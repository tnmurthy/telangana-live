// api/gold-rates.js - Vercel Edge Function
// Fetches live Hyderabad gold & silver rates from multiple sources in order:
//   1. GoodReturns.in   – most accurate for local Hyderabad retail prices
//   2. metals.live + frankfurter.app – global spot price converted to INR (approximate)
//   3. BankBazaar.com   – alternative Indian market source
// Falls back to static FALLBACK only when all three sources fail.

export const config = { runtime: 'edge' };

const FALLBACK = {
  gold22k:    { price: 14000, unit: 'per gram',    change: null },  // Updated Apr 9, 2026
  gold24k:    { price: 15300, unit: 'per gram',    change: null },  // Updated Apr 9, 2026
  silver:     { price: 93.50, unit: 'per gram',     change: null },
  gold10g22k: { price: 140000, unit: 'per 10 grams', change: null },  // Updated Apr 9, 2026
  gold10g24k: { price: 153000, unit: 'per 10 grams', change: null },  // Updated Apr 9, 2026  lastUpdated: new Date().toISOString(),
  source: 'fallback',
};

// ── helpers ──────────────────────────────────────────────────────────────────
const parseNum   = (str) => str ? parseFloat(str.replace(/,/g, '')) : null;
const validGold  = (n)   => n != null && n > 4000  && n < 200000;
const validSilver = (n)  => n != null && n > 30    && n < 2000;
const normSilver  = (n)  => (n != null && n > 1000) ? n / 1000 : n; // per-kg → per-gram

// Try multiple regex patterns; return first valid match
function findPrice(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return parseNum(m[1]);
  }
  return null;
}

// Common two-directional patterns for "NNK … price" and "price … NNK"
const karat22Patterns = [
  /22\s*[Kk](?:arat)?\b[\s\S]{0,500}?(?:₹|Rs\.?\s*)([\d,]{4,})/,
  /(?:₹|Rs\.?\s*)([\d,]{4,})[\s\S]{0,100}22\s*[Kk](?:arat)?\b/,
];
const karat24Patterns = [
  /24\s*[Kk](?:arat)?\b[\s\S]{0,500}?(?:₹|Rs\.?\s*)([\d,]{4,})/,
  /(?:₹|Rs\.?\s*)([\d,]{4,})[\s\S]{0,100}24\s*[Kk](?:arat)?\b/,
];
const silverPatterns = [
  /[Ss]ilver\b[\s\S]{0,400}?(?:₹|Rs\.?\s*)([\d,]{2,})/,
  /(?:₹|Rs\.?\s*)([\d,]{2,})[\s\S]{0,100}[Ss]ilver\b/,
];

// ── Source 1: GoodReturns.in ─────────────────────────────────────────────────
async function fromGoodReturns() {
  const res = await fetch('https://www.goodreturns.in/gold-rates-in-hyderabad.html', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-IN,en;q=0.9',
      'Referer': 'https://www.google.com/',
    },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`GoodReturns HTTP ${res.status}`);
  const html = await res.text();

  const raw22   = findPrice(html, karat22Patterns);
  const raw24   = findPrice(html, karat24Patterns);
  const rawSil  = findPrice(html, silverPatterns);

  const gold22k = validGold(raw22)   ? raw22  : null;
  const gold24k = validGold(raw24)   ? raw24  : null;
  const silver  = validSilver(normSilver(rawSil)) ? normSilver(rawSil) : null;

  if (!gold22k && !gold24k) throw new Error('GoodReturns: no valid gold prices parsed');
  return { gold22k, gold24k, silver, source: 'goodreturns' };
}

// ── Source 2: metals.live + frankfurter.app (spot price → INR) ───────────────
// India retail ≈ international spot + ~10% customs duty + 3% GST + small margins
const INDIA_GOLD_PREMIUM   = 1.135; // 10% customs + 3% GST + ~0.35% misc
const INDIA_SILVER_PREMIUM = 1.03;  // 3% GST
const TROY_OZ_TO_GRAM      = 31.1035;

