import sys
import os

# Insert engines path at start of sys.path to resolve shared library imports
SHARED_ENGINES_DIR = r"C:\tt-ai-stack\02_engines"
if SHARED_ENGINES_DIR not in sys.path:
    sys.path.insert(0, SHARED_ENGINES_DIR)

from llm_provider import LLMProvider
from core.config import CONFIG

# Expose both the LLMProvider class and the initialized singleton
llm = LLMProvider(config=CONFIG)
