// api/gold-rates.js - Vercel Serverless Function
// Fetches live gold & silver rates for Hyderabad from GoodReturns
// Endpoint: /api/gold-rates

export const config = { runtime: 'edge' };

const FALLBACK = {
  gold22k: { price: 7180, unit: 'per gram', change: 0 },
  gold24k: { price: 7830, unit: 'per gram', change: 0 },
  silver:  { price: 93.50, unit: 'per gram', change: 0 },
  gold10g22k: { price: 71800, unit: 'per 10 grams', change: 0 },
  gold10g24k: { price: 78300, unit: 'per 10 grams', change: 0 },
  lastUpdated: new Date().toISOString(),
  source: 'fallback'
};

export default async function handler(req) {
  try {
    // GoodReturns gold price page for Hyderabad
    const res = await fetch(
      'https://www.goodreturns.in/gold-rates-in-hyderabad.html',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TelanganaLiveBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml'
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!res.ok) throw new Error(`GoodReturns returned ${res.status}`);

    const html = await res.text();

    // Parse 22K gold (most common for jewelry in Telangana)
    const gold22Match = html.match(/22\s*K[\s\S]{0,300}Rs\.?\s*([\d,]+)/i);
    const gold24Match = html.match(/24\s*K[\s\S]{0,300}Rs\.?\s*([\d,]+)/i);
    const silverMatch = html.match(/Silver[\s\S]{0,300}Rs\.?\s*([\d,]+)/i);

    const parsePrice = (match) =>
      match ? parseFloat(match[1].replace(/,/g, '')) : null;

    const raw22k = parsePrice(gold22Match);
    const raw24k = parsePrice(gold24Match);
    const rawSilver = parsePrice(silverMatch);

    // GoodReturns usually shows price per gram for gold
    // Validate: 22K gold should be between 5000-12000 per gram
    const gold22k = raw22k && raw22k > 1000 && raw22k < 100000
      ? (raw22k > 5000 ? raw22k : raw22k * 10)  // normalize to per gram if needed
      : FALLBACK.gold22k.price;

    const gold24k = raw24k && raw24k > 1000 && raw24k < 100000
      ? (raw24k > 5000 ? raw24k : raw24k * 10)
      : FALLBACK.gold24k.price;

    const silver = rawSilver && rawSilver > 50 && rawSilver < 5000
      ? rawSilver
      : FALLBACK.silver.price;

    const data = {
      gold22k:     { price: gold22k,      unit: 'per gram',     change: 0 },
      gold24k:     { price: gold24k,      unit: 'per gram',     change: 0 },
      silver:      { price: silver,       unit: 'per gram',     change: 0 },
      gold10g22k:  { price: gold22k * 10, unit: 'per 10 grams', change: 0 },
      gold10g24k:  { price: gold24k * 10, unit: 'per 10 grams', change: 0 },
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
    console.error('gold-rates error:', err.message);
    return new Response(JSON.stringify({ ...FALLBACK, error: err.message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
