import os
from dotenv import load_dotenv

load_dotenv()

CONFIG = {
    # ── LLM Providers ──────────────────────────────────────────────────────────
    'llm_provider': os.getenv('LLM_PROVIDER', 'gemini'),  # gemini | groq | moonshot | anthropic | ollama | zai

    # Google Gemini
    'google_api_key': os.getenv('GOOGLE_API_KEY'),
    'gemini_model': os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),

    # Moonshot (Kimi) — OpenAI-compatible
    'moonshot_api_key': os.getenv('MOONSHOT_API_KEY'),
    'moonshot_base_url': os.getenv('MOONSHOT_BASE_URL', 'https://api.moonshot.cn/v1'),
    'moonshot_model': os.getenv('MOONSHOT_MODEL', 'moonshot-v1-8k'),

    # Groq — FREE tier, no credit card, very fast (https://console.groq.com)
    'groq_api_key': os.getenv('GROQ_API_KEY'),
    'groq_model': os.getenv('GROQ_MODEL', 'llama-3.1-8b-instant'),

    # Anthropic (legacy / fallback)
    'api_key': os.getenv('ANTHROPIC_API_KEY'),
    'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
    'model': os.getenv('ANTHROPIC_MODEL', 'claude-3-5-haiku-20241022'),

    # ZAI (legacy / fallback)
    'z_ai_api_key': os.getenv('Z_AI_API_KEY'),
    'z_ai_base_url': os.getenv('Z_AI_BASE_URL', 'https://open.z.ai/v1'),
    'z_ai_model': os.getenv('Z_AI_MODEL', 'glm-4-plus'),

    # ── Database ───────────────────────────────────────────────────────────────
    'supabase_url': os.getenv('SUPABASE_URL'),
    'supabase_key': os.getenv('SUPABASE_KEY'),
    'supabase_service_key': os.getenv('SUPABASE_SERVICE_KEY'),

    # ── General ────────────────────────────────────────────────────────────────
    'site_url': 'https://telangana.live',
    'max_tokens': 2048,
    'schedule_morning': '06:00',
    'schedule_evening': '18:00',
    'news_sync_interval_hours': int(os.getenv('NEWS_SYNC_INTERVAL_HOURS', '1')),
    'alerts_sync_interval_hours': int(os.getenv('ALERTS_SYNC_INTERVAL_HOURS', '2')),
    'secondary_sync_interval_hours': int(os.getenv('SECONDARY_SYNC_INTERVAL_HOURS', '3')),
    'gold_sync_interval_hours': int(os.getenv('GOLD_SYNC_INTERVAL_HOURS', '12')),
}


