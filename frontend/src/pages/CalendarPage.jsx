import OfficialSource from '../components/OfficialSource';

// Listed 2026 holidays and festivals, several on the wrong dates (Milad-un-Nabi
// on 6 February, for one), with "days until" counts built on them (TL-47).
const SOURCES = [
    { name: 'Telangana State Portal', href: 'https://www.telangana.gov.in/', what: 'The General Administration Department publishes the year\'s public and optional holidays as a government order.' },
    { name: "Today's panchang", href: '/panchang', what: 'Tithi, nakshatra and festival days, computed daily for Hyderabad.' },
];

export default function CalendarPage() {
    return (
        <OfficialSource
            title="Holidays & Festivals"
            intro="Check the state's notified holiday list before you plan around a date. We don't publish our own holiday calendar."
            sources={SOURCES}
        />
    );
}
