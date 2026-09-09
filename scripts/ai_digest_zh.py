#!/usr/bin/env python3
from __future__ import annotations

import html
from concurrent.futures import ThreadPoolExecutor
import json
import re
import sys
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from typing import Any, Dict
from xml.etree import ElementTree as ET

URL = "https://ai-digest.liziran.com/zh/feed.xml"
UA = "Mozilla/5.0 (compatible; HermesAgent/1.0; +https://hermes-agent.nousresearch.com)"
MAX_CANDIDATES = 20
MAX_ITEMS = 12
SUMMARY_TARGET_LEN = 800
MIN_SUMMARY_LEN = 120
TREND_WEIGHTS = {
    "监管": 3.0,
    "监管政策": 3.2,
    "合规": 2.6,
    "安全": 2.4,
    "安全性": 2.4,
    "安全风险": 2.8,
    "安全漏洞": 2.8,
    "模型": 2.0,
    "大模型": 2.2,
    "模型发布": 2.2,
    "开源": 1.8,
    "开源模型": 2.2,
    "融资": 2.0,
    "投资": 1.8,
    "收购": 1.8,
    "政策": 1.6,
    "隐私": 2.0,
}
RECENCY_HOURS = 72


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._in_noise = 0
        self._parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() in {"script", "style", "noscript", "header", "footer", "nav"}:
            self._in_noise += 1

    def handle_endtag(self, tag):
        if tag.lower() in {"script", "style", "noscript", "header", "footer", "nav"} and self._in_noise:
            self._in_noise -= 1

    def handle_data(self, data):
        if self._in_noise:
            return
        cleaned = (data or "").strip()
        if cleaned:
            self._parts.append(cleaned)

    def text(self) -> str:
        text = " ".join(self._parts)
        text = html.unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        return text


# Verified TLS and bounded retries; never disable certificate validation.
from news_http import fetch


def text(node, name, default: str = "") -> str:
    if node is None:
        return default
    child = node.find(name)
    return (child.text or default).strip() if child is not None and child.text else default


def normalize_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value or "")
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def normalize_summary(value: str) -> str:
    value = normalize_text(value)
    return value[:SUMMARY_TARGET_LEN]


def parse_published(value: str):
    if not value:
        return "", None
    try:
        dt = parsedate_to_datetime(value)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat(), dt
    except Exception:
        return value, None


def extract_meta_desc(html_text: str) -> str:
    for pattern in (
        re.compile(r'<meta[^>]+name=["\'](?:description|twitter:description)["\'][^>]+content=["\']([^"\']+)["\']', re.I),
        re.compile(r'<meta[^>]+property=["\'](?:og:description|twitter:description)["\'][^>]+content=["\']([^"\']+)["\']', re.I),
        re.compile(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:name|property)=["\'](?:description|og:description|twitter:description)["\']', re.I),
    ):
        match = pattern.search(html_text)
        if match:
            value = html.unescape(match.group(1).strip())
            if value:
                return value
    return ""


def extract_leadin(html_text: str) -> str:
    body_match = re.search(r"<body[^>]*>(.*)</body>", html_text, flags=re.S | re.I)
    search_scope = body_match.group(1) if body_match else html_text

    # First paragraph / lead text
    candidates = re.findall(r"<p[^>]*>(.*?)</p>", search_scope, flags=re.S | re.I)
    for raw in candidates:
        value = normalize_text(raw)
        if len(value) >= 70:
            return value

    parser = _TextExtractor()
    parser.feed(search_scope)
    full = parser.text()
    if len(full) > 80:
        return full
    return ""


def enrich_summary(link: str, fallback: str) -> str:
    summary = normalize_summary(fallback)
    if summary and len(summary) >= MIN_SUMMARY_LEN:
        return summary

    if not link:
        return summary

    try:
        html_text = fetch(link, timeout=15, accepts="text/html").decode("utf-8", errors="ignore")
    except Exception:
        return summary

    meta = extract_meta_desc(html_text)
    if meta:
        return normalize_summary(meta)

    lead = extract_leadin(html_text)
    if lead:
        return normalize_summary(lead)

    return normalize_summary(fallback)


