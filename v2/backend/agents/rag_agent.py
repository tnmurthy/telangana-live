import os
from supabase import create_client, Client
import google.generativeai as genai

from core.models import ModelRegistry

class RAGAgent:
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"),
            os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        )
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

    def get_embedding(self, text: str):
        # Using the correct genai.embed_content method with registry model
        result = genai.embed_content(
            model=ModelRegistry.EMBEDDING,
            content=text,
            task_type="retrieval_document",
            output_dimensionality=1536
        )
        return result['embedding']

    def search_knowledge(self, query_text: str, limit: int = 5):
        query_embedding = self.get_embedding(query_text)
        
        # Use RPC for vector similarity search
        result = self.supabase.rpc(
            'match_knowledge',
            {
                'query_embedding': query_embedding,
                'match_threshold': 0.70, # Lowered slightly for demo
                'match_count': limit,
            }
        ).execute()
        
        return result.data

    def generate_answer(self, query: str, context: list):
        context_str = "\n".join([item['content'] for item in context])
        prompt = f"""
        You are the Telangana.live AI Assistant. 
        Use the following context to answer the citizen's question accurately.
        If the answer is not in the context, say you don't know and advise them to contact local officials.
        
        Context:
        {context_str}
        
        Question: {query}
        """
        
        model = ModelRegistry.get_generative_model("HIGH_INTEL")
        response = model.generate_content(prompt)
        return response.text
