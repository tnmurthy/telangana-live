import os
import time
import logging
from typing import Optional, Dict, Any
import anthropic
import google.generativeai as genai
from config import CONFIG

logger = logging.getLogger(__name__)

class LLMProvider:
    def __init__(self):
        anthropic_key = CONFIG.get('anthropic_api_key') or os.getenv('ANTHROPIC_API_KEY')
        self.anthropic_client = anthropic.Anthropic(api_key=anthropic_key) if anthropic_key else None
        
        gemini_key = CONFIG.get('google_api_key') or os.getenv('GOOGLE_API_KEY')
        if gemini_key:
            genai.configure(api_key=gemini_key)
            self.gemini_available = True
        else:
            self.gemini_available = False

    def generate(self, prompt: str, provider: str = "anthropic", model: str = "claude-3-haiku-20240307", temperature: float = 0.7, max_tokens: int = 1500, retries: int = 2, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        last_error = None
        for attempt in range(retries + 1):
            try:
                if provider == "anthropic":
                    return self._call_anthropic(prompt, model, temperature, max_tokens, system_prompt)
                elif provider == "gemini":
                    return self._call_gemini(prompt, model, temperature, system_prompt)
                else:
                    raise ValueError(f"Unknown provider: {provider}")
            except Exception as e:
                last_error = e
                logger.warning(f"LLM {provider} attempt {attempt + 1} failed: {e}")
                if attempt < retries: time.sleep(2 ** attempt)
        logger.error(f"LLM generation failed: {last_error}")
        return {"text": None, "tokens": 0, "error": str(last_error)}

    def _call_anthropic(self, prompt, model, temperature, max_tokens, system_prompt):
        if not self.anthropic_client: raise ValueError("Anthropic API key is missing.")
        kwargs = {"model": model, "max_tokens": max_tokens, "temperature": temperature, "messages": [{"role": "user", "content": prompt}]}
        if system_prompt: kwargs["system"] = system_prompt
        response = self.anthropic_client.messages.create(**kwargs)
        return {"text": response.content[0].text, "tokens": getattr(response.usage, 'input_tokens', 0) + getattr(response.usage, 'output_tokens', 0)}

    def _call_gemini(self, prompt, model, temperature, system_prompt):
        if not self.gemini_available: raise ValueError("Google Gemini API key is missing.")
        generation_config = genai.types.GenerationConfig(temperature=temperature)
        model_kwargs = {"model_name": model}
        if system_prompt and "1.5" in model: model_kwargs["system_instruction"] = system_prompt
        model_instance = genai.GenerativeModel(**model_kwargs)
        response = model_instance.generate_content(prompt, generation_config=generation_config)
        return {"text": response.text, "tokens": 0}

llm = LLMProvider()
