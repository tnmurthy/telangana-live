import requests, re, json
from datetime import datetime

def scrape_history():
    url = "https://www.bankbazaar.com/gold-rate-hyderabad.html"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    html = resp.text
    
    # Dates: DD MMM YYYY
    dates = re.findall(r'(\d+\s*[A-Z][a-z]+\s*\d{4})', html)
    # Prices: ₹ 14,XXX or ₹ 7,XXX
    # We need to find them in pairs or in the table block
    
    history = []
    # Try to find date followed by prices
    # Usually in a table: <tr><td>Date</td><td>24K</td><td>22K</td></tr>
    # But regex is easier if structure is consistent
    
    # Find all price-like strings
    all_prices = re.findall(r"₹\s*([\d,]+)", html)
    
    # BankBazaar typically has a history table where:
    # Date | 24K (8g or 1g) | 22K (8g or 1g)
    # Let's try to match them sequentially
    
    print(f"Found {len(dates)} dates and {len(all_prices)} prices.")
    
    # Start from where the 10-day history table likely begins
    # Usually around the 5th date found (after headers)
    for i in range(4, 11):
        if i < len(dates) and (i*2 + 1) < len(all_prices):
            date_str = dates[i]
            p24 = float(all_prices[i*2].replace(",", ""))
            p22 = float(all_prices[i*2 + 1].replace(",", ""))
            
            # Normalize to 1g
            p24_1g = p24 / 2 if p24 > 10000 else p24
            p22_1g = p22 / 2 if p22 > 10000 else p22
            
            # Convert date to YYYY-MM-DD
            try:
                dt = datetime.strptime(date_str, "%d %b %Y")
                history.append({
                    "date": dt.strftime("%Y-%m-%d"),
                    "gold22k": round(p22_1g, 2),
                    "gold24k": round(p24_1g, 2),
                    "silver": 0 # Silver usually separate
                })
            except:
                pass
                
    return sorted(history, key=lambda x: x["date"])

if __name__ == "__main__":
    h = scrape_history()
    print(json.dumps(h, indent=2))
