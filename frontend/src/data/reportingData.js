// Reporting categories and trifurcation boundary data
// Simplified polygon boundaries for GHMC/CMC/MMC auto-detection

export const reportCategories = [
    { id: 'roads', label: 'Roads & Footpaths', icon: '🛣️', color: '#F59E0B' },
    { id: 'water', label: 'Water & Drainage', icon: '💧', color: '#3B82F6' },
    { id: 'sanitation', label: 'Sanitation & Waste', icon: '🗑️', color: '#10B981' },
    { id: 'power', label: 'Power & Street Lights', icon: '⚡', color: '#EF4444' },
];

// Simplified trifurcation boundaries (bounding boxes for demo)
// In production, these would be full GeoJSON polygons
export const trifurcationBoundaries = {
    cmc: {
        name: 'Cyberabad Municipal Corporation (CMC)',
        shortName: 'CMC',
        // Western Hyderabad: Gachibowli, Madhapur, Kondapur, Miyapur, Kukatpally
        bounds: { minLat: 17.42, maxLat: 17.52, minLng: 78.32, maxLng: 78.42 },
        color: '#6366F1',
        commissioner: 'Cyberabad Zonal Commissioner',
        office: 'NAC Building, Gachibowli',
        portalUrl: 'https://cdma.telangana.gov.in/',
    },
    mmc: {
        name: 'Malkajgiri Municipal Corporation (MMC)',
        shortName: 'MMC',
        // Eastern Hyderabad: Malkajgiri, Secunderabad East, Uppal, Tarnaka
        bounds: { minLat: 17.42, maxLat: 17.52, minLng: 78.52, maxLng: 78.62 },
        color: '#EC4899',
        commissioner: 'Malkajgiri Zonal Commissioner',
        office: 'Commissioner Office, Tarnaka',
        portalUrl: 'https://cdma.telangana.gov.in/',
    },
    ghmc: {
        name: 'Greater Hyderabad Municipal Corporation (GHMC)',
        shortName: 'GHMC',
        // Central Hyderabad: Old City, Koti, Abids, Nampally
        bounds: { minLat: 17.35, maxLat: 17.42, minLng: 78.42, maxLng: 78.52 },
        color: '#F97316',
        commissioner: 'GHMC Commissioner',
        office: 'GHMC Head Office, Tank Bund Road',
        portalUrl: 'https://www.ghmc.gov.in/',
    },
};

// Detect which corporation a lat/lng falls under
export function detectCorporation(lat, lng) {
    for (const [key, corp] of Object.entries(trifurcationBoundaries)) {
        const { bounds } = corp;
        if (lat >= bounds.minLat && lat <= bounds.maxLat && lng >= bounds.minLng && lng <= bounds.maxLng) {
            return { key, ...corp };
        }
    }
    // Default to GHMC for any point in greater Hyderabad area
    return { key: 'ghmc', ...trifurcationBoundaries.ghmc };
}

// Mock existing reports for demo
export const mockReports = [
    { id: 1, lat: 17.4435, lng: 78.3772, category: 'roads', description: 'Pothole near Gachibowli flyover', status: 'assigned', corporation: 'CMC', date: '2026-03-08', ward: 142 },
    { id: 2, lat: 17.4512, lng: 78.3815, category: 'power', description: 'Street light not working near Cyber Towers', status: 'reported', corporation: 'CMC', date: '2026-03-09', ward: 145 },
    { id: 3, lat: 17.3850, lng: 78.4867, category: 'water', description: 'Water pipeline leak at Sultan Bazaar', status: 'resolved', corporation: 'GHMC', date: '2026-03-07', ward: 78 },
    { id: 4, lat: 17.4432, lng: 78.5543, category: 'sanitation', description: 'Garbage overflow at Malkajgiri bus stop', status: 'assigned', corporation: 'MMC', date: '2026-03-09', ward: 230 },
    { id: 5, lat: 17.3616, lng: 78.4747, category: 'roads', description: 'Broken footpath near Charminar', status: 'reported', corporation: 'GHMC', date: '2026-03-09', ward: 32 },
    { id: 6, lat: 17.4600, lng: 78.3600, category: 'water', description: 'Sewage overflow in Kondapur Colony', status: 'reported', corporation: 'CMC', date: '2026-03-10', ward: 150 },
    { id: 7, lat: 17.4480, lng: 78.5700, category: 'power', description: 'Transformer sparking in AS Rao Nagar', status: 'assigned', corporation: 'MMC', date: '2026-03-08', ward: 245 },
    { id: 8, lat: 17.3950, lng: 78.4500, category: 'sanitation', description: 'Open dumping near Nampally railway station', status: 'resolved', corporation: 'GHMC', date: '2026-03-06', ward: 65 },
];

export const statusSteps = [
    { key: 'reported', label: 'Reported', icon: '📝' },
    { key: 'assigned', label: 'Assigned', icon: '👷' },
    { key: 'resolved', label: 'Resolved', icon: '✅' },
];
