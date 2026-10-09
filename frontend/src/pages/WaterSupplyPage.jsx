import OfficialSource from '../components/OfficialSource';

// Showed supply days and timings for each area, dated April 2026, that were made up. (TL-47)
const SOURCES = [
    { name: "HMWSSB (Hyderabad Water Board)", href: "https://www.hyderabadwater.gov.in/", what: "Supply schedules, complaints (155313) and bill payment." },
];

export default function WaterSupplyPage() {
    return (
        <OfficialSource
            title="Water Supply"
            intro="Supply timings, complaints and new connections are handled by HMWSSB. We don't publish supply schedules."
            sources={SOURCES}
        />
    );
}
