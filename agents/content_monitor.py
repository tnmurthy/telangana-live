import anthropic
import requests
from bs4 import BeautifulSoup
from config import CONFIG
from database import db
import logging

logger = logging.getLogger(__name__)

class ContentMonitor:
    """Monitors telangana.live for content that needs updates"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def fetch_website(self):
        """Fetch and parse website content"""
        try:
            response = requests.get(CONFIG['site_url'], timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove scripts and styles
            for script in soup(['script', 'style']):
                script.decompose()
            
            text = soup.get_text(separator='\n', strip=True)
            return text[:8000]  # Limit to 8000 chars
        except Exception as e:
            logger.error(f"Error fetching website: {str(e)}")
            return None
    
    def analyze_for_updates(self, content):
        """Use Claude to analyze content and identify what needs updates"""
        message = self.client.messages.create(
            model=CONFIG['model'],
            max_tokens=1500,
            messages=[{
                'role': 'user',
                'content': f"""
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
            }]
        )
        
        tokens = message.usage.input_tokens + message.usage.output_tokens
        db.log_activity('ContentMonitor', 'analyze', 'success', message.content[0].text, tokens)
        
        return message.content[0].text, tokens
    
    def run(self):
        """Execute monitoring cycle"""
        logger.info("Starting content monitor...")
        content = self.fetch_website()
        
        if content:
            analysis, tokens = self.analyze_for_updates(content)
            logger.info(f"Analysis complete. Tokens used: {tokens}")
            return analysis
        return None
