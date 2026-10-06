// Indian National AQI (CPCB): the worst sub-index across the pollutants we
// have. Breakpoints are µg/m³ (CPCB defines them on 24-hour averages; a
// single current reading gives an indicative value). Replaces an invented
// "PM2.5 x 4.2" conversion and a default of "Good" when no data came back.

const BREAKPOINTS = {
    pm2_5: [[0, 30, 0, 50], [31, 60, 51, 100], [61, 90, 101, 200], [91, 120, 201, 300], [121, 250, 301, 400], [251, 500, 401, 500]],
    pm10: [[0, 50, 0, 50], [51, 100, 51, 100], [101, 250, 101, 200], [251, 350, 201, 300], [351, 430, 301, 400], [431, 600, 401, 500]],
};

const BANDS = [
    [50, 'Good', '#22C55E'],
    [100, 'Satisfactory', '#84CC16'],
    [200, 'Moderate', '#EAB308'],
    [300, 'Poor', '#F97316'],
    [400, 'Very Poor', '#EF4444'],
    [Infinity, 'Severe', '#991B1B'],
];

function subIndex(pollutant, concentration) {
    const c = Math.round(concentration);
    for (const [cLo, cHi, iLo, iHi] of BREAKPOINTS[pollutant]) {
        if (c <= cHi) return Math.round(iLo + ((iHi - iLo) * (Math.max(c, cLo) - cLo)) / (cHi - cLo));
    }
    return 500;
}

/** CPCB AQI from PM2.5 and PM10 (either may be missing); null when neither is known. */
export function indianAqi({ pm2_5, pm10 } = {}) {
    const subs = [['pm2_5', pm2_5], ['pm10', pm10]]
        .filter(([, v]) => typeof v === 'number' && Number.isFinite(v))
        .map(([name, v]) => subIndex(name, v));
    return subs.length ? Math.max(...subs) : null;
}

/** { label, color } for an AQI value, or nulls when there is no value. */
export function aqiBand(aqi) {
    if (aqi == null) return { label: null, color: null };
    const [, label, color] = BANDS.find(([max]) => aqi <= max);
    return { label, color };
}
