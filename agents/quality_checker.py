import anthropic
from config import CONFIG
from database import db
import logging

logger = logging.getLogger(__name__)

class QualityChecker:
    """Checks and improves content quality"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def check_quality(self, title, content):
        """Check content quality and suggest improvements"""
        message = self.client.messages.create(
            model=CONFIG['model'],
            max_tokens=1500,
            messages=[{
                'role': 'user',
                'content': f"""
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
            }]
        )
        
        tokens = message.usage.input_tokens + message.usage.output_tokens
        improved_content = message.content[0].text
        
        # Update in Supabase
        db.update_content(title, improved_content, tokens)
        db.log_activity('QualityChecker', 'check', 'success', f'Checked {title}', tokens)
        logger.info(f"Quality check complete: {title}. Tokens: {tokens}")
        
        return improved_content, tokens
