import * as Astronomy from 'astronomy-engine';

// Today's panchang for Hyderabad, computed from the Sun's and Moon's
// positions (astronomy-engine). Elements are taken at local sunrise, as
// printed panchangams do. /api/panchang/today used to return one fixed
// reading (Ashadha, Dashami, Rohini, sunrise 05:40) every day.

export const HYDERABAD = { lat: 17.385, lon: 78.4867, elevation: 505 };

const IST_OFFSET_MIN = 330;

const TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
    'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
];
const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati',
];
const YOGAS = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula',
    'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyana',
    'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];
const MOVABLE_KARANAS = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti'];
// Amanta months, Chaitra first.
const MONTHS = [
    'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
    'Ashvayuja', 'Kartika', 'Margashira', 'Pushya', 'Magha', 'Phalguna',
];
const TELUGU_MONTHS = [
    'చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద',
    'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ',
];
// Rahu kaal: which eighth of the daytime, by weekday (Sunday first).
const RAHU_SEGMENT = [8, 2, 7, 5, 6, 4, 3];

const mod360 = (x) => ((x % 360) + 360) % 360;

/** Lahiri ayanamsa in degrees (linear fit; well under 0.01° error this century). */
export function lahiriAyanamsa(date) {
    const years = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400000);
    return 23.853 + 0.013969 * years;
}

const sunLon = (date) => Astronomy.SunPosition(date).elon;
const moonLon = (date) => Astronomy.EclipticGeoMoon(date).lon;

function istParts(date) {
    const ist = new Date(date.getTime() + IST_OFFSET_MIN * 60000);
    return { y: ist.getUTCFullYear(), m: ist.getUTCMonth(), d: ist.getUTCDate(), weekday: ist.getUTCDay() };
}

/** "HH:MM" in IST, or null. */
export function istClock(date) {
    if (!date) return null;
    const ist = new Date(date.getTime() + IST_OFFSET_MIN * 60000);
    return `${String(ist.getUTCHours()).padStart(2, '0')}:${String(ist.getUTCMinutes()).padStart(2, '0')}`;
}

/** Tithi, paksha, karana, nakshatra and yoga at one instant. */
export function elementsAt(date) {
    const sun = sunLon(date);
    const moon = moonLon(date);
    const ayan = lahiriAyanamsa(date);
    const elong = mod360(moon - sun);

    const tithiIndex = Math.floor(elong / 12); // 0..29
    const shukla = tithiIndex < 15;
    let tithi;
    if (tithiIndex === 14) tithi = 'Purnima';
    else if (tithiIndex === 29) tithi = 'Amavasya';
    else tithi = TITHIS[tithiIndex % 15];

    const half = Math.floor(elong / 6); // 0..59
    let karana;
    if (half === 0) karana = 'Kimstughna';
    else if (half >= 57) karana = ['Shakuni', 'Chatushpada', 'Naga'][half - 57];
    else karana = MOVABLE_KARANAS[(half - 1) % 7];

    const span = 360 / 27;
    return {
        tithi,
        tithiNumber: tithiIndex + 1,
        paksha: shukla ? 'Shukla' : 'Krishna',
        karana,
        nakshatra: NAKSHATRAS[Math.floor(mod360(moon - ayan) / span)],
        yoga: YOGAS[Math.floor(mod360(sun + moon - 2 * ayan) / span)],
    };
}

/** When the Moon next (days > 0) or last (days < 0) reaches a phase angle: 0 new, 180 full. */
export function moonPhaseTime(angle, from, days) {
    return Astronomy.SearchMoonPhase(angle, from, days).date;
}

function siderealSign(date) {
    return Math.floor(mod360(sunLon(date) - lahiriAyanamsa(date)) / 30);
}

/** Amanta lunar month for an instant, with the Adhika (leap) flag. */
export function lunarMonthAt(date) {
    const prevNewMoon = moonPhaseTime(0, date, -35);
    const nextNewMoon = moonPhaseTime(0, new Date(prevNewMoon.getTime() + 86400000), 35);
    const sign = siderealSign(prevNewMoon);
    const index = (sign + 1) % 12; // Sun in Meena at the new moon starts Chaitra
    return { index, adhika: siderealSign(nextNewMoon) === sign };
}

/**
 * Panchang for the IST calendar day containing `now`, at the given place.
 * Rise and set times may be null when a body does not rise or set that day.
 */
export function computePanchang(now = new Date(), place = HYDERABAD) {
    const observer = new Astronomy.Observer(place.lat, place.lon, place.elevation);
    const { y, m, d, weekday } = istParts(now);
    const dayStart = new Date(Date.UTC(y, m, d) - IST_OFFSET_MIN * 60000);
    const riseSet = (body, dir) => Astronomy.SearchRiseSet(body, observer, dir, dayStart, 1)?.date ?? null;

    const sunrise = riseSet(Astronomy.Body.Sun, +1);
    const sunset = riseSet(Astronomy.Body.Sun, -1);
    const at = sunrise ?? new Date(dayStart.getTime() + 6 * 3600000);
    const el = elementsAt(at);
    const month = lunarMonthAt(at);

    let rahu = null;
    let abhijit = null;
    if (sunrise && sunset) {
        const day = sunset - sunrise;
        const part = day / 8;
        const start = new Date(sunrise.getTime() + (RAHU_SEGMENT[weekday] - 1) * part);
        rahu = `${istClock(start)} - ${istClock(new Date(start.getTime() + part))}`;
        const muhurta = day / 15; // Abhijit is the 8th of 15 daytime muhurtas
        abhijit = `${istClock(new Date(sunrise.getTime() + 7 * muhurta))} - ${istClock(new Date(sunrise.getTime() + 8 * muhurta))}`;
    }

    // Vikram Samvat (Chaitradi): +57 from Chaitra Shukla Pratipada, else +56.
    const lateYearMonth = month.index >= 9 && m <= 3;
    const prefix = month.adhika ? 'Adhika ' : '';
    return {
        date: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        place: 'Hyderabad',
        year: y + (lateYearMonth ? 56 : 57),
        month: prefix + MONTHS[month.index],
        teluguMonth: (month.adhika ? 'అధిక ' : '') + TELUGU_MONTHS[month.index],
        tithi: el.tithi,
        paksha: el.paksha,
        nakshatra: el.nakshatra,
        yoga: el.yoga,
        karana: el.karana,
        sunrise: istClock(sunrise),
        sunset: istClock(sunset),
        moonrise: istClock(riseSet(Astronomy.Body.Moon, +1)),
        moonset: istClock(riseSet(Astronomy.Body.Moon, -1)),
        rahu_kaal: rahu,
        abhijit,
        moonPhase: el.paksha === 'Shukla' ? 'Waxing (Shukla Paksha)' : 'Waning (Krishna Paksha)',
        // No festival calendar or ritual source is connected yet.
        festivals: [],
        rituals: [],
        source: 'Computed from Sun and Moon positions (astronomy-engine), Lahiri ayanamsa, at sunrise in Hyderabad',
    };
}
