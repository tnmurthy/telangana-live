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
