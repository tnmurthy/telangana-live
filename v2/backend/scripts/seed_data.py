import os
import uuid
from supabase import create_client, Client
from typing import Dict, List

# Load environment variables if needed or assume set in session
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in environment.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahbubnagar",
    "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
]

def seed_areas():
    print(f"🌱 Seeding {len(DISTRICTS)} districts...")
    area_map = {}
    
    for name in DISTRICTS:
        try:
            # Check if exists
            existing = supabase.table("areas").select("id").eq("name", name).execute()
            if existing.data:
                print(f"  - {name} already exists.")
                area_map[name] = existing.data[0]["id"]
                continue
            
            # Insert
            res = supabase.table("areas").insert({
                "name": name,
                "type": "district"
            }).execute()
            
            if res.data:
                print(f"  ✅ Added {name}")
                area_map[name] = res.data[0]["id"]
        except Exception as e:
            print(f"  ❌ Error adding {name}: {e}")
            
    return area_map

def seed_officials(area_map: Dict[str, str]):
    print("🌱 Seeding sample elected officials...")
    
    # Sample logic for high-impact demo
    samples = [
        {
            "area": "Hyderabad",
            "name": "Asaduddin Owaisi",
            "role": "Member of Parliament (MP)",
            "party": "AIMIM",
            "contact": {"twitter": "@asadowaisi", "email": "asad@aimim.org"}
        },
        {
            "area": "Hyderabad",
            "name": "M. Raghunandan Rao",
            "role": "Member of Parliament (MP)",
            "party": "BJP",
            "contact": {"twitter": "@RaghunandanraoM"}
        },
        {
            "area": "Siddipet",
            "name": "T. Harish Rao",
            "role": "Member of Legislative Assembly (MLA)",
            "party": "BRS",
            "contact": {"twitter": "@BRSHarish"}
        },
        {
            "area": "Warangal",
            "name": "Kadiyam Srihari",
            "role": "Member of Legislative Assembly (MLA)",
            "party": "BRS",
            "contact": {"twitter": "@KadiyamSrihari"}
        }
    ]

    for off in samples:
        area_id = area_map.get(off["area"])
        if not area_id:
            continue
            
        try:
            # Check if exists
            existing = supabase.table("officials").select("id").eq("name", off["name"]).execute()
            if existing.data:
                print(f"  - {off['name']} already exists.")
                continue

            supabase.table("officials").insert({
                "area_id": area_id,
                "name": off["name"],
                "role": off["role"],
                "party": off["party"],
                "contact_json": off["contact"]
            }).execute()
            print(f"  ✅ Added {off['role']}: {off['name']} ({off['area']})")
        except Exception as e:
            print(f"  ❌ Error adding official {off['name']}: {e}")

if __name__ == "__main__":
    try:
        id_map = seed_areas()
        seed_officials(id_map)
        print("\n✨ Seeding Complete! Telangana.live 2.0 is now live-data ready.")
    except Exception as e:
        print(f"💥 Global Seeding Error: {e}")
