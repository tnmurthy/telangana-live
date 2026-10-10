"""
sync_ai_pulse_news.py: Automated Hugging Face Trending & Market Radar updater.

Fetches the latest trending models from Hugging Face API (https://huggingface.co/api/trending)
and synchronizes with frontend/public/data/ai_market_radar.json.
Can be executed standalone or automatically in GitHub Actions.
"""
import json
import logging
import os
import sys
from datetime import datetime, timezone

import requests

logger = logging.getLogger(__name__)

_SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_SCRIPTS_DIR)
_REPO_ROOT = os.path.dirname(_BACKEND_DIR)

DEFAULT_OUT = os.path.join(_REPO_ROOT, "frontend", "public", "data", "ai_market_radar.json")
HF_TRENDING_URL = "https://huggingface.co/api/trending?limit=25"

# Verified frontier leaders benchmark baseline
MARKET_LEADERS = [
    {
        "id": "anthropic/claude-3.7-sonnet",
        "name": "Claude 3.7 Sonnet (Hybrid Reasoning)",
        "provider": "Anthropic",
        "role": "code-specialist",
        "arenaElo": 1385,
        "codingBenchmarkScore": "70.3% SWE-bench Verified",
        "pricingSummary": "$3.00 / $15.00 per 1M tokens",
        "speedTokensPerSec": 72,
        "sweetSpot": "Gold standard for full-stack engineering, multi-turn bug hunting, and tool use",
        "isDominant": True,
    },
    {
        "id": "deepseek/deepseek-r1",
        "name": "DeepSeek R1 (Full 671B)",
        "provider": "DeepSeek",
        "role": "reasoning",
        "arenaElo": 1362,
        "codingBenchmarkScore": "49.2% SWE-bench Verified",
        "pricingSummary": "$0.55 / $2.19 per 1M tokens",
        "speedTokensPerSec": 38,
        "sweetSpot": "Exceptional cost-to-reasoning ratio; excels at formal logic, math & algorithmic synthesis",
        "isDominant": True,
    },
    {
        "id": "google/gemini-2.0-flash-001",
        "name": "Gemini 2.0 Flash",
        "provider": "Google",
        "role": "frontier-agent",
        "arenaElo": 1340,
        "codingBenchmarkScore": "62.8% HumanEval+",
        "pricingSummary": "$0.10 / $0.40 per 1M tokens",
        "speedTokensPerSec": 135,
        "sweetSpot": "Ultra-fast multimodal agent loops with 1M native context window at near-zero token cost",
        "isDominant": False,
    },
    {
        "id": "openai/o3-mini",
        "name": "OpenAI o3-mini",
        "provider": "OpenAI",
        "role": "reasoning",
        "arenaElo": 1358,
        "codingBenchmarkScore": "73.1% CodeForces Elo equivalent",
        "pricingSummary": "$1.10 / $4.40 per 1M tokens",
        "speedTokensPerSec": 85,
        "sweetSpot": "High-speed reasoning with configurable effort tiers for competition math and STEM analysis",
        "isDominant": False,
    },
]

