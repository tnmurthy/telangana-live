import sys
import os

# Insert engines path at start of sys.path to resolve shared library imports
SHARED_ENGINES_DIR = r"C:\tt-ai-stack\02_engines"
if SHARED_ENGINES_DIR not in sys.path:
    sys.path.insert(0, SHARED_ENGINES_DIR)

try:
    from llm_provider import LLMProvider
except ImportError:
    # If the shared library is not available (e.g. in GitHub Actions CI),
    # use a local robust implementation of LLMProvider.
    import time
    import logging
    import requests
    from typing import Optional, Dict, Any

    logger = logging.getLogger(__name__)

    try:
        import anthropic
    except ImportError:
        anthropic = None

    try:
        import google.generativeai as genai
    except ImportError:
        genai = None

    # Patch httpx for older client SDKs if httpx is present
    try:
        import httpx
        for _cls in (httpx.Client, httpx.AsyncClient):
            _orig = _cls.__init__
            def _make_patched(orig):
                def _patched(self, *args, **kwargs):
                    if 'proxies' in kwargs:
                        proxies = kwargs.pop('proxies')
                        if proxies and not kwargs.get('proxy'):
                            kwargs['proxy'] = next(iter(proxies.values())) if isinstance(proxies, dict) else proxies
                    orig(self, *args, **kwargs)
                return _patched
            _cls.__init__ = _make_patched(_orig)
    except ImportError:
        pass

    class LLMProvider:
        DEFAULT_MODELS = {
            "anthropic": "claude-3-5-haiku-20241022",
            "gemini":    "gemini-2.0-flash",
            "ollama":    "qwen2.5-coder:7b",
            "zai":       "glm-4-plus",
            "moonshot":  "moonshot-v1-8k",
            "groq":      "llama-3.1-8b-instant",
        }

        def __init__(self, config: Optional[Dict[str, Any]] = None):
            self.config = config or {}

            # Anthropic key
            anthropic_key = (
                self.config.get('anthropic_api_key')
                or self.config.get('api_key')
                or os.getenv('ANTHROPIC_API_KEY')
            )
            if anthropic_key and anthropic:
                try:
                    self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key)
                except Exception as e:
                    logger.error(f"Failed to initialize Anthropic client: {e}")
                    self.anthropic_client = None
            else:
                self.anthropic_client = None

            # Gemini key
            gemini_key = (
                self.config.get('google_api_key')
                or os.getenv('GOOGLE_API_KEY')
            )
            if gemini_key and genai:
                try:
                    genai.configure(api_key=gemini_key)
                    self.gemini_available = True
                except Exception as e:
                    logger.error(f"Failed to configure Gemini: {e}")
                    self.gemini_available = False
            else:
                self.gemini_available = False

            # Moonshot (Kimi) key
            moonshot_key = (
                self.config.get('moonshot_api_key')
                or os.getenv('MOONSHOT_API_KEY')
            )
            self.moonshot_available = bool(moonshot_key)

            # Groq key (free tier)
            groq_key = (
                self.config.get('groq_api_key')
                or os.getenv('GROQ_API_KEY')
            )
            self.groq_available = bool(groq_key)

            # Ollama URL
            self.ollama_url = (
                self.config.get('ollama_url')
                or os.getenv('OLLAMA_URL', 'http://localhost:11434')
            )

        def generate(
            self,
            prompt: str,
            provider: str = "gemini",
            model: str = "gemini-2.0-flash",
            temperature: float = 0.7,
            max_tokens: int = 1500,
            retries: int = 2,
            system_prompt: Optional[str] = None,
        ) -> Dict[str, Any]:
            """Generate text via the requested provider with retry and provider fallback."""
            configured_provider = self.config.get('llm_provider', provider)
            default_priority = ["gemini", "groq", "moonshot", "anthropic", "zai", "ollama"]

            # Build fallback chain: configured first, then requested, then rest
            provider_fallback_chain = []
            if configured_provider in default_priority:
                provider_fallback_chain.append(configured_provider)
            if provider not in provider_fallback_chain and provider in default_priority:
                provider_fallback_chain.append(provider)
            for p in default_priority:
                if p not in provider_fallback_chain:
                    provider_fallback_chain.append(p)

            last_error = None

            for p in provider_fallback_chain:
                # ── Availability checks ───────────────────────────────────────
                if p == "anthropic":
                    if not anthropic:
                        logger.info("Skipping Anthropic (package not installed).")
                        continue
                    if not self.anthropic_client:
                        logger.info("Skipping Anthropic (no API key).")
                        continue
                elif p == "gemini":
                    if not genai:
                        logger.info("Skipping Gemini (package not installed).")
                        continue
                    if not self.gemini_available:
                        logger.info("Skipping Gemini (no API key).")
                        continue
                elif p == "moonshot":
                    if not self.moonshot_available:
                        logger.info("Skipping Moonshot (no API key).")
                        continue
                elif p == "groq":
                    if not self.groq_available:
                        logger.info("Skipping Groq (no API key).")
                        continue
                elif p == "zai":
                    if not (self.config.get('z_ai_api_key') or os.getenv('Z_AI_API_KEY')):
                        logger.info("Skipping ZAI (no API key).")
                        continue

                # ── Provider-aware model resolution ───────────────────────────
                if p == "gemini":
                    current_model = (
                        self.config.get('gemini_model')
                        or self.DEFAULT_MODELS['gemini']
                    )
                    if provider == "gemini" and model not in ("claude-3-haiku-20240307", "", None):
                        current_model = model  # caller explicitly passed a gemini model
                elif p == "moonshot":
                    current_model = (
                        self.config.get('moonshot_model')
                        or self.DEFAULT_MODELS['moonshot']
                    )
                    if provider == "moonshot" and model not in ("claude-3-haiku-20240307", "", None):
                        current_model = model
                elif p == "groq":
                    current_model = (
                        self.config.get('groq_model')
                        or self.DEFAULT_MODELS['groq']
                    )
                    if provider == "groq" and model not in ("claude-3-haiku-20240307", "", None):
                        current_model = model
                elif p == "anthropic":
                    current_model = (
                        self.config.get('model')
                        or self.DEFAULT_MODELS['anthropic']
                    )
                    if provider == "anthropic" and model not in ("claude-3-haiku-20240307", "", None):
                        current_model = model
                elif p == "zai":
                    current_model = (
                        self.config.get('z_ai_model')
                        or self.DEFAULT_MODELS['zai']
                    )
                    if provider == "zai" and model not in ("claude-3-haiku-20240307", "", None):
                        current_model = model
                else:
                    current_model = self.DEFAULT_MODELS.get(p, model)

                logger.info(f"Attempting LLM generation with provider={p!r}, model={current_model!r}")

                for attempt in range(retries + 1):
                    try:
                        if p == "anthropic":
                            return self._call_anthropic(prompt, current_model, temperature, max_tokens, system_prompt)
                        elif p == "gemini":
                            return self._call_gemini(prompt, current_model, temperature, system_prompt)
                        elif p == "ollama":
                            return self._call_ollama(prompt, current_model, temperature, system_prompt)
                        elif p == "zai":
                            return self._call_zai(prompt, current_model, max_tokens)
                        elif p == "moonshot":
                            return self._call_moonshot(prompt, current_model, temperature, max_tokens, system_prompt)
                        elif p == "groq":
                            return self._call_groq(prompt, current_model, temperature, max_tokens, system_prompt)
                        else:
                            raise ValueError(f"Unknown provider: {p!r}")
                    except Exception as exc:
                        last_error = exc
                        logger.warning(f"LLM {p!r} attempt {attempt + 1} failed: {exc}")
                        if attempt < retries:
                            time.sleep(2 ** attempt)

                logger.error(f"Provider {p!r} exhausted retries. Last error: {last_error}. Falling back...")

            logger.error(f"All LLM providers failed. Last error: {last_error}")
            return {"text": None, "tokens": 0, "error": f"All providers failed. Last error: {str(last_error)}"}

        def _call_anthropic(self, prompt, model, temperature, max_tokens, system_prompt):
            if not self.anthropic_client:
                raise ValueError("Anthropic client is not initialized.")
            kwargs = {
                "model": model,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "messages": [{"role": "user", "content": prompt}],
            }
            if system_prompt:
                kwargs["system"] = system_prompt
            response = self.anthropic_client.messages.create(**kwargs)
            tokens = (
                getattr(response.usage, 'input_tokens', 0)
                + getattr(response.usage, 'output_tokens', 0)
            )
            return {"text": response.content[0].text, "tokens": tokens}

        def _call_gemini(self, prompt, model, temperature, system_prompt):
            if not self.gemini_available or not genai:
                raise ValueError("Google Gemini API is not configured.")
            generation_config = genai.types.GenerationConfig(temperature=temperature)
            model_kwargs = {"model_name": model}
            if system_prompt:
                model_kwargs["system_instruction"] = system_prompt
            model_instance = genai.GenerativeModel(**model_kwargs)
            response = model_instance.generate_content(prompt, generation_config=generation_config)
            return {"text": response.text, "tokens": 0}

        def _call_ollama(self, prompt, model, temperature, system_prompt):
            payload = {
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {"temperature": temperature},
            }
            if system_prompt:
                payload["system"] = system_prompt
            response = requests.post(f"{self.ollama_url}/api/generate", json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            tokens = data.get("prompt_eval_count", 0) + data.get("eval_count", 0)
            return {"text": data.get("response"), "tokens": tokens}

        def _call_zai(self, prompt: str, model: str, max_tokens: int) -> Dict[str, Any]:
            zai_key = self.config.get('z_ai_api_key') or os.getenv('Z_AI_API_KEY')
            zai_base_url = (
                self.config.get('z_ai_base_url')
                or os.getenv('Z_AI_BASE_URL', 'https://open.z.ai/v1')
            )
            if not zai_key:
                raise ValueError("Z_AI_API_KEY is missing.")
            headers = {'Authorization': f'Bearer {zai_key}', 'Content-Type': 'application/json'}
            payload = {
                'model': model,
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': max_tokens,
            }
            response = requests.post(f'{zai_base_url}/chat/completions', headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            tokens = usage.get('prompt_tokens', 0) + usage.get('completion_tokens', 0)
            return {"text": text, "tokens": tokens}

        def _call_moonshot(
            self, prompt: str, model: str, temperature: float, max_tokens: int,
            system_prompt: Optional[str] = None
        ) -> Dict[str, Any]:
            """Call Moonshot (Kimi) via its OpenAI-compatible Chat Completions API."""
            moonshot_key = self.config.get('moonshot_api_key') or os.getenv('MOONSHOT_API_KEY')
            moonshot_base_url = (
                self.config.get('moonshot_base_url')
                or os.getenv('MOONSHOT_BASE_URL', 'https://api.moonshot.cn/v1')
            )
            if not moonshot_key:
                raise ValueError("MOONSHOT_API_KEY is missing.")
            headers = {'Authorization': f'Bearer {moonshot_key}', 'Content-Type': 'application/json'}
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            messages.append({'role': 'user', 'content': prompt})
            payload = {
                'model': model,
                'messages': messages,
                'temperature': temperature,
                'max_tokens': max_tokens,
            }
            response = requests.post(
                f'{moonshot_base_url}/chat/completions', headers=headers, json=payload, timeout=60
            )
            response.raise_for_status()
            data = response.json()
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            tokens = usage.get('prompt_tokens', 0) + usage.get('completion_tokens', 0)
            return {"text": text, "tokens": tokens}

        def _call_groq(
            self, prompt: str, model: str, temperature: float, max_tokens: int,
            system_prompt: Optional[str] = None
        ) -> Dict[str, Any]:
            """Call Groq via its OpenAI-compatible API (free tier, no credit card)."""
            groq_key = self.config.get('groq_api_key') or os.getenv('GROQ_API_KEY')
            if not groq_key:
                raise ValueError("GROQ_API_KEY is missing.")
            headers = {'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'}
            messages = []
            if system_prompt:
                messages.append({'role': 'system', 'content': system_prompt})
            messages.append({'role': 'user', 'content': prompt})
            payload = {
                'model': model,
                'messages': messages,
                'temperature': temperature,
                'max_tokens': max_tokens,
            }
            response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers=headers, json=payload, timeout=30
            )
            response.raise_for_status()
            data = response.json()
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            tokens = usage.get('prompt_tokens', 0) + usage.get('completion_tokens', 0)
            return {"text": text, "tokens": tokens}

from core.config import CONFIG
llm = LLMProvider(config=CONFIG)
