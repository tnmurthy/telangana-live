import os
import json
import feedparser
from datetime import datetime
from core.config import CONFIG
from core.database import db
from core.logger import logger
from core.llm_provider import llm
from agents.fact_checker import fact_checker

class NewsSyncAgent:
    def __init__(self):
        self.feeds_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts", "resources", "feeds.json")
        self.output_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "src", "src", "data", "news.json")
        self.feeds = self._load_feeds()

    def _load_feeds(self):
        try:
            with open(self.feeds_file, encoding="utf-8") as f:
                data = json.load(f)
            feeds = {}
            for category in ("telangana", "national"):
                for item in data.get(category, []):
                    feeds[item["source"]] = item["url"]
            return feeds
        except Exception as e:
            logger.warning(f"Could not load feeds.json: {e}. Using defaults.")
            return {
                "The Hindu - Hyderabad": "https://www.thehindu.com/news/cities/Hyderabad/feeder/default.rss",
                "Telangana Today": "https://telanganatoday.com/feed",
            }

    def process_news(self, limit=5):
        """Fetch, fact-check, and sync news to Supabase."""
        logger.info("NewsSyncAgent: Starting sync cycle...")
        processed_count = 0
        articles_for_json = []

        for source, url in self.feeds.items():
            try:
                logger.info(f"Fetching from {source}...")
                feed = feedparser.parse(url)
                
                for entry in feed.entries[:limit]:
                    title = entry.title
                    link = entry.link
                    description = entry.get("summary", "")

                    # 1. Fact Checking (Fault Tolerant)
                    verification = {}
                    try:
                        logger.info(f"Fact-checking: {title[:40]}...")
                        verification = fact_checker.check_news_item(title, description)
                    except Exception as e:
                        logger.warning(f"Fact-check failed for {title[:20]}: {e}. Proceeding anyway.")
                    
                    if verification.get("is_fake_news_flag", False):
                        logger.warning(f"REJECTED FAKE NEWS: {title[:30]}")
                        continue

                    # 2. AI Summarization (Using local Ollama)
                    summary = ""
                    try:
                        prompt = f"Summarize this news in 1 concise line for a mobile app:\nTitle: {title}\nDescription: {description}"
                        resp = llm.generate(
                            prompt=prompt,
                            provider="ollama",
                            model=CONFIG.get('model', 'qwen2.5-coder:7b'),
                            max_tokens=100
                        )
                        summary = resp.get("text", "").strip()
                    except Exception as e:
                        logger.error(f"AI Summary failed: {e}")

                    # 3. Save to Supabase (Attempt)
                    try:
                        db.insert_content(
                            title=title,
                            category="news",
                            content=description,
                            source_url=link,
                            generated_code=json.dumps({
                                "summary": summary,
                                "source": source,
                                "credibility": verification.get("credibility_score", 85)
                            }),
                            token_usage=0
                        )
                    except Exception as e:
                        logger.warning(f"Supabase sync failed (RLS?): {e}")

                    # 4. Add to local list for JSON export
                    articles_for_json.append({
                        "title": title,
                        "description": description,
                        "link": link,
                        "source": source,
                        "ai_summary": summary or description[:100] + "...",
                        "published": datetime.now().isoformat(),
                        "category": "General",
                        "region": "Telangana"
                    })
                    processed_count += 1

            except Exception as e:
                logger.error(f"Error processing source {source}: {e}")

        # 5. Hybrid Sync: Export to JSON for frontend
        if articles_for_json:
            try:
                os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
                with open(self.output_file, "w", encoding="utf-8") as f:
                    json.dump(articles_for_json, f, indent=2, ensure_ascii=False)
                logger.info(f"Hybrid Sync: Updated {self.output_file} with {len(articles_for_json)} items.")
            except Exception as e:
                logger.error(f"Hybrid Sync failed: {e}")

        logger.info(f"NewsSyncAgent: Cycle complete. Processed {processed_count} items.")
        return processed_count

if __name__ == "__main__":
    agent = NewsSyncAgent()
    agent.process_news(limit=2)
