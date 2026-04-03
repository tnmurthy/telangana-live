import { useState, useEffect } from 'react';

const VS_MONTHS = ['Pausha', 'Magha', 'Phalguna', 'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika', 'Margashirsha'];
const TELUGU_MONTHS = ['పుష్య', 'మాఘ', 'ఫాల్గుణ', 'చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర'];
const TELUGU_DAYS = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

function getVikramSamvatDate(date) {
    const gMonth = date.getMonth();
    const gDay = date.getDate();
    const gYear = date.getFullYear();
    const vsYear = gMonth >= 3 ? gYear + 57 : gYear + 56;
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
        month: VS_MONTHS[gMonth],
        teluguMonth: TELUGU_MONTHS[gMonth],
        teluguDay: TELUGU_DAYS[date.getDay()],
        tithi: tithiNames[tithi - 1] || 'Pratipada',
    };
}

function formatGregorian(date) {
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
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
        <div className="bg-dark-bg-secondary/50 backdrop-blur-sm border-b border-white/[0.04]">
            <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
                {/* Gregorian */}
                <div className="flex items-center gap-3 text-xs">
                    <span className="text-text-secondary font-medium">{gregorian}</span>
                    <span className="text-heritage-gold font-heading font-bold tabular-nums tracking-tight text-sm">{time}</span>
                </div>

                {/* Vikram Samvat + Telugu */}
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                    <span className="bg-heritage-gold/8 border border-heritage-gold/15 text-heritage-gold-light px-2 py-0.5 rounded-md font-medium">
                        {vs.teluguDay}
                    </span>
                    <span className="hidden sm:inline text-white/10">|</span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-text-secondary">{vs.teluguMonth}</span>
                        <span className="text-white/10">·</span>
                        <span className="text-text-secondary">{vs.tithi}</span>
                        <span className="text-white/10">·</span>
                        <span className="gold-text font-semibold">VS {vs.year}</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
