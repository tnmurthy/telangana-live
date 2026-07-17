// Metro Phase 1 data — March 2026 (Govt takeover from L&T → HMRL)
export const metroData = {
    status: 'operational',
    takeover: {
        headline: 'Metro Phase 1: Transitioning to State Govt (HMRL) Control',
        detail: 'Operations Normal — L&T Metro handover to Hyderabad Metro Rail Limited (HMRL) completed March 2026',
        date: 'March 2026',
    },
    lines: [
        {
            name: 'Red Line',
            route: 'Miyapur ↔ LB Nagar',
            stations: 27,
            color: '#EF4444',
            crowdLevel: 72, // percentage
            crowdLabel: 'Moderate',
            peakHours: '8:30 AM – 10:30 AM, 5:30 PM – 8:00 PM',
        },
        {
            name: 'Blue Line',
            route: 'Nagole ↔ Raidurg',
            stations: 16,
            color: '#3B82F6',
            crowdLevel: 85,
            crowdLabel: 'Crowded',
            peakHours: '8:00 AM – 10:00 AM, 5:00 PM – 7:30 PM',
        },
        {
            name: 'Green Line',
            route: 'JBS ↔ MGBS',
            stations: 5,
            color: '#22C55E',
            crowdLevel: 45,
            crowdLabel: 'Low',
            peakHours: '9:00 AM – 11:00 AM',
        },
    ],
    ridership2026: '5.2 lakh/day avg',
};

// MMTS data with Ladies Special
export const mmtsData = {
    routes: [
        {
            name: 'Lingampally — Falaknuma',
            stops: ['Lingampally', 'HITEC City', 'Begumpet', 'Secunderabad', 'Kacheguda', 'Falaknuma'],
            frequency: 'Every 30 min (peak)',
        },
        {
            name: 'Secunderabad — Cherlapally',
            stops: ['Secunderabad', 'Malkajgiri', 'Moula-Ali', 'Safilguda', 'Cherlapally Terminal'],
            frequency: 'Every 20 min (peak)',
            highlight: true,
            highlightNote: 'Cherlapally Terminal — Major hub for East Hyderabad (2026)',
            highlightIcon: 'Construction',
        },
    ],
    ladiesSpecial: {
        name: 'Matru Bhoomi Ladies Special',
        route: 'Falaknuma → Secunderabad → Malkajgiri → Cherlapally',
        timings: ['6:30 AM', '8:15 AM', '5:45 PM', '7:30 PM'],
        note: 'Dedicated coaches for women commuters on Malkajgiri & Cyberabad routes',
        icon: 'Ladies',
    },
};

// Basthi Dawakhana 2026 locations
export const basthiDawakhanas = [
    { name: 'Basthi Dawakhana Kushaiguda', area: 'Kushaiguda', zone: 'malkajgiri', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2796 1111' },
    { name: 'Basthi Dawakhana Vanasthalipuram', area: 'Vanasthalipuram', zone: 'malkajgiri', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2407 2222' },
    { name: 'Basthi Dawakhana Kondapur', area: 'Kondapur', zone: 'cyberabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2311 3333' },
    { name: 'Basthi Dawakhana Madhapur', area: 'Madhapur', zone: 'cyberabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2311 4444' },
    { name: 'Basthi Dawakhana Charminar', area: 'Charminar', zone: 'hyderabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2452 5555' },
    { name: 'Basthi Dawakhana Musheerabad', area: 'Musheerabad', zone: 'hyderabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2760 6666' },
    { name: 'Basthi Dawakhana Uppal', area: 'Uppal', zone: 'malkajgiri', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2720 7777' },
    { name: 'Basthi Dawakhana Kukatpally', area: 'Kukatpally', zone: 'hyderabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2305 8888' },
    { name: 'Basthi Dawakhana Shamshabad', area: 'Shamshabad', zone: 'cyberabad', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2402 9999' },
    { name: 'Basthi Dawakhana LB Nagar', area: 'LB Nagar', zone: 'malkajgiri', timings: '9 AM – 1 PM, 4 PM – 9 PM', phone: '040-2408 0000' },
];
