// Hyderabad Metro lines. Crowd levels, peak hours, station counts, a
// "takeover completed March 2026" banner, ridership and an MMTS timetable used
// to be here; none was sourced and some were wrong (TL-47).
export const metroData = {
    lines: [
        { name: 'Red Line', route: 'Miyapur ↔ LB Nagar', color: '#EF4444' },
        { name: 'Blue Line', route: 'Nagole ↔ Raidurg', color: '#3B82F6' },
        { name: 'Green Line', route: 'JBS ↔ MGBS', color: '#22C55E' },
    ],
};

// Patterned phone numbers (040-2796 1111, ... 0000) and timings were removed;
// they were not real (TL-47). Check the clinic on Google Maps before visiting.
export const basthiDawakhanas = [
    { name: 'Basthi Dawakhana Kushaiguda', area: 'Kushaiguda', zone: 'malkajgiri' },
    { name: 'Basthi Dawakhana Vanasthalipuram', area: 'Vanasthalipuram', zone: 'malkajgiri' },
    { name: 'Basthi Dawakhana Kondapur', area: 'Kondapur', zone: 'cyberabad' },
    { name: 'Basthi Dawakhana Madhapur', area: 'Madhapur', zone: 'cyberabad' },
    { name: 'Basthi Dawakhana Charminar', area: 'Charminar', zone: 'hyderabad' },
    { name: 'Basthi Dawakhana Musheerabad', area: 'Musheerabad', zone: 'hyderabad' },
    { name: 'Basthi Dawakhana Uppal', area: 'Uppal', zone: 'malkajgiri' },
    { name: 'Basthi Dawakhana Kukatpally', area: 'Kukatpally', zone: 'hyderabad' },
    { name: 'Basthi Dawakhana Shamshabad', area: 'Shamshabad', zone: 'cyberabad' },
    { name: 'Basthi Dawakhana LB Nagar', area: 'LB Nagar', zone: 'malkajgiri' },
];
