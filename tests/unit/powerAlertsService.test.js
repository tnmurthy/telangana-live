import { describe, it, expect, afterEach, vi } from 'vitest';

// powerAlertsService feeds the NewsTicker and CrisisDashboard. It used to
// return two invented shutdowns ("Jubilee Hills (Ward 10): Planned maintenance
// shutdown", ...) whenever its API call failed, which on the static site was
// always. These tests pin the rule from docs/DATA_STANDARDS.md: on any failure,
// return nothing rather than something made up.

const FEED = [
  {
    id: 'alert-aaa', type: 'power_outage', severity: 'medium',
    title: 'TGSPDCL announces 6-hour power shutdown in Nizamabad',
    message: 'TGSPDCL announces 6-hour power shutdown in Nizamabad',
    district: 'Nizamabad', time: '1 Oct, 3:00 PM IST',
    link: 'https://news.example/nizamabad', sourceLink: 'https://news.example/nizamabad',
  },
  {
    id: 'alert-bbb', type: 'flood', severity: 'high',
    title: 'Flash floods in Khammam', message: 'Flash floods in Khammam',
    district: 'Khammam', time: '1 Oct, 1:00 PM IST', link: 'https://news.example/khammam',
  },
];

function respond(body, { ok = true, status = 200, json = true } = {}) {
  return Promise.resolve({
    ok,
    status,
    json: json ? () => Promise.resolve(body) : () => Promise.reject(new SyntaxError('Unexpected token <')),
  });
}

async function load() {
  vi.resetModules();
  const { powerAlertsService } = await import('../../src/services/powerAlertsService.js');
  return powerAlertsService;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('powerAlertsService.getActiveAlerts', () => {
  it('reads the published alerts feed', async () => {
    global.fetch = vi.fn(() => respond(FEED));
    await (await load()).getActiveAlerts();
    expect(global.fetch).toHaveBeenCalledWith('/data/alerts.json');
  });

  it('returns only power outages, in ticker shape', async () => {
    global.fetch = vi.fn(() => respond(FEED));
    const alerts = await (await load()).getActiveAlerts();
    expect(alerts).toEqual([
      {
        id: 'alert-aaa',
        message: 'TGSPDCL announces 6-hour power shutdown in Nizamabad',
        time: '1 Oct, 3:00 PM IST',
        type: 'power',
        link: 'https://news.example/nizamabad',
        area: 'Nizamabad',
      },
    ]);
  });

  it('returns nothing when the feed has no power outages', async () => {
    global.fetch = vi.fn(() => respond([FEED[1]]));
    expect(await (await load()).getActiveAlerts()).toEqual([]);
  });

  it('returns nothing when the request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));
    expect(await (await load()).getActiveAlerts()).toEqual([]);
  });

  it('returns nothing on a non-OK response', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => respond(null, { ok: false, status: 404 }));
    expect(await (await load()).getActiveAlerts()).toEqual([]);
  });

  it('returns nothing when the response is HTML instead of JSON', async () => {
    // What actually happened in production: the SPA served index.html.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => respond(null, { json: false }));
    expect(await (await load()).getActiveAlerts()).toEqual([]);
  });

  it('never returns the old invented fallback alerts', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.reject(new Error('down')));
    const alerts = await (await load()).getActiveAlerts();
    expect(JSON.stringify(alerts)).not.toMatch(/Jubilee Hills|Banjara Hills|fallback-/);
  });
});
