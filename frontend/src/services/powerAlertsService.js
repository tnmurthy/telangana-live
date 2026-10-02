// Power alerts for the NewsTicker and CrisisDashboard, read from the published
// civic alerts feed (/data/alerts.json, written by
// backend/scripts/emergency_alerts.py). This is a static site with no runtime
// API; the previous version called /api/civic/alerts, which returns the SPA's
// HTML, and then fell back to two invented shutdowns on every page load.
//
// On any failure, or when there are no power outages, return [] — never a
// made-up alert (docs/DATA_STANDARDS.md, rule 1).

const FEED_URL = '/data/alerts.json';

export const powerAlertsService = {
    async getActiveAlerts() {
        try {
            const response = await fetch(FEED_URL);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data)) return [];

            return data
                .filter(item => item.type === 'power_outage')
                .map(item => ({
                    id: item.id,
                    message: item.title || item.message,
                    time: item.time,
                    type: 'power', // ticker colour and icon key
                    link: item.link || item.sourceLink || null,
                    area: item.district || 'Telangana',
                }));
        } catch (error) {
            console.error('Could not load the power alerts feed:', error);
            return [];
        }
    }
};
