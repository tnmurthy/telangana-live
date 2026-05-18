import anthropic
import requests
from core.config import CONFIG
from core.database import db
import logging

logger = logging.getLogger(__name__)

class ContentUpdater:
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
    
    def update_content(self, title, old_content, new_info):
        prompt = f"""
Update this content with new information while maintaining quality and relevance.

Title: {title}

OLD CONTENT:
{old_content}

NEW INFORMATION TO INTEGRATE:
{new_info}

Please:
1. Merge the information naturally
2. Keep best parts of both old and new
3. Maintain professional tone
4. Remove any outdated or redundant parts
5. Ensure accuracy

Provide only the updated content (no explanations).
"""
        
        if self.provider == 'zai':
            updated_content = self._call_zai(prompt)
            tokens = len(prompt.split()) * 2 + len(updated_content.split()) * 2
        else:
            message = self.client.messages.create(
                model=CONFIG['model'],
                max_tokens=1500,
                messages=[{'role': 'user', 'content': prompt}]
            )
            tokens = message.usage.input_tokens + message.usage.output_tokens
            updated_content = message.content[0].text
        
        # Update in Supabase
        db.update_content(title, updated_content, tokens)
        db.log_activity('ContentUpdater', 'update', 'success', f'Updated {title}', tokens)
        logger.info(f"Content updated: {title}. Tokens: {tokens}")
        
        return updated_content, tokens
