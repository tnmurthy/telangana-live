import re

def classify_article(title: str, description: str):
    """
    Classifies a news article into a category and a region based on title and description keywords.
    Categories: Govt, Business, Safety, Transit, Weather, Education, Health, General
    Regions: Hyderabad, Cyberabad, Malkajgiri, Warangal, Karimnagar, Khammam, Nizamabad, Telangana
    """
    title_val = title or ""
    desc_val = description or ""
    text = f"{title_val} {desc_val}".lower()

    # Category classification based on keywords
    category = "General"
    if any(k in text for k in ["traffic", "metro", "rtc", "tsrtc", "train", "railway", "road", "transit", "flyover", "highway", "bus", "transport", "aviation", "airport", "flight"]):
        category = "Transit"
    elif any(k in text for k in ["rain", "flood", "heat", "weather", "imd", "monsoon", "cyclone", "temperature", "climate", "summer", "winter", "forecast"]):
        category = "Weather"
    elif any(k in text for k in ["police", "crime", "robbery", "arrest", "safety", "security", "murder", "theft", "scam", "fraud", "cybercrime", "seizure", "raid", "fir", "jail", "encounter", "court", "investigation"]):
        category = "Safety"
    elif any(k in text for k in ["school", "college", "exam", "result", "education", "student", "teacher", "syllabus", "university", "admission", "curriculum"]):
        category = "Education"
    elif any(k in text for k in ["gold", "silver", "stock", "market", "rupee", "finance", "business", "price", "inflation", "mandi", "pulses", "economy", "trade", "gst", "corporate", "investment", "shares"]):
        category = "Business"
    elif any(k in text for k in ["hospital", "health", "covid", "dengue", "doctor", "medicine", "vaccine", "disease", "treatment", "outbreak", "clinical", "virus", "malaria"]):
        category = "Health"
    elif any(k in text for k in ["govt", "government", "civic", "ghmc", "hmda", "tsspdcl", "municipal", "cm ", "revanth", "minister", "scheme", "policy", "cabinet", "election", "bjp", "congress", "brs", "mla", "mp ", "secretariat", "collector", "hyderabad municipal"]):
        category = "Govt"

    # Region classification based on keywords
    region = "Telangana"
    if any(k in text for k in ["cyberabad", "hitec", "gachibowli", "kondapur", "madhapur", "serilingampally"]):
        region = "Cyberabad"
    elif any(k in text for k in ["malkajgiri", "uppal", "alwal", "kapra", "medchal"]):
        region = "Malkajgiri"
    elif any(k in text for k in ["warangal", "hanumakonda", "kazipet", "gwmc", "kakatiya"]):
        region = "Warangal"
    elif any(k in text for k in ["karimnagar", "smart city", "granite hub", "kmc"]):
        region = "Karimnagar"
    elif any(k in text for k in ["khammam"]):
        region = "Khammam"
    elif any(k in text for k in ["nizamabad"]):
        region = "Nizamabad"
    elif any(k in text for k in ["hyderabad", "ghmc", "banjara", "jubilee", "secunderabad", "charminar", "koti", "begumpet", "khairatabad", "nampally", "old city"]):
        region = "Hyderabad"

    return category, region

def extract_image_url(entry):
    """
    Extracts an image URL from an RSS feed entry checking various standard fields
    such as media:content, media:thumbnail, enclosures, or a fallback regex on HTML content.
    """
    if not entry:
        return ""

    # 1. media:content (feedparser places under 'media_content')
    media_content = entry.get("media_content") or entry.get("media:content")
    if media_content and isinstance(media_content, list):
        for media in media_content:
            if isinstance(media, dict):
                # prioritize image medium or type
                if media.get("medium") == "image" or "image" in media.get("type", ""):
                    if media.get("url"):
                        return media.get("url")
        # fallback: return first url
        for media in media_content:
            if isinstance(media, dict) and media.get("url"):
                return media.get("url")

    # 2. media:thumbnail
    media_thumbnail = entry.get("media_thumbnail") or entry.get("media:thumbnail")
    if media_thumbnail and isinstance(media_thumbnail, list):
        for thumb in media_thumbnail:
            if isinstance(thumb, dict) and thumb.get("url"):
                return thumb.get("url")

    # 3. enclosures
    enclosures = entry.get("enclosures")
    if enclosures and isinstance(enclosures, list):
        for enc in enclosures:
            if isinstance(enc, dict):
                if "image" in enc.get("type", ""):
                    if enc.get("href"):
                        return enc.get("href")
        # fallback: return first href that might be an image link
        for enc in enclosures:
            if isinstance(enc, dict) and enc.get("href"):
                return enc.get("href")

    # 4. Extract from HTML fields (summary, description, content)
    for key in ["summary", "description", "content"]:
        val = entry.get(key)
        if isinstance(val, list):
            val = " ".join([v.get("value", "") for v in val if isinstance(v, dict)])
        if val and isinstance(val, str):
            # check for img tag src
            img_match = re.search(r'<img[^>]+src=["\'](https?://[^"\']+)["\']', val)
            if img_match:
                return img_match.group(1)

    return ""

