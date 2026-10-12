"""
TL-04: news classification with whole-word regex matching.

Verifies that substring collisions (e.g. 'bus' in 'business' mapping to Transit,
or 'train' in 'training' mapping to Transit) are eliminated.
Tests a labelled benchmark set of >=30 real civic headlines.
"""
import os
import sys

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))

from core.news_classifier import classify_article  # noqa: E402


LABELLED_HEADLINES = [
    # --- Category: Business (must NOT be Transit via 'bus') ---
    ("Hyderabad business leaders meet to discuss IT export growth in Madhapur", "", "Business", "Cyberabad"),
    ("Small businesses in Secunderabad urge GST rate revision", "", "Business", "Hyderabad"),
    ("Global corporate investment surge recorded in Financial District", "", "Business", "Cyberabad"),
    ("Gold price rises past record high in Hyderabad jewellery market", "", "Business", "Hyderabad"),
    ("Silver rates fall in Khammam wholesale bullion trade", "", "Business", "Khammam"),
    ("Paddy mandi prices stabilise across Nizamabad procurement centres", "", "Business", "Nizamabad"),
    ("Rupee gains against dollar boosting Telangana pharmaceutical exports", "", "Business", "Telangana"),
    ("Hyderabad startups secure record funding in first quarter", "", "Business", "Hyderabad"),

    # --- Category: Education (must NOT be Transit via 'train') ---
    ("Telangana youth skill training program launched by government in Warangal", "", "Education", "Warangal"),
    ("Teacher training workshops commence across Karimnagar government schools", "", "Education", "Karimnagar"),
    ("TSBIE announces intermediate exam results schedule", "", "Education", "Telangana"),
    ("Osmania University issues admission notification for postgraduate courses", "", "Education", "Hyderabad"),
    ("New curriculum introduced for engineering colleges in Cyberabad", "", "Education", "Cyberabad"),

    # --- Category: Weather (must NOT trigger on false substrings like wheat/theater) ---
    ("IMD issues heavy rain alert for Adilabad and northern districts", "", "Weather", "Adilabad"),
    ("Heatwave conditions intensify across Mahbubnagar with temperatures reaching 43C", "", "Weather", "Mahbubnagar"),
    ("Monsoon rainfall brings relief to farmers in Nalgonda", "", "Weather", "Nalgonda"),
    ("Severe thunderstorm and hailstorm warning issued for Siddipet", "", "Weather", "Siddipet"),

    # --- Category: Transit ---
    ("Hyderabad Metro Red Line enhances peak hour train frequency between Miyapur and LB Nagar", "", "Transit", "Hyderabad"),
    ("TGSRTC introduces new electric bus fleet on Cyberabad IT corridors", "", "Transit", "Cyberabad"),
    ("Heavy traffic congestion on Begumpet flyover following breakdown", "", "Transit", "Hyderabad"),
    ("South Central Railway announces special train services from Secunderabad", "", "Transit", "Hyderabad"),
    ("Gachibowli junction road widening work to ease airport traffic flow", "", "Transit", "Cyberabad"),

    # --- Category: Safety (must NOT trigger on first, afraid, confirmation) ---
    ("Cybercrime police arrest gang involved in investment fraud in Madhapur", "", "Safety", "Cyberabad"),
    ("Task force raids illegal narcotics operation in Banjara Hills", "", "Safety", "Hyderabad"),
    ("Police register FIR against fraudulent real estate developer in Uppal", "", "Safety", "Malkajgiri"),
    ("Anti-corruption bureau court sentences former municipal official", "", "Safety", "Telangana"),
    ("Hyderabad police commissioner reviews night patrolling and citizen safety", "", "Safety", "Hyderabad"),

    # --- Category: Health ---
    ("Dengue cases decline across Basthi Dawakhana neighborhood clinics in Hyderabad", "", "Health", "Hyderabad"),
    ("Gandhi Hospital doctors perform complex cardiology procedure", "", "Health", "Hyderabad"),
    ("Health minister reviews seasonal viral fever preparedness in Warangal", "", "Health", "Warangal"),
    ("Vaccine drive expands coverage against communicable diseases in Khammam", "", "Health", "Khammam"),

    # --- Category: Govt ---
    ("CM Revanth Reddy chairs state cabinet meeting at Secretariat", "", "Govt", "Hyderabad"),
    ("GHMC standing committee approves civic development projects worth 200 crore", "", "Govt", "Hyderabad"),
    ("Telangana assembly passes new municipal administration policy", "", "Govt", "Telangana"),
    ("District collector reviews welfare scheme implementation in Suryapet", "", "Govt", "Suryapet"),
]


def test_labelled_headlines_count():
    assert len(LABELLED_HEADLINES) >= 30


def test_labelled_benchmark_headlines_classify_correctly():
    for title, desc, expected_cat, expected_reg in LABELLED_HEADLINES:
        category, region = classify_article(title, desc)
        assert category == expected_cat, f"Expected category {expected_cat} but got {category} for: '{title}'"
        assert region == expected_reg, f"Expected region {expected_reg} but got {region} for: '{title}'"


def test_business_is_never_classified_as_transit_via_bus():
    title = "Hyderabad business chamber announces new corporate investments"
    cat, _ = classify_article(title, "")
    assert cat == "Business"


def test_training_is_never_classified_as_transit_via_train():
    title = "Technical training initiative for college graduates"
    cat, _ = classify_article(title, "")
    assert cat == "Education"


def test_first_and_afraid_do_not_trigger_safety():
    # 'first' must not match 'fir', 'afraid' must not match 'raid'
    title = "First cohort of graduates celebrated at annual convocation; students unafraid of challenges"
    cat, _ = classify_article(title, "")
    assert cat != "Safety"
