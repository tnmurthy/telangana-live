import anthropic
from config import CONFIG
from database import db
import logging

logger = logging.getLogger(__name__)

class ContentUpdater:
    """Updates existing content with new information"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=CONFIG['api_key'])
    
    def update_content(self, title, old_content, new_info):
        """Update existing content with new information"""
        message = self.client.messages.create(
            model=CONFIG['model'],
            max_tokens=1500,
            messages=[{
                'role': 'user',
                'content': f"""
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
            }]
        )
        
        tokens = message.usage.input_tokens + message.usage.output_tokens
        updated_content = message.content[0].text
        
        # Update in Supabase
        db.update_content(title, updated_content, tokens)
        db.log_activity('ContentUpdater', 'update', 'success', f'Updated {title}', tokens)
        logger.info(f"Content updated: {title}. Tokens: {tokens}")
        
        return updated_content, tokens
