#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse


PROJECT_ROOT = Path(os.environ.get(
    'PORTFOLIO_PROJECT_ROOT',
    '/Users/nathanshan/Desktop/nateEc.github copy.io',
)).expanduser().resolve()
NEWS_PATH = Path('public/tech-news/latest.json')
SYNC_SCRIPT = PROJECT_ROOT / 'scripts' / 'sync-tech-news.py'


def _run(command: list[str], *, timeout: int = 600) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=PROJECT_ROOT,
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
    for section in sections:
        items = section.get('items') if isinstance(section, dict) else None
        if not isinstance(items, list):
            raise RuntimeError('tech-news section has invalid items')
        for item in items:
            url = item.get('url') if isinstance(item, dict) else None
            parsed = urlparse(url) if isinstance(url, str) else None
            if not parsed or parsed.scheme != 'https' or not parsed.netloc:
                raise RuntimeError(f'tech-news item has unsafe URL: {url}')
            item_count += 1

    if item_count < 3:
        raise RuntimeError(f'tech-news payload has too few items: {item_count}')
    return date


def _ensure_publishable_worktree() -> None:
    if not (PROJECT_ROOT / '.git').exists():
        raise RuntimeError(f'portfolio repository is missing: {PROJECT_ROOT}')
    if _checked(['git', 'branch', '--show-current']) != 'main':
        raise RuntimeError('portfolio publishing requires the main branch')

    changed = _changed_paths()
    unexpected = changed - {NEWS_PATH.as_posix()}
    if unexpected:
        raise RuntimeError(f'portfolio has unrelated local changes: {", ".join(sorted(unexpected))}')

    _checked(['git', 'fetch', 'origin', 'main'])
    local_head = _checked(['git', 'rev-parse', 'HEAD'])
    remote_head = _checked(['git', 'rev-parse', 'origin/main'])
    if local_head != remote_head:
        raise RuntimeError('local main is not synchronized with origin/main')


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
        _checked(['npm', 'run', 'check'], timeout=600)

        changed = _changed_paths()
        unexpected = changed - {NEWS_PATH.as_posix()}
        if unexpected:
            raise RuntimeError(f'checks produced unrelated changes: {", ".join(sorted(unexpected))}')
        if NEWS_PATH.as_posix() not in changed:
            print('no-op: today\'s Tech Signal snapshot is already published')
            return 0

        _checked(['git', 'add', '--', NEWS_PATH.as_posix()])
        _checked([
            'git', 'commit',
            '-m', f'chore(news): 更新 {snapshot_date} 科技资讯',
            '-m', '- 刷新 AI、Hacker News 与 TechCrunch 每日信号\n- 保留原文、趋势依据与完整发布时间\n- 通过构建、站点与主题检查后发布',
        ])
        _checked(['git', 'push', 'origin', 'main'], timeout=300)
        print(f'published: Tech Signal snapshot {snapshot_date} pushed to main')
        return 0
    except Exception as exc:
        print(f'error: {exc}')
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
