import re

from core.correlation_engine import ENTITY_MAPPING_RULES, map_article_to_civic_entities


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
    elif any(k in text for k in ["warangal", "hanumakonda", "kazipet", "gwmc", "kakatiya", "ఓరుగల్లు", "వరంగల్", "హనుమకొండ", "కాజీపేట", "పరకాల"]):
        region = "Warangal"
    elif any(k in text for k in ["karimnagar", "smart city", "granite hub", "kmc", "కరీంనగర్"]):
        region = "Karimnagar"
    elif any(k in text for k in ["khammam", "stambhadri", "ఖమ్మం", "స్తంభాద్రి"]):
        region = "Khammam"
    elif any(k in text for k in ["nizamabad", "indur", "నిజామాబాద్", "ఇందూరు"]):
        region = "Nizamabad"
    elif any(k in text for k in ["nalgonda", "neelagiri", "నల్గొండ", "నీలగిరి"]):
        region = "Nalgonda"
    elif any(k in text for k in ["mahbubnagar", "palamuru", "మహబూబ్ నగర్", "పాలమూరు"]):
        region = "Mahbubnagar"
    elif any(k in text for k in ["adilabad", "edulabad", "ఆదిలాబాద్"]):
        region = "Adilabad"
    elif any(k in text for k in ["hyderabad", "ghmc", "banjara", "jubilee", "secunderabad", "charminar", "koti", "begumpet", "khairatabad", "nampally", "old city"]):
        region = "Hyderabad"
    elif any(k in text for k in ["siddipet"]):
        region = "Siddipet"
    elif any(k in text for k in ["sangareddy"]):
        region = "Sangareddy"
    elif any(k in text for k in ["rangareddy"]):
        region = "Rangareddy"
    elif any(k in text for k in ["suryapet"]):
        region = "Suryapet"
    elif any(k in text for k in ["mancherial"]):
        region = "Mancherial"
    elif any(k in text for k in ["jagityal", "jagtial"]):
        region = "Jagtial"
    elif any(k in text for k in ["bhupalpally"]):
        region = "Jayashankar Bhupalpally"
    elif any(k in text for k in ["kothagudem", "bhadradri"]):
        region = "Bhadradri Kothagudem"
    elif any(k in text for k in ["bhuvanagiri", "yadadri"]):
        region = "Yadadri Bhuvanagiri"

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

def entity_label(entity_type: str, entity_id: str) -> str:
    """Human-readable label for a civic entity, as stored in civic_tags."""
    if entity_type == "district":
        return f"{entity_id} District"
    if entity_type == "reservoir":
        return entity_id.replace("-", " ").title()
    if entity_type in ("gold_rate", "fuel_price"):
        return entity_id.title()
    return entity_id


# Label -> (entity_type, entity_id), built from the one keyword table.
_LABEL_TO_ENTITY = {
    entity_label(entity_type, entity_id): (entity_type, entity_id)
    for entity_type, entities in ENTITY_MAPPING_RULES.items()
    for entity_id in entities
}


def extract_entities(title: str, description: str) -> dict:
    """
    Extracts civic entities from news text.
    Returns a dict with 'domain_entities' (labels) and 'locations'.

    Uses core.correlation_engine's ENTITY_MAPPING_RULES and its whole-word
    matching. This module used to keep its own copy of the table, which
    drifted from the original and matched substrings (TL-15).
    """
    matches = map_article_to_civic_entities(title, description)
    return {
        "domain_entities": [entity_label(m["entity_type"], m["entity_id"]) for m in matches],
        "locations": [],
    }


def map_domain_to_civic_schema(domain_entity: str):
    """
    Maps a domain entity label to its database (entity_type, entity_id).
    Returns (None, None) for an unknown label.
    """
    return _LABEL_TO_ENTITY.get(domain_entity, (None, None))
