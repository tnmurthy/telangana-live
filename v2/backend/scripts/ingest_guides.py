import os
import glob
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

# Load env
load_dotenv('.env')

def ingest_civic_guides():
    print("📚 Ingesting V1 Civic Guides into RAG Knowledge Base...")
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not all([url, key, gemini_key]):
        print("❌ Missing keys.")
        return

    sb: Client = create_client(url, key)
    genai.configure(api_key=gemini_key)
    
    # Path to legacy content
    base_path = "../../content"
    md_files = glob.glob(os.path.join(base_path, "*/*.md"))

    print(f"🔍 Found {len(md_files)} guide files.")

    for file_path in md_files:
        try:
            category = os.path.basename(os.path.dirname(file_path))
            filename = os.path.basename(file_path)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            print(f"  - Embedding: {category}/{filename}...")
            
            # Generate Embedding (Truncated to 1536)
            result = genai.embed_content(
                model="models/gemini-embedding-001",
                content=content,
                task_type="retrieval_document",
                output_dimensionality=1536
            )
            embedding = result['embedding']
            
            # Insert into Knowledge Base
            sb.table("knowledge_base").insert({
                "content": content,
                "metadata": {
                    "source": "civic_guide",
                    "category": category,
                    "filename": filename
                },
                "embedding": embedding
            }).execute()

        except Exception as e:
            print(f"  ❌ Error processing {file_path}: {e}")

    print("✨ Civic Guides Ingested! AI Assistant is now a subject matter expert.")

if __name__ == "__main__":
    ingest_civic_guides()
