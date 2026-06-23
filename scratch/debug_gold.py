import requests, re
url = "https://www.livemint.com/gold-prices/hyderabad"
resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
html = resp.text
print(f"Length: {len(html)}")
m_24 = re.search(r"24\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
if m_24:
    print(f"Found 24K: {m_24.group(1)}")
m_22 = re.search(r"22\s*Karat.*?₹\s*([\d,]+)", html, re.I | re.S)
if m_22:
    print(f"Found 22K: {m_22.group(1)}")

# Print a chunk around Karat
idx = html.find("24 Karat")
if idx != -1:
    print(f"Context: {html[idx:idx+200]}")
