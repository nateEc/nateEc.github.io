#!/usr/bin/env python3
from __future__ import annotations

import os
import json
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any
import sqlite3
from urllib.parse import urlparse
from news_contract import ITEMS_PER_SOURCE, is_localized, validate_digest, write_snapshot


PROJECT_ROOT = Path(os.environ.get(
    'PORTFOLIO_PROJECT_ROOT',
    str(Path(__file__).resolve().parents[1]),
)).expanduser().resolve()
OUTPUT_JSON = PROJECT_ROOT / 'public/tech-news/latest.json'
DB_PATH = Path.home() / '.hermes' / 'cron' / 'executions.db'
HN_JOB_ID = '0d56c417b34c'
FETCH_TIMEOUT_SECONDS = int(os.environ.get('TECH_NEWS_FETCH_TIMEOUT_SECONDS', '300'))
FETCH_ATTEMPTS = max(1, int(os.environ.get('TECH_NEWS_FETCH_ATTEMPTS', '2')))
FETCH_RETRY_SECONDS = max(0, int(os.environ.get('TECH_NEWS_FETCH_RETRY_SECONDS', '10')))

HN_SCRIPT = Path(__file__).resolve().parent / 'hacker_news_digest.py'
HERMES_BIN = Path(os.environ.get('HERMES_BIN', shutil.which('hermes') or str(Path.home() / '.local/bin/hermes')))
TRANSLATION_TIMEOUT_SECONDS = int(os.environ.get('TECH_NEWS_TRANSLATION_TIMEOUT_SECONDS', '600'))


def _run_digest(script_path: Path) -> dict[str, Any]:
    if not script_path.is_file():
        raise RuntimeError(f'missing digest script: {script_path}')
    last_error = 'unknown fetch error'
    for attempt in range(1, FETCH_ATTEMPTS + 1):
        try:
            result = subprocess.run(
                [sys.executable, str(script_path)],
                text=True,
                capture_output=True,
                check=False,
                timeout=FETCH_TIMEOUT_SECONDS,
            )
            if result.returncode != 0:
                last_error = result.stderr.strip() or result.stdout[:400] or f'exit code {result.returncode}'
            else:
                try:
                    data = validate_digest(json.loads(result.stdout))
                    for source in data.get('sources', []):
                        if source.get('warning'):
                            print(f'warning: {source["name"]}: {source["warning"]}', file=sys.stderr)
                    return data
                except (ValueError, TypeError) as exc:
                    last_error = f'invalid digest ({exc})'
        except subprocess.TimeoutExpired:
            last_error = f'timed out after {FETCH_TIMEOUT_SECONDS} seconds'

        if attempt < FETCH_ATTEMPTS:
            time.sleep(FETCH_RETRY_SECONDS)

    raise RuntimeError(f'{script_path.name} failed after {FETCH_ATTEMPTS} attempts: {last_error}')


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


def _build_hn_sections(data: dict[str, Any], translations: dict[str, dict[str, str]]) -> list[dict[str, Any]]:
    sections: list[dict[str, Any]] = []
    for source in data.get('sources', []):
        name = source.get('name', 'news source')
        source_page = _safe_https_url(source.get('source_page') or source.get('feed_url'))
        raw_items = source.get('items') or []
        items = []
        for item in raw_items[:ITEMS_PER_SOURCE]:
            title = _normalize_text(item.get('title', ''), 100)
            if not title:
                continue
            summary = _normalize_text(item.get('summary', ''), 220)
            url = _safe_https_url(item.get('link'))
            if not url:
                continue
            localized = translations.get(url, {})
            title_zh = _normalize_text(localized.get('titleZh', ''), 100)
            summary_zh = _normalize_text(localized.get('summaryZh', ''), 220)
            if not is_localized(title, title_zh) or (summary and not is_localized(summary, summary_zh)):
                raise ValueError(f'missing Chinese localization for {name}: {url}')
            score = item.get('trend_score')
            items.append({
                'title': title,
                'summary': summary,
                'titleZh': title_zh,
                'summaryZh': summary_zh,
                'url': url,
                'source': name,
                'score': round(float(score), 2) if isinstance(score, (int, float)) else None,
                'reasons': _reasons(item.get('why_trending')),
                'published': _published(item.get('published')),
            })
        sections.append({'name': name, 'source': source_page, 'items': items})
    return sections


def _cached_translations() -> dict[str, dict[str, str]]:
    try:
        snapshot = json.loads(OUTPUT_JSON.read_text(encoding='utf-8'))
    except (OSError, ValueError, TypeError):
        return {}
    cached: dict[str, dict[str, str]] = {}
    for section in snapshot.get('sections', []):
        if section.get('name') not in {'Hacker News', 'TechCrunch'}:
            continue
        for item in section.get('items', []):
            url = _safe_https_url(item.get('url'))
            title_zh = item.get('titleZh')
            summary_zh = item.get('summaryZh', '')
            if url and is_localized(item.get('title'), title_zh) and (not item.get('summary') or is_localized(item.get('summary'), summary_zh)):
                cached[url] = {'titleZh': title_zh, 'summaryZh': summary_zh if isinstance(summary_zh, str) else ''}
    return cached


def _translation_candidates(data: dict[str, Any]) -> list[dict[str, str]]:
    candidates = []
    for source in data.get('sources', []):
        for item in (source.get('items') or [])[:ITEMS_PER_SOURCE]:
            url = _safe_https_url(item.get('link'))
            title = _normalize_text(item.get('title', ''), 100)
            if url and title:
                candidates.append({
                    'url': url,
                    'title': title,
                    'summary': _normalize_text(item.get('summary', ''), 220),
                })
    return candidates