def _score_keywords(text_lower: str) -> tuple[float, list[str]]:
    reasons: list[str] = []
    score = 0.0
    for keyword, weight in TREND_WEIGHTS.items():
        if keyword.lower() in text_lower:
            score += weight
            reasons.append(keyword)
    return score, reasons


def compute_trend_score(item: Dict[str, Any], now: datetime) -> tuple[float, list[str]]:
    title = (item.get("title") or "").lower()
    summary = (item.get("summary") or "").lower()
    cat_text = " ".join(item.get("categories", [])).lower()
    combined = " ".join([title, summary, cat_text])

    kw_score, reasons = _score_keywords(combined)

    published_dt = item.get("published_dt")
    age_bonus = 0.0
    if published_dt:
        age_hours = max((now - published_dt).total_seconds() / 3600.0, 0.0)
        age_bonus = max(0.0, 1.0 - age_hours / RECENCY_HOURS) * 2.0

    why = reasons[:3]
    trend_score = round(kw_score + age_bonus, 3)
    return trend_score, sorted(dict.fromkeys(why))


def parse_feed(xml: bytes):
    root = ET.fromstring(xml)
    items = []

    if root.tag.endswith("rss"):
        channel = root.find("channel")
        feed_title = text(channel, "title", "AI资讯速览")
        entry_iter = channel.findall("item") if channel is not None else []
        for item in entry_iter[:MAX_CANDIDATES]:
            items.append(
                {
                    "title": text(item, "title"),
                    "link": text(item, "link"),
                    "published": text(item, "pubDate"),
                    "summary": text(item, "description"),
                    "categories": [
                        (cat.text or "").strip()
                        for cat in item.findall("category")
                        if (cat.text or "").strip()
                    ],
                }
            )
    else:
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        feed_title = root.findtext("atom:title", default="AI资讯速览", namespaces=ns)
        for item in root.findall("atom:entry", ns)[:MAX_CANDIDATES]:
            link_el = item.find("atom:link", ns)
            items.append(
                {
                    "title": item.findtext("atom:title", default="", namespaces=ns),
                    "link": link_el.attrib.get("href", "") if link_el is not None else "",
                    "published": item.findtext("atom:updated", default="", namespaces=ns),
                    "summary": item.findtext("atom:summary", default="", namespaces=ns),
                    "categories": [
                        (cat.text or "").strip()
                        for cat in item.findall("atom:category", ns)
                        if (cat.text or "").strip()
                    ],
                }
            )

    # enrich + normalize + dedupe
    normalized = []
    seen = set()
    for item in items:
        title = (item.get("title") or "").strip()
        link = (item.get("link") or "").strip()
        key = link or title
        if not key or key in seen:
            continue
        seen.add(key)

        parsed_iso, parsed_dt = parse_published(item.get("published", ""))
        norm = {
            "title": title,
            "link": link,
            "published": parsed_iso,
            "published_dt": parsed_dt,
            "summary": normalize_summary(item.get("summary", "")),
            "categories": item.get("categories", []),
        }
        normalized.append(norm)

    now = datetime.now(timezone.utc)
    for item in normalized:
        trend_score, reasons = compute_trend_score(item, now)
        item["trend_score"] = trend_score
        item["why_trending"] = reasons
        item.pop("published_dt", None)

    normalized.sort(key=lambda x: x.get("trend_score", 0.0), reverse=True)
    # Optional article enrichment must not serialize 20 slow external sites.
    def enrich(item):
        item["summary"] = enrich_summary(item["link"], item["summary"])
        return item
    with ThreadPoolExecutor(max_workers=6) as pool:
        selected = list(pool.map(enrich, normalized[:MAX_ITEMS]))
    return feed_title, selected


def main():
    try:
        xml = fetch(URL)
        feed_title, items = parse_feed(xml)
        if not items:
            raise RuntimeError("AI feed contained no usable items")
        print(
            json.dumps(
                {
                    "source": URL,
                    "feed_title": feed_title,
                    "item_count": len(items),
                    "items": items,
                },
                ensure_ascii=False,
                indent=2,
            )
        )
    except Exception as e:
        print(
            json.dumps(
                {
                    "source": URL,
                    "error": str(e),
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
