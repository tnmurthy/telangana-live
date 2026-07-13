#!/usr/bin/env python3
"""
water_scraper.py — Telangana.live Water Reservoir Updates Scraper/Simulator
Calculates and updates reservoir levels (TMC, Feet, Inflow, Outflow) based on seasonal variations and pushes to Upstash Redis and local JSON file.
"""

import json
import os
import sys
import datetime
import random
import requests
from dotenv import load_dotenv

# Ensure stdout encodes properly
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Paths
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
FRONTEND_DATA_DIR = os.path.join(ROOT_DIR, "frontend", "src", "data")
OUTPUT_FILE = os.path.join(FRONTEND_DATA_DIR, "water_levels.json")

# 12 Reservoirs Base Configuration
RESERVOIRS_BASE = [
    {
        "id": "nagarjuna-sagar",
        "name": "Nagarjuna Sagar",
        "river": "Krishna",
        "district": "Nalgonda",
        "fullCapacityTMC": 312.05,
        "fullLevelFt": 590.0,
        "purpose": ["Irrigation", "Hydroelectric", "Drinking"],
        "baseMinLevelFt": 510.0,
        "baseMaxInflow": 45000,
        "baseMaxOutflow": 35000
    },
    {
        "id": "srisailam",
        "name": "Srisailam Dam",
        "river": "Krishna",
        "district": "Nagarkurnool",
        "fullCapacityTMC": 215.81,
        "fullLevelFt": 885.0,
        "purpose": ["Hydroelectric", "Irrigation", "Drinking"],
        "baseMinLevelFt": 800.0,
        "baseMaxInflow": 38000,
        "baseMaxOutflow": 30000
    },
    {
        "id": "sriram-sagar",
        "name": "Sriram Sagar (SRSP)",
        "river": "Godavari",
        "district": "Nizamabad",
        "fullCapacityTMC": 90.31,
        "fullLevelFt": 1091.5,
        "purpose": ["Irrigation", "Drinking"],
        "baseMinLevelFt": 1050.0,
        "baseMaxInflow": 15000,
        "baseMaxOutflow": 12000
    },
    {
        "id": "singur",
        "name": "Singur Dam",
        "river": "Manjeera",
        "district": "Sangareddy",
        "fullCapacityTMC": 29.91,
        "fullLevelFt": 1598.0,
        "purpose": ["Drinking Water - GHMC", "Irrigation"],
        "baseMinLevelFt": 1570.0,
        "baseMaxInflow": 5000,
        "baseMaxOutflow": 4000
    },
    {
        "id": "nizamsagar",
        "name": "Nizam Sagar",
        "river": "Manjeera",
        "district": "Kamareddy",
        "fullCapacityTMC": 21.62,
        "fullLevelFt": 1441.5,
        "purpose": ["Irrigation"],
        "baseMinLevelFt": 1400.0,
        "baseMaxInflow": 3000,
        "baseMaxOutflow": 2500
    },
    {
        "id": "jurala",
        "name": "Jurala Dam",
        "river": "Krishna",
        "district": "Jogulamba Gadwal",
        "fullCapacityTMC": 10.17,
        "fullLevelFt": 318.0,
        "purpose": ["Power Generation", "Irrigation"],
        "baseMinLevelFt": 310.0,
        "baseMaxInflow": 4000,
        "baseMaxOutflow": 3500
    },
    {
        "id": "kaleshwaram",
        "name": "Kaleshwaram Lift Irrigation",
        "river": "Godavari",
        "district": "Jayashankar Bhupalpally",
        "fullCapacityTMC": 16.0,
        "fullLevelFt": 162.0,
        "purpose": ["Irrigation", "Drinking Water"],
        "baseMinLevelFt": 140.0,
        "baseMaxInflow": 8000,
        "baseMaxOutflow": 7500
    },
    {
        "id": "himayat-sagar",
        "name": "Himayat Sagar",
        "river": "Esi",
        "district": "Rangareddy",
        "fullCapacityTMC": 2.97,
        "fullLevelFt": 1763.5,
        "purpose": ["Drinking Water - GHMC"],
        "baseMinLevelFt": 1740.0,
        "baseMaxInflow": 1500,
        "baseMaxOutflow": 1200
    },
    {
        "id": "osman-sagar",
        "name": "Osman Sagar",
        "river": "Musi",
        "district": "Rangareddy",
        "fullCapacityTMC": 3.9,
        "fullLevelFt": 1790.0,
        "purpose": ["Drinking Water - GHMC"],
        "baseMinLevelFt": 1765.0,
        "baseMaxInflow": 1800,
        "baseMaxOutflow": 1500
    },
    {
        "id": "lower-manair",
        "name": "Lower Manair Dam (LMD)",
        "river": "Manair",
        "district": "Karimnagar",
        "fullCapacityTMC": 27.64,
        "fullLevelFt": 960.0,
        "purpose": ["Irrigation", "Drinking Water"],
        "baseMinLevelFt": 915.0,
        "baseMaxInflow": 6000,
        "baseMaxOutflow": 5000
    },
    {
        "id": "paleru",
        "name": "Paleru Reservoir",
        "river": "Paleru",
        "district": "Khammam",
        "fullCapacityTMC": 8.33,
        "fullLevelFt": 308.0,
        "purpose": ["Irrigation"],
        "baseMinLevelFt": 290.0,
        "baseMaxInflow": 2000,
        "baseMaxOutflow": 1800
    },
    {
        "id": "dindi",
        "name": "Dindi Reservoir",
        "river": "Krishna",
        "district": "Nalgonda",
        "fullCapacityTMC": 7.12,
        "fullLevelFt": 188.0,
        "purpose": ["Irrigation", "Drinking Water"],
        "baseMinLevelFt": 165.0,
        "baseMaxInflow": 1500,
        "baseMaxOutflow": 1200
    }
]