async function fromSpotPrice() {
  const [metalsRes, fxRes] = await Promise.all([
    fetch('https://metals.live/api/latest',                      { signal: AbortSignal.timeout(5000) }),
    fetch('https://api.frankfurter.app/latest?from=USD&to=INR', { signal: AbortSignal.timeout(5000) }),
  ]);
  if (!metalsRes.ok) throw new Error(`metals.live HTTP ${metalsRes.status}`);
  if (!fxRes.ok)     throw new Error(`frankfurter HTTP ${fxRes.status}`);

  const metals = await metalsRes.json();
  const fx     = await fxRes.json();

  const usdInr = fx?.rates?.INR;
  const xau    = metals?.xau; // gold  spot USD/troy oz
  const xag    = metals?.xag; // silver spot USD/troy oz

  if (!usdInr || !xau) throw new Error('Spot: incomplete API response');

  const gold24k = Math.round((xau * usdInr / TROY_OZ_TO_GRAM) * INDIA_GOLD_PREMIUM);
  const gold22k = Math.round(gold24k * 22 / 24);
  const silver  = xag
    ? Math.round((xag * usdInr / TROY_OZ_TO_GRAM) * INDIA_SILVER_PREMIUM * 100) / 100
    : null;

  if (!validGold(gold22k)) throw new Error('Spot: derived price out of valid range');
  return { gold22k, gold24k, silver, source: 'spot-derived' };
}

// ── Source 3: BankBazaar Hyderabad gold ──────────────────────────────────────
async function fromBankBazaar() {
  const res = await fetch('https://www.bankbazaar.com/gold-rate/hyderabad.html', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-IN,en;q=0.9',
    },
    signal: AbortSignal.timeout(7000),
  });
  if (!res.ok) throw new Error(`BankBazaar HTTP ${res.status}`);
  const html = await res.text();

  const raw22  = findPrice(html, karat22Patterns);
  const raw24  = findPrice(html, karat24Patterns);
  const rawSil = findPrice(html, silverPatterns);

  const gold22k = validGold(raw22)   ? raw22  : null;
  const gold24k = validGold(raw24)   ? raw24  : null;
  const silver  = validSilver(normSilver(rawSil)) ? normSilver(rawSil) : null;

  if (!gold22k && !gold24k) throw new Error('BankBazaar: no valid gold prices parsed');
  return { gold22k, gold24k, silver, source: 'bankbazaar' };
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(_req) {
  const sources = [fromGoodReturns, fromSpotPrice, fromBankBazaar];
  const collected = { gold22k: null, gold24k: null, silver: null, source: null };

  for (const fn of sources) {
    // Stop early once we have all three prices
    if (collected.gold22k && collected.gold24k && collected.silver) break;
    try {
      const d = await fn();
      collected.gold22k ??= d.gold22k;
      collected.gold24k ??= d.gold24k;
      collected.silver  ??= d.silver;
      collected.source  ??= d.source;
    } catch (err) {
      console.warn(`[gold-rates] ${fn.name} failed:`, err.message);
    }
  }

  // Fill any remaining gaps with FALLBACK values
  const gold22k = collected.gold22k ?? FALLBACK.gold22k.price;
  const gold24k = collected.gold24k ?? FALLBACK.gold24k.price;
  const silver  = collected.silver  ?? FALLBACK.silver.price;

  const data = {
    gold22k:    { price: gold22k,      unit: 'per gram',     change: null },
    gold24k:    { price: gold24k,      unit: 'per gram',     change: null },
    silver:     { price: silver,       unit: 'per gram',     change: null },
    gold10g22k: { price: gold22k * 10, unit: 'per 10 grams', change: null },
    gold10g24k: { price: gold24k * 10, unit: 'per 10 grams', change: null },
    lastUpdated: new Date().toISOString(),
    source: collected.source ?? 'fallback',
  };

  // Use a shorter cache TTL when we had to fall back so the next request retries sooner
  const isFullFallback = collected.source === null;
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': isFullFallback
        ? 's-maxage=300, stale-while-revalidate=60'
        : 's-maxage=3600, stale-while-revalidate=600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
