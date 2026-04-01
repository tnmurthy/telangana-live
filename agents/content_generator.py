import anthropic
import json
from config import CONFIG
from database import db
import logging

logger = logging.getLogger(__name__)

class ContentGenerator:
    """Generates new content for telangana.live"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def generate_content(self, topic, category, content_type='article'):
        """Generate new content and store in Supabase"""
        message = self.client.messages.create(
            model=CONFIG['model'],
            max_tokens=2000,
            messages=[{
                'role': 'user',
                'content': f"""
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
            }]
        )
        
        tokens = message.usage.input_tokens + message.usage.output_tokens
        response_text = message.content[0].text
        
        try:
            # Parse JSON response
            generated = json.loads(response_text)
            
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
        """Execute generation cycle with default topics"""
        logger.info("Starting content generator...")
        
        topics = [
            ('Top Telangana Tourism Destinations', 'guides', 'guide'),
            ('Latest IT Jobs in Hyderabad', 'listings', 'listing'),
            ('Telangana Weekly News Roundup', 'news', 'article'),
        ]
        
        results = []
        for topic, category, content_type in topics:
            content, tokens = self.generate_content(topic, category, content_type)
            if content:
                results.append({'topic': topic, 'tokens': tokens, 'status': 'success'})
            else:
                results.append({'topic': topic, 'tokens': tokens, 'status': 'error'})
        
        return results
