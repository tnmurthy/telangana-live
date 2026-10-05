// Official (NDMA SACHET) alerts carry the issuing authority's own end time as
// expiresAt. The feed is baked into the build, so a page loaded after that
// time must hide the alert itself rather than wait for the next sync.

const IST_TIME = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
});

function parse(iso) {
    const ms = Date.parse(iso);
    return Number.isNaN(ms) ? null : ms;
}

/** Alerts still in force at `now`; alerts without expiresAt are kept. */
export function activeAlerts(alerts, now = new Date()) {
    if (!Array.isArray(alerts)) return [];
    return alerts.filter((alert) => {
        if (!alert.expiresAt) return true;
        const ends = parse(alert.expiresAt);
        return ends !== null && ends > now.getTime();
    });
}

/** "until 9:30 AM IST", or '' when there is no readable expiry. */
export function untilLabel(expiresAt) {
    const ends = expiresAt ? parse(expiresAt) : null;
    if (ends === null) return '';
    return `until ${IST_TIME.format(new Date(ends)).toUpperCase()} IST`;
}
