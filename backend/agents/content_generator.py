import json
import re
import logging
from core.config import CONFIG
from core.database import db
from core.llm_provider import llm

logger = logging.getLogger(__name__)

DEFAULT_TOPICS = [
    ('Hyderabad Traffic Updates', 'news', 'article'),
    ('Telangana IT Industry News', 'news', 'article'),
    ('Best Restaurants in Hyderabad', 'guides', 'guide'),
    ('Telangana Government Schemes 2024', 'guides', 'guide'),
    ('Latest IT Jobs in Hyderabad', 'listings', 'listing'),
    ('Telangana Weekly News Roundup', 'news', 'article'),
]


class ContentGenerator:
    def __init__(self):
        self.provider = CONFIG['llm_provider']
        self.model = CONFIG.get('z_ai_model', 'glm-4-plus') if self.provider == 'zai' else CONFIG.get('model', 'claude-3-5-haiku-20241022')

    def generate_content(self, topic, category, content_type='article'):
        """Generate new content and store in Supabase."""
        prompt = f"""
Generate a {content_type} for telangana.live about: {topic}

Category: {category}
Target: Telangana residents and visitors

Requirements:
- Engaging and informative title
- SEO meta description (150 chars)
- 3-4 paragraphs of quality content
- Relevant keywords for SEO
- Clear call-to-action
- Professional tone

Format your response as JSON with these exact keys:
{{
  "title": "...",
  "description": "...",
  "content": "...",
  "keywords": ["..."],
  "cta": "..."
}}
"""
        result = llm.generate(
            prompt,
            provider=self.provider,
            model=self.model,
            max_tokens=2000,
        )
        response_text = result.get('text') or ''
        tokens = result.get('tokens', 0)

        try:
            clean = re.sub(r'^```(?:json)?\s*|\s*```$', '', response_text.strip(), flags=re.MULTILINE)
            generated = json.loads(clean)

            db.insert_content(
                title=generated.get('title', topic),
                category=category,
                content=generated.get('content', response_text),
                source_url=CONFIG['site_url'],
                generated_code='',
                token_usage=tokens,
            )
            db.log_activity('ContentGenerator', 'generate', 'success', topic, tokens)
            logger.info(f"Generated {category}/{topic}. Tokens: {tokens}")
            return generated, tokens
        except json.JSONDecodeError as exc:
            logger.error(f"JSON parse error: {exc}")
            db.log_activity('ContentGenerator', 'generate', 'error', f'JSON parse error for {topic}', tokens)
            return None, tokens

    def run(self):
        """Execute generation cycle.

        First tries to pull dynamic topics from the Supabase ``topic_queue``
        table (populated by editors / admin UI).  Falls back to the hard-coded
        DEFAULT_TOPICS list when the table is empty or unavailable.
        """
        logger.info("Starting content generator...")

        queued = db.get_topic_queue()
        if queued:
            topics = [(row['topic'], row['category'], row.get('content_type', 'article')) for row in queued]
            logger.info(f"Using {len(topics)} topic(s) from Supabase topic_queue.")
        else:
            topics = DEFAULT_TOPICS
            logger.info("No queued topics found; using default topics.")

        results = []
        for topic, category, content_type in topics:
            content, tokens = self.generate_content(topic, category, content_type)
            results.append({
                'topic': topic,
                'tokens': tokens,
                'status': 'success' if content else 'error',
            })
        return results
