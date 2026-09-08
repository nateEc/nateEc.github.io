"""Validation before mutation, shared by generation and publication."""
from datetime import datetime
import json
import os
from pathlib import Path
import tempfile
from urllib.parse import urlparse

REQUIRED_SOURCES = {'AI资讯', 'Hacker News', 'TechCrunch'}

def validate_digest(data):
    if not isinstance(data, dict):
        raise ValueError('digest must be an object')
    if data.get('error'):
        raise ValueError(f'digest source failed: {data["error"]}')
    sources = data.get('sources')
    if sources is None:
        sources = [data]
    elif not isinstance(sources, list) or not sources:
        raise ValueError('digest has no sources')
    for source in sources:
        if not isinstance(source, dict):
            raise ValueError('invalid digest source')
        name = source.get('name', 'AI资讯')
        if source.get('error'):
            raise ValueError(f'{name}: {source["error"]}')
        if not isinstance(source.get('items'), list) or not source['items']:
            raise ValueError(f'{name}: no items')
        if any(not isinstance(item, dict) for item in source['items']):
            raise ValueError(f'{name}: invalid item')
    if 'sources' in data:
        names = [s.get('name') for s in sources]
        if len(names) != len(set(names)) or set(names) != {'Hacker News', 'TechCrunch'}:
            raise ValueError('digest requires distinct Hacker News and TechCrunch sources')
    return data

def validate_payload(payload):
    if not isinstance(payload, dict) or payload.get('schemaVersion') != 1:
        raise ValueError('invalid tech-news schema')
    today = datetime.now().astimezone().date().isoformat()
    if payload.get('date') != today:
        raise ValueError(f'tech-news payload is not for today: {payload.get("date")}')
    stamp = datetime.fromisoformat(payload.get('updatedAt', ''))
    if stamp.tzinfo is None or stamp.astimezone().date().isoformat() != today:
        raise ValueError('invalid generation timestamp')
    sections = payload.get('sections')
    if not isinstance(sections, list) or any(not isinstance(s, dict) for s in sections):
        raise ValueError('invalid tech-news sections')
    names = [s.get('name') for s in sections]
    if len(names) != len(set(names)) or set(names) != REQUIRED_SOURCES:
        raise ValueError('required news sources missing or duplicated')
    for section in sections:
        items = section.get('items')
        if not isinstance(items, list) or not items:
            raise ValueError(f'tech-news source has no items: {section["name"]}')
        for item in items:
            if not isinstance(item, dict) or not isinstance(item.get('title'), str) or not item['title'].strip():
                raise ValueError('news item has no title')
            parsed = urlparse(item.get('url', ''))
            if parsed.scheme != 'https' or not parsed.netloc:
                raise ValueError('unsafe news URL')
            published = datetime.fromisoformat(item.get('published', ''))
            if published.tzinfo is None:
                raise ValueError('publication timestamp needs timezone')
    return today

def write_snapshot(path: Path, payload):
    validate_payload(payload)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent, prefix='.news-', suffix='.tmp', delete=False) as stream:
            temporary = Path(stream.name)
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write('\n')
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
