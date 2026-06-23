import requests
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

def find_fuel(html):
    # News18 Fuel
    m = re.search(r"Petrol Price.*?₹\s*([\d.]+)", html, re.I | re.S)
    if m:
        print(f"  Found Petrol: {m.group(1)}")
    m = re.search(r"Diesel Price.*?₹\s*([\d.]+)", html, re.I | re.S)
    if m:
        print(f"  Found Diesel: {m.group(1)}")

# Sources for Fuel
find_fuel(test_source("News18 Fuel", "https://www.news18.com/fuel-price/telangana/hyderabad.html"))
find_fuel(test_source("BankBazaar Fuel", "https://www.bankbazaar.com/fuel/petrol-price-hyderabad.html"))
find_fuel(test_source("GoodReturns Fuel", "https://www.goodreturns.in/petrol-price-in-hyderabad.html"))