def calculate_levels():
    """Calculates live reservoir levels with seasonal simulation and random variations."""
    now = datetime.datetime.utcnow()
    month = now.month
    
    # Define seasonal configuration multipliers
    # Monsoon / Post-monsoon (June - October)
    if month in [6, 7, 8, 9, 10]:
        inflow_multiplier = 0.7 + (random.random() * 0.3)  # 70% to 100% of max inflow
        outflow_multiplier = 0.4 + (random.random() * 0.3) # 40% to 70% of max outflow
        storage_pct_range = (0.55, 0.95)                   # 55% to 95% storage capacity
    # Summer (March - May)
    elif month in [3, 4, 5]:
        inflow_multiplier = 0.01 + (random.random() * 0.05) # 1% to 6% of max inflow
        outflow_multiplier = 0.1 + (random.random() * 0.2)  # 10% to 30% of max outflow
        storage_pct_range = (0.15, 0.40)                    # 15% to 40% storage capacity
    # Winter / Dry season (November - February)
    else:
        inflow_multiplier = 0.05 + (random.random() * 0.15) # 5% to 20% of max inflow
        outflow_multiplier = 0.2 + (random.random() * 0.3)  # 20% to 50% of max outflow
        storage_pct_range = (0.45, 0.75)                    # 45% to 75% storage capacity

    reservoirs_list = []
    
    for r in RESERVOIRS_BASE:
        # Calculate random capacity within the seasonal range
        storage_pct = random.uniform(*storage_pct_range)
        currentLevelTMC = round(r["fullCapacityTMC"] * storage_pct, 2)
        
        # Inflows and Outflows
        inflow = int(r["baseMaxInflow"] * inflow_multiplier * random.uniform(0.85, 1.15))
        outflow = int(r["baseMaxOutflow"] * outflow_multiplier * random.uniform(0.85, 1.15))
        
        # Zero out inflows for small lakes (Himayat/Osman Sagar) during dry months
        if r["id"] in ["himayat-sagar", "osman-sagar"] and month not in [6, 7, 8, 9]:
            inflow = 0
            
        # Calculate height/level in feet proportionally
        # FRL (Full Reservoir Level) to Minimum Drawdown level (approx. baseMinLevelFt)
        usable_range = r["fullLevelFt"] - r["baseMinLevelFt"]
        currentLevelFt = round(r["baseMinLevelFt"] + (usable_range * storage_pct), 1)

        # Generate alert message if capacity is low
        alertMessage = None
        if storage_pct < 0.30:
            alertMessage = f"Critical Storage Alert: {r['name']} is below 30% capacity. Municipal water rationing may be activated."
        elif storage_pct < 0.50 and r["id"] in ["himayat-sagar", "osman-sagar", "nizamsagar"]:
            alertMessage = f"Low storage warning: Conservation advisory is active."

        reservoirs_list.append({
            "id": r["id"],
            "name": r["name"],
            "river": r["river"],
            "district": r["district"],
            "purpose": r["purpose"],
            "fullLevelFt": r["fullLevelFt"],
            "currentLevelFt": currentLevelFt,
            "fullCapacityTMC": r["fullCapacityTMC"],
            "currentLevelTMC": currentLevelTMC,
            "inflow": inflow,
            "outflow": outflow,
            "inflowUnit": "cusecs",
            "alertMessage": alertMessage,
            "correlated_news": []
        })

    return {
        "lastUpdated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "reservoirs": reservoirs_list
    }

def sync_to_redis(key, data):
    """Pushes water levels data to Upstash Redis directly via REST API."""
    load_dotenv(os.path.join(ROOT_DIR, "backend", ".env"))
    
    redis_url = os.environ.get("VITE_UPSTASH_REDIS_REST_URL") or os.environ.get("UPSTASH_REDIS_REST_URL")
    redis_token = os.environ.get("VITE_UPSTASH_REDIS_REST_TOKEN") or os.environ.get("UPSTASH_REDIS_REST_TOKEN")
    
    if not redis_url or not redis_token:
        print(f"  ℹ️ Upstash credentials absent, skipped syncing {key} to Redis.")
        return False
        
    try:
        url = f"{redis_url.rstrip('/')}/set/{key}"
        headers = {"Authorization": f"Bearer {redis_token}"}
        resp = requests.post(url, headers=headers, json=data)
        resp.raise_for_status()
        print(f"  ✅ Synced {key} to Upstash Redis successfully!")
        return True
    except Exception as e:
        print(f"  ⚠️ Redis sync failed for {key}: {e}")
        return False

def main():
    print("Simulating/Scraping latest water reservoir levels...")
    data = calculate_levels()
    
    # 1. Write locally
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✅ Written locally to: {OUTPUT_FILE} (12 reservoirs)")
    
    # 2. Sync to Upstash Redis
    sync_to_redis("tg:water:levels", data)
    
    print("✅ water_scraper.py completed successfully.")

if __name__ == "__main__":
    main()
