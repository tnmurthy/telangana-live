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
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

# Output path for frontend static data
FRONTEND_DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "src", "data")
NEWS_JSON_PATH = os.path.join(FRONTEND_DATA_DIR, "news.json")

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
                link = entry.get("link", "")
                title = entry.get("title", "")
                summary = entry.get("summary", "")
                published = entry.get("published", datetime.datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S +0530"))
                
                # Basic region tagging
                region = "Telangana"
                low_title = title.lower()
                if any(k in low_title for k in ["hyderabad", "ghmc", "banjara", "jubilee", "secunderabad"]):
                    region = "Hyderabad"
                elif any(k in low_title for k in ["cyberabad", "hitec", "gachibowli", "kondapur", "madhapur"]):
                    region = "Cyberabad"
                elif any(k in low_title for k in ["malkajgiri", "uppal", "alwal", "kapra"]):
                    region = "Malkajgiri"

                # Category tagging refinement
                cat = category.capitalize()
                if any(k in low_title for k in ["traffic", "metro", "rtc", "train", "road"]):
                    cat = "Transit"
                elif any(k in low_title for k in ["rain", "flood", "heat", "weather", "imd"]):
                    cat = "Weather"
                elif any(k in low_title for k in ["police", "crime", "robbery", "arrest"]):
                    cat = "Safety"

                articles.append({
                    "id":          uid(link),
                    "title":       title[:255],
                    "link":        link,
                    "source":      feed_meta["source"],
                    "published":   published,
                    "description": summary[:500],
                    "category":    cat,
                    "region":      region,
                    "ai_summary":  "", # Placeholder for now
                    "tags":        []
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

# Write to local news.json for static frontend consumption
try:
    os.makedirs(FRONTEND_DATA_DIR, exist_ok=True)
    with open(NEWS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print(f"✅ Written {len(articles)} articles to {NEWS_JSON_PATH}")
except Exception as e:
    print(f"⚠️ Failed to write news.json: {e}")

print("\n✅ news_aggregation.py completed.")
