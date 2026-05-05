import anthropic
import requests
from bs4 import BeautifulSoup
from core.config import CONFIG
from core.database import db
import logging

logger = logging.getLogger(__name__)

class ContentMonitor:
    def __init__(self):
        self.provider = CONFIG['llm_provider']
        
        if self.provider == 'zai':
            self.zai_api_key = CONFIG['z_ai_api_key']
            self.zai_base_url = CONFIG['z_ai_base_url']
            self.zai_model = CONFIG['z_ai_model']
        else:
            self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def _call_zai(self, prompt, max_tokens=1500):
        headers = {
            'Authorization': f'Bearer {self.zai_api_key}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model': self.zai_model,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': max_tokens
        }
        response = requests.post(
            f'{self.zai_base_url}/chat/completions',
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    
    def fetch_website(self):
        """Fetch and parse website content"""
        try:
            response = requests.get(CONFIG['site_url'], timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for script in soup(['script', 'style']):
                script.decompose()
            
            text = soup.get_text(separator='\n', strip=True)
            return text[:8000]
        except Exception as e:
            logger.error(f"Error fetching website: {str(e)}")
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
        
        if self.provider == 'zai':
            result = self._call_zai(prompt)
            tokens = len(prompt.split()) * 2 + len(result.split()) * 2
        else:
            message = self.client.messages.create(
                model=CONFIG['model'],
                max_tokens=1500,
                messages=[{'role': 'user', 'content': prompt}]
            )
            tokens = message.usage.input_tokens + message.usage.output_tokens
            result = message.content[0].text
        
        db.log_activity('ContentMonitor', 'analyze', 'success', result, tokens)
        
        return result, tokens
    
    def run(self):
        """Execute monitoring cycle"""
        logger.info("Starting content monitor...")
        content = self.fetch_website()
        
        if content:
            analysis, tokens = self.analyze_for_updates(content)
            logger.info(f"Analysis complete. Tokens used: {tokens}")
            return analysis
        return None
