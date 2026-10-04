// Tech & AI Pulse feed (/data/tech_pulse.json), written by
// backend/scripts/tech_pulse.py on a schedule. Every item is a real, dated
// article. Freshness is checked again here so a feed that stopped updating
// shows an empty section rather than old news (docs/DATA_STANDARDS.md).

const FEED_URL = '/data/tech_pulse.json';
const CATEGORIES = ['safety', 'govt', 'jobs'];
const DEFAULT_MAX_AGE_DAYS = 14;
const DAY_MS = 86400000;

export async function loadTechPulse() {
    try {
        const response = await fetch(FEED_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Could not load the Tech & AI Pulse feed:', error);
        return null;
    }
}

export function freshItems(feed, now = new Date()) {
    const maxAgeDays = Number(feed?.maxAgeDays) || DEFAULT_MAX_AGE_DAYS;
    const cutoff = now.getTime() - maxAgeDays * DAY_MS;
    const categories = feed && typeof feed.categories === 'object' ? feed.categories : {};

    return Object.fromEntries(CATEGORIES.map((category) => {
        const items = Array.isArray(categories[category]) ? categories[category] : [];
        return [category, items.filter((item) => {
            const published = Date.parse(item?.publishedAt);
            return !Number.isNaN(published) && published >= cutoff;
        })];
    }));
}
