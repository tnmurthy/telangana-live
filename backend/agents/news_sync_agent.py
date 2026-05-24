import os
import json
import feedparser
import requests
from datetime import datetime
from core.config import CONFIG
from core.database import db
from core.logger import logger
from core.llm_provider import llm
from agents.fact_checker import fact_checker
from core.news_classifier import classify_article, extract_image_url, extract_entities, map_domain_to_civic_schema
from core.clustering import cluster_articles

class NewsSyncAgent:
    def _check_ollama_online(self):
        try:
            url = CONFIG.get('ollama_url') or os.getenv('OLLAMA_URL', 'http://localhost:11434')
            resp = requests.get(url, timeout=1)
            return resp.status_code == 200
        except Exception:
            return False

    def __init__(self):
        self.feeds_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts", "resources", "feeds.json")
        self.output_file = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "src", "data", "news.json"))
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
        ollama_online = self._check_ollama_online()
        if not ollama_online:
            logger.info("Ollama is offline. Bypassing AI summarization.")

        for source, url in self.feeds.items():
            try:
                logger.info(f"Fetching from {source}...")
                feed = feedparser.parse(url)
                
                for entry in feed.entries[:limit]:
                    title = entry.title
                    link = entry.link
                    description = entry.get("summary", "")

                    # 1. Classification, Entity Extraction & Image Extraction
                    cat, reg = classify_article(title, description)
                    entities = extract_entities(title, description)
                    img = extract_image_url(entry)
                    published_date = entry.get("published", datetime.now().isoformat())

                    # 2. Fact Checking (Fault Tolerant)
                    verification = {}
                    try:
                        logger.info(f"Fact-checking: {title[:40]}...")
                        verification = fact_checker.check_news_item(title, description)
                    except Exception as e:
                        logger.warning(f"Fact-check failed for {title[:20]}: {e}. Proceeding anyway.")
                    
                    if verification.get("is_fake_news_flag", False):
                        logger.warning(f"REJECTED FAKE NEWS: {title[:30]}")
                        continue

                    # 3. AI Summarization (Using local Ollama)
                    summary = ""
                    if ollama_online:
                        try:
                            prompt = f"Summarize this news in 1 concise line for a mobile app:\nTitle: {title}\nDescription: {description}"
                            resp = llm.generate(
                                prompt=prompt,
                                provider="ollama",
                                model=CONFIG.get('model', 'qwen2.5-coder:7b'),
                                max_tokens=100,
                                retries=0
                            )
                            summary = resp.get("text", "").strip()
                        except Exception as e:
                            logger.error(f"AI Summary failed: {e}")
                    else:
                        summary = description[:100] + "..." if description else ""

                    # 4. Save to Supabase (Attempt) and establish correlations
                    content_id = None
                    try:
                        content_id = db.insert_content(
                            title=title,
                            category="news",
                            content=description,
                            source_url=link,
                            generated_code=json.dumps({
                                "summary": summary,
                                "source": source,
                                "credibility": verification.get("credibility_score", 85)
                            }),
                            token_usage=0,
                            civic_tags=entities.get("domain_entities", []),
                            entities=entities,
                            district=reg
                        )
                        
                        if content_id:
                            for domain_entity in entities.get("domain_entities", []):
                                entity_type, entity_id = map_domain_to_civic_schema(domain_entity)
                                if entity_type and entity_id:
                                    db.create_correlation(content_id, entity_type, entity_id)
                    except Exception as e:
                        logger.warning(f"Supabase sync failed or correlation write error: {e}")

                    # 5. Add to local list for JSON export
                    correlated_civic_entities = []
                    for domain_entity in entities.get("domain_entities", []):
                        entity_type, entity_id = map_domain_to_civic_schema(domain_entity)
                        if entity_type and entity_id:
                            correlated_civic_entities.append({
                                "entity_type": entity_type,
                                "entity_id": entity_id
                            })

                    articles_for_json.append({
                         "title": title,
                         "description": description,
                         "link": link,
                         "source": source,
                         "ai_summary": summary or description[:100] + "...",
                         "published": published_date,
                         "category": cat,
                         "region": reg,
                         "image_url": img,
                         "correlated_civic_entities": correlated_civic_entities
                    })
                    processed_count += 1

            except Exception as e:
                logger.error(f"Error processing source {source}: {e}")

        if articles_for_json:
            try:
                os.makedirs(os.path.dirname(self.output_file), exist_ok=True)
                clustered_news = cluster_articles(articles_for_json)
                with open(self.output_file, "w", encoding="utf-8") as f:
                    json.dump(clustered_news, f, indent=2, ensure_ascii=False)
                logger.info(f"Hybrid Sync: Updated {self.output_file} with {len(articles_for_json)} items.")
            except Exception as e:
                logger.error(f"Hybrid Sync failed: {e}")

        logger.info(f"NewsSyncAgent: Cycle complete. Processed {processed_count} items.")
        return processed_count

if __name__ == "__main__":
    agent = NewsSyncAgent()
    agent.process_news(limit=2)
