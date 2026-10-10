"""
sync_llm_pricing.py: Automated LLM Model Pricing & Cost Benchmark snapshot generator.

Fetches the latest model pricing from OpenRouter API (https://openrouter.ai/api/v1/models)
and updates frontend/public/data/llm_pricing.json.
Dynamically discovers and scores the newest, frontier, and most popular models across
major AI labs (Google, Anthropic, OpenAI, DeepSeek, Mistral, Meta) while maintaining
guaranteed representation for baseline frontier models.
"""
import json
import logging
import os
import re
import sys
from datetime import datetime, timezone

import requests

logger = logging.getLogger(__name__)

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_SCRIPTS_DIR)
_REPO_ROOT = os.path.dirname(_BACKEND_DIR)

DEFAULT_OUT = os.path.join(_REPO_ROOT, "frontend", "public", "data", "llm_pricing.json")
OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models"

# Frontier baseline models across all major AI labs (guaranteed fallback + baseline specs)
BASELINE_MODELS = {
    # Google
    "google/gemini-2.0-flash-lite-001": {
        "name": "Gemini 2.0 Flash-Lite",
        "provider": "Google",
        "category": "economy",
        "latencyTier": "Ultra-Fast",
        "badge": "Lowest Cost",
        "isPopular": True,
        "defaultInput": 0.075,
        "defaultOutput": 0.30,
        "defaultContext": 1048576,
        "description": "Ultra-low latency, high-efficiency model built for high-frequency civic & agent workloads."
    },
    "google/gemini-2.0-flash-001": {
        "name": "Gemini 2.0 Flash",
        "provider": "Google",
        "category": "economy",
        "latencyTier": "Fast",
        "badge": "Popular",
        "isPopular": True,
        "defaultInput": 0.10,
        "defaultOutput": 0.40,
        "defaultContext": 1048576,
        "description": "Google frontier workhorse model with native multimodal capabilities and 1M token context."
    },
    "google/gemini-2.0-pro-exp-02-05": {
        "name": "Gemini 2.0 Pro Exp",
        "provider": "Google",
        "category": "balanced",
        "latencyTier": "Fast",
        "badge": "Top Google",
        "defaultInput": 1.25,
        "defaultOutput": 5.00,
        "defaultContext": 2000000,
        "description": "Google experimental frontier model with massive context window and superior coding & agent capabilities."
    },
    # Anthropic
    "anthropic/claude-3.5-haiku": {
        "name": "Claude 3.5 Haiku",
        "provider": "Anthropic",
        "category": "balanced",
        "latencyTier": "Ultra-Fast",
        "defaultInput": 0.80,
        "defaultOutput": 4.00,
        "defaultContext": 200000,
        "description": "Anthropic fast compact model with blazing speed and strong coding/tool performance."
    },
    "anthropic/claude-3.7-sonnet": {
        "name": "Claude 3.7 Sonnet",
        "provider": "Anthropic",
        "category": "reasoning",
        "latencyTier": "Fast",
        "badge": "Top Coder",
        "isPopular": True,
        "defaultInput": 3.00,
        "defaultOutput": 15.00,
        "defaultContext": 200000,
        "description": "Frontier hybrid reasoning and coding model from Anthropic with instantaneous or thinking-step answers."
    },
    # OpenAI
    "openai/gpt-4o-mini": {
        "name": "GPT-4o mini",
        "provider": "OpenAI",
        "category": "economy",
        "latencyTier": "Ultra-Fast",
        "badge": "Popular",
        "isPopular": True,
        "defaultInput": 0.15,
        "defaultOutput": 0.60,
        "defaultContext": 128000,
        "description": "Cost-efficient omni small model for high-volume conversational & extraction tasks."
    },
    "openai/gpt-4o": {
        "name": "GPT-4o",
        "provider": "OpenAI",
        "category": "balanced",
        "latencyTier": "Fast",
        "isPopular": True,
        "defaultInput": 2.50,
        "defaultOutput": 10.00,
        "defaultContext": 128000,
        "description": "OpenAI flagship versatile multimodal model with strong real-world benchmarks."
    },
    "openai/o3-mini": {
        "name": "o3-mini",
        "provider": "OpenAI",
        "category": "reasoning",
        "latencyTier": "Deep Reasoning",
        "badge": "Reasoning",
        "isPopular": True,
        "defaultInput": 1.10,
        "defaultOutput": 4.40,
        "defaultContext": 200000,
        "description": "Cost-effective STEM and logic reasoning model with thinking capabilities."
    },
    "openai/o1": {
        "name": "o1",
        "provider": "OpenAI",
        "category": "reasoning",
        "latencyTier": "Deep Reasoning",
        "badge": "Frontier Reasoning",
        "isPopular": True,
        "defaultInput": 15.00,
        "defaultOutput": 60.00,
        "defaultContext": 200000,
        "description": "OpenAI flagship deep reasoning foundation model trained with large-scale reinforcement learning."
    },
    # DeepSeek
    "deepseek/deepseek-chat": {
        "name": "DeepSeek V3",
        "provider": "DeepSeek",
        "category": "economy",
        "latencyTier": "Fast",
        "badge": "Extreme Value",
        "isPopular": True,
        "defaultInput": 0.14,
        "defaultOutput": 0.28,
        "defaultContext": 163840,
        "description": "671B MoE model delivering frontier intelligence at fraction-of-a-cent prices."
    },
    "deepseek/deepseek-r1": {
        "name": "DeepSeek R1",
        "provider": "DeepSeek",
        "category": "reasoning",
        "latencyTier": "Deep Reasoning",
        "badge": "Open Reasoning",
        "isPopular": True,
        "defaultInput": 0.70,
        "defaultOutput": 2.50,
        "defaultContext": 64000,
        "description": "Open-weights reinforcement learning reasoning model rivaling top proprietary labs."
    },
    # Mistral & Meta
    "mistralai/mistral-large-2411": {
        "name": "Mistral Large 2411",
        "provider": "Mistral",
        "category": "balanced",
        "latencyTier": "Fast",
        "badge": "Multilingual",
        "defaultInput": 2.00,
        "defaultOutput": 6.00,
        "defaultContext": 128000,
        "description": "European flagship weights model with high multilingual proficiency and tool calling."
    },
    "meta-llama/llama-3.3-70b-instruct": {
        "name": "Llama 3.3 70B Instruct",
        "provider": "Meta",
        "category": "economy",
        "latencyTier": "Fast",
        "badge": "Open Source",
        "isPopular": True,
        "defaultInput": 0.10,
        "defaultOutput": 0.32,
        "defaultContext": 131072,
        "description": "State-of-the-art open-weights 70B model matching previous-gen 405B capabilities at low cost."
    },
}

