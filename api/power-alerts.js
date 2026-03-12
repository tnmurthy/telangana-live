// api/power-alerts.js - Vercel Serverless Function
// Scrapes live power outage alerts from TSSPDCL & TSNPDCL
// Endpoint: /api/power-alerts?zone=hyderabad
// Also reads from Upstash Redis KV (populated by n8n scraper every 1 hour)

export const config = { runtime: 'edge' };

const FALLBACK_ALERTS = [
  {
    id: 'fallback-1',
    area: 'Service Unavailable',
    feeder: 'Unable to fetch live data',
    startTime: new Date().toISOString(),
    endTime: null,
    zone: 'all',
    source: 'fallback'
  }
];

async function fetchFromRedis(zone) {
  const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
  const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  try {
    const key = zone === 'all' ? 'power-alerts:all' : `power-alerts:${zone}`;
    const res = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      signal: AbortSignal.timeout(3000)
    });
    const json = await res.json();
    if (json.result) return JSON.parse(json.result);
  } catch (_) { /* fallthrough to live scrape */ }
  return null;
}

async function scrapeFromTSSPDCL() {
  const res = await fetch(
    'https://www.tssouthernpower.com/powerinterruptionnotice.jsp',
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TelanganaLiveBot/1.0)',
        'Accept': 'text/html'
      },
      signal: AbortSignal.timeout(10000)
    }
  );
  if (!res.ok) throw new Error(`TSSPDCL returned ${res.status}`);
  const html = await res.text();

  const alerts = [];
  // Match table rows with power cut info
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let rowMatch;
  let rowCount = 0;

  while ((rowMatch = rowRegex.exec(html)) !== null && rowCount < 50) {
    const cells = [];
    let cellMatch;
    const cellReg = new RegExp(cellRegex.source, 'gi');
    while ((cellMatch = cellReg.exec(rowMatch[1])) !== null) {
      cells.push(cellMatch[1].replace(/<[^>]+>/g, '').trim());
    }

    if (cells.length >= 3 && cells[0] && cells[1]) {
      alerts.push({
        id: `tsspdcl-${rowCount}`,
        area: cells[0] || '',
        feeder: cells[1] || '',
        startTime: cells[2] || '',
        endTime: cells[3] || '',
        zone: 'hyderabad',
        source: 'tsspdcl'
      });
      rowCount++;
    }
  }

  return alerts.filter(a => a.area.length > 2);
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const zone = (searchParams.get('zone') || 'all').toLowerCase();

  // 1. Try Redis first (populated by n8n hourly)
  const cached = await fetchFromRedis(zone);
  if (cached && cached.length > 0) {
    return new Response(JSON.stringify({ alerts: cached, source: 'redis-cache' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=900, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // 2. Live scrape from TSSPDCL
  try {
    const alerts = await scrapeFromTSSPDCL();
    const filtered = zone === 'all' ? alerts : alerts.filter(a => a.zone === zone);

    return new Response(JSON.stringify({
      alerts: filtered.length > 0 ? filtered : FALLBACK_ALERTS,
      source: 'live-scrape',
      count: filtered.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=900',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('power-alerts error:', err.message);
    return new Response(JSON.stringify({ alerts: FALLBACK_ALERTS, error: err.message }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
