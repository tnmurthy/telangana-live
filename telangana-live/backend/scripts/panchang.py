import ephem
import math
import sys
import os
import json
from datetime import datetime

# Resolve internal imports
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))
try:
    from core.llm_provider import llm
except ImportError:
    # Fallback for direct script execution if needed
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from core.llm_provider import llm

# Constants for Hyderabad
HYD_LAT = '17.3850'
HYD_LON = '78.4867'

TITHI_NAMES = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
]

TELUGU_MONTHS = ['చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ']
VS_MONTHS = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna']

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
    "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
    "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
    "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
]

YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi",
    "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata",
    "Variyana", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha",
    "Shukla", "Brahma", "Indra", "Vaidhriti"
]

KARANAS = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]

def get_vikram_samvat(dt: datetime = None) -> dict:
    if dt is None:
        dt = datetime.utcnow()
        
    observer = ephem.Observer()
    observer.lat = HYD_LAT
    observer.lon = HYD_LON
    observer.date = dt
    
    sun = ephem.Sun()
    sun.compute(dt)
    moon = ephem.Moon()
    moon.compute(dt)
    
    sun_lon = ephem.Ecliptic(sun).lon * 180.0 / math.pi
    moon_lon = ephem.Ecliptic(moon).lon * 180.0 / math.pi
    
    diff = moon_lon - sun_lon
    if diff < 0:
        diff += 360.0
        
    tithi_index = int(diff / 12.0) % 30
    paksha = "Shukla" if tithi_index < 15 else "Krishna"
    tithi_name = TITHI_NAMES[tithi_index]
    
    nakshatra_index = int(moon_lon / (360.0/27.0)) % 27
    nakshatra_name = NAKSHATRAS[nakshatra_index]
    
    yoga_sum = sun_lon + moon_lon
    if yoga_sum >= 360.0:
        yoga_sum -= 360.0
    yoga_index = int(yoga_sum / (360.0/27.0)) % 27
    yoga_name = YOGAS[yoga_index]
    
    karana_index = int(diff / 6.0) % 60
    if karana_index == 0:
        karana_name = "Kintughna"
    elif karana_index == 57:
        karana_name = "Shakuni"
    elif karana_index == 58:
        karana_name = "Chatushpada"
    elif karana_index == 59:
        karana_name = "Naga"
    else:
        karana_name = KARANAS[(karana_index - 1) % 7]
        
    local_dt = ephem.localtime(ephem.Date(dt))
    
    # Calculate sunrise/sunset using midnight UTC to ensure it corresponds to the current day
    midnight_utc = dt.replace(hour=0, minute=0, second=0, microsecond=0)
    observer.date = midnight_utc
    
    try:
        sunrise = ephem.localtime(observer.next_rising(ephem.Sun())).strftime('%H:%M')
        sunset = ephem.localtime(observer.next_setting(ephem.Sun())).strftime('%H:%M')
    except:
        sunrise, sunset = "06:00", "18:00"
        
    try:
        moonrise = ephem.localtime(observer.next_rising(ephem.Moon())).strftime('%H:%M')
        moonset = ephem.localtime(observer.next_setting(ephem.Moon())).strftime('%H:%M')
    except:
        moonrise, moonset = "18:00", "06:00"
        
    observer.date = dt
    
    # Rough approximation for Year and Month
    gMonth = local_dt.month - 1
    gYear = local_dt.year
    vsYear = gYear + 57 if local_dt.month >= 3 else gYear + 56
    month_idx = (gMonth - 2) % 12
    
    # Very basic static mapping for Rahu Kaal based on weekday
    # For a real system, this would be computed using the exact sunrise-sunset duration.
    # 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    rahu_mapping = [
        "07:30 - 09:00", "15:00 - 16:30", "12:00 - 13:30",
        "13:30 - 15:00", "10:30 - 12:00", "09:00 - 10:30", "16:30 - 18:00"
    ]
    rahu_kaal = rahu_mapping[local_dt.weekday()]
    
    # Abhijit is usually midday (~11:45 to 12:30)
    abhijit_muhurat = "11:45 - 12:30"

    # Moon Phase logic
    moon_phase_val = moon.phase / 100.0  # 0-1
    if moon_phase_val < 0.03: moon_label = "Amavasya (New Moon)"
    elif moon_phase_val < 0.47: moon_label = "Waxing (Shukla Paksha)"
    elif moon_phase_val < 0.53: moon_label = "Purnima (Full Moon)"
    else: moon_label = "Waning (Krishna Paksha)"
    
    # Upcoming Festivals (Hardcoded for June 2026 based on research)
    festivals = [
        {"date": "June 03", "name": "Vibhuvana Sankashti", "significance": "Dedicated to Lord Ganesha for overcoming obstacles."},
        {"date": "June 07", "name": "Adhik Janmashtami", "significance": "Celebration of Lord Krishna's divine birth."},
        {"date": "June 10", "name": "Parama Ekadashi", "significance": "Auspicious day for spiritual liberation."},
        {"date": "June 13", "name": "Adhik Amavasya", "significance": "Sacred day for honoring ancestors."}
    ]

    # Rituals
    rituals = [
        {"title": "Surya Arghya", "description": "Offer water to the Sun during sunrise for health and vitality."},
        {"title": "Mantra Jaap", "description": "Chanting 'Om Namah Shivaya' 108 times for mental peace."}
    ]
    
    return {
        "year": vsYear,
        "month": VS_MONTHS[month_idx],
        "teluguMonth": TELUGU_MONTHS[month_idx],
        "tithi": tithi_name,
        "paksha": paksha,
        "nakshatra": nakshatra_name,
        "yoga": yoga_name,
        "karana": karana_name,
        "sunrise": sunrise,
        "sunset": sunset,
        "moonrise": moonrise,
        "moonset": moonset,
        "rahu_kaal": rahu_kaal,
        "abhijit": abhijit_muhurat,
        "moonPhase": moon_label,
        "festivals": festivals,
        "rituals": rituals
    }

