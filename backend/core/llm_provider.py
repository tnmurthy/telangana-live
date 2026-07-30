"""
backend/core/llm_provider.py

Thin shim that imports the canonical LLMProvider from the shared engines
directory and creates a project-scoped singleton configured via core.config.

When running in CI (shared engines not on disk), a local copy of the
class is imported from the fallback module below.
"""

import sys
import os

# ── Try shared engine first ───────────────────────────────────────────────────

SHARED_ENGINES_DIR = r"C:\tt-ai-stack\02_engines"
if SHARED_ENGINES_DIR not in sys.path:
    sys.path.insert(0, SHARED_ENGINES_DIR)

try:
    from llm_provider import LLMProvider, DEFAULT_MODELS, FALLBACK_ORDER  # noqa: F401
except ImportError:
    # CI / no shared engines on disk — fall back to local copy
    from core._llm_provider_fallback import LLMProvider, DEFAULT_MODELS, FALLBACK_ORDER  # noqa: F401

# ── Project singleton ─────────────────────────────────────────────────────────

from core.config import CONFIG
llm = LLMProvider(config=CONFIG)
