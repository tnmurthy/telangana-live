import logging
from core.config import CONFIG
from core.database import db
from core.llm_provider import llm

logger = logging.getLogger(__name__)


class ContentUpdater:
    def __init__(self):
        self.provider = CONFIG['llm_provider']
        self.model = CONFIG.get('z_ai_model', 'glm-4-plus') if self.provider == 'zai' else CONFIG.get('model', 'claude-3-5-haiku-20241022')

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
        result = llm.generate(
            prompt,
            provider=self.provider,
            model=self.model,
            max_tokens=1500,
        )
        updated_content = result.get('text') or old_content
        tokens = result.get('tokens', 0)

        db.update_content(title, updated_content, tokens)
        db.log_activity('ContentUpdater', 'update', 'success', f'Updated {title}', tokens)
        logger.info(f"Content updated: {title}. Tokens: {tokens}")
        return updated_content, tokens
