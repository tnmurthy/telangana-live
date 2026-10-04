// api/fuel-prices.js - Vercel Serverless Function
// Scrapes live petrol/diesel (and LPG when available) prices from GoodReturns.
// Deployed at: /api/fuel-prices?city=hyderabad
//
// Returns only prices it actually read. If petrol or diesel cannot be read it
// answers 503 and the site falls back to the synced data file. It used to
// return fixed prices (petrol 102.68, ...) stamped with the current time, and
// always reported CNG as 72.80 (docs/DATA_STANDARDS.md, rule 1).

export const config = { runtime: 'edge' };

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

function unavailable(reason) {
  return new Response(JSON.stringify({ error: reason, source: 'unavailable' }), {
    status: 503,
    headers: { ...HEADERS, 'Cache-Control': 's-maxage=300' },
  });
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get('city') || 'hyderabad').toLowerCase();

  try {
    const res = await fetch(`https://www.goodreturns.in/fuel-price/${city}.html`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TelanganaLiveBot/1.0)', Accept: 'text/html' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return unavailable(`GoodReturns returned ${res.status}`);

    const html = await res.text();
    const petrolMatch = html.match(/Petrol[\s\S]*?Rs\.\s*([\d.]+)/i);
    const dieselMatch = html.match(/Diesel[\s\S]*?Rs\.\s*([\d.]+)/i);
    if (!petrolMatch || !dieselMatch) return unavailable('petrol or diesel price not found on page');

    const data = {
      petrol: { price: parseFloat(petrolMatch[1]), change: 0, unit: 'per litre' },
      diesel: { price: parseFloat(dieselMatch[1]), change: 0, unit: 'per litre' },
      city,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    };

    // LPG only when the HP Gas page states it; otherwise the field is omitted.
    try {
      const lpgRes = await fetch('https://www.hindustanpetroleum.com/price-revision-domestic-lpg', {
        signal: AbortSignal.timeout(5000),
      });
      const lpgMatch = (await lpgRes.text()).match(/Hyderabad[\s\S]{0,200}([\d]{3}\.[\d]{2})/i);
      if (lpgMatch) data.lpg = { price: parseFloat(lpgMatch[1]), change: 0, unit: 'per cylinder (14.2kg)' };
    } catch (_) { /* LPG omitted */ }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...HEADERS, 'Cache-Control': 's-maxage=3600, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('fuel-prices error:', err.message);
    return unavailable(err.message);
  }
}
