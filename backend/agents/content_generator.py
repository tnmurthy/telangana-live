import anthropic
import openai
import requests
import json
import re
from core.config import CONFIG
from core.database import db
import logging

logger = logging.getLogger(__name__)

# Default topics used when no dynamic queue is available in Supabase
DEFAULT_TOPICS = [
    ('Top Telangana Tourism Destinations', 'guides', 'guide'),
    ('Latest IT Jobs in Hyderabad', 'listings', 'listing'),
    ('Telangana Weekly News Roundup', 'news', 'article'),
]

class ContentGenerator:
    def __init__(self):
        self.provider = CONFIG['llm_provider']
        
        if self.provider == 'zai':
            self.zai_api_key = CONFIG['z_ai_api_key']
            self.zai_base_url = CONFIG['z_ai_base_url']
            self.zai_model = CONFIG['z_ai_model']
        else:
            self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def _call_zai(self, prompt, max_tokens=2000):
        """Call z.ai API"""
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
    
    def generate_content(self, topic, category, content_type='article'):
        """Generate new content and store in Supabase"""
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
        
        if self.provider == 'zai':
            response_text = self._call_zai(prompt)
            tokens = len(prompt.split()) * 2 + len(response_text.split()) * 2
        else:
            message = self.client.messages.create(
                model=CONFIG['model'],
                max_tokens=2000,
                messages=[{'role': 'user', 'content': prompt}]
            )
            tokens = message.usage.input_tokens + message.usage.output_tokens
            response_text = message.content[0].text
        
        try:
            # Strip markdown code fences if the model wrapped the JSON
            clean = re.sub(r'^```(?:json)?\s*|\s*```$', '', response_text.strip(), flags=re.MULTILINE)
            generated = json.loads(clean)
            
            # Store in Supabase
            db.insert_content(
                title=generated.get('title', topic),
                category=category,
                content=generated.get('content', response_text),
                source_url=CONFIG['site_url'],
                generated_code='',
                token_usage=tokens
            )
            
            db.log_activity('ContentGenerator', 'generate', 'success', topic, tokens)
            logger.info(f"Generated {category}/{topic}. Tokens: {tokens}")
            
            return generated, tokens
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {str(e)}")
            db.log_activity('ContentGenerator', 'generate', 'error', f'JSON parse error for {topic}', tokens)
            return None, tokens
    
    def run(self):
        """Execute generation cycle.
        
        First tries to pull dynamic topics from the Supabase ``topic_queue``
        table (populated by editors / admin UI).  Falls back to the hard-coded
        DEFAULT_TOPICS list when the table is empty or unavailable.
        """
        logger.info("Starting content generator...")

        # Prefer editor-supplied topic queue
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
            if content:
                results.append({'topic': topic, 'tokens': tokens, 'status': 'success'})
            else:
                results.append({'topic': topic, 'tokens': tokens, 'status': 'error'})
        
        return results