# Provider recognition mappings
PROVIDER_PATTERNS = [
    (r"^(google|gemini)/", "Google"),
    (r"^(anthropic|claude)/", "Anthropic"),
    (r"^(openai|o1|o3|gpt)/", "OpenAI"),
    (r"^(deepseek)/", "DeepSeek"),
    (r"^(mistral|mistralai)/", "Mistral"),
    (r"^(meta-llama|meta)/", "Meta"),
]

# Patterns to filter out non-chat, raw base weights, or auxiliary embeddings
EXCLUDE_ID_PATTERNS = [
    r":free$", r":nitro$", r":exact$", r":extended$", r":online$",
    r"-base$", r"-base-", r"-embedding", r"embed", r"whisper",
    r"rerank", r"moderation", r"tts", r"stt", r"guard",
    r"clip", r"vl-base", r"router", r"adapter"
]

FRONTIER_SERIES_KEYWORDS = [
    "claude-3.7-sonnet", "claude-3-7-sonnet", "claude-3.5-sonnet", "claude-3.5-haiku",
    "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.0-pro", "gemini-2.5-pro",
    "gpt-4.5", "gpt-4o", "gpt-4o-mini", "o3-mini", "o1", "o1-mini", "o1-preview",
    "deepseek-r1", "deepseek-chat", "deepseek-v3",
    "mistral-large-2411", "mistral-large", "mistral-small",
    "llama-3.3-70b", "llama-3.3-70b-instruct", "llama-3.1-405b", "llama-3.1-70b"
]


def detect_provider(model_id: str) -> str:
    for pat, prov in PROVIDER_PATTERNS:
        if re.search(pat, model_id, re.IGNORECASE):
            return prov
    prefix = model_id.split("/")[0] if "/" in model_id else "Other"
    return prefix.capitalize()


