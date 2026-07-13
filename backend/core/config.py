import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    # Anthropic key for the content-generation agents
    'api_key': os.getenv('ANTHROPIC_API_KEY'),
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_key': os.getenv('SUPABASE_KEY'),
    'supabase_service_key': os.getenv('SUPABASE_SERVICE_KEY'),
    'site_url': 'https://telangana.live',
    # Use a current Claude model; falls back to a lightweight model if unset
    'model': os.getenv('ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022'),
    'max_tokens': 2048,
    'schedule_morning': '06:00',
    'schedule_evening': '18:00',
    'llm_provider': os.getenv('LLM_PROVIDER', 'anthropic'),
    'z_ai_api_key': os.getenv('Z_AI_API_KEY'),
    'z_ai_base_url': os.getenv('Z_AI_BASE_URL', 'https://open.z.ai/v1'),
    'z_ai_model': os.getenv('Z_AI_MODEL', 'glm-4-plus'),
    'news_sync_interval_hours': int(os.getenv('NEWS_SYNC_INTERVAL_HOURS', '1')),
    'secondary_sync_interval_hours': int(os.getenv('SECONDARY_SYNC_INTERVAL_HOURS', '3')),
    'gold_sync_interval_hours': int(os.getenv('GOLD_SYNC_INTERVAL_HOURS', '12')),
}

