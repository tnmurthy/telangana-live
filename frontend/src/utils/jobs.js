// Jobs board helpers (TL-28). The page used to count days from a hard-coded
// "today" (4 Apr 2026), so notifications that closed in April and May were
// still shown as live openings with "Apply Now".

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole days from today until the closing date (negative once passed). */
export function daysUntil(dateStr, today = new Date()) {
    const [y, m, d] = (dateStr || '').split('-').map(Number);
    if (!y || !m || !d) return Number.NaN;
    return Math.round((new Date(y, m - 1, d) - startOfDay(today)) / DAY_MS);
}

/** Listings whose closing date is today or later. */
export function openListings(jobs, today = new Date()) {
    return jobs.filter((job) => daysUntil(job.lastDate, today) >= 0);
}

/** Each organisation's official recruitment page, once, sorted by name. */
export function recruitmentPortals(jobs) {
    const byOrg = new Map();
    for (const job of jobs) {
        if (job.applyUrl && !byOrg.has(job.organization)) {
            byOrg.set(job.organization, { organization: job.organization, url: job.applyUrl, type: job.type });
        }
    }
    return [...byOrg.values()].sort((a, b) => a.organization.localeCompare(b.organization));
}