def compute_category(input_price: float, model_id: str, name: str, reasoning_meta: dict | None = None) -> str:
    """
    Computes category automatically:
    - 'reasoning' if model has reasoning capabilities or input >= $4/M or 'r1'/'o1'/'o3' in name
    - 'economy' if input <= $0.80/M
    - 'balanced' for standard workhorses ($0.80 - $3.50/M)
    """
    combined = f"{model_id} {name}".lower()
    has_reasoning = bool(reasoning_meta and (reasoning_meta.get("mandatory") or reasoning_meta.get("default_enabled")))
    has_reasoning_kw = any(k in combined for k in ["-r1", "/r1", "deepseek-r1", "/o1", "/o3", "o1-", "o3-", "reasoning", "thinking"])

    if has_reasoning or has_reasoning_kw or input_price >= 4.0:
        return "reasoning"
    if input_price <= 0.80:
        return "economy"
    return "balanced"


def compute_latency_tier(context_window: int, category: str, input_price: float, model_id: str) -> str:
    """
    Computes latency tier automatically based on context, category, price, and model name.
    """
    combined = model_id.lower()
    if category == "reasoning" or "o1" in combined or "o3" in combined or "r1" in combined:
        return "Deep Reasoning"
    if "flash-lite" in combined or "haiku" in combined or "mini" in combined or input_price <= 0.15:
        return "Ultra-Fast"
    if "flash" in combined or input_price <= 2.50 or context_window <= 131072:
        return "Fast"
    return "Standard"


def is_valid_frontier_model(model_obj: dict) -> bool:
    """Filter out defunct/raw base weights (ensure instruct/chat/reasoning endpoints)."""
    model_id = model_obj.get("id", "")
    if not model_id or "/" not in model_id:
        return False

    for pat in EXCLUDE_ID_PATTERNS:
        if re.search(pat, model_id, re.IGNORECASE):
            return False

    arch = model_obj.get("architecture") or {}
    instruct_type = arch.get("instruct_type")
    # If explicitly base model with no instruct, exclude
    if instruct_type == "none":
        return False

    pricing = model_obj.get("pricing") or {}
    try:
        prompt_val = float(pricing.get("prompt", -1))
        # Exclude placeholder or negative pricing models
        if prompt_val < 0:
            return False
    except (ValueError, TypeError):
        return False

    return True


def score_model_relevance(model_obj: dict) -> float:
    """Calculates relevance score based on frontier keyword matching, creation recency, and provider."""
    model_id = model_obj.get("id", "").lower()
    score = 0.0

    # Keyword priority
    for kw in FRONTIER_SERIES_KEYWORDS:
        if kw in model_id:
            score += 100.0
            break

    # Major provider priority
    provider = detect_provider(model_id)
    if provider in ["Google", "Anthropic", "OpenAI", "DeepSeek", "Mistral", "Meta"]:
        score += 50.0

    # Recency boost
    created = model_obj.get("created") or 0
    if created > 0:
        # 1 point per 30 days of timestamp
        score += min(50.0, created / 1000000.0)

    return score


def fetch_openrouter_models() -> dict:
    """Fetch live catalog from OpenRouter with headers and timeout."""
    resp = requests.get(
        OPENROUTER_MODELS_URL,
        headers={"User-Agent": "TelanganaLiveTechPulse/2.0", "Accept": "application/json"},
        timeout=12,
    )
    resp.raise_for_status()
    return resp.json()


