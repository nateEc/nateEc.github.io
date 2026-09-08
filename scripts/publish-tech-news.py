#!/usr/bin/env python3
from __future__ import annotations

import fcntl
import hashlib
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from news_contract import validate_payload


PROJECT_ROOT = Path(os.environ.get(
    'PORTFOLIO_PROJECT_ROOT',
    str(Path(__file__).resolve().parents[1]),
)).expanduser().resolve()
NODE_BIN = Path(os.environ.get(
    'PORTFOLIO_NODE_BIN',
    str(Path.home() / '.nvm' / 'versions' / 'node' / 'v22.22.1' / 'bin'),
)).expanduser().resolve()
NEWS_PATH = Path('public/tech-news/latest.json')
SYNC_SCRIPT = PROJECT_ROOT / 'scripts' / 'sync-tech-news.py'
PUSH_ATTEMPTS = max(1, int(os.environ.get('TECH_NEWS_PUSH_ATTEMPTS', '3')))
PUSH_RETRY_SECONDS = max(0, int(os.environ.get('TECH_NEWS_PUSH_RETRY_SECONDS', '10')))
DEPLOYMENT_URL = 'https://nateec.github.io/tech-news/latest.json'
DEPLOYMENT_TIMEOUT_SECONDS = max(1, int(os.environ.get('TECH_NEWS_DEPLOYMENT_TIMEOUT_SECONDS', '600')))
DEPLOYMENT_POLL_SECONDS = max(1, int(os.environ.get('TECH_NEWS_DEPLOYMENT_POLL_SECONDS', '10')))


def _runtime_env() -> dict[str, str]:
    node = NODE_BIN / 'node'
    npm = NODE_BIN / 'npm'
    if not node.is_file() or not npm.is_file():
        raise RuntimeError(f'portfolio Node runtime is missing: {NODE_BIN}')

    env = os.environ.copy()
    current_path = env.get('PATH', '')
    env['PATH'] = os.pathsep.join(part for part in (str(NODE_BIN), current_path) if part)
    return env


def _run(command: list[str], *, timeout: int = 600) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=PROJECT_ROOT,
        env=_runtime_env(),
        text=True,
        capture_output=True,
        check=False,
        timeout=timeout,
    )


def _checked(command: list[str], *, timeout: int = 600) -> str:
    result = _run(command, timeout=timeout)
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip() or f'exit code {result.returncode}'
        raise RuntimeError(f'{" ".join(command)} failed: {detail[:1200]}')
    return result.stdout.strip()


def _changed_paths() -> set[str]:
    result = _run(['git', 'status', '--porcelain=v1', '--untracked-files=all'])
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip() or f'exit code {result.returncode}'
        raise RuntimeError(f'git status failed: {detail[:1200]}')
    paths: set[str] = set()
    for line in result.stdout.splitlines():
        if len(line) < 4:
            continue
        path = line[3:].split(' -> ')[-1]
        paths.add(path)
    return paths


def _validate_payload(payload: Any) -> str:
    return validate_payload(payload)


def _fetch_main() -> None:
    last_detail = 'unknown fetch error'
    for attempt in range(1, PUSH_ATTEMPTS + 1):
        try:
            result = _run(['git', 'fetch', 'origin', 'main'], timeout=120)
            if result.returncode == 0:
                return
            last_detail = result.stderr.strip() or result.stdout.strip()
        except subprocess.TimeoutExpired:
            last_detail = 'timed out after 120 seconds'
        if attempt < PUSH_ATTEMPTS:
            time.sleep(PUSH_RETRY_SECONDS)
    raise RuntimeError(f'git fetch failed after {PUSH_ATTEMPTS} attempts: {last_detail[:1200]}')


def _push_main() -> None:
    last_detail = 'unknown push error'
    for attempt in range(1, PUSH_ATTEMPTS + 1):
        try:
            result = _run(['git', 'push', 'origin', 'main'], timeout=120)
            if result.returncode == 0:
                return
            last_detail = result.stderr.strip() or result.stdout.strip() or f'exit code {result.returncode}'
        except subprocess.TimeoutExpired:
            last_detail = 'timed out after 120 seconds'
        if attempt < PUSH_ATTEMPTS:
            _fetch_main()
            _rebase_pending()
            time.sleep(PUSH_RETRY_SECONDS)
    raise RuntimeError(f'git push origin main failed after {PUSH_ATTEMPTS} attempts: {last_detail[:1200]}')


def _wait_for_deployment(snapshot_date: str, updated_at: str) -> None:
    deadline = time.monotonic() + DEPLOYMENT_TIMEOUT_SECONDS
    last_detail = 'deployment snapshot was not reachable'
    query = urlencode({'published': updated_at})

    while True:
        try:
            request = Request(f'{DEPLOYMENT_URL}?{query}', headers={'User-Agent': 'tech-signal-publisher/1.0'})
            with urlopen(request, timeout=20) as response:
                deployed = json.load(response)
            validate_payload(deployed)
            if deployed.get('date') == snapshot_date and deployed.get('updatedAt') == updated_at:
                return
            last_detail = (
                f'deployed snapshot is {deployed.get("date")} / {deployed.get("updatedAt")}, '
                f'expected {snapshot_date} / {updated_at}'
            )
        except Exception as exc:
            last_detail = str(exc)

        remaining = deadline - time.monotonic()
        if remaining <= 0:
            break
        time.sleep(min(DEPLOYMENT_POLL_SECONDS, remaining))

    raise RuntimeError(
        f'GitHub Pages did not publish the expected Tech Signal snapshot within '
        f'{DEPLOYMENT_TIMEOUT_SECONDS} seconds: {last_detail}'
    )


