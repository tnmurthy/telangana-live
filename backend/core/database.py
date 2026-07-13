from supabase import create_client, Client
from datetime import datetime
from core.config import CONFIG
import logging
from schemas import ContentModel, ActivityLogModel, CivicCorrelationModel

logger = logging.getLogger(__name__)


class SupabaseDB:
    def __init__(self):
        self.url = CONFIG['supabase_url']
        self.key = CONFIG['supabase_key']
        self._client: Client | None = None

    @property
    def client(self) -> Client:
        """Lazily create the Supabase client so that missing env vars only
        raise an error when DB operations are actually attempted, not at
        module-import time (which would break scheduler startup)."""
        if self._client is None:
            if not self.url or not self.key:
                raise RuntimeError(
                    "SUPABASE_URL and SUPABASE_KEY must be set in the environment "
                    "before any database operations are performed."
                )
            self._client = create_client(self.url, self.key)
        return self._client

    def insert_content(
        self, title, category, content, source_url, generated_code, token_usage,
        civic_tags=None, entities=None, district=None, vector_embedding=None
    ):
        """Insert or update content in Supabase."""
        validated = ContentModel(
            title=title, category=category, content=content,
            source_url=source_url, generated_code=generated_code,
            token_usage=token_usage or 0,
            civic_tags=civic_tags,
            entities=entities,
            district=district,
            vector_embedding=vector_embedding
        )
        data = validated.model_dump()

        try:
            response = self.client.table('content').update(data).eq('title', title).execute()
            if response.data:
                row_id = response.data[0]['id']
                logger.info(f"Content updated: {title} (ID: {row_id})")
                return row_id

            insert_response = self.client.table('content').insert(data).execute()
            if insert_response.data:
                row_id = insert_response.data[0]['id']
                logger.info(f"Content inserted: {title} (ID: {row_id})")
                return row_id

            logger.warning(f"Content inserted/updated but no data returned for title: {title}")
            return None
        except Exception as e:
            logger.error(f"Error inserting content: {str(e)}")
            return None

    def log_activity(self, agent, action, status, details, tokens_used):
        """Log agent activity to Supabase."""
        validated = ActivityLogModel(
            agent=agent, action=action, status=status,
            details=details, tokens_used=tokens_used or 0
        )
        data = validated.model_dump()

        try:
            self.client.table('activity_log').insert(data).execute()
            logger.info(f"Activity logged: {agent} - {action}")
            return True
        except Exception as e:
            logger.error(f"Error logging activity: {str(e)}")
            return False

    def get_content_by_category(self, category):
        """Get content by category."""
        try:
            response = self.client.table('content').select('*').eq('category', category).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching content: {str(e)}")
            return []

    def get_activity_log(self, limit=50):
        """Get recent activity logs."""
        try:
            response = (
                self.client.table('activity_log')
                .select('*')
                .order('timestamp', desc=True)
                .limit(limit)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.error(f"Error fetching logs: {str(e)}")
            return []

    def update_content(self, title, content, token_usage):
        """Update existing content."""
        now = datetime.now().isoformat()

        data = {
            'content': content,
            'updated_at': now,
            'token_usage': token_usage,
        }

        try:
            self.client.table('content').update(data).eq('title', title).execute()
            logger.info(f"Content updated: {title}")
            return True
        except Exception as e:
            logger.error(f"Error updating content: {str(e)}")
            return False

    def publish_content(self, title):
        """Mark content as published so the frontend can surface it."""
        try:
            self.client.table('content').update({'status': 'published', 'updated_at': datetime.now().isoformat()}).eq('title', title).execute()
            logger.info(f"Content published: {title}")
            return True
        except Exception as e:
            logger.error(f"Error publishing content: {str(e)}")
            return False

    def get_published_content(self, limit=10):
        """Fetch recently published articles for the Stories bar."""
        try:
            response = (
                self.client.table('content')
                .select('id, title, category, content, source_url, updated_at')
                .eq('status', 'published')
                .order('updated_at', desc=True)
                .limit(limit)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.error(f"Error fetching published content: {str(e)}")
            return []

    def get_pending_quality_check(self, limit=5):
        """Fetch active content that has not yet been quality-checked."""
        try:
            response = (
                self.client.table('content')
                .select('id, title, content')
                .eq('status', 'active')
                .order('created_at', desc=True)
                .limit(limit)
                .execute()
            )
            return response.data
        except Exception as e:
            logger.error(f"Error fetching pending content: {str(e)}")
            return []

    def get_topic_queue(self):
        """Fetch dynamic content topics queued by editors in Supabase.
        Falls back to an empty list when the table doesn't exist yet."""
        try:
            response = (
                self.client.table('topic_queue')
                .select('topic, category, content_type')
                .eq('status', 'pending')
                .order('created_at', desc=True)
                .limit(10)
                .execute()
            )
            return response.data or []
        except Exception as e:
            logger.warning(f"topic_queue table not available ({e}); using default topics.")
            return []

    def create_correlation(self, content_id: int, entity_type: str, entity_id: str, correlation_score: float = 1.0):
        """Create a new civic correlation record."""
        validated = CivicCorrelationModel(
            content_id=content_id,
            entity_type=entity_type,
            entity_id=entity_id,
            correlation_score=correlation_score
        )
        data = validated.model_dump()
        try:
            response = self.client.table('civic_correlations').insert(data).execute()
            if response.data:
                row_id = response.data[0]['id']
                logger.info(f"Civic correlation created: {entity_type}/{entity_id} -> content {content_id} (ID: {row_id})")
                return row_id
            return None
        except Exception as e:
            logger.error(f"Error creating civic correlation: {str(e)}")
            return None

    def get_correlations_by_entity(self, entity_type: str, entity_id: str):
        """Get all civic correlations for a given entity."""
        try:
             response = (
                 self.client.table('civic_correlations')
                 .select('*')
                 .eq('entity_type', entity_type)
                 .eq('entity_id', entity_id)
                 .eq('is_active', True)
                 .execute()
             )
             return response.data
        except Exception as e:
             logger.error(f"Error fetching correlations by entity: {str(e)}")
             return []

    def get_correlations_by_content(self, content_id: int):
        """Get all civic correlations for a given content ID."""
        try:
             response = (
                 self.client.table('civic_correlations')
                 .select('*')
                 .eq('content_id', content_id)
                 .eq('is_active', True)
                 .execute()
             )
             return response.data
        except Exception as e:
             logger.error(f"Error fetching correlations by content: {str(e)}")
             return []

    def get_content_by_id(self, content_id: int):
        """Fetch content by ID."""
        try:
            response = self.client.table('content').select('*').eq('id', content_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error fetching content by ID {content_id}: {str(e)}")
            return None

    def get_correlations_by_type(self, entity_type: str):
        """Get all active civic correlations for a given entity type."""
        try:
             response = (
                 self.client.table('civic_correlations')
                 .select('*')
                 .eq('entity_type', entity_type)
                 .eq('is_active', True)
                 .execute()
             )
             return response.data
        except Exception as e:
             logger.error(f"Error fetching correlations by type: {str(e)}")
             return []


db = SupabaseDB()