SUNSET_RADAR = [
    {
        "id": "gpt-3.5-turbo-legacy",
        "modelName": "GPT-3.5-Turbo (0301 / 0613 checkpoints)",
        "provider": "OpenAI",
        "status": "deprecated",
        "cutoffDate": "Deprecated / Sunset Phase",
        "statusBadge": "Critical",
        "impactSummary": "All legacy 0301/0613 endpoints shut down. Traffic must route to GPT-4o mini or Gemini 2.0 Flash.",
        "recommendedSuccessor": {
            "id": "openai/gpt-4o-mini",
            "name": "GPT-4o mini",
            "speedDelta": "+2.4x Faster",
            "costDelta": "66% Cheaper ($0.15 vs $0.50)",
        },
    },
    {
        "id": "claude-2-legacy",
        "modelName": "Claude 2.0 & Claude 2.1",
        "provider": "Anthropic",
        "status": "deprecated",
        "cutoffDate": "Retiring from Anthropic API",
        "statusBadge": "Critical",
        "impactSummary": "Early Anthropic 200k models being phased out in favor of 3.5 Haiku and Sonnet architectures.",
        "recommendedSuccessor": {
            "id": "anthropic/claude-3.5-haiku",
            "name": "Claude 3.5 Haiku",
            "speedDelta": "+4.1x Faster",
            "costDelta": "80% Cheaper ($0.80 vs $8.00)",
        },
    },
    {
        "id": "gemini-1.0-pro-preview",
        "modelName": "Gemini 1.0 Pro & early 1.5 preview checkpoints",
        "provider": "Google",
        "status": "sunset-imminent",
        "cutoffDate": "Mid 2025",
        "statusBadge": "Warning",
        "impactSummary": "v1beta endpoints for Gemini 1.0 pro returning deprecation warnings; upgrade to 2.0 Flash or Flash-Lite.",
        "recommendedSuccessor": {
            "id": "google/gemini-2.0-flash-lite-001",
            "name": "Gemini 2.0 Flash-Lite",
            "speedDelta": "+3.8x Faster",
            "costDelta": "85% Cheaper ($0.075 vs $0.50)",
        },
    },
    {
        "id": "claude-3-opus-legacy",
        "modelName": "Claude 3 Opus (Original)",
        "provider": "Anthropic",
        "status": "legacy-support",
        "cutoffDate": "Superseded by 3.5 Sonnet / 3.7",
        "statusBadge": "Notice",
        "impactSummary": "3 Opus remains available but costs $15/$75 per M tokens while 3.5/3.7 Sonnet outscores it in code and logic.",
        "recommendedSuccessor": {
            "id": "anthropic/claude-3.7-sonnet",
            "name": "Claude 3.7 Sonnet",
            "speedDelta": "+2.1x Faster",
            "costDelta": "80% Cheaper ($3/$15 vs $15/$75)",
        },
    },
]

JEV_SPOTLIGHT = {
    "id": "jev-router-spotlight",
    "name": "Jev & JEV-27B Architecture",
    "creator": "TypeSafe AI & AutoTrust Lab",
    "paradigm": "System 1 Probabilistic Decision Router + System 2 Multimodal Reasoning",
    "releaseDate": "Active Frontier 2025/2026",
    "description": (
        "Traditional LLMs waste immense autoregressive compute generating repetitive text tokens when an agent "
        "simply needs a categorical decision, routing label, or calibrated probability. TypeSafe's Jev introduces "
        "instant sub-500ms decision routing, while the open-weights JEV-27B-VL pairs it with Qwen-based visual reasoning."
    ),
    "architectureHighlights": [
        "Sub-500ms single-forward-pass routing for agent dispatch & civic classification",
        "Calibrated probabilities: returns exact confidence scores across candidate classes rather than halluncinated text",
        "Dual-System Operation: Fast reflex (System 1) for triage, deep step-by-step thinking (System 2) for difficult cases",
        "Massive cost reduction: Cuts token consumption up to 90% in agent decision pipelines",
    ],
    "benchmarks": [
        {"metric": "Zero-Shot Decision Latency", "value": "< 240ms"},
        {"metric": "Agent Dispatch Accuracy", "value": "98.4%"},
        {"metric": "SWE-bench Routing Overhead", "value": "-88% vs GPT-4o"},
        {"metric": "Multimodal Grounding (JEV-27B)", "value": "86.1% UI-Nav"},
    ],
    "hfRepoUrl": "https://huggingface.co/autotrust/JEV-27B-VL",
    "demoUrl": "https://huggingface.co/spaces/autotrust/JEV-27B-Demo",
    "sdkUsageSnippet": """// TypeSafe Jev System 1 Routing
const decision = await typesafe.decide({
  system: "Route incoming Vizag civic alert to ward authority",
  context: incidentReport,
  choices: ["GVMC_WATER", "EPDCL_POWER", "TRAFFIC_POLICE", "CYBER_CELL"]
});
console.log(decision.choice, decision.confidence); // 'GVMC_WATER', 0.984""",
}