def _parse_translation_response(raw: str) -> dict[str, dict[str, str]]:
    cleaned = raw.strip()
    if cleaned.startswith('```'):
        cleaned = re.sub(r'^```(?:json)?\s*|\s*```$', '', cleaned, flags=re.I)
    data = json.loads(cleaned)
    rows = data.get('translations') if isinstance(data, dict) else None
    if not isinstance(rows, list):
        raise ValueError('translation response has no translations list')
    result: dict[str, dict[str, str]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        url = _safe_https_url(row.get('url'))
        title_zh = _normalize_text(row.get('titleZh', ''), 100)
        summary_zh = _normalize_text(row.get('summaryZh', ''), 220)
        if url and title_zh:
            result[url] = {'titleZh': title_zh, 'summaryZh': summary_zh}
    return result


def _translate_hn_items(data: dict[str, Any]) -> dict[str, dict[str, str]]:
    candidates = _translation_candidates(data)
    translations = _cached_translations()
    def missing_items() -> list[dict[str, str]]:
        return [item for item in candidates if not (
            is_localized(item['title'], translations.get(item['url'], {}).get('titleZh'))
            and (not item['summary'] or is_localized(item['summary'], translations.get(item['url'], {}).get('summaryZh')))
        )]

    if missing_items():
        if not HERMES_BIN.is_file():
            raise RuntimeError(f'Hermes translator is missing: {HERMES_BIN}')
        deadline = time.monotonic() + TRANSLATION_TIMEOUT_SECONDS
        for attempt in range(3):
            missing = missing_items()
            if not missing:
                break
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise RuntimeError('Hermes localization exceeded its time budget')
            repair_items = []
            for item in missing:
                previous = translations.get(item['url'], {})
                invalid_fields = [field + 'Zh' for field in ('title', 'summary')
                                  if item[field] and not is_localized(item[field], previous.get(field + 'Zh'))]
                repair_items.append({**item, 'previousTranslation': previous, 'invalidFields': invalid_fields})
            prompt = (
                '你是科技新闻本地化编辑。将 JSON 中每条英文 title 和 summary 准确、自然、简洁地翻译为简体中文。'
                '保留品牌和产品专名，但必须翻译其中的通用词，例如 Cloudflare Quick Tunnels → Cloudflare 快速隧道。'
                '只有完全由单个品牌名构成的字段（如 OpenJEV）才允许原样保留。不要添加事实、评论或解释。'
                '多词标题必须含中文；品牌有常用中文名时使用中文，例如 Xiaomi MiMo v2.6 → 小米 MiMo v2.6。'
                'invalidFields 列出尚未通过校验的字段，请修正 previousTranslation 中这些字段；摘要不得留空。'
                '必须覆盖每个 URL，只返回 JSON 对象：'
                '{"translations":[{"url":"原 URL","titleZh":"中文标题","summaryZh":"中文摘要"}]}。输入：'
                + json.dumps(repair_items, ensure_ascii=False)
            )
            result = subprocess.run(
                [str(HERMES_BIN), '--ignore-rules', '-t', '', '-z', prompt],
                text=True, capture_output=True, check=False, timeout=remaining,
            )
            if result.returncode != 0:
                detail = result.stderr.strip() or result.stdout.strip() or f'exit code {result.returncode}'
                raise RuntimeError(f'Hermes localization failed: {detail[:800]}')
            try:
                response = _parse_translation_response(result.stdout)
            except (ValueError, TypeError) as exc:
                if attempt == 2:
                    raise RuntimeError(f'Hermes localization returned invalid JSON: {exc}') from exc
                continue
            for item in missing:
                row = response.get(item['url'], {})
                previous = translations.setdefault(item['url'], {})
                for field in ('title', 'summary'):
                    key = field + 'Zh'
                    if is_localized(item[field], row.get(key)):
                        previous[key] = row[key]

    missing_urls = [item['url'] for item in missing_items()]
    if missing_urls:
        raise RuntimeError(f'Hermes localization incomplete: {", ".join(missing_urls)}')
    return translations


def _to_json_payload(
    hn_data: dict[str, Any],
    run_times: dict[str, datetime | None],
    translations: dict[str, dict[str, str]],
) -> dict[str, Any]:
    validate_digest(hn_data)
    now = datetime.now().astimezone()
    sections = _build_hn_sections(hn_data, translations)

    return {
        'schemaVersion': 2,
        'updatedAt': now.isoformat(timespec='seconds'),
        'date': now.date().isoformat(),
        'sections': sections,
        'jobs': {
            'hn': {
                'id': HN_JOB_ID,
                'lastRunAt': run_times['hn'].isoformat() if run_times.get('hn') else None,
            },
        },
    }


def main() -> int:
    now = datetime.now().astimezone()
    run_times = {'hn': None}
    for name, job_id in [('hn', HN_JOB_ID)]:
        try:
            run_times[name] = _last_completed_run(job_id, now)
        except sqlite3.Error as exc:
            # Execution timestamps are optional metadata, not a news source.
            print(f'warning: {name} run metadata unavailable: {exc}', file=sys.stderr)

    try:
        hn_data = _run_digest(HN_SCRIPT)
        translations = _translate_hn_items(hn_data)
        payload = _to_json_payload(hn_data, run_times, translations)
        write_snapshot(OUTPUT_JSON, payload)
    except Exception as exc:
        print(f'error: {exc}')
        return 1

    print(f'updated: tech-news payload saved -> {OUTPUT_JSON}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
