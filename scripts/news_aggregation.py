#!/usr/bin/env python3
"""
news_aggregation.py — Aggregates Telangana/Hyderabad news via RSS feeds
Writes to Supabase table: news_articles
Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY env vars
"""

import os, json, hashlib, datetime, feedparser, requests, sys

# Fix Unicode output for Windows terminal
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

FEEDS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "resources", "feeds.json")

def load_feeds():
    if not os.path.exists(FEEDS_FILE):
        return {"telangana": []}
    with open(FEEDS_FILE, "r") as f:
        return json.load(f)

CATEGORIZED_FEEDS = load_feeds()

def uid(url):
    return hashlib.md5(url.encode()).hexdigest()

articles = []
for category, feeds in CATEGORIZED_FEEDS.items():
    print(f"\n📂 Processing Category: {category.upper()}")
    for feed_meta in feeds:
        try:
            # Use requests with timeout to avoid hanging
            resp = requests.get(feed_meta["url"], timeout=15, headers={"User-Agent": "Mozilla/5.0"})
            resp.raise_for_status()
            
            feed = feedparser.parse(resp.content)
            count = 0
            for entry in feed.entries[:10]:
                articles.append({
                    "id":          uid(entry.get("link", "")),
                    "source":      feed_meta["source"],
                    "category":    category,
                    "title":       entry.get("title", "")[:255],
                    "url":         entry.get("link", ""),
                    "published_at":entry.get("published", datetime.datetime.utcnow().isoformat()),
                    "summary":     entry.get("summary", "")[:500],
                    "created_at":  datetime.datetime.utcnow().isoformat(),
                })
                count += 1
            print(f"  ✅ {feed_meta['source']}: {count} articles")
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
