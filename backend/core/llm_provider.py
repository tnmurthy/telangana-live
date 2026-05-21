import os
import time
import logging
import requests
from typing import Optional, Dict, Any
import anthropic
import google.generativeai as genai
from core.config import CONFIG

logger = logging.getLogger(__name__)


class LLMProvider:
    def __init__(self):
        # Anthropic — support both legacy 'api_key' and new 'anthropic_api_key' config keys
        anthropic_key = (
            CONFIG.get('anthropic_api_key')
            or CONFIG.get('api_key')
            or os.getenv('ANTHROPIC_API_KEY')
        )
        self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key) if anthropic_key else None

        # Gemini
        gemini_key = CONFIG.get('google_api_key') or os.getenv('GOOGLE_API_KEY')
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.gemini_available = True
        else:
            self.gemini_available = False

        # Ollama
        self.ollama_url = CONFIG.get('ollama_url') or os.getenv('OLLAMA_URL', 'http://localhost:11434')

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
        """Generate text via the requested provider with automatic retry.

        Returns a dict with keys:
          - ``text``   (str | None)
          - ``tokens`` (int)
          - ``error``  (str | None, only present on failure)
        """
        last_error = None
        for attempt in range(retries + 1):
            try:
                if provider == "anthropic":
                    return self._call_anthropic(prompt, model, temperature, max_tokens, system_prompt)
                elif provider == "gemini":
                    return self._call_gemini(prompt, model, temperature, system_prompt)
                elif provider == "ollama":
                    return self._call_ollama(prompt, model, temperature, system_prompt)
                elif provider == "zai":
                    return self._call_zai(prompt, model, max_tokens)
                else:
                    raise ValueError(f"Unknown provider: {provider!r}")
            except Exception as exc:
                last_error = exc
                logger.warning(f"LLM {provider!r} attempt {attempt + 1} failed: {exc}")
                if attempt < retries:
                    time.sleep(2 ** attempt)

        logger.error(f"LLM generation failed after {retries + 1} attempts: {last_error}")
        return {"text": None, "tokens": 0, "error": str(last_error)}

    # ------------------------------------------------------------------
    # Provider implementations
    # ------------------------------------------------------------------

    def _call_anthropic(self, prompt, model, temperature, max_tokens, system_prompt):
        if not self.anthropic_client:
            raise ValueError("Anthropic API key is missing.")
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
        if not self.gemini_available:
            raise ValueError("Google Gemini API key is missing.")
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
        response = requests.post(f"{self.ollama_url}/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
        tokens = data.get("prompt_eval_count", 0) + data.get("eval_count", 0)
        return {"text": data.get("response"), "tokens": tokens}

    def _call_zai(self, prompt: str, model: str, max_tokens: int) -> Dict[str, Any]:
        """Call the z.ai OpenAI-compatible chat completions endpoint."""
        zai_key = CONFIG.get('z_ai_api_key') or os.getenv('Z_AI_API_KEY')
        zai_base_url = (
            CONFIG.get('z_ai_base_url')
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
            f'{zai_base_url}/chat/completions', headers=headers, json=payload
        )
        response.raise_for_status()
        data = response.json()
        text = data['choices'][0]['message']['content']
        usage = data.get('usage', {})
        tokens = usage.get('prompt_tokens', 0) + usage.get('completion_tokens', 0)
        return {"text": text, "tokens": tokens}


# Module-level singleton used by all agents
llm = LLMProvider()