def parse_model_item(model_id: str, live_item: dict | None, baseline_meta: dict | None) -> dict:
    live_pricing = (live_item or {}).get("pricing", {})
    prompt_str = live_pricing.get("prompt")
    completion_str = live_pricing.get("completion")

    default_input = baseline_meta.get("defaultInput", 0.0) if baseline_meta else 0.0
    default_output = baseline_meta.get("defaultOutput", 0.0) if baseline_meta else 0.0
    default_context = baseline_meta.get("defaultContext", 128000) if baseline_meta else 128000

    try:
        p_val = float(prompt_str) if prompt_str is not None else -1.0
        input_price = round(p_val * 1_000_000, 4) if p_val >= 0 else default_input
    except (ValueError, TypeError):
        input_price = default_input

    try:
        c_val = float(completion_str) if completion_str is not None else -1.0
        output_price = round(c_val * 1_000_000, 4) if c_val >= 0 else default_output
    except (ValueError, TypeError):
        output_price = default_output

    context_window = (live_item or {}).get("context_length") or default_context

    provider = baseline_meta.get("provider") if baseline_meta else detect_provider(model_id)
    raw_name = (live_item or {}).get("name") or (baseline_meta.get("name") if baseline_meta else model_id.split("/")[-1])
    # Clean provider prefix in name e.g. "Google: Gemini 2.0 Flash" -> "Gemini 2.0 Flash"
    clean_name = re.sub(rf"^{provider}:\s*", "", raw_name, flags=re.IGNORECASE) if raw_name else model_id

    reasoning_meta = (live_item or {}).get("reasoning")
    category = baseline_meta.get("category") if baseline_meta else compute_category(input_price, model_id, clean_name, reasoning_meta)
    latency_tier = baseline_meta.get("latencyTier") if baseline_meta else compute_latency_tier(context_window, category, input_price, model_id)

    description = baseline_meta.get("description") if baseline_meta else ((live_item or {}).get("description") or "")
    if description:
        description = description.split("\n")[0][:180]

    item = {
        "id": model_id,
        "name": clean_name,
        "provider": provider,
        "category": category,
        "inputPricePerM": input_price,
        "outputPricePerM": output_price,
        "contextWindow": context_window,
        "description": description,
        "latencyTier": latency_tier,
    }

    if baseline_meta and baseline_meta.get("badge"):
        item["badge"] = baseline_meta["badge"]
    elif "claude-3.7" in model_id:
        item["badge"] = "Hybrid Thinking"
    elif "r1" in model_id:
        item["badge"] = "Open Reasoning"

    if baseline_meta and baseline_meta.get("isPopular") or any(k in model_id for k in ["flash-001", "gpt-4o", "sonnet", "chat"]):
        item["isPopular"] = True

    return item


def build_pricing_snapshot(live_data: dict | None = None) -> dict:
    live_map = {}
    valid_live_models = []

    if live_data and "data" in live_data:
        for m in live_data["data"]:
            if isinstance(m, dict) and "id" in m:
                live_map[m["id"]] = m
                if is_valid_frontier_model(m):
                    valid_live_models.append(m)

    models_list = []
    included_ids = set()

    # Step 1: Always include all baseline frontier releases
    for model_id, meta in BASELINE_MODELS.items():
        live_m = live_map.get(model_id)
        item = parse_model_item(model_id, live_m, meta)
        models_list.append(item)
        included_ids.add(model_id)

    # Step 2: Dynamically discover and rank newer models added to OpenRouter
    if valid_live_models:
        # Score and sort models
        scored = []
        for m in valid_live_models:
            mid = m["id"]
            if mid in included_ids:
                continue
            score = score_model_relevance(m)
            if score >= 50.0:  # Relevant model from recognized lab or frontier keyword
                scored.append((score, m.get("created", 0), m))

        scored.sort(key=lambda x: (x[0], x[1]), reverse=True)

        # Allow top dynamic additions (e.g. up to 10 newest frontier releases)
        for _, _, m in scored[:8]:
            mid = m["id"]
            item = parse_model_item(mid, m, None)
            models_list.append(item)
            included_ids.add(mid)

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "updatedAt": now_iso,
        "source": "openrouter-live" if live_map else "snapshot-verified",
        "models": models_list,
    }


def sync_pricing(out_path: str = DEFAULT_OUT) -> bool:
    """Fetch and write pricing JSON if changed (ignoring timestamp)."""
    try:
        live_data = fetch_openrouter_models()
        logger.info("Successfully fetched %d models from OpenRouter", len(live_data.get("data", [])))
    except Exception as exc:
        logger.warning("Could not fetch live OpenRouter models (%s); using verified baseline.", exc)
        live_data = None

    snapshot = build_pricing_snapshot(live_data)

    existing = None
    if os.path.exists(out_path):
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = None

    # Compare models list without timestamp to prevent unnecessary commits
    if existing and existing.get("models") == snapshot.get("models"):
        logger.info("Pricing data unchanged. Skipping write.")
        return False

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
        f.write("\n")

    logger.info("Updated pricing snapshot written to %s", out_path)
    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    out = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    sync_pricing(out)
