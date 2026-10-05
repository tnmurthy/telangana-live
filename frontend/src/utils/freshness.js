// How current a module's data is, from its own timestamp.
// Mirrors backend/scripts/check_freshness.py, which fails the daily check
// when a module passes the same limit.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @param {string} timestamp ISO time or date the data was last updated
 * @param {number} maxAgeHours older than this is stale
 * @returns {{ stale: boolean, text: string }}
 */
export function freshness(timestamp, maxAgeHours, now = new Date()) {
    const updated = new Date(timestamp);
    if (!timestamp || Number.isNaN(updated.getTime())) {
        return { stale: true, text: 'Update time unknown' };
    }
    const ageMs = now.getTime() - updated.getTime();
    if (ageMs > maxAgeHours * 3600 * 1000) {
        const ist = new Date(updated.getTime() + 5.5 * 3600 * 1000);
        const date = `${ist.getUTCDate()} ${MONTHS[ist.getUTCMonth()]} ${ist.getUTCFullYear()}`;
        return { stale: true, text: `Last updated ${date}, may be out of date` };
    }
    const minutes = Math.max(0, Math.round(ageMs / 60000));
    if (minutes < 60) return { stale: false, text: `Updated ${minutes} min ago` };
    return { stale: false, text: `Updated ${Math.floor(minutes / 60)} h ago` };
}
