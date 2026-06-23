import logging
from core.config import CONFIG
from core.database import db
from core.llm_provider import llm

logger = logging.getLogger(__name__)


class QualityChecker:
    """Checks and improves content quality, then publishes it."""

    def __init__(self):
        self.provider = CONFIG['llm_provider']
        self.model = CONFIG.get('z_ai_model', 'glm-4-plus') if self.provider == 'zai' else CONFIG.get('model', 'claude-3-5-haiku-20241022')

    def check_quality(self, title, content):
        """Check content quality, save improvements, and publish the article."""
        prompt = f"""
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
        result = llm.generate(
            prompt,
            provider=self.provider,
            model=self.model,
            max_tokens=1500,
        )
        improved_content = result.get('text') or content
        tokens = result.get('tokens', 0)

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
            except Exception as exc:
                logger.error(f"Quality check failed for '{item['title']}': {exc}")
                db.log_activity('QualityChecker', 'check', 'error', str(exc), 0)
