#!/usr/bin/env python3
import os
import sys
from pathlib import Path
import re

# Ensure emoji/unicode output works regardless of the terminal's default codepage (e.g. Windows cp1252)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Central paths
PROJECT_ROOT = Path(__file__).resolve().parent
DOCS_DIR = PROJECT_ROOT / "frontend" / "src" / "content" / "docs"

EXPECTED_CATEGORIES = [
    "1-documents-certificates",
    "2-bills-taxes",
    "3-land-property",
    "4-ration-food-pensions",
    "5-jobs-education-scholarships",
    "6-complaints-grievances",
    "7-police-safety",
    "8-rti-courts-legal",
    "9-health-social-welfare",
    "10-elections-voting"
]

DISCLAIMER_TEXT = (
    "This website is not an official government portal. Telangana.live is an independent "
    "helper site that explains and links to official services. All actual transactions and "
    "applications must be done on the official government websites."
)

def verify_structure():
    errors = []

    print(f"Checking docs directory: {DOCS_DIR}")
    if not DOCS_DIR.exists():
        errors.append(f"Docs directory does not exist: {DOCS_DIR}")
        print("\n".join(errors))
        return False

    # Get top level directories
    subdirs = [p for p in DOCS_DIR.iterdir() if p.is_dir()]
    subdir_names = sorted([p.name for p in subdirs])

    # Check 1: Exactly 10 top-level categories
    if len(subdirs) != 10:
        errors.append(f"Expected exactly 10 top-level categories, found {len(subdirs)}: {subdir_names}")
    
    # Check if they match expected names
    for cat in EXPECTED_CATEGORIES:
        if cat not in subdir_names:
            errors.append(f"Missing expected category: {cat}")
    
    for name in subdir_names:
        if name not in EXPECTED_CATEGORIES:
            errors.append(f"Unexpected category found: {name}")

    # Check each category
    for subdir in subdirs:
        if subdir.name not in EXPECTED_CATEGORIES:
            continue
        
        # Get sub-pages (markdown files)
        files = [p for p in subdir.iterdir() if p.is_file() and p.suffix == ".md"]
        num_files = len(files)
        
        # Check 2: 3 to 7 sub-pages
        if not (3 <= num_files <= 7):
            errors.append(f"Category '{subdir.name}' has {num_files} sub-pages, which is not between 3 and 7. Files: {[f.name for f in files]}")
            
        for file_path in files:
            content = file_path.read_text(encoding="utf-8")
            
            # Check 3: Headings check
            # # Page title (clear, citizen-friendly)
            h1_matches = re.findall(r"^#\s+(.+)$", content, re.MULTILINE)
            if len(h1_matches) != 1:
                errors.append(f"File '{file_path.relative_to(PROJECT_ROOT)}' must contain exactly one H1 heading (# Page title). Found: {h1_matches}")
            
            # ## Who should use this
            if not re.search(r"^## Who should use this$", content, re.MULTILINE):
                errors.append(f"File '{file_path.relative_to(PROJECT_ROOT)}' is missing heading: '## Who should use this'")
                
            # ## Steps in short
            if not re.search(r"^## Steps in short$", content, re.MULTILINE):
                errors.append(f"File '{file_path.relative_to(PROJECT_ROOT)}' is missing heading: '## Steps in short'")
                
            # ## Important links
            if not re.search(r"^## Important links$", content, re.MULTILINE):
                errors.append(f"File '{file_path.relative_to(PROJECT_ROOT)}' is missing heading: '## Important links'")
                
            # Check 4: Non-official portal disclaimer
            # Normalizing spaces to make check robust
            normalized_content = " ".join(content.split())
            normalized_disclaimer = " ".join(DISCLAIMER_TEXT.split())
            if normalized_disclaimer not in normalized_content:
                errors.append(f"File '{file_path.relative_to(PROJECT_ROOT)}' is missing the required non-official portal disclaimer.")

    if errors:
        print("\n--- STRUCTURE VERIFICATION FAILED ---")
        for err in errors:
            print(f"❌ {err}")
        return False
    else:
        print("\n--- STRUCTURE VERIFICATION PASSED ---")
        print("✅ Exactly 10 top-level categories.")
        print("✅ Every category has between 3 and 7 sub-pages.")
        print("✅ Every sub-page contains exactly one H1 heading.")
        print("✅ Every sub-page contains the exact required H2 headings.")
        print("✅ Every sub-page contains the non-official portal disclaimer.")
        return True

if __name__ == "__main__":
    success = verify_structure()
    sys.exit(0 if success else 1)
