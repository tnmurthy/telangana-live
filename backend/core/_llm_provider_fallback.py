"""
llm_provider.py — shared LLM abstraction with automatic provider fallback.

Provider priority (first available wins):
    gemini → groq → moonshot → anthropic → zai → ollama

Adding a new provider requires changes in exactly 4 places (all dicts):
    DEFAULT_MODELS, _CONFIG_KEYS, _AVAILABILITY, _DISPATCH
"""

import os
import time
import logging
import requests
from typing import Optional, Dict, Any, Callable

logger = logging.getLogger(__name__)

# ── Optional SDK imports ──────────────────────────────────────────────────────

try:
    import anthropic as _anthropic
except ImportError:
    _anthropic = None

try:
    import google.generativeai as genai
except ImportError:
    genai = None

# Patch httpx proxies kwarg for older SDK versions
try:
    import httpx
    for _cls in (httpx.Client, httpx.AsyncClient):
        _orig = _cls.__init__
        def _make_patched(orig):
            def _patched(self, *args, **kwargs):
                if "proxies" in kwargs:
                    proxies = kwargs.pop("proxies")
                    if proxies and not kwargs.get("proxy"):
                        kwargs["proxy"] = next(iter(proxies.values())) if isinstance(proxies, dict) else proxies
                orig(self, *args, **kwargs)
            return _patched
        _cls.__init__ = _make_patched(_orig)
except ImportError:
    httpx = None

# Sentinel: the old hard-coded default model that callers passed when they
# didn't actually want to specify a model. Treat it as "use provider default".
_CALLER_SENTINEL = "claude-3-haiku-20240307"

# Preferred fallback order — first available key wins
FALLBACK_ORDER = ["gemini", "groq", "moonshot", "anthropic", "zai", "ollama"]


# ── Provider config keys (maps provider → config dict key for its API key) ───

_API_KEY_CFGKEYS: Dict[str, str] = {
    "groq":     "groq_api_key",
    "moonshot": "moonshot_api_key",
    "zai":      "z_ai_api_key",
    "anthropic": "anthropic_api_key",
}

_API_KEY_ENVVARS: Dict[str, str] = {
    "groq":     "GROQ_API_KEY",
    "moonshot": "MOONSHOT_API_KEY",
    "zai":      "Z_AI_API_KEY",
    "anthropic": "ANTHROPIC_API_KEY",
}

# Base URLs for OpenAI-compatible providers
_OPENAI_COMPAT_URLS: Dict[str, str] = {
    "groq":     "https://api.groq.com/openai/v1",
    "moonshot": "https://api.moonshot.cn/v1",
    "zai":      "https://open.z.ai/v1",
}

_OPENAI_COMPAT_URL_CFGKEYS: Dict[str, str] = {
    "moonshot": "moonshot_base_url",
    "zai":      "z_ai_base_url",
}

_OPENAI_COMPAT_URL_ENVVARS: Dict[str, str] = {
    "moonshot": "MOONSHOT_BASE_URL",
    "zai":      "Z_AI_BASE_URL",
}

# Default model per provider
DEFAULT_MODELS: Dict[str, str] = {
    "gemini":    "gemini-2.0-flash",
    "groq":      "llama-3.1-8b-instant",
    "moonshot":  "moonshot-v1-8k",
    "anthropic": "claude-3-5-haiku-20241022",
    "zai":       "glm-4-plus",
    "ollama":    "qwen2.5-coder:7b",
}

# Config key that overrides the default model per provider
_MODEL_CFGKEYS: Dict[str, str] = {
    "gemini":    "gemini_model",
    "groq":      "groq_model",
    "moonshot":  "moonshot_model",
    "anthropic": "model",          # legacy key
    "zai":       "z_ai_model",
}


# ── Main class ────────────────────────────────────────────────────────────────

