import os
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

# Load env from parent dir if needed or relative
load_dotenv('.env')

def init_rag():
    print("🧠 Initializing RAG Knowledge Base...")
    
    # 1. Connect
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not all([url, key, gemini_key]):
        print("❌ Missing keys. Skipping.")
        return

    sb: Client = create_client(url, key)
    genai.configure(api_key=gemini_key)
    
    # 2. Fetch News from public.news
    news_res = sb.table("news").select("*").execute()
    
    if not news_res.data:
        print("ℹ️ No news data to embed. Run bridge first.")
        return

    for item in news_res.data:
        text = f"{item['title']}. {item['content']}"
        print(f"  - Embedding: {item['title'][:30]}...")
        
        # 3. Generate Embedding (Truncated to 1536 for pgvector compatibility)
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document",
            output_dimensionality=1536
        )
        embedding = result['embedding']
        
        # 4. Insert into Knowledge Base
        sb.table("knowledge_base").insert({
            "content": text,
            "metadata": {"source": "news", "id": item["id"]},
            "embedding": embedding
        }).execute()

    print("✨ Knowledge Base Initialized! AI Assistant is now context-aware.")

if __name__ == "__main__":
    init_rag()