def _pending_news_only() -> bool:
    commits = _checked(['git', 'rev-list', 'origin/main..HEAD']).splitlines()
    return bool(commits) and all(
        set(_checked(['git', 'diff-tree', '--no-commit-id', '--name-only', '-r', commit]).splitlines()) == {NEWS_PATH.as_posix()}
        for commit in commits
    )


def _rebase_pending() -> None:
    if _run(['git', 'merge-base', '--is-ancestor', 'origin/main', 'HEAD']).returncode == 0:
        return
    if not _pending_news_only():
        raise RuntimeError('unpublished changes are not exclusively news snapshots')
    result = _run(['git', 'rebase', 'origin/main'])
    if result.returncode != 0:
        _run(['git', 'rebase', '--abort'])
        raise RuntimeError('remote news conflict: pending commit preserved; no force push')


def _git_file(name: str) -> Path:
    path = Path(_checked(['git', 'rev-parse', '--git-path', name]))
    return path if path.is_absolute() else PROJECT_ROOT / path


def _ensure_publishable_worktree() -> None:
    if not _git_file('tech-signal-publisher').is_file():
        raise RuntimeError('publishing requires the designated isolated checkout')
    _checked(['node', '--version'])
    _checked(['npm', '--version'])
    if _checked(['git', 'branch', '--show-current']) != 'main':
        raise RuntimeError('portfolio publishing requires the main branch')
    changed = _changed_paths()
    unexpected = changed - {NEWS_PATH.as_posix()}
    if unexpected:
        raise RuntimeError(f'publisher has unrelated changes: {", ".join(sorted(unexpected))}')
    if NEWS_PATH.as_posix() in changed:
        # Only the bot-owned generated snapshot, never developer changes.
        _git_file('tech-news-recovery.json').write_bytes((PROJECT_ROOT / NEWS_PATH).read_bytes())
        _checked(['git', 'restore', '--source=HEAD', '--staged', '--worktree', '--', NEWS_PATH.as_posix()])
    _fetch_main()
    if _checked(['git', 'rev-parse', 'HEAD']) == _checked(['git', 'rev-parse', 'origin/main']):
        return
    if _run(['git', 'merge-base', '--is-ancestor', 'HEAD', 'origin/main']).returncode == 0:
        _checked(['git', 'merge', '--ff-only', 'origin/main'])
        return
    if not _pending_news_only():
        raise RuntimeError('publisher contains unpublished non-news commits')
    _rebase_pending()
    _push_main()


def _ensure_dependencies() -> None:
    key = hashlib.sha256((PROJECT_ROOT / 'package-lock.json').read_bytes() + _checked(['node', '--version']).encode()).hexdigest()
    stamp = _git_file('tech-news-dependencies')
    if not (PROJECT_ROOT / 'node_modules/.package-lock.json').is_file() or not stamp.is_file() or stamp.read_text() != key:
        _checked(['npm', 'ci', '--no-audit', '--no-fund'], timeout=600)
        stamp.write_text(key)


def _publish() -> int:
    _ensure_publishable_worktree()
    try:
        current = json.loads((PROJECT_ROOT / NEWS_PATH).read_text(encoding='utf-8'))
        date = _validate_payload(current)
    except (ValueError, TypeError):
        pass
    else:
        _wait_for_deployment(date, current['updatedAt'])
        print(f'no-op: complete snapshot {date} is already committed and verified online')
        return 0
    _ensure_dependencies()
    sync_result = _run([sys.executable, str(SYNC_SCRIPT)], timeout=1300)
    if sync_result.returncode != 0:
        detail = sync_result.stderr.strip() or sync_result.stdout.strip()
        raise RuntimeError(f'tech-news sync failed: {detail[:1600]}')
    if sync_result.stderr.strip():
        print(sync_result.stderr.strip())
    payload = json.loads((PROJECT_ROOT / NEWS_PATH).read_text(encoding='utf-8'))
    snapshot_date = _validate_payload(payload)
    _checked(['npm', 'run', 'check'], timeout=600)
    changed = _changed_paths()
    if changed - {NEWS_PATH.as_posix()}:
        raise RuntimeError('checks produced unrelated changes; no commit performed')
    if NEWS_PATH.as_posix() in changed:
        _checked(['git', 'add', '--', NEWS_PATH.as_posix()])
        _checked(['git', 'commit', '-m', f'chore(news): 更新 {snapshot_date} 科技资讯',
                  '-m', '- 刷新三个完整新闻来源，失败时不覆盖有效快照。\n- 通过构建与站点检查，隔离发布并核实线上版本。'])
        _push_main()
    _wait_for_deployment(snapshot_date, payload['updatedAt'])
    print(f'published: Tech Signal {snapshot_date}; all sources validated, main pushed, deployment verified')
    return 0


def main() -> int:
    try:
        with _git_file('tech-signal.lock').open('a') as lock:
            try:
                fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                raise RuntimeError('another Tech Signal publisher is still running')
            return _publish()
    except Exception as exc:
        print(f'error: {exc}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
