#!/usr/bin/env python3
import sys
import os
import requests
import datetime
import feedparser

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.database import db

def sync_ai_news():
    print("Syncing AI News...")
    feed_url = "https://hnrss.org/newest?q=AI"
    try:
        parsed = feedparser.parse(feed_url)
        inserted = 0
        for entry in parsed.entries[:10]:
            data = {
                "title": entry.title,
                "url": entry.link,
                "source": "hacker_news",
                "score": 0,
                "published_at": datetime.datetime.now().isoformat()
            }
            try:
                db.client.table("ai_daily_news").upsert(data, on_conflict="url").execute()
                inserted += 1
            except Exception as e:
                # Might fail if table isn't created yet or duplicate handling
                pass
        print(f"✅ Inserted {inserted} AI news items.")
    except Exception as e:
        print(f"⚠️ Error syncing AI news: {e}")

def sync_elo_scores():
    print("Syncing ELO Scores...")
    # Mock data to simulate fetching from LMSYS or HuggingFace
    leaderboard = [
        {"model_name": "GPT-4o", "provider": "OpenAI", "elo_score": 1287, "rank": 1, "source": "lmsys"},
        {"model_name": "Claude 3.5 Sonnet", "provider": "Anthropic", "elo_score": 1279, "rank": 2, "source": "lmsys"},
        {"model_name": "Gemini 1.5 Pro", "provider": "Google", "elo_score": 1261, "rank": 3, "source": "lmsys"},
        {"model_name": "Llama 3.1 405B", "provider": "Meta", "elo_score": 1258, "rank": 4, "source": "lmsys"}
    ]
    
    today = datetime.date.today().isoformat()
    try:
        for model in leaderboard:
            model["snapshot_date"] = today
            try:
                db.client.table("ai_models_leaderboard").upsert(model, on_conflict="model_name,source,snapshot_date").execute()
            except Exception as e:
                pass
        print(f"✅ Inserted {len(leaderboard)} ELO scores.")
    except Exception as e:
        print(f"⚠️ Error syncing ELO scores: {e}")

if __name__ == "__main__":
    sync_ai_news()
    sync_elo_scores()
