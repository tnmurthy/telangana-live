import os
import re
import math
import requests
import logging

logger = logging.getLogger(__name__)

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

def get_embedding(text: str) -> list:
    """Generate a vector embedding using local Ollama nomic-embed-text."""
    if not text:
        return None
    try:
        resp = requests.post(
            f"{OLLAMA_URL}/api/embeddings",
            json={"model": "nomic-embed-text", "prompt": text},
            timeout=5
        )
        resp.raise_for_status()
        return resp.json().get("embedding")
    except Exception as e:
        logger.debug(f"Ollama embedding failed for text '{text[:20]}...': {e}")
        return None

def cosine_similarity(v1: list, v2: list) -> float:
    """Compute cosine similarity between two float vectors."""
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(x * y for x, y in zip(v1, v2))
    mag1 = math.sqrt(sum(x * x for x in v1))
    mag2 = math.sqrt(sum(x * x for x in v2))
    if not mag1 or not mag2:
        return 0.0
    return dot / (mag1 * mag2)

def jaccard_similarity(s1: str, s2: str) -> float:
    """Fallback text similarity score (Jaccard word set intersection)."""
    words1 = set(re.findall(r'\w+', s1.lower()))
    words2 = set(re.findall(r'\w+', s2.lower()))
    if not words1 or not words2:
        return 0.0
    return len(words1.intersection(words2)) / len(words1.union(words2))

def cluster_articles(articles: list, threshold: float = 0.82, jaccard_threshold: float = 0.35) -> list:
    """
    Cluster articles list using semantic embeddings or Jaccard fallback.
    Updates the representative article in-place with 'other_sources' list.
    """
    clustered = []
    # Pre-calculate embeddings to avoid redundant calls
    embeddings = []
    for art in articles:
        # Combine title and a snippet of description for better semantic capture
        text = f"{art.get('title', '')} {art.get('description', '')[:100]}"
        emb = get_embedding(text)
        embeddings.append(emb)

    for i, art in enumerate(articles):
        art["other_sources"] = art.get("other_sources", [])
        emb = embeddings[i]
        
        matched_idx = -1
        # Compare with existing representatives in clustered
        for j, rep_art in enumerate(clustered):
            rep_idx = articles.index(rep_art)
            rep_emb = embeddings[rep_idx]
            
            sim = 0.0
            if emb and rep_emb:
                sim = cosine_similarity(emb, rep_emb)
                if sim >= threshold:
                    matched_idx = j
                    break
            else:
                # Fallback to Jaccard similarity if embedding is missing
                sim = jaccard_similarity(art.get("title", ""), rep_art.get("title", ""))
                if sim >= jaccard_threshold:
                    matched_idx = j
                    break
        
        if matched_idx >= 0:
            # We found a match! Add this article's source as an alternative coverage
            matched_rep = clustered[matched_idx]
            # Avoid duplicating the same source + link
            if not any(src.get("link") == art.get("link") for src in matched_rep["other_sources"]):
                matched_rep["other_sources"].append({
                    "source": art.get("source", "Other Source"),
                    "link": art.get("link", "#")
                })
        else:
            # No match found, this article is a new representative
            clustered.append(art)
            
    return clustered
