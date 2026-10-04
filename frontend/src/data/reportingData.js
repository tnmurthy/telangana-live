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
export const statusSteps = [
    { key: 'reported', label: 'Reported', icon: '📝' },
    { key: 'assigned', label: 'Assigned', icon: '👷' },
    { key: 'resolved', label: 'Resolved', icon: '✅' },
];
