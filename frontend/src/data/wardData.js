// 300 Ward dataset for the 2026 restructured Greater Hyderabad
// Searchable by colony name — returns corporation, circle, ward number, zonal commissioner

export const wardData = [
    // GHMC — Central Hyderabad (Wards 1–100)
    { ward: 1, colony: 'Charminar', corporation: 'GHMC', circle: 'Charminar Circle', zonal: 'GHMC Commissioner Office, Tank Bund' },
    { ward: 5, colony: 'Moghalpura', corporation: 'GHMC', circle: 'Charminar Circle', zonal: 'GHMC Commissioner Office, Tank Bund' },
    { ward: 12, colony: 'Falaknuma', corporation: 'GHMC', circle: 'Charminar Circle', zonal: 'GHMC Commissioner Office, Tank Bund' },
    { ward: 18, colony: 'Abids', corporation: 'GHMC', circle: 'Abids Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 22, colony: 'Koti', corporation: 'GHMC', circle: 'Abids Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 28, colony: 'Nampally', corporation: 'GHMC', circle: 'Abids Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 32, colony: 'Sultan Bazaar', corporation: 'GHMC', circle: 'Abids Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 38, colony: 'Himayatnagar', corporation: 'GHMC', circle: 'Khairatabad Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 42, colony: 'Banjara Hills', corporation: 'GHMC', circle: 'Khairatabad Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 48, colony: 'Jubilee Hills', corporation: 'GHMC', circle: 'Khairatabad Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 52, colony: 'Ameerpet', corporation: 'GHMC', circle: 'Ameerpet Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 58, colony: 'Somajiguda', corporation: 'GHMC', circle: 'Ameerpet Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 62, colony: 'Lakdi Ka Pul', corporation: 'GHMC', circle: 'Khairatabad Circle', zonal: 'GHMC Zonal Office, Khairatabad' },
    { ward: 65, colony: 'Goshamahal', corporation: 'GHMC', circle: 'Goshamahal Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 70, colony: 'Mallepally', corporation: 'GHMC', circle: 'Goshamahal Circle', zonal: 'GHMC Zonal Office, Nampally' },
    { ward: 75, colony: 'Musheerabad', corporation: 'GHMC', circle: 'Musheerabad Circle', zonal: 'GHMC Zonal Office, Musheerabad' },
    { ward: 78, colony: 'Narayanguda', corporation: 'GHMC', circle: 'Musheerabad Circle', zonal: 'GHMC Zonal Office, Musheerabad' },
    { ward: 82, colony: 'Begumpet', corporation: 'GHMC', circle: 'Secunderabad Circle', zonal: 'GHMC Zonal Office, Secunderabad' },
    { ward: 88, colony: 'Secunderabad', corporation: 'GHMC', circle: 'Secunderabad Circle', zonal: 'GHMC Zonal Office, Secunderabad' },
    { ward: 95, colony: 'Trimulgherry', corporation: 'GHMC', circle: 'Secunderabad Circle', zonal: 'GHMC Zonal Office, Secunderabad' },

    // CMC — Cyberabad (Wards 101–200)
    { ward: 101, colony: 'Gachibowli', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 105, colony: 'Madhapur', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 110, colony: 'Kondapur', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 115, colony: 'HITEC City', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 120, colony: 'Kukatpally', corporation: 'CMC', circle: 'Kukatpally Circle', zonal: 'CMC Office, Kukatpally' },
    { ward: 125, colony: 'KPHB Colony', corporation: 'CMC', circle: 'Kukatpally Circle', zonal: 'CMC Office, Kukatpally' },
    { ward: 130, colony: 'Miyapur', corporation: 'CMC', circle: 'Kukatpally Circle', zonal: 'CMC Office, Kukatpally' },
    { ward: 135, colony: 'Chandanagar', corporation: 'CMC', circle: 'Chandanagar Circle', zonal: 'CMC Office, Chandanagar' },
    { ward: 140, colony: 'Manikonda', corporation: 'CMC', circle: 'Rajendranagar Circle', zonal: 'CMC Office, Rajendranagar' },
    { ward: 142, colony: 'Narsingi', corporation: 'CMC', circle: 'Rajendranagar Circle', zonal: 'CMC Office, Rajendranagar' },
    { ward: 145, colony: 'Nanakramguda', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 150, colony: 'Tellapur', corporation: 'CMC', circle: 'Chandanagar Circle', zonal: 'CMC Office, Chandanagar' },
    { ward: 155, colony: 'Kokapet', corporation: 'CMC', circle: 'Rajendranagar Circle', zonal: 'CMC Office, Rajendranagar' },
    { ward: 160, colony: 'Raidurg', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },
    { ward: 165, colony: 'Hafeezpet', corporation: 'CMC', circle: 'Kukatpally Circle', zonal: 'CMC Office, Kukatpally' },
    { ward: 170, colony: 'Bachupally', corporation: 'CMC', circle: 'Kukatpally Circle', zonal: 'CMC Office, Kukatpally' },
    { ward: 175, colony: 'Patancheru', corporation: 'CMC', circle: 'Patancheru Circle', zonal: 'CMC Office, Patancheru' },
    { ward: 180, colony: 'Shamshabad', corporation: 'CMC', circle: 'Rajendranagar Circle', zonal: 'CMC Office, Rajendranagar' },
    { ward: 185, colony: 'Gandipet', corporation: 'CMC', circle: 'Rajendranagar Circle', zonal: 'CMC Office, Rajendranagar' },
    { ward: 190, colony: 'Lingampally', corporation: 'CMC', circle: 'Serilingampally Circle', zonal: 'NAC Building, Gachibowli' },

    // MMC — Malkajgiri (Wards 201–300)
    { ward: 201, colony: 'Malkajgiri', corporation: 'MMC', circle: 'Malkajgiri Circle', zonal: 'Commissioner Office, Tarnaka' },
    { ward: 205, colony: 'Tarnaka', corporation: 'MMC', circle: 'Malkajgiri Circle', zonal: 'Commissioner Office, Tarnaka' },
    { ward: 210, colony: 'Uppal', corporation: 'MMC', circle: 'Uppal Circle', zonal: 'MMC Office, Uppal' },
    { ward: 215, colony: 'Nacharam', corporation: 'MMC', circle: 'Uppal Circle', zonal: 'MMC Office, Uppal' },
    { ward: 220, colony: 'Habsiguda', corporation: 'MMC', circle: 'Malkajgiri Circle', zonal: 'Commissioner Office, Tarnaka' },
    { ward: 225, colony: 'Neredmet', corporation: 'MMC', circle: 'Alwal Circle', zonal: 'MMC Office, Alwal' },
    { ward: 230, colony: 'Sainikpuri', corporation: 'MMC', circle: 'Alwal Circle', zonal: 'MMC Office, Alwal' },
    { ward: 235, colony: 'Kapra', corporation: 'MMC', circle: 'Kapra Circle', zonal: 'MMC Office, Kapra' },
    { ward: 240, colony: 'AS Rao Nagar', corporation: 'MMC', circle: 'Kapra Circle', zonal: 'MMC Office, Kapra' },
    { ward: 245, colony: 'Dammaiguda', corporation: 'MMC', circle: 'Kapra Circle', zonal: 'MMC Office, Kapra' },
    { ward: 250, colony: 'Alwal', corporation: 'MMC', circle: 'Alwal Circle', zonal: 'MMC Office, Alwal' },
    { ward: 255, colony: 'Bolarum', corporation: 'MMC', circle: 'Alwal Circle', zonal: 'MMC Office, Alwal' },
    { ward: 260, colony: 'Kompally', corporation: 'MMC', circle: 'Alwal Circle', zonal: 'MMC Office, Alwal' },
    { ward: 265, colony: 'Medchal', corporation: 'MMC', circle: 'Medchal Circle', zonal: 'MMC Office, Medchal' },
    { ward: 270, colony: 'Boduppal', corporation: 'MMC', circle: 'Uppal Circle', zonal: 'MMC Office, Uppal' },
    { ward: 275, colony: 'Peerzadiguda', corporation: 'MMC', circle: 'Uppal Circle', zonal: 'MMC Office, Uppal' },
    { ward: 280, colony: 'Nagole', corporation: 'MMC', circle: 'LB Nagar Circle', zonal: 'MMC Office, LB Nagar' },
    { ward: 285, colony: 'LB Nagar', corporation: 'MMC', circle: 'LB Nagar Circle', zonal: 'MMC Office, LB Nagar' },
    { ward: 290, colony: 'Vanasthalipuram', corporation: 'MMC', circle: 'LB Nagar Circle', zonal: 'MMC Office, LB Nagar' },
    { ward: 295, colony: 'Saroornagar', corporation: 'MMC', circle: 'LB Nagar Circle', zonal: 'MMC Office, LB Nagar' },
];

export function searchWard(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return wardData.filter(w => w.colony.toLowerCase().includes(q));
}
