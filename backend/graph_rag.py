"""
graph_rag.py - Lightweight Entity & Topic Knowledge Graph RAG for News Portals
Extracts Entities, Topics, Locations, and Relationships into a Graph state
and enables multi-hop relational retrieval (GraphRAG).
"""

import json
import re
from typing import Dict, List, Set, Tuple

class NewsGraphRAG:
    def __init__(self):
        self.nodes: Dict[str, dict] = {}  # entity_id -> { id, label, properties }
        self.edges: List[dict] = []       # List of { from, relation, to }

    def add_node(self, node_id: str, label: str, properties: dict = None):
        if properties is None:
            properties = {}
        self.nodes[node_id] = {
            "id": node_id,
            "label": label,
            "properties": properties
        }

    def add_edge(self, source_id: str, relation: str, target_id: str):
        if source_id in self.nodes and target_id in self.nodes:
            self.edges.append({
                "from": source_id,
                "relation": relation,
                "to": target_id
            })

    def ingest_article(self, article_id: str, title: str, content: str, category: str, entities: List[dict]):
        """
        Ingests news article and constructs knowledge graph connections.
        """
        article_node_id = f"article:{article_id}"
        self.add_node(article_node_id, "Article", {"title": title, "category": category})

        # Category Node Edge
        cat_node_id = f"category:{category.lower()}"
        if cat_node_id not in self.nodes:
            self.add_node(cat_node_id, "Category", {"name": category})
        self.add_edge(article_node_id, "BELONGS_TO", cat_node_id)

        # Entity Extraction Edges
        for entity in entities:
            ent_id = f"entity:{entity['name'].lower().replace(' ', '_')}"
            ent_type = entity.get("type", "General")
            
            if ent_id not in self.nodes:
                self.add_node(ent_id, ent_type, {"name": entity['name']})
            
            self.add_edge(article_node_id, "MENTIONS", ent_id)

    def query_graph_rag(self, entity_name: str, max_hops: int = 2) -> dict:
        """
        Performs multi-hop graph retrieval starting from an entity node.
        """
        start_id = f"entity:{entity_name.lower().replace(' ', '_')}"
        if start_id not in self.nodes:
            return {"found": False, "articles": [], "connected_entities": []}

        visited = set()
        queue = [(start_id, 0)]
        connected_articles = []
        connected_entities = set()

        while queue:
            current_id, depth = queue.pop(0)
            if current_id in visited or depth > max_hops:
                continue
            
            visited.add(current_id)
            current_node = self.nodes[current_id]

            if current_node["label"] == "Article" and current_id != start_id:
                connected_articles.append(current_node["properties"])

            if current_node["label"] in ["Person", "Location", "Organization", "Topic"] and current_id != start_id:
                connected_entities.add(current_node["properties"].get("name", current_id))

            # Traverse adjacent edges
            adjacent = [
                e["to"] if e["from"] == current_id else e["from"]
                for e in self.edges
                if e["from"] == current_id or e["to"] == current_id
            ]

            for neighbor in adjacent:
                if neighbor not in visited:
                    queue.append((neighbor, depth + 1))

        return {
            "found": True,
            "query_entity": entity_name,
            "articles": connected_articles,
            "connected_entities": list(connected_entities)
        }

    def extract_entities_from_text(self, text: str) -> List[dict]:
        """
        Simple rule-based entity extractor for titles and article content.
        Identifies key capitalized entities, locations, and events.
        """
        entities = []
        # Match multi-word capitalized phrases (Proper Nouns)
        matches = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        seen = set()
        
        for m in matches:
            if len(m) > 3 and m.lower() not in seen and m not in ["Telangana", "Live", "Step", "The", "This", "That"]:
                seen.add(m.lower())
                ent_type = "Location" if any(loc in m for loc in ["Hyderabad", "District", "City", "Telangana", "India"]) else "Organization"
                entities.append({"name": m, "type": ent_type})

        return entities

    def generate_entity_graph_digest(self, entity_name: str) -> str:
        """
        Agentic Workflow Integration: Generates a structured news digest summary
        from the knowledge graph around a central entity.
        """
        graph_data = self.query_graph_rag(entity_name, max_hops=2)
        if not graph_data["found"]:
            return f"No knowledge graph data found for entity '{entity_name}'."

        digest = [
            f"=== GRAPH NEWS DIGEST: {entity_name.upper()} ===",
            f"Central Entity: {entity_name}",
            f"Connected Entities: {', '.join(graph_data['connected_entities'] or ['None'])}",
            "\nRelated Coverage:"
        ]

        for i, article in enumerate(graph_data["articles"], 1):
            digest.append(f"{i}. {article.get('title', 'Untitled')} [{article.get('category', 'General')}]")

        return "\n".join(digest)

if __name__ == "__main__":
    # Self-test script
    rag = NewsGraphRAG()
    
    # Mock Ingestion
    rag.ingest_article(
        article_id="101",
        title="Telangana Tech Summit 2026 Announced in Hyderabad",
        content="IT Minister announced new AI initiatives in Hyderabad today.",
        category="Technology",
        entities=[
            {"name": "Telangana Tech Summit", "type": "Event"},
            {"name": "Hyderabad", "type": "Location"},
            {"name": "IT Minister", "type": "Person"}
        ]
    )

    rag.ingest_article(
        article_id="102",
        title="Hyderabad Metro Expansion Approved for Phase 3",
        content="Infrastructure growth accelerates across Hyderabad.",
        category="Infrastructure",
        entities=[
            {"name": "Hyderabad", "type": "Location"},
            {"name": "Metro Rail", "type": "Organization"}
        ]
    )

    # Perform Multi-hop Graph Search & Generate Agent Digest
    digest = rag.generate_entity_graph_digest("Hyderabad")
    print(digest)

