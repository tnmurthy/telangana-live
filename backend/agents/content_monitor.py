import requests
from bs4 import BeautifulSoup
import logging
from core.config import CONFIG
from core.database import db
from core.llm_provider import llm

logger = logging.getLogger(__name__)


class ContentMonitor:
    def __init__(self):
        self.provider = CONFIG['llm_provider']
        self.model = CONFIG.get('z_ai_model', 'glm-4-plus') if self.provider == 'zai' else CONFIG.get('model', 'claude-3-5-haiku-20241022')

    def fetch_website(self):
        """Fetch and parse website content."""
        try:
            response = requests.get(CONFIG['site_url'], timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')

            for tag in soup(['script', 'style']):
                tag.decompose()

            text = soup.get_text(separator='\n', strip=True)
            return text[:8000]
        except Exception as exc:
            logger.error(f"Error fetching website: {exc}")
            return None

    def analyze_for_updates(self, content):
        prompt = f"""
You are a content analyst for telangana.live. Analyze this website content and identify:

1. News items that are outdated or need updating
2. Sections with missing information
3. Broken links or references
4. Content categories and their status

Website Content:
---
{content}
---

Provide a JSON response with:
{{
  "news": {{"status": "needs_update/ok", "details": "..."}},
  "guides": {{"status": "needs_update/ok", "details": "..."}},
  "listings": {{"status": "needs_update/ok", "details": "..."}},
  "priority": "high/medium/low",
  "recommendations": ["..."]
}}
"""
        result = llm.generate(
            prompt,
            provider=self.provider,
            model=self.model,
            max_tokens=1500,
        )
        analysis = result.get('text') or ''
        tokens = result.get('tokens', 0)

        db.log_activity('ContentMonitor', 'analyze', 'success', analysis, tokens)
        return analysis, tokens

    def run(self):
        """Execute monitoring cycle."""
        logger.info("Starting content monitor...")
        content = self.fetch_website()

        if content:
            analysis, tokens = self.analyze_for_updates(content)
            logger.info(f"Analysis complete. Tokens used: {tokens}")
            return analysis
        return None