def extract_entities(title: str, description: str) -> dict:
    """
    Extracts civic entities from news text.
    Returns a dict with 'domain_entities' and 'locations'.
    """
    text = f"{title or ''} {description or ''}".lower()
    entities = {
        "domain_entities": [],
        "locations": []
    }
    
    # Deterministic mapping keywords
    mappings = {
        # Transit
        "Red Line": ["red line", "miyapur", "lb nagar", "ameerpet"],
        "Blue Line": ["blue line", "nagole", "raidurg", "hitec city"],
        
        # Reservoirs
        "Nagarjuna Sagar": ["nagarjuna sagar", "nssp", "krishna river"],
        "Srisailam": ["srisailam", "nagarkurnool"],
        
        # Financial
        "Gold": ["gold rate", "gold price", "24k gold", "22k gold", "gold jewellery"],
        "Fuel": ["petrol", "diesel", "fuel hike", "fuel tax"],
        
        # Mandi Commodities
        "Red Chillies": ["red chillies", "chilli price", "chillies rate", "mirchi price", "chili price"],
        "Maize": ["maize rate", "maize price", "maize crop", "corn rate", "corn price", "makka"],
        "Paddy (Common)": ["paddy price", "paddy procurement", "paddy rate", "common paddy"],
        "Cotton": ["cotton price", "cotton rate", "cotton procurement", "kapas"],
        
        # Basthi Dawakhanas
        "Basthi Dawakhana Kushaiguda": ["basthi dawakhana kushaiguda", "kushaiguda dawakhana", "kushaiguda basti dawakhana"],
        "Basthi Dawakhana Vanasthalipuram": ["basthi dawakhana vanasthalipuram", "vanasthalipuram dawakhana", "vanasthalipuram basti dawakhana"],
        "Basthi Dawakhana Kondapur": ["basthi dawakhana kondapur", "kondapur dawakhana", "kondapur basti dawakhana"],
        "Basthi Dawakhana Madhapur": ["basthi dawakhana madhapur", "madhapur dawakhana", "madhapur basti dawakhana"],
        "Basthi Dawakhana Charminar": ["basthi dawakhana charminar", "charminar dawakhana", "charminar basti dawakhana"],
        "Basthi Dawakhana Musheerabad": ["basthi dawakhana musheerabad", "musheerabad dawakhana", "musheerabad basti dawakhana"],
        "Basthi Dawakhana Uppal": ["basthi dawakhana uppal", "uppal dawakhana", "uppal basti dawakhana"],
        "Basthi Dawakhana Kukatpally": ["basthi dawakhana kukatpally", "kukatpally dawakhana", "kukatpally basti dawakhana"],
        "Basthi Dawakhana Shamshabad": ["basthi dawakhana shamshabad", "shamshabad dawakhana", "shamshabad basti dawakhana"],
        "Basthi Dawakhana LB Nagar": ["basthi dawakhana lb nagar", "lb nagar dawakhana", "lb nagar basti dawakhana"],
        
        # Districts
        "Adilabad District": ["adilabad"],
        "Bhadradri Kothagudem District": ["bhadradri", "kothagudem"],
        "Hyderabad District": ["hyderabad", "secunderabad"],
        "Jagtial District": ["jagtial"],
        "Jangaon District": ["jangaon"],
        "Jayashankar Bhupalpally District": ["bhupalpally", "jayashankar"],
        "Jogulamba Gadwal District": ["jogulamba", "gadwal"],
        "Kamareddy District": ["kamareddy"],
        "Karimnagar District": ["karimnagar"],
        "Khammam District": ["khammam"],
        "Kumuram Bheem Asifabad District": ["kumuram bheem", "asifabad"],
        "Mahabubabad District": ["mahabubabad"],
        "Mahbubnagar District": ["mahbubnagar"],
        "Mancherial District": ["mancherial"],
        "Medak District": ["medak"],
        "Medchal-Malkajgiri District": ["medchal", "malkajgiri"],
        "Mulugu District": ["mulugu"],
        "Nagarkurnool District": ["nagarkurnool"],
        "Nalgonda District": ["nalgonda"],
        "Narayanpet District": ["narayanpet"],
        "Nirmal District": ["nirmal"],
        "Nizamabad District": ["nizamabad"],
        "Peddapalli District": ["peddapalli"],
        "Rajanna Sircilla District": ["sircilla", "rajanna"],
        "Rangareddy District": ["rangareddy"],
        "Sangareddy District": ["sangareddy"],
        "Siddipet District": ["siddipet"],
        "Suryapet District": ["suryapet"],
        "Vikarabad District": ["vikarabad"],
        "Wanaparthy District": ["wanaparthy"],
        "Warangal District": ["warangal"],
        "Yadadri Bhuvanagiri District": ["yadadri", "bhuvanagiri"],
        "Hanumakonda District": ["hanumakonda", "hanamkonda"]
    }
    
    for entity, keywords in mappings.items():
        if any(kw in text for kw in keywords):
            entities["domain_entities"].append(entity)
            
    return entities

