export const config = { runtime: 'edge' };

export default async function handler(req) {
    // Generate a static fallback panchang for 2026
    const data = {
        "year": 2083,
        "month": "Ashadha",
        "teluguMonth": "ఆషాఢ",
        "tithi": "Dashami",
        "paksha": "Shukla",
        "nakshatra": "Rohini",
        "yoga": "Siddhi",
        "karana": "Taitila",
        "sunrise": "05:40",
        "sunset": "18:50",
        "moonrise": "14:30",
        "moonset": "02:15",
        "rahu_kaal": "15:00 - 16:30",
        "abhijit": "11:45 - 12:30",
        "moonPhase": "Waxing (Shukla Paksha)",
        "festivals": [
            {"date": "June 03", "name": "Vibhuvana Sankashti", "significance": "Dedicated to Lord Ganesha for overcoming obstacles."},
            {"date": "June 07", "name": "Adhik Janmashtami", "significance": "Celebration of Lord Krishna's divine birth."}
        ],
        "rituals": [
            {"title": "Surya Arghya", "description": "Offer water to the Sun during sunrise for health and vitality."}
        ]
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=600',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
