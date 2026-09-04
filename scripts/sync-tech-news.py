#!/usr/bin/env python3
from __future__ import annotations

import os
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
import sqlite3
from urllib.parse import urlparse


PROJECT_ROOT = Path(os.environ.get(
    'PORTFOLIO_PROJECT_ROOT',
    '/Users/nathanshan/Desktop/nateEc.github copy.io',
)).expanduser().resolve()
OUTPUT_JSON = PROJECT_ROOT / 'public/tech-news/latest.json'
DB_PATH = Path.home() / '.hermes' / 'cron' / 'executions.db'
AI_JOB_ID = 'a804139d5bcb'
HN_JOB_ID = '0d56c417b34c'
FETCH_TIMEOUT_SECONDS = int(os.environ.get('TECH_NEWS_FETCH_TIMEOUT_SECONDS', '300'))

AI_SCRIPT = Path.home() / '.hermes' / 'scripts' / 'ai_digest_zh.py'
HN_SCRIPT = Path.home() / '.hermes' / 'scripts' / 'hacker_news_digest.py'


def _run_digest(script_path: Path) -> dict[str, Any]:
    if not script_path.is_file():
        raise RuntimeError(f'missing digest script: {script_path}')
    result = subprocess.run(
        [sys.executable, str(script_path)],
        text=True,
        capture_output=True,
        check=False,
        timeout=FETCH_TIMEOUT_SECONDS,
    )
    if result.returncode != 0:
        raise RuntimeError(f'{script_path.name} execution failed: {result.stderr.strip() or result.stdout[:400]}')
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f'{script_path.name} output is not valid JSON ({exc})') from exc


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _normalize_text(value: str, limit: int = 220) -> str:
    cleaned = re.sub(r'\s+', ' ', (value or '').strip())
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[:limit].rstrip() + '…'


def _safe_https_url(value: Any) -> str:
    if not isinstance(value, str):
        return ''
    cleaned = value.strip()
    parsed = urlparse(cleaned)
    if parsed.scheme != 'https' or not parsed.netloc:
        return ''
    return cleaned


def _published(value: Any) -> str:
    return _normalize_text(value if isinstance(value, str) else '', 80)


def _reasons(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [_normalize_text(reason, 48) for reason in value if isinstance(reason, str) and reason.strip()][:4]


def _last_completed_run(job_id: str, now: datetime) -> datetime | None:
    if not DB_PATH.exists():
        return None

    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.cursor()
        cur.execute(
            'SELECT job_id, finished_at, status FROM executions '
            'WHERE job_id = ? AND status = "completed" ORDER BY finished_at DESC LIMIT 20',
            (job_id,),
        )
        rows = cur.fetchall()
    finally:
        conn.close()

    today = now.astimezone().date()
    for row_job, finished_at, status in rows:
        dt = _parse_dt(finished_at)
        if dt is None:
            continue
        if dt.astimezone().date() == today:
            return dt
        if row_job == job_id and status == 'completed':
            # same run exists but not today
            return None

    return None


def _build_ai_section(data: dict[str, Any], source_name: str) -> dict[str, Any]:
    raw_items = data.get('items') or []
    items = []
    for item in raw_items[:4]:
        title = _normalize_text(item.get('title', ''), 100)
        if not title:
            continue
        summary = _normalize_text(item.get('summary', ''), 220)
        url = _safe_https_url(item.get('link'))
        if not url:
            continue
        score = item.get('trend_score')
        items.append({
            'title': title,
            'summary': summary,
            'url': url,
            'source': source_name,
            'score': round(float(score), 2) if isinstance(score, (int, float)) else None,
            'reasons': _reasons(item.get('why_trending')),
            'published': _published(item.get('published')),
        })
    source_url = _safe_https_url(data.get('source_page') or data.get('feed_url'))
    if not source_url:
        source_url = 'https://ai-digest.liziran.com/zh/'
    return {'name': source_name, 'source': source_url, 'items': items}


def _build_hn_sections(data: dict[str, Any]) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    for source in data.get('sources', []):
        name = source.get('name', 'news source')
        source_page = _safe_https_url(source.get('source_page') or source.get('feed_url'))
        raw_items = source.get('items') or []
        items = []
        for item in raw_items[:4]:
            title = _normalize_text(item.get('title', ''), 100)
            if not title:
                continue
            summary = _normalize_text(item.get('summary', ''), 220)
            url = _safe_https_url(item.get('link'))
            if not url:
                continue
            score = item.get('trend_score')
            items.append({
                'title': title,
                'summary': summary,
                'url': url,
                'source': name,
                'score': round(float(score), 2) if isinstance(score, (int, float)) else None,
                'reasons': _reasons(item.get('why_trending')),
                'published': _published(item.get('published')),
            })
        sections.append({'name': name, 'source': source_page, 'items': items})
    return sections


def _to_json_payload(ai_data: dict[str, Any], hn_data: dict[str, Any], run_times: dict[str, datetime]) -> dict[str, Any]:
    now = datetime.now().astimezone()
    sections = []

    sections.append(_build_ai_section(ai_data, 'AI资讯'))
    sections.extend(_build_hn_sections(hn_data))

    return {
        'schemaVersion': 1,
        'updatedAt': now.isoformat(timespec='seconds'),
        'date': now.date().isoformat(),
        'sections': sections,
        'jobs': {
            'ai': {
                'id': AI_JOB_ID,
                'lastRunAt': run_times['ai'].isoformat() if run_times.get('ai') else None,
            },
            'hn': {
                'id': HN_JOB_ID,
                'lastRunAt': run_times['hn'].isoformat() if run_times.get('hn') else None,
            },
        },
    }


def main() -> int:
    now = datetime.now().astimezone()
    run_times = {
        'ai': _last_completed_run(AI_JOB_ID, now),
        'hn': _last_completed_run(HN_JOB_ID, now),
    }

    if not run_times['ai'] or not run_times['hn']:
        print('skip: one or both scheduled tech-news cron jobs have not completed today yet')
        return 0

    try:
        ai_data = _run_digest(AI_SCRIPT)
        hn_data = _run_digest(HN_SCRIPT)
    except Exception as exc:
        print(f'error: {exc}')
        return 1

    payload = _to_json_payload(ai_data, hn_data, run_times)

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'updated: tech-news payload saved -> {OUTPUT_JSON}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
