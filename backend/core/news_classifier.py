import re

from core.correlation_engine import ENTITY_MAPPING_RULES, map_article_to_civic_entities

CATEGORY_KEYWORDS = {
    "Weather": [
        "rain", "flood", "heatwave", "weather", "imd", "monsoon", "cyclone",
        "temperature", "climate", "forecast", "hailstorm", "thunderstorm",
        "downpour", "rainfall", "heavy rain",
    ],
    "Safety": [
        "police", "crime", "robbery", "arrest", "arrested", "safety", "security",
        "murder", "theft", "scam", "fraud", "cybercrime", "seizure", "raid",
        "raids", "fir", "jail", "encounter", "court", "investigation", "lokayukta",
        "vigilance", "smuggling", "narcotics", "contraband",
    ],
    "Health": [
        "hospital", "hospitals", "health", "healthcare", "covid", "dengue",
        "doctor", "doctors", "medicine", "medicines", "vaccine", "vaccines",
        "disease", "treatment", "outbreak", "clinical", "virus", "malaria",
        "chikungunya", "typhoid",
    ],
    "Education": [
        "school", "schools", "college", "colleges", "exam", "exams", "result",
        "results", "education", "student", "students", "teacher", "teachers",
        "syllabus", "university", "universities", "admission", "admissions",
        "curriculum", "scholarship", "tsbie", "inter results", "ssc results",
    ],
    "Transit": [
        "traffic", "metro", "rtc", "tgsrtc", "tsrtc", "train", "trains",
        "railway", "railways", "road", "roads", "transit", "flyover", "flyovers",
        "highway", "highways", "bus", "buses", "transport", "aviation",
        "airport", "airports", "flight", "flights", "expressway", "mmts",
    ],
    "Business": [
        "gold", "silver", "stock", "stocks", "market", "markets", "rupee",
        "finance", "business", "businesses", "price", "prices", "inflation",
        "mandi", "mandis", "pulses", "economy", "trade", "gst", "corporate",
        "investment", "investments", "shares", "startup", "startups",
    ],
    "Govt": [
        "govt", "government", "civic", "ghmc", "hmda", "tsspdcl", "municipal",
        "cm", "chief minister", "revanth", "minister", "scheme", "policy",
        "cabinet", "election", "elections", "bjp", "congress", "brs", "mla",
        "mlas", "mp", "mps", "secretariat", "collector", "hyderabad municipal",
    ],
}

REGION_KEYWORDS = {
    "Cyberabad": [
        "cyberabad", "hitec city", "hitec", "gachibowli", "kondapur",
        "madhapur", "serilingampally", "financial district", "kokapet",
        "nanakramguda", "raidurg",
    ],
    "Malkajgiri": [
        "malkajgiri", "uppal", "alwal", "kapra", "medchal", "kushaiguda", "ecil",
    ],
    "Warangal": [
        "warangal", "hanumakonda", "hanamkonda", "kazipet", "gwmc", "kakatiya",
        "ఓరుగల్లు", "వరంగల్", "హనుమకొండ", "కాజీపేట", "పరకాల",
    ],
    "Karimnagar": [
        "karimnagar", "smart city", "granite hub", "kmc", "కరీంనగర్",
    ],
    "Khammam": [
        "khammam", "stambhadri", "ఖమ్మం", "స్తంభాద్రి",
    ],
    "Nizamabad": [
        "nizamabad", "indur", "నిజామాబాద్", "ఇందూరు",
    ],
    "Nalgonda": [
        "nalgonda", "neelagiri", "నల్గొండ", "నీలగిరి",
    ],
    "Mahbubnagar": [
        "mahbubnagar", "palamuru", "మహబూబ్ నగర్", "పాలమూరు",
    ],
    "Adilabad": [
        "adilabad", "edulabad", "ఆదిలాబాద్",
    ],
    "Siddipet": [
        "siddipet", "సిద్దిపేట",
    ],
    "Sangareddy": [
        "sangareddy", "సంగారెడ్డి",
    ],
    "Rangareddy": [
        "rangareddy", "రంగారెడ్డి",
    ],
    "Suryapet": [
        "suryapet", "సూర్యాపేట",
    ],
    "Mancherial": [
        "mancherial", "మంచిర్యాల",
    ],
    "Jagtial": [
        "jagtial", "jagityal", "జగిత్యాల",
    ],
    "Jayashankar Bhupalpally": [
        "bhupalpally", "jayashankar", "భూపాలపల్లి",
    ],
    "Bhadradri Kothagudem": [
        "kothagudem", "bhadradri", "కొత్తగూడెం", "భద్రాద్రి",
    ],
    "Yadadri Bhuvanagiri": [
        "bhuvanagiri", "yadadri", "భువనగిరి", "యాదాద్రి",
    ],
    "Hyderabad": [
        "hyderabad", "ghmc", "banjara hills", "banjara", "jubilee hills",
        "jubilee", "secunderabad", "charminar", "koti", "begumpet",
        "khairatabad", "nampally", "old city", "హైదరాబాద్", "సికింద్రాబాద్",
    ],
}


def _compile_patterns(keyword_map: dict[str, list[str]]) -> dict[str, list[re.Pattern]]:
    compiled = {}
    for key, words in keyword_map.items():
        patterns = []
        for word in words:
            escaped = re.escape(word)
            patterns.append(re.compile(rf"(?<!\w){escaped}(?!\w)", re.IGNORECASE))
        compiled[key] = patterns
    return compiled


_COMPILED_CATEGORIES = _compile_patterns(CATEGORY_KEYWORDS)
_COMPILED_REGIONS = _compile_patterns(REGION_KEYWORDS)


def classify_article(title: str, description: str):
    """
    Classifies a news article into a category and a region based on title and description keywords.
    Uses whole-word boundary matching to prevent substring collisions (TL-04).
    Categories: Weather, Safety, Health, Education, Transit, Business, Govt, General
    Regions: Cyberabad, Malkajgiri, Warangal, Karimnagar, Khammam, Nizamabad, Nalgonda,
             Mahbubnagar, Adilabad, Siddipet, Sangareddy, Rangareddy, Suryapet, Mancherial,
             Jagtial, Jayashankar Bhupalpally, Bhadradri Kothagudem, Yadadri Bhuvanagiri,
             Hyderabad, Telangana
    """
    title_val = title or ""
    desc_val = description or ""
    text = f"{title_val} {desc_val}"

    # Category classification based on whole-word regex patterns
    category = "General"
    for cat, patterns in _COMPILED_CATEGORIES.items():
        if any(p.search(text) for p in patterns):
            category = cat
            break

    # Region classification based on whole-word regex patterns
    region = "Telangana"
    for reg, patterns in _COMPILED_REGIONS.items():
        if any(p.search(text) for p in patterns):
            region = reg
            break

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
            # prioritize image medium or type
            if (isinstance(media, dict)
                    and (media.get("medium") == "image" or "image" in media.get("type", ""))
                    and media.get("url")):
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
            if isinstance(enc, dict) and "image" in enc.get("type", "") and enc.get("href"):
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
