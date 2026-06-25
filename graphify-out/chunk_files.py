import json
from pathlib import Path

def chunk_files():
    detect_path = Path("graphify-out/.graphify_detect.json")
    if not detect_path.exists():
        print("No detect file found.")
        return
        
    detect = json.loads(detect_path.read_text(encoding="utf-8"))
    
    # We only run semantic extraction on non-code files (document, paper, image)
    # Code files are fully handled by AST structural extraction (which has 5500+ edges)
    non_code_files = []
    non_code_files.extend(detect.get("files", {}).get("document", []))
    non_code_files.extend(detect.get("files", {}).get("paper", []))
    non_code_files.extend(detect.get("files", {}).get("image", []))
    
    # Sort files to group by directory
    non_code_files.sort(key=lambda x: str(Path(x).parent))
    
    chunks = []
    current_chunk = []
    
    # Image files get their own chunk (vision needs separate context)
    image_exts = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'}
    
    for f in non_code_files:
        suffix = Path(f).suffix.lower()
        if suffix in image_exts:
            # If current chunk has items, save it first
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = []
            # Image in its own chunk
            chunks.append([f])
        else:
            current_chunk.append(f)
            if len(current_chunk) >= 25:
                chunks.append(current_chunk)
                current_chunk = []
                
    if current_chunk:
        chunks.append(current_chunk)
        
    # Write chunks to disk
    for idx, chunk in enumerate(chunks):
        chunk_file = Path("graphify-out") / f".graphify_chunk_files_{idx}.txt"
        chunk_file.write_text("\n".join(chunk), encoding="utf-8")
        
    print(f"Split {len(non_code_files)} non-code files into {len(chunks)} chunks.")
    
if __name__ == "__main__":
    chunk_files()
