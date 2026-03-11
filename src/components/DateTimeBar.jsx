import { useState, useEffect } from 'react';

// Vikram Samvat month names (approximate mapping from Gregorian)
const VS_MONTHS = [
    'Pausha',      // Jan ~
    'Magha',       // Feb ~
    'Phalguna',    // Mar ~
    'Chaitra',     // Apr ~
    'Vaishakha',   // May ~
    'Jyeshtha',    // Jun ~
    'Ashadha',     // Jul ~
    'Shravana',    // Aug ~
    'Bhadrapada',  // Sep ~
    'Ashvina',     // Oct ~
    'Kartika',     // Nov ~
    'Margashirsha', // Dec ~
];

// Telugu month names
const TELUGU_MONTHS = [
    'పుష్య',       // Jan ~
    'మాఘ',         // Feb ~
    'ఫాల్గుణ',     // Mar ~
    'చైత్ర',       // Apr ~
    'వైశాఖ',       // May ~
    'జ్యేష్ఠ',     // Jun ~
    'ఆషాఢ',        // Jul ~
    'శ్రావణ',      // Aug ~
    'భాద్రపద',     // Sep ~
    'ఆశ్వయుజ',     // Oct ~
    'కార్తీక',     // Nov ~
    'మార్గశిర',    // Dec ~
];

// Weekday names in Telugu
const TELUGU_DAYS = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

function getVikramSamvatDate(date) {
    const gMonth = date.getMonth(); // 0-indexed
    const gDay = date.getDate();
    const gYear = date.getFullYear();

    // VS year is ~57 years ahead of Gregorian
    // New year starts around March/April (Chaitra)
    const vsYear = gMonth >= 3 ? gYear + 57 : gYear + 56;
    const vsMonth = VS_MONTHS[gMonth];
    const teluguMonth = TELUGU_MONTHS[gMonth];
    const teluguDay = TELUGU_DAYS[date.getDay()];

    // Tithi approximation (lunar day 1-30)
    const dayOfYear = Math.floor((date - new Date(gYear, 0, 0)) / 86400000);
    const tithi = ((dayOfYear * 12 + gDay) % 30) + 1;

    const tithiNames = [
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
        'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
        'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
        'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
    ];

    return {
        year: vsYear,
        month: vsMonth,
        teluguMonth,
        teluguDay,
        tithi: tithiNames[tithi - 1] || 'Pratipada',
    };
}

function formatGregorian(date) {
    const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-IN', opts);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export default function DateTimeBar() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const vs = getVikramSamvatDate(now);
    const gregorian = formatGregorian(now);
    const time = formatTime(now);

    return (
        <div className="bg-black/30 border-b border-white/[0.04]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
                {/* Gregorian */}
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="text-text-secondary font-medium">{gregorian}</span>
                    <span className="text-heritage-gold font-heading font-bold tabular-nums tracking-tight">{time}</span>
                </div>

                {/* Vikram Samvat + Telugu */}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-text-muted">
                    <span className="bg-heritage-gold/8 border border-heritage-gold/15 text-heritage-gold-light px-2 py-0.5 rounded-md font-medium">
                        {vs.teluguDay}
                    </span>
                    <span className="hidden sm:inline">|</span>
                    <span>
                        <span className="text-text-secondary">{vs.teluguMonth}</span>
                        <span className="mx-1 text-text-muted">·</span>
                        <span className="text-text-secondary">{vs.tithi}</span>
                        <span className="mx-1 text-text-muted">·</span>
                        <span className="gold-text font-semibold">VS {vs.year}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
