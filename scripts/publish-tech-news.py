#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen


PROJECT_ROOT = Path(os.environ.get(
    'PORTFOLIO_PROJECT_ROOT',
    '/Users/nathanshan/Desktop/nateEc.github copy.io',
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
REQUIRED_SOURCES = {'AI资讯', 'Hacker News', 'TechCrunch'}


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
    if not isinstance(payload, dict):
        raise RuntimeError('tech-news payload must be an object')
    date = payload.get('date')
    if date != datetime.now().astimezone().date().isoformat():
        raise RuntimeError(f'tech-news payload is not for today: {date}')
    sections = payload.get('sections')
    if not isinstance(sections, list) or not sections:
        raise RuntimeError('tech-news payload has no sections')

    item_count = 0
    source_names: set[str] = set()
    for section in sections:
        name = section.get('name') if isinstance(section, dict) else None
        if not isinstance(name, str) or not name:
            raise RuntimeError('tech-news section has no source name')
        if name in source_names:
            raise RuntimeError(f'tech-news payload has duplicate source: {name}')
        source_names.add(name)

        items = section.get('items') if isinstance(section, dict) else None
        if not isinstance(items, list) or not items:
            raise RuntimeError(f'tech-news source has no items: {name}')
        for item in items:
            url = item.get('url') if isinstance(item, dict) else None
            parsed = urlparse(url) if isinstance(url, str) else None
            if not parsed or parsed.scheme != 'https' or not parsed.netloc:
                raise RuntimeError(f'tech-news item has unsafe URL: {url}')
            published = item.get('published') if isinstance(item, dict) else None
            try:
                datetime.fromisoformat(published) if isinstance(published, str) else None
            except ValueError as exc:
                raise RuntimeError(f'tech-news item has invalid publication timestamp: {published}') from exc
            if not published:
                raise RuntimeError('tech-news item has no publication timestamp')
            item_count += 1

    missing_sources = REQUIRED_SOURCES - source_names
    if missing_sources:
        raise RuntimeError(f'tech-news payload is missing sources: {", ".join(sorted(missing_sources))}')
    if item_count < 3:
        raise RuntimeError(f'tech-news payload has too few items: {item_count}')
    return date


def _push_main() -> None:
    last_detail = 'unknown push error'
    for attempt in range(1, PUSH_ATTEMPTS + 1):
        result = _run(['git', 'push', 'origin', 'main'], timeout=300)
        if result.returncode == 0:
            return
        last_detail = result.stderr.strip() or result.stdout.strip() or f'exit code {result.returncode}'
        if attempt < PUSH_ATTEMPTS:
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


def _ensure_publishable_worktree() -> None:
    if not (PROJECT_ROOT / '.git').exists():
        raise RuntimeError(f'portfolio repository is missing: {PROJECT_ROOT}')
    _checked(['node', '--version'])
    _checked(['npm', '--version'])
    if _checked(['git', 'branch', '--show-current']) != 'main':
        raise RuntimeError('portfolio publishing requires the main branch')

    changed = _changed_paths()
    unexpected = changed - {NEWS_PATH.as_posix()}
    if unexpected:
        raise RuntimeError(f'portfolio has unrelated local changes: {", ".join(sorted(unexpected))}')

    _checked(['git', 'fetch', 'origin', 'main'])
    local_head = _checked(['git', 'rev-parse', 'HEAD'])
    remote_head = _checked(['git', 'rev-parse', 'origin/main'])
    if local_head == remote_head:
        return

    if _run(['git', 'merge-base', '--is-ancestor', 'origin/main', 'HEAD']).returncode != 0:
        raise RuntimeError('local main is behind or diverged from origin/main')

    pending_paths = {
        path for path in _checked(['git', 'diff', '--name-only', 'origin/main..HEAD']).splitlines() if path
    }
    if pending_paths != {NEWS_PATH.as_posix()}:
        raise RuntimeError('local main contains unpublished commits outside the Tech Signal snapshot')

    _push_main()
    _checked(['git', 'fetch', 'origin', 'main'])
    if _checked(['git', 'rev-parse', 'HEAD']) != _checked(['git', 'rev-parse', 'origin/main']):
        raise RuntimeError('pending Tech Signal commit could not be synchronized with origin/main')


def main() -> int:
    try:
        _ensure_publishable_worktree()
        sync_result = _run([sys.executable, str(SYNC_SCRIPT)], timeout=720)
        if sync_result.returncode != 0:
            detail = sync_result.stderr.strip() or sync_result.stdout.strip()
            raise RuntimeError(f'tech-news sync failed: {detail[:1200]}')
        if not (PROJECT_ROOT / NEWS_PATH).is_file():
            raise RuntimeError('tech-news sync did not create latest.json')

        payload = json.loads((PROJECT_ROOT / NEWS_PATH).read_text(encoding='utf-8'))
        snapshot_date = _validate_payload(payload)
        updated_at = payload.get('updatedAt')
        if not isinstance(updated_at, str) or not updated_at:
            raise RuntimeError('tech-news payload has no generation timestamp')
        _checked(['npm', 'run', 'check'], timeout=600)

        changed = _changed_paths()
        unexpected = changed - {NEWS_PATH.as_posix()}
        if unexpected:
            raise RuntimeError(f'checks produced unrelated changes: {", ".join(sorted(unexpected))}')
        if NEWS_PATH.as_posix() not in changed:
            _wait_for_deployment(snapshot_date, updated_at)
            print('no-op: today\'s Tech Signal snapshot is already published')
            return 0

        _checked(['git', 'add', '--', NEWS_PATH.as_posix()])
        _checked([
            'git', 'commit',
            '-m', f'chore(news): 更新 {snapshot_date} 科技资讯',
            '-m', '- 刷新 AI、Hacker News 与 TechCrunch 每日信号\n- 保留原文、趋势依据与完整发布时间\n- 通过构建、站点与主题检查后发布',
        ])
        _push_main()
        _wait_for_deployment(snapshot_date, updated_at)
        print(f'published: Tech Signal snapshot {snapshot_date} pushed to main and verified online')
        return 0
    except Exception as exc:
        print(f'error: {exc}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
