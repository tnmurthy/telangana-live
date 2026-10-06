// Status band for a reservoir reading. The hard-coded "as of April 5, 2026"
// levels that used to sit here were not from any bulletin, and were removed.
export function getReservoirStatus(reservoir) {
    const pct = (reservoir.currentLevelTMC / reservoir.fullCapacityTMC) * 100;
    if (reservoir.state === 'flood') return { color: '#EF4444', label: 'Flood Alert', pct };
    if (pct < 30) return { color: '#EF4444', label: 'Critical Low', pct };
    if (pct < 50) return { color: '#F97316', label: 'Low', pct };
    if (pct < 70) return { color: '#EAB308', label: 'Moderate', pct };
    if (pct < 90) return { color: '#22C55E', label: 'Good', pct };
    return { color: '#3B82F6', label: 'Near Full', pct };
}
