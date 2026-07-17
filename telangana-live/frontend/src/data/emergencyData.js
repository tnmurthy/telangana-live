// Emergency contacts — verified 2026 data
// Regional routing: /malkajgiri prioritizes MMC contact

export const emergencyContacts = {
    general: [
        { name: 'NDRF Telangana', number: '83330 68536', icon: 'Emergency', priority: 1 },
        { name: 'GHMC (General/Flood)', number: '21111111', icon: 'Heritage', priority: 2 },
        { name: 'DRF (Disaster Rescue)', number: '90001 13667', icon: 'Fire', priority: 3 },
        { name: 'Power Outages', number: '1912', icon: 'Power', priority: 4 },
        { name: 'Heatstroke Helpline', number: '108', icon: 'Ambulance', priority: 5 },
    ],
    regional: {
        malkajgiri: { name: 'MMC (Malkajgiri Municipal Corp)', number: '87126 99165', icon: 'Govt', desc: 'Residential/East focus' },
        cyberabad: { name: 'CMC (Cyberabad Municipal Corp)', number: '040-2785 2000', icon: 'Govt', desc: 'IT corridor focus' },
        hyderabad: { name: 'GHMC Central Office', number: '040-2326 1555', icon: 'Govt', desc: 'Central Hyderabad' },
    },
};

// Trifurcated corporation data (GHMC split in 2026)
export const corporations = {
    hyderabad: {
        name: 'GHMC (Residual)',
        fullName: 'Greater Hyderabad Municipal Corporation',
        area: 'Central Hyderabad',
        focus: 'Heritage, Old City, Secunderabad core',
        contact: '040-2326 1555',
        zones: ['Charminar', 'Khairatabad', 'Secunderabad', 'Kukatpally'],
    },
    cyberabad: {
        name: 'CMC',
        fullName: 'Cyberabad Municipal Corporation',
        area: 'IT Corridor — Gachibowli to Shamshabad',
        focus: 'IT Parks, Coworking, Real Estate, Financial District',
        contact: '040-2785 2000',
        zones: ['Madhapur', 'Gachibowli', 'Kondapur', 'Nanakramguda', 'Shamshabad'],
    },
    malkajgiri: {
        name: 'MMC',
        fullName: 'Malkajgiri Municipal Corporation',
        area: 'East & Northeast Hyderabad',
        focus: 'Residential, Cantonment, Defence areas',
        contact: '87126 99165',
        zones: ['Malkajgiri', 'Uppal', 'LB Nagar', 'Alwal', 'Kompally', 'Medchal'],
    },
};

// Heatwave data for cooling dashboard
export const heatwaveData = {
    currentTemp: 39, // IMD Begumpet reading
    feelsLike: 43,
    uvIndex: 11, // extreme
    uvLabel: 'Extreme',
    uvWarning: 'Avoid sun 12 PM – 4 PM',
    imdStation: 'IMD Begumpet',
    lastUpdated: '2026-03-09 14:30 IST',
    orsPoints: [
        { name: 'Nampally ORS Center', area: 'Nampally', distance: '2.1 km' },
        { name: 'Secunderabad Civil Hospital', area: 'Secunderabad', distance: '3.4 km' },
        { name: 'Gandhi Hospital ORS', area: 'Musheerabad', distance: '4.0 km' },
        { name: 'Fever Hospital ORS', area: 'Nallakunta', distance: '2.8 km' },
        { name: 'Osmania General Hospital', area: 'Afzalgunj', distance: '1.5 km' },
    ],
};
