from supabase import create_client, Client
from datetime import datetime
from config import CONFIG
import logging

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

    def insert_content(self, title, category, content, source_url, generated_code, token_usage):
        """Insert or update content in Supabase."""
        now = datetime.now().isoformat()

        data = {
            'title': title,
            'category': category,
            'content': content,
            'source_url': source_url,
            'generated_code': generated_code,
            'status': 'active',
            'created_at': now,
            'updated_at': now,
            'token_usage': token_usage,
        }

        try:
            response = self.client.table('content').update(data).eq('title', title).execute()
            if not response.data:
                self.client.table('content').insert(data).execute()
            logger.info(f"Content inserted/updated: {title}")
            return True
        except Exception as e:
            logger.error(f"Error inserting content: {str(e)}")
            return False

    def log_activity(self, agent, action, status, details, tokens_used):
        """Log agent activity to Supabase."""
        now = datetime.now().isoformat()

        data = {
            'agent': agent,
            'action': action,
            'status': status,
            'timestamp': now,
            'details': details,
            'tokens_used': tokens_used,
        }

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


db = SupabaseDB()

