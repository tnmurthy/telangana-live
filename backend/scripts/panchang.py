import ephem
import math
from datetime import datetime, date

# Tithi names
TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
]

# Telugu month names (Amavasyant)
TELUGU_MONTHS = ['చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ']
VS_MONTHS = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna']

def get_tithi(dt: datetime = None) -> dict:
    if dt is None:
        dt = datetime.now()
    
    # Use PyEphem to calculate the exact sun and moon longitude
    sun = ephem.Sun(dt)
    moon = ephem.Moon(dt)
    
    # Ecliptic longitude in degrees
    sun_lon = ephem.Ecliptic(sun).lon * 180.0 / math.pi
    moon_lon = ephem.Ecliptic(moon).lon * 180.0 / math.pi
    
    # Difference
    diff = moon_lon - sun_lon
    if diff < 0:
        diff += 360.0
        
    # Each Tithi is 12 degrees
    tithi_index = int(diff / 12.0)
    
    paksha = "Shukla" if tithi_index < 15 else "Krishna"
    
    return {
        "tithi_index": tithi_index + 1,
        "tithi_name": TITHI_NAMES[tithi_index],
        "paksha": paksha,
        "sun_lon": sun_lon,
        "moon_lon": moon_lon
    }

def get_vikram_samvat(dt: datetime = None) -> dict:
    if dt is None:
        dt = datetime.now()
    
    # Rough approximation for Year and Month based on Gregorian
    # For a true panchang, we'd calculate the exact lunar month based on solar ingress.
    gMonth = dt.month - 1
    gYear = dt.year
    vsYear = gYear + 57 if dt.month >= 3 else gYear + 56
    
    month_idx = (gMonth - 2) % 12
    
    tithi_info = get_tithi(dt)
    
    return {
        "year": vsYear,
        "month": VS_MONTHS[month_idx],
        "teluguMonth": TELUGU_MONTHS[month_idx],
        "tithi": tithi_info["tithi_name"],
        "paksha": tithi_info["paksha"]
    }

def answer_muhurat_query(query: str, llm_provider: str = 'openai') -> dict:
    """
    Uses an LLM to answer a natural language Muhurat query.
    We pass today's panchang to the LLM as context.
    """
    today_panchang = get_vikram_samvat(datetime.now())
    
    prompt = f"""
    You are an expert Vedic Astrologer providing advice for the Telangana region.
    Today's Panchang is:
    Year: {today_panchang['year']}
    Month: {today_panchang['month']} ({today_panchang['teluguMonth']})
    Tithi: {today_panchang['tithi']} ({today_panchang['paksha']} Paksha)
    
    User Query: "{query}"
    
    Analyze the user's query against standard astrological rules (e.g. avoiding Amavasya for good deeds, checking if the current tithi is auspicious for the specific task).
    Return your response strictly in the following JSON format:
    {{
        "decision": "Yes" | "No" | "Wait",
        "explanation": "A clear, concise 2-sentence explanation of why based on today's panchang."
    }}
    """
    
    # Temporary mock implementation to ensure pipeline works before wiring real LLM API keys
    import json
    
    # Mocking logic for the demo based on the word in query
    query_lower = query.lower()
    decision = "Wait"
    explanation = "It is generally advisable to check with a local pandit for highly specific dates."
    
    if "vehicle" in query_lower or "car" in query_lower or "bike" in query_lower:
        decision = "Wait"
        explanation = f"Today is {today_panchang['tithi']}, which may not be the most auspicious. Wait for a solid Muhurat like Dashami or Ekadashi."
    elif "business" in query_lower or "shop" in query_lower:
        decision = "Yes"
        explanation = f"Today's Tithi ({today_panchang['tithi']}) is generally favorable for new beginnings if done during the Abhijit Muhurat."
    elif "borewell" in query_lower:
        decision = "No"
        explanation = f"Drilling a borewell requires checking the specific 'Jala Chakra'. It is highly advised not to proceed today without checking your personal Nakshatra."
        
    return {
        "decision": decision,
        "explanation": explanation,
        "raw_panchang": today_panchang
    }

if __name__ == "__main__":
    print(get_vikram_samvat())
    print(answer_muhurat_query("is it good to buy a vehicle?"))
