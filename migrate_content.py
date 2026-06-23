#!/usr/bin/env python3
import os
import re
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).resolve().parent
SOURCE_DIR = PROJECT_ROOT / "content"
TARGET_DIR = PROJECT_ROOT / "frontend" / "src" / "content" / "docs"

MAPPING = {
    "certificates": "1-documents-certificates",
    "bills": "2-bills-taxes",
    "land": "3-land-property",
    "ration": "4-ration-food-pensions",
    "jobs-education": "5-jobs-education-scholarships",
    "complaints": "6-complaints-grievances",
    "police": "7-police-safety",
    "legal": "8-rti-courts-legal",
    "health": "9-health-social-welfare",
    "elections": "10-elections-voting"
}

DISCLAIMER_MARKDOWN = (
    "\n\n---\n\n"
    "> **Disclaimer:** This website is not an official government portal. Telangana.live is an independent "
    "helper site that explains and links to official services. All actual transactions and "
    "applications must be done on the official government websites.\n"
)

def clean_and_migrate():
    print("Starting content migration...")
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    for src_folder, target_folder in MAPPING.items():
        src_path = SOURCE_DIR / src_folder
        target_path = TARGET_DIR / target_folder
        
        if not src_path.exists():
            print(f"Warning: Source folder {src_path} does not exist. Skipping.")
            continue
            
        target_path.mkdir(parents=True, exist_ok=True)
        
        # Read markdown files from source folder
        files = [p for p in src_path.iterdir() if p.is_file() and p.suffix == ".md"]
        
        for file_path in files:
            # Skip index files
            if file_path.name == "index.md":
                continue
                
            content = file_path.read_text(encoding="utf-8")
            
            # Clean up potential existing disclaimers or trailing spaces/newlines
            # Let's strip any existing disclaimer to start fresh
            # The disclaimer we might have appended or is there
            content = re.sub(
                r"\s*---\s*>\s*\*\*Disclaimer:\*\*.*$", 
                "", 
                content, 
                flags=re.IGNORECASE | re.DOTALL
            )
            # Also check for other standard disclaimer blocks
            content = re.sub(
                r"\s*This website is not an official government portal.*$", 
                "", 
                content, 
                flags=re.IGNORECASE | re.DOTALL
            )
            
            # Strip trailing/leading spaces
            content = content.strip()
            
            # Append standard disclaimer
            final_content = content + DISCLAIMER_MARKDOWN
            
            dest_file_path = target_path / file_path.name
            dest_file_path.write_text(final_content, encoding="utf-8")
            print(f"Migrated and formatted: {dest_file_path.relative_to(PROJECT_ROOT)}")

if __name__ == "__main__":
    clean_and_migrate()
    print("Migration complete!")
