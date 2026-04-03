import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    'api_key': os.getenv('OPENAI_API_KEY'),
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_key': os.getenv('SUPABASE_KEY'),
    'supabase_service_key': os.getenv('SUPABASE_SERVICE_KEY'),
    'site_url': 'https://telangana.live',
    'model': 'gpt-4o',
    'max_tokens': 2048,
    'schedule_morning': '06:00',
    'schedule_evening': '18:00',
}