class LLMProvider:

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}

        # Anthropic SDK client
        anthropic_key = (
            self.config.get("anthropic_api_key")
            or self.config.get("api_key")
            or os.getenv("ANTHROPIC_API_KEY")
        )
        if anthropic_key and _anthropic:
            try:
                self._anthropic_client = _anthropic.Anthropic(api_key=anthropic_key)
            except Exception as exc:
                logger.error("Failed to init Anthropic client: %s", exc)
                self._anthropic_client = None
        else:
            self._anthropic_client = None

        # Gemini (configure once, check on use)
        gemini_key = self.config.get("google_api_key") or os.getenv("GOOGLE_API_KEY")
        if gemini_key and genai:
            try:
                genai.configure(api_key=gemini_key)
                self._gemini_ok = True
            except Exception as exc:
                logger.error("Failed to configure Gemini: %s", exc)
                self._gemini_ok = False
        else:
            self._gemini_ok = False

        # Simple key presence checks for REST-based providers
        self._key_available: Dict[str, bool] = {
            p: bool(self.config.get(cfg) or os.getenv(env))
            for p, cfg, env in (
                ("groq",     "groq_api_key",     "GROQ_API_KEY"),
                ("moonshot", "moonshot_api_key",  "MOONSHOT_API_KEY"),
                ("zai",      "z_ai_api_key",      "Z_AI_API_KEY"),
            )
        }

        self._ollama_url = (
            self.config.get("ollama_url")
            or os.getenv("OLLAMA_URL", "http://localhost:11434")
        )

    # ── Public API ─────────────────────────────────────────────────────────────

    def generate(
        self,
        prompt: str,
        provider: str = "gemini",
        model: str = "",
        temperature: float = 0.7,
        max_tokens: int = 1500,
        retries: int = 2,
        system_prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate text, falling back through available providers automatically."""
        chain = self._build_chain(provider)
        # Treat the old sentinel as "no model specified"
        caller_model = "" if model == _CALLER_SENTINEL else model
        last_error: Optional[Exception] = None

        for p in chain:
            if not self._is_available(p):
                logger.info("Skipping %r (not available).", p)
                continue

            current_model = self._resolve_model(p, caller_model if p == provider else "")
            logger.info("Trying provider=%r model=%r", p, current_model)

            for attempt in range(retries + 1):
                try:
                    return self._dispatch(p, prompt, current_model, temperature, max_tokens, system_prompt)
                except Exception as exc:
                    last_error = exc
                    logger.warning("Provider %r attempt %d failed: %s", p, attempt + 1, exc)
                    if attempt < retries:
                        time.sleep(2 ** attempt)

            logger.error("Provider %r exhausted retries, falling back. Last error: %s", p, last_error)

        logger.error("All providers failed. Last error: %s", last_error)
        return {"text": None, "tokens": 0, "error": str(last_error)}

    # ── Internal helpers ───────────────────────────────────────────────────────

    def _build_chain(self, requested: str) -> list[str]:
        """Return ordered list of providers to try: configured → requested → rest."""
        configured = self.config.get("llm_provider", requested)
        seen: set[str] = set()
        chain: list[str] = []
        for p in [configured, requested, *FALLBACK_ORDER]:
            if p in FALLBACK_ORDER and p not in seen:
                chain.append(p)
                seen.add(p)
        return chain

    def _is_available(self, provider: str) -> bool:
        if provider == "gemini":
            return bool(genai and self._gemini_ok)
        if provider == "anthropic":
            return bool(_anthropic and self._anthropic_client)
        if provider == "ollama":
            return True  # always attempt; will fail at call-time if not running
        return self._key_available.get(provider, False)

    def _resolve_model(self, provider: str, caller_model: str) -> str:
        """Return the model to use: caller override → config key → default."""
        if caller_model:
            return caller_model
        cfg_key = _MODEL_CFGKEYS.get(provider)
        if cfg_key:
            configured = self.config.get(cfg_key)
            if configured:
                return configured
        return DEFAULT_MODELS.get(provider, "")

    def _dispatch(
        self,
        provider: str,
        prompt: str,
        model: str,
        temperature: float,
        max_tokens: int,
        system_prompt: Optional[str],
    ) -> Dict[str, Any]:
        if provider == "gemini":
            return self._call_gemini(prompt, model, temperature, system_prompt)
        if provider == "anthropic":
            return self._call_anthropic(prompt, model, temperature, max_tokens, system_prompt)
        if provider == "ollama":
            return self._call_ollama(prompt, model, temperature, system_prompt)
        if provider in _OPENAI_COMPAT_URLS:
            return self._call_openai_compat(provider, prompt, model, temperature, max_tokens, system_prompt)
        raise ValueError(f"Unknown provider: {provider!r}")

    # ── Provider call implementations ─────────────────────────────────────────

    def _call_gemini(self, prompt: str, model: str, temperature: float, system_prompt: Optional[str]) -> Dict[str, Any]:
        if not genai or not self._gemini_ok:
            raise RuntimeError("Gemini is not configured.")
        cfg = genai.types.GenerationConfig(temperature=temperature)
        kwargs: Dict[str, Any] = {"model_name": model}
        if system_prompt:
            kwargs["system_instruction"] = system_prompt
        resp = genai.GenerativeModel(**kwargs).generate_content(prompt, generation_config=cfg)
        return {"text": resp.text, "tokens": 0}

    def _call_anthropic(self, prompt: str, model: str, temperature: float, max_tokens: int, system_prompt: Optional[str]) -> Dict[str, Any]:
        if not self._anthropic_client:
            raise RuntimeError("Anthropic client is not initialized.")
        kwargs: Dict[str, Any] = {
            "model": model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}],
        }
        if system_prompt:
            kwargs["system"] = system_prompt
        resp = self._anthropic_client.messages.create(**kwargs)
        tokens = getattr(resp.usage, "input_tokens", 0) + getattr(resp.usage, "output_tokens", 0)
        return {"text": resp.content[0].text, "tokens": tokens}

    def _call_ollama(self, prompt: str, model: str, temperature: float, system_prompt: Optional[str]) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if system_prompt:
            payload["system"] = system_prompt
        resp = requests.post(f"{self._ollama_url}/api/generate", json=payload, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        tokens = data.get("prompt_eval_count", 0) + data.get("eval_count", 0)
        return {"text": data.get("response"), "tokens": tokens}

    def _call_openai_compat(
        self,
        provider: str,
        prompt: str,
        model: str,
        temperature: float,
        max_tokens: int,
        system_prompt: Optional[str],
    ) -> Dict[str, Any]:
        """Single implementation for all OpenAI-compatible REST providers (Groq, Moonshot, ZAI)."""
        key_cfg = _API_KEY_CFGKEYS[provider]
        key_env = _API_KEY_ENVVARS[provider]
        api_key = self.config.get(key_cfg) or os.getenv(key_env)
        if not api_key:
            raise RuntimeError(f"{key_env} is missing.")

        url_cfg = _OPENAI_COMPAT_URL_CFGKEYS.get(provider)
        url_env = _OPENAI_COMPAT_URL_ENVVARS.get(provider)
        base_url = (
            (url_cfg and self.config.get(url_cfg))
            or (url_env and os.getenv(url_env))
            or _OPENAI_COMPAT_URLS[provider]
        )

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        resp = requests.post(
            f"{base_url}/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={"model": model, "messages": messages, "temperature": temperature, "max_tokens": max_tokens},
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        usage = data.get("usage", {})
        return {
            "text": data["choices"][0]["message"]["content"],
            "tokens": usage.get("prompt_tokens", 0) + usage.get("completion_tokens", 0),
        }


# Default singleton (reads from environment variables)
llm = LLMProvider()