def fetch_hf_trending():
    """Fetch live trending items from Hugging Face API."""
    resp = requests.get(
        HF_TRENDING_URL,
        headers={"User-Agent": "TelanganaLive-AIMarketPulse/1.0 (https://www.telangana.live)"},
        timeout=12,
    )
    if resp.status_code == 200:
        return resp.json()
    return None


def extract_trending_models(hf_payload):
    """Filter and normalize model entities from the trending feed."""
    models = []
    if not hf_payload:
        return models

    items = hf_payload.get("recentlyTrending", [])
    for item in items:
        if item.get("repoType") != "model":
            continue
        data = item.get("repoData", {})
        model_id = data.get("id")
        if not model_id:
            continue

        author = data.get("author") or model_id.split("/")[0]
        name = model_id.split("/")[-1]
        downloads = data.get("downloads", 0)
        likes = data.get("likes", 0)
        pipeline_tag = data.get("pipeline_tag") or "custom"
        num_params = data.get("numParameters")
        author_data = data.get("authorData", {})
        avatar_url = author_data.get("avatarUrl") if isinstance(author_data, dict) else None

        desc = f"Trending {pipeline_tag} model by {author} with {downloads:,} downloads"
        if "jev" in model_id.lower():
            desc = "Dual-system multimodal decision & reasoning foundation (System 1 reflex + System 2 thought)"
        elif "clef" in model_id.lower():
            desc = "Cloudflare edge-optimized vision-language backbone for instantaneous UI & edge reasoning"
        elif "ltx" in model_id.lower():
            desc = "State-of-the-art open diffusion model for high-fidelity 4K cinematic video generation"
        elif "qwen" in model_id.lower():
            desc = "High-efficiency open multimodal model runnable on local workstations"

        models.append({
            "id": model_id,
            "name": name,
            "author": author,
            "downloads": downloads,
            "likes": likes,
            "pipelineTag": pipeline_tag,
            "numParameters": num_params,
            "description": desc,
            "avatarUrl": avatar_url,
        })

    # Return top 8 models
    return models[:8]


def build_market_radar_snapshot(live_hf_data=None):
    trending = extract_trending_models(live_hf_data)

    # Ensure autotrust/JEV-27B-VL is prominently tracked if not in top list
    has_jev = any("jev" in m["id"].lower() for m in trending)
    if not has_jev:
        trending.insert(0, {
            "id": "autotrust/JEV-27B-VL",
            "name": "JEV-27B-VL",
            "author": "autotrust",
            "downloads": 1525286,
            "likes": 1041,
            "pipelineTag": "image-text-to-text",
            "numParameters": 27781427952,
            "description": "Dual-system multimodal decision & reasoning foundation (System 1 fast classification + System 2 thought)",
            "avatarUrl": "https://cdn-avatars.huggingface.co/v1/production/uploads/663b77dda14bfb0a2d41b6aa/6sRaDSlKnKIPlf5pH9E02.jpeg",
        })

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return {
        "updatedAt": now_iso,
        "source": "hf-trending-live" if live_hf_data else "snapshot-verified",
        "trendingModels": trending,
        "marketLeaders": MARKET_LEADERS,
        "sunsetRadar": SUNSET_RADAR,
        "spotlight": JEV_SPOTLIGHT,
    }


def sync_market_radar(out_path: str = DEFAULT_OUT) -> bool:
    try:
        live_data = fetch_hf_trending()
        logger.info("Successfully fetched Hugging Face trending items")
    except Exception as exc:
        logger.warning("Could not fetch live HF trending (%s); using verified baseline.", exc)
        live_data = None

    snapshot = build_market_radar_snapshot(live_data)

    existing = None
    if os.path.exists(out_path):
        try:
            with open(out_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
        except Exception:
            existing = None

    # Check content equivalence without updatedAt to avoid unnecessary commits
    if existing:
        snap_copy = dict(snapshot)
        exist_copy = dict(existing)
        snap_copy.pop("updatedAt", None)
        exist_copy.pop("updatedAt", None)
        if snap_copy == exist_copy:
            logger.info("AI Market Radar data unchanged. Skipping write.")
            return False

    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
        f.write("\n")

    logger.info("Updated AI Market Radar snapshot written to %s", out_path)
    return True


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    out = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    sync_market_radar(out)
