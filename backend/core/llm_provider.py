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

    class LLMProvider:
        DEFAULT_MODELS = {
            "anthropic": "claude-3-5-haiku-20241022",
            "gemini": "gemini-1.5-flash",
            "ollama": "qwen2.5-coder:7b",
            "zai": "glm-4-plus",
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

            # Ollama URL
            self.ollama_url = (
                self.config.get('ollama_url')
                or os.getenv('OLLAMA_URL', 'http://localhost:11434')
            )

        def generate(
            self,
            prompt: str,
            provider: str = "anthropic",
            model: str = "claude-3-haiku-20240307",
            temperature: float = 0.7,
            max_tokens: int = 1500,
            retries: int = 2,
            system_prompt: Optional[str] = None,
        ) -> Dict[str, Any]:
            configured_provider = self.config.get('llm_provider', provider)
            default_priority = ["anthropic", "gemini", "zai", "ollama"]

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
                # Check availability of the provider
                if p == "anthropic":
                    if not anthropic:
                        logger.info("Skipping Anthropic fallback (anthropic package not installed).")
                        continue
                    if not self.anthropic_client:
                        logger.info("Skipping Anthropic fallback (no API key configured).")
                        continue
                elif p == "gemini":
                    if not genai:
                        logger.info("Skipping Gemini fallback (google-generativeai package not installed).")
                        continue
                    if not self.gemini_available:
                        logger.info("Skipping Gemini fallback (no API key configured).")
                        continue
                elif p == "zai":
                    zai_key = self.config.get('z_ai_api_key') or os.getenv('Z_AI_API_KEY')
                    if not zai_key:
                        logger.info("Skipping Z_AI fallback (no API key configured).")
                        continue

                # Determine the model name to use
                if p == configured_provider:
                    current_model = self.config.get('model', model)
                elif p == provider:
                    current_model = model
                else:
                    if p == "anthropic":
                        current_model = self.config.get('model') or self.DEFAULT_MODELS.get(p)
                    elif p == "zai":
                        current_model = self.config.get('z_ai_model') or self.DEFAULT_MODELS.get(p)
                    else:
                        current_model = self.DEFAULT_MODELS.get(p)

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
                        else:
                            raise ValueError(f"Unknown provider: {p!r}")
                    except Exception as exc:
                        last_error = exc
                        logger.warning(f"LLM {p!r} attempt {attempt + 1} failed: {exc}")
                        if attempt < retries:
                            time.sleep(2 ** attempt)

                logger.error(f"Provider {p!r} exhausted all retries. Error: {last_error}. Falling back...")

            logger.error(f"All LLM providers in fallback chain failed. Last error: {last_error}")
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
            if system_prompt and "1.5" in model:
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
            response = requests.post(f"{self.ollama_url}/api/generate", json=payload, timeout=5)
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
            headers = {
                'Authorization': f'Bearer {zai_key}',
                'Content-Type': 'application/json',
            }
            payload = {
                'model': model,
                'messages': [{'role': 'user', 'content': prompt}],
                'max_tokens': max_tokens,
            }
            response = requests.post(
                f'{zai_base_url}/chat/completions', headers=headers, json=payload, timeout=60
            )
            response.raise_for_status()
            data = response.json()
            text = data['choices'][0]['message']['content']
            usage = data.get('usage', {})
            tokens = usage.get('prompt_tokens', 0) + usage.get('completion_tokens', 0)
            return {"text": text, "tokens": tokens}

from core.config import CONFIG
llm = LLMProvider(config=CONFIG)
