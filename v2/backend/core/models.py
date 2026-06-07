import google.generativeai as genai
import os

class ModelRegistry:
    """
    Centralized registry for all AI models used in Telangana.live 2.0.
    Ensures easy migration if models are deprecated or retired.
    """
    
    # Tier 1: High Intelligence (Assistant, RAG complex queries)
    # Default: gemini-2.0-flash
    HIGH_INTEL = "models/gemini-2.0-flash"
    
    # Tier 2: Low-Cost / High-Frequency (Classification, Auditing, Refresh)
    # Default: gemini-2.0-flash-lite
    LOW_COST = "models/gemini-2.0-flash-lite"
    
    # Tier 3: Embeddings
    # Default: gemini-embedding-001
    EMBEDDING = "models/gemini-embedding-001"

    @classmethod
    def get_model(cls, tier="LOW_COST"):
        """Returns the current active model for the given tier."""
        return getattr(cls, tier, cls.LOW_COST)

    @classmethod
    def get_generative_model(cls, tier="LOW_COST"):
        """Initializes and returns a Gemini GenerativeModel instance."""
        model_name = cls.get_model(tier)
        return genai.GenerativeModel(model_name)
