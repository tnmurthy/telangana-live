import requests, re
from bs4 import BeautifulSoup
url = "https://www.livemint.com/gold-prices/hyderabad"
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
html = resp.text
soup = BeautifulSoup(html, "html.parser")
rows = soup.find_all("tr")
for row in rows:
    text = row.get_text(" ", strip=True)
    if "Gram" in text:
        print(f"Row: {text}")
