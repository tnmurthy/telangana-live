import requests
from bs4 import BeautifulSoup
import re

def test_source(name, url):
    print(f"Testing {name}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        print(f"  Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"  Length: {len(resp.text)}")
            return resp.text
    except Exception as e:
        print(f"  Error: {e}")
    return None

def find_gold(html):
    # Live Mint Gold
    m = re.search(r"24\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
    if m:
        print(f"  Found 24K: {m.group(1)}")
    m = re.search(r"22\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
    if m:
        print(f"  Found 22K: {m.group(1)}")

# Sources for Gold
test_source("LiveMint Gold", "https://www.livemint.com/gold-prices/hyderabad")
test_source("NDTV Gold", "https://www.ndtv.com/business/gold-rates-in-hyderabad-city")

# Sources for Fuel
test_source("NDTV Fuel", "https://www.ndtv.com/business/fuel-prices-in-hyderabad-city-citycode-14")
test_source("GoodReturns Fuel", "https://www.goodreturns.in/petrol-price-in-hyderabad.html")
