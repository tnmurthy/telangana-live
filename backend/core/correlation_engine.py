import re

# Rule-based dictionary mapping civic entities to keywords
ENTITY_MAPPING_RULES = {
    "metro_line": {
        "Red Line": ["red line", "miyapur", "lb nagar", "ameerpet", "jntu", "kphb", "mgbs", "dilsukhnagar"],
        "Blue Line": ["blue line", "nagole", "raidurg", "hitec city", "begumpet", "madhapur", "jubilee hills"],
        "Green Line": ["green line", "jbs", "mgbs", "koti", "sultan bazar", "musheerabad", "chikkadpally"]
    },
    "reservoir": {
        "nagarjuna-sagar": ["nagarjuna sagar", "nagarjunasagar", "nssp", "krishna river", "nalgonda dam"],
        "srisailam": ["srisailam", "sreesailam", "nagarkurnool dam", "pothireddypadu"],
        "sriram-sagar": ["sriram sagar", "srsp", "pochampad", "nizamabad dam", "godavari river water"],
        "osman-sagar": ["osman sagar", "gandipet", "musi river"],
        "himayat-sagar": ["himayat sagar", "himayatsagar", "esi river"]
    },
    "gold_rate": {
        "gold": ["gold rate", "gold price", "sovereign", "jewellery market", "gold bullion", "24k gold", "22k gold"],
        "silver": ["silver price", "silver rate", "bullion rate"]
    },
    "fuel_price": {
        "fuel": ["petrol price", "diesel price", "fuel price", "fuel hike", "petrol bunk", "fuel tax"]
    },
    "mandi_price": {
        "Paddy (Common)": ["paddy price", "rice market", "paddy rate", "common paddy", "paddy procurement"],
        "Cotton": ["cotton price", "cotton mandi", "cotton rate", "kapas"],
        "Red Chillies": ["red chillies", "chilli mandi", "chilli rate", "mirchi price", "chili price"],
        "Maize": ["maize price", "corn rate", "maize mandi", "maize crop", "corn price", "makka"]
    },
    "basthi_dawakhana": {
        "Basthi Dawakhana Kushaiguda": ["basthi dawakhana kushaiguda", "kushaiguda dawakhana", "kushaiguda basti dawakhana"],
        "Basthi Dawakhana Vanasthalipuram": ["basthi dawakhana vanasthalipuram", "vanasthalipuram dawakhana", "vanasthalipuram basti dawakhana"],
        "Basthi Dawakhana Kondapur": ["basthi dawakhana kondapur", "kondapur dawakhana", "kondapur basti dawakhana"],
        "Basthi Dawakhana Madhapur": ["basthi dawakhana madhapur", "madhapur dawakhana", "madhapur basti dawakhana"],
        "Basthi Dawakhana Charminar": ["basthi dawakhana charminar", "charminar dawakhana", "charminar basti dawakhana"],
        "Basthi Dawakhana Musheerabad": ["basthi dawakhana musheerabad", "musheerabad dawakhana", "musheerabad basti dawakhana"],
        "Basthi Dawakhana Uppal": ["basthi dawakhana uppal", "uppal dawakhana", "uppal basti dawakhana"],
        "Basthi Dawakhana Kukatpally": ["basthi dawakhana kukatpally", "kukatpally dawakhana", "kukatpally basti dawakhana"],
        "Basthi Dawakhana Shamshabad": ["basthi dawakhana shamshabad", "shamshabad dawakhana", "shamshabad basti dawakhana"],
        "Basthi Dawakhana LB Nagar": ["basthi dawakhana lb nagar", "lb nagar dawakhana", "lb nagar basti dawakhana"]
    },
    "district": {
        "Adilabad": ["adilabad"],
        "Bhadradri Kothagudem": ["bhadradri", "kothagudem"],
        "Hyderabad": ["hyderabad", "secunderabad"],
        "Jagtial": ["jagtial"],
        "Jangaon": ["jangaon"],
        "Jayashankar Bhupalpally": ["bhupalpally", "jayashankar"],
        "Jogulamba Gadwal": ["jogulamba", "gadwal"],
        "Kamareddy": ["kamareddy"],
        "Karimnagar": ["karimnagar"],
        "Khammam": ["khammam"],
        "Kumuram Bheem Asifabad": ["kumuram bheem", "asifabad"],
        "Mahabubabad": ["mahabubabad"],
        "Mahbubnagar": ["mahbubnagar"],
        "Mancherial": ["mancherial"],
        "Medak": ["medak"],
        "Medchal-Malkajgiri": ["medchal", "malkajgiri"],
        "Mulugu": ["mulugu"],
        "Nagarkurnool": ["nagarkurnool"],
        "Nalgonda": ["nalgonda"],
        "Narayanpet": ["narayanpet"],
        "Nirmal": ["nirmal"],
        "Nizamabad": ["nizamabad"],
        "Peddapalli": ["peddapalli"],
        "Rajanna Sircilla": ["sircilla", "rajanna"],
        "Rangareddy": ["rangareddy"],
        "Sangareddy": ["sangareddy"],
        "Siddipet": ["siddipet"],
        "Suryapet": ["suryapet"],
        "Vikarabad": ["vikarabad"],
        "Wanaparthy": ["wanaparthy"],
        "Warangal": ["warangal"],
        "Yadadri Bhuvanagiri": ["yadadri", "bhuvanagiri"],
        "Hanumakonda": ["hanumakonda", "hanamkonda"]
    }
}

def map_article_to_civic_entities(title: str, description: str) -> list:
    """
    Scans article text for matching keywords and returns a list of dictionaries:
    [{'entity_type': '...', 'entity_id': '...', 'score': 1.0}]
    """
    text = f"{title or ''} {description or ''}".lower()
    matches = []
    
    for entity_type, entities in ENTITY_MAPPING_RULES.items():
        for entity_id, keywords in entities.items():
            # Compile keywords as regex word boundaries to prevent substring collisions (e.g. "rain" in "train")
            for keyword in keywords:
                pattern = rf"\b{re.escape(keyword)}\b"
                if re.search(pattern, text):
                    # Higher weight if keyword is found in the title
                    title_match = re.search(pattern, (title or "").lower())
                    score = 1.0 if title_match else 0.75
                    
                    matches.append({
                        "entity_type": entity_type,
                        "entity_id": entity_id,
                        "score": score
                    })
                    break # Match found for this entity, skip to next entity ID
                    
    return matches