def map_domain_to_civic_schema(domain_entity: str):
    """
    Maps high-level domain entities to database type/ID keys.
    Returns (entity_type, entity_id).
    """
    mapping = {
        # Transit
        "Red Line": ("metro_line", "Red Line"),
        "Blue Line": ("metro_line", "Blue Line"),
        
        # Reservoirs
        "Nagarjuna Sagar": ("reservoir", "nagarjuna-sagar"),
        "Srisailam": ("reservoir", "srisailam"),
        
        # Financial
        "Gold": ("gold_rate", "gold"),
        "Fuel": ("fuel_price", "petrol"),
        
        # Mandi Commodities
        "Red Chillies": ("mandi_price", "Red Chillies"),
        "Maize": ("mandi_price", "Maize"),
        "Paddy (Common)": ("mandi_price", "Paddy (Common)"),
        "Cotton": ("mandi_price", "Cotton"),
        
        # Basthi Dawakhanas
        "Basthi Dawakhana Kushaiguda": ("basthi_dawakhana", "Basthi Dawakhana Kushaiguda"),
        "Basthi Dawakhana Vanasthalipuram": ("basthi_dawakhana", "Basthi Dawakhana Vanasthalipuram"),
        "Basthi Dawakhana Kondapur": ("basthi_dawakhana", "Basthi Dawakhana Kondapur"),
        "Basthi Dawakhana Madhapur": ("basthi_dawakhana", "Basthi Dawakhana Madhapur"),
        "Basthi Dawakhana Charminar": ("basthi_dawakhana", "Basthi Dawakhana Charminar"),
        "Basthi Dawakhana Musheerabad": ("basthi_dawakhana", "Basthi Dawakhana Musheerabad"),
        "Basthi Dawakhana Uppal": ("basthi_dawakhana", "Basthi Dawakhana Uppal"),
        "Basthi Dawakhana Kukatpally": ("basthi_dawakhana", "Basthi Dawakhana Kukatpally"),
        "Basthi Dawakhana Shamshabad": ("basthi_dawakhana", "Basthi Dawakhana Shamshabad"),
        "Basthi Dawakhana LB Nagar": ("basthi_dawakhana", "Basthi Dawakhana LB Nagar"),
        
        # Districts
        "Adilabad District": ("district", "Adilabad"),
        "Bhadradri Kothagudem District": ("district", "Bhadradri Kothagudem"),
        "Hyderabad District": ("district", "Hyderabad"),
        "Jagtial District": ("district", "Jagtial"),
        "Jangaon District": ("district", "Jangaon"),
        "Jayashankar Bhupalpally District": ("district", "Jayashankar Bhupalpally"),
        "Jogulamba Gadwal District": ("district", "Jogulamba Gadwal"),
        "Kamareddy District": ("district", "Kamareddy"),
        "Karimnagar District": ("district", "Karimnagar"),
        "Khammam District": ("district", "Khammam"),
        "Kumuram Bheem Asifabad District": ("district", "Kumuram Bheem Asifabad"),
        "Mahabubabad District": ("district", "Mahabubabad"),
        "Mahbubnagar District": ("district", "Mahbubnagar"),
        "Mancherial District": ("district", "Mancherial"),
        "Medak District": ("district", "Medak"),
        "Medchal-Malkajgiri District": ("district", "Medchal-Malkajgiri"),
        "Mulugu District": ("district", "Mulugu"),
        "Nagarkurnool District": ("district", "Nagarkurnool"),
        "Nalgonda District": ("district", "Nalgonda"),
        "Narayanpet District": ("district", "Narayanpet"),
        "Nirmal District": ("district", "Nirmal"),
        "Nizamabad District": ("district", "Nizamabad"),
        "Peddapalli District": ("district", "Peddapalli"),
        "Rajanna Sircilla District": ("district", "Rajanna Sircilla"),
        "Rangareddy District": ("district", "Rangareddy"),
        "Sangareddy District": ("district", "Sangareddy"),
        "Siddipet District": ("district", "Siddipet"),
        "Suryapet District": ("district", "Suryapet"),
        "Vikarabad District": ("district", "Vikarabad"),
        "Wanaparthy District": ("district", "Wanaparthy"),
        "Warangal District": ("district", "Warangal"),
        "Yadadri Bhuvanagiri District": ("district", "Yadadri Bhuvanagiri"),
        "Hanumakonda District": ("district", "Hanumakonda")
    }
    return mapping.get(domain_entity, (None, None))
