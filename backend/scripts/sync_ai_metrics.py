#!/usr/bin/env python3
import datetime
import os
import sys

import feedparser

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def get_db_client():
    try:
        from core.database import db
        return db.client
    except Exception as e:
        print(f"ℹ️  Supabase client not available ({e}). Skipping remote DB upsert.")
        return None

def sync_ai_news():
    print("Syncing AI News...")
    feed_url = "https://hnrss.org/newest?q=AI"
    client = get_db_client()
    try:
        parsed = feedparser.parse(feed_url)
        inserted = 0
        news_items = []
        for entry in parsed.entries[:10]:
            data = {
                "title": entry.title,
                "url": entry.link,
                "source": "hacker_news",
                "score": 0,
                "published_at": datetime.datetime.now(datetime.UTC).isoformat()
            }
            news_items.append(data)
            if client:
                try:
                    client.table("ai_daily_news").upsert(data, on_conflict="url").execute()
                    inserted += 1
                except Exception as e:
                    print(f"⚠️ Upsert failed for {data['url']}: {e}")
        if client:
            print(f"✅ Upserted {inserted} AI news items to Supabase.")
        else:
            print(f"✅ Fetched {len(news_items)} AI news items (local mode).")
    except Exception as e:
        print(f"⚠️ Error syncing AI news: {e}")

if __name__ == "__main__":
    sync_ai_news()

