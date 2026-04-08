#!/usr/bin/env python3
"""
news_aggregation.py — Aggregates Telangana/Hyderabad news via RSS feeds
Writes to Supabase table: news_articles
Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
"""

import os, json, hashlib, datetime, feedparser, requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

RSS_FEEDS = [
    {"source": "The Hindu - Hyderabad",    "url": "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss"},
    {"source": "Times of India - Hyd",     "url": "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms"},
    {"source": "Deccan Chronicle",         "url": "https://www.deccanchronicle.com/rss_feed/"},
    {"source": "Telangana Today",          "url": "https://telanganatoday.com/feed"},
    {"source": "Hans India - Telangana",   "url": "https://www.thehansindia.com/rss/telangana.xml"},
]

def uid(url):
    return hashlib.md5(url.encode()).hexdigest()

articles = []
for feed_meta in RSS_FEEDS:
    try:
        feed = feedparser.parse(feed_meta["url"])
        for entry in feed.entries[:10]:
            articles.append({
                "id":          uid(entry.get("link", "")),
                "source":      feed_meta["source"],
                "title":       entry.get("title", "")[:255],
                "url":         entry.get("link", ""),
                "published_at":entry.get("published", datetime.datetime.utcnow().isoformat()),
                "summary":     entry.get("summary", "")[:500],
                "created_at":  datetime.datetime.utcnow().isoformat(),
            })
        print(f"  ✅ {feed_meta['source']}: {len(feed.entries[:10])} articles")
    except Exception as e:
        print(f"  ⚠️  {feed_meta['source']} failed: {e}")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("\nℹ️  Supabase secrets not set — printing article count only.")
    print(f"  Total articles fetched: {len(articles)}")
else:
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates",
    }
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/news_articles",
        headers=headers,
        json=articles,
        timeout=30,
    )
    print(f"\n✅ Upserted {len(articles)} articles → Supabase ({resp.status_code})")

print("\n✅ news_aggregation.py completed.")
