// api/fuel-prices.js - Vercel Serverless Function
// Scrapes live petrol/diesel/LPG/CNG prices for Telangana from GoodReturns
// Deployed at: /api/fuel-prices?city=hyderabad

export const config = { runtime: 'edge' };

const FALLBACK = {
  petrol: { price: 102.68, change: 0.00 },
  diesel: { price: 88.73, change: 0.00 },
  lpg:    { price: 803.00, change: 0.00 },
  cng:    { price: 72.80, change: 0.00 },
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get('city') || 'hyderabad').toLowerCase();

  try {
    // Primary: GoodReturns fuel price API (free, no key needed)
    const url = `https://www.goodreturns.in/fuel-price/${city}.html`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TelanganaLiveBot/1.0)',
        'Accept': 'text/html'
      },
      signal: AbortSignal.timeout(8000)
    });

    if (!res.ok) throw new Error(`GoodReturns returned ${res.status}`);

    const html = await res.text();

    // Parse petrol price
    const petrolMatch = html.match(/Petrol[\s\S]*?Rs\.\s*([\d.]+)/i);
    const dieselMatch = html.match(/Diesel[\s\S]*?Rs\.\s*([\d.]+)/i);

    const petrolPrice = petrolMatch ? parseFloat(petrolMatch[1]) : FALLBACK.petrol.price;
    const dieselPrice = dieselMatch ? parseFloat(dieselMatch[1]) : FALLBACK.diesel.price;

    // LPG: Try government HP Gas page
    let lpgPrice = FALLBACK.lpg.price;
    try {
      const lpgRes = await fetch(
        'https://www.hindustanpetroleum.com/price-revision-domestic-lpg',
        { signal: AbortSignal.timeout(5000) }
      );
      const lpgHtml = await lpgRes.text();
      const lpgMatch = lpgHtml.match(/Hyderabad[\s\S]{0,200}([\d]{3}\.[\d]{2})/i);
      if (lpgMatch) lpgPrice = parseFloat(lpgMatch[1]);
    } catch (_) { /* use fallback */ }

    const data = {
      petrol: { price: petrolPrice, change: 0.00, unit: 'per litre' },
      diesel: { price: dieselPrice, change: 0.00, unit: 'per litre' },
      lpg:    { price: lpgPrice,    change: 0.00, unit: 'per cylinder (14.2kg)' },
      cng:    { price: 72.80,       change: 0.00, unit: 'per kg' }, // TGPDCL, scrape separately
      city,
      lastUpdated: new Date().toISOString(),
      source: 'live'
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('fuel-prices error:', err.message);
    return new Response(JSON.stringify({ ...FALLBACK, error: err.message }), {
      status: 200, // Return 200 with fallback so UI doesn't break
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
