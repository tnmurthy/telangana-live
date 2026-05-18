import anthropic
import requests
from core.config import CONFIG
from core.database import db
import logging

logger = logging.getLogger(__name__)

class QualityChecker:
<<<<<<< HEAD:backend/agents/agents/quality_checker.py
    """Checks and improves content quality, then publishes it."""
    
=======
>>>>>>> 18e0bf2 (updating repo):agents/quality_checker.py
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
    
    def check_quality(self, title, content):
<<<<<<< HEAD:backend/agents/agents/quality_checker.py
        """Check content quality, save improvements, and publish the article."""
        message = self.client.messages.create(
            model=CONFIG['model'],
            max_tokens=1500,
            messages=[{
                'role': 'user',
                'content': f"""
=======
        prompt = f"""
>>>>>>> 18e0bf2 (updating repo):agents/quality_checker.py
Review and improve this content for quality and accuracy.

Title: {title}

Content:
{content}

Check for:
1. Grammar and spelling errors
2. Readability (use simple, clear language)
3. SEO optimization (proper keywords, structure)
4. Accuracy (especially Telangana-specific facts)
5. Tone and professionalism
6. Engagement and clarity

Provide an improved version of the content that addresses all these points.
Keep it the same length or slightly longer.
"""
        
        if self.provider == 'zai':
            improved_content = self._call_zai(prompt)
            tokens = len(prompt.split()) * 2 + len(improved_content.split()) * 2
        else:
            message = self.client.messages.create(
                model=CONFIG['model'],
                max_tokens=1500,
                messages=[{'role': 'user', 'content': prompt}]
            )
            tokens = message.usage.input_tokens + message.usage.output_tokens
            improved_content = message.content[0].text
        
        # Save improved content and promote status to 'published'
        db.update_content(title, improved_content, tokens)
        db.publish_content(title)
        db.log_activity('QualityChecker', 'check_and_publish', 'success', f'Checked & published: {title}', tokens)
        logger.info(f"Quality check complete, published: {title}. Tokens: {tokens}")
        
        return improved_content, tokens

    def run(self):
        """Quality-check all content that is still in 'active' (draft) status."""
        logger.info("Starting quality checker...")
        pending = db.get_pending_quality_check(limit=5)
        if not pending:
            logger.info("No pending content to quality-check.")
            return

        for item in pending:
            try:
                self.check_quality(item['title'], item['content'])
            except Exception as e:
                logger.error(f"Quality check failed for '{item['title']}': {e}")
                db.log_activity('QualityChecker', 'check', 'error', str(e), 0)
