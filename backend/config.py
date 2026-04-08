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
}