def answer_muhurat_query(query: str, llm_provider: str = 'openai', today_panchang=None) -> dict:
    """
    Uses LLM to answer whether a specific task is auspicious today 
    based on calculated Panchang data.
    """
    if not query or not isinstance(query, str) or not query.strip():
        return {
            "decision": "Error", 
            "explanation": "Please provide a valid query.",
            "raw_panchang": {}
        }
    
    if not today_panchang:
        today_panchang = get_vikram_samvat(datetime.utcnow())
    
    # Construct the system prompt and context
    panchang_context = json.dumps(today_panchang, indent=2)
    prompt = f"""
    You are an expert Vedic Astrologer (Pandit). Based on the following Panchang data for today:
    {panchang_context}
    
    User Query: "{query}"
    
    Evaluate if this activity is auspicious according to the Tithi, Nakshatra, Yoga, and Karana. 
    Consider Rahu Kaal (avoid if possible) and Varjyam.
    
    Return your response in STRICT JSON format:
    {{
        "decision": "Yes" | "No" | "Wait",
        "explanation": "Short astrological explanation in 2-3 sentences."
    }}
    """
    
    try:
        response = llm.generate(prompt)
        # Attempt to parse JSON from LLM response
        clean_text = response["text"].strip()
        if "```json" in clean_text:
            clean_text = clean_text.split("```json")[1].split("```")[0].strip()
        elif "```" in clean_text:
            clean_text = clean_text.split("```")[1].strip()
            
        result = json.loads(clean_text)
        return {
            "decision": result.get("decision", "Wait"),
            "explanation": result.get("explanation", "Astrological data processed."),
            "tokens": response.get("tokens", 0),
            "raw_panchang": today_panchang
        }
    except Exception as e:
        print(f"AI Panchang Query Failed: {e}")
        # Fallback logic
        is_bad = "rahu" in query.lower() or "kaal" in query.lower()
        return {
            "decision": "Wait" if is_bad else "Consult Pandit",
            "explanation": f"Unable to reach the celestial advisor. Based on Tithi ({today_panchang['tithi']}), please proceed with caution.",
            "raw_panchang": today_panchang
        }
