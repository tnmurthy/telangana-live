// The hard-coded "live" alerts that used to be here (dated 3-4 Jun, shown as
// current until Oct 2026) were removed. Alerts come from /data/alerts.json.

export const powerTariff = {
    lastUpdated: '2026-03-01',
    unit: '₹/kWh',
    categories: [
        { name: 'Residential (0–100 units)', rate: 1.95, slab: '0–100' },
        { name: 'Residential (101–200 units)', rate: 3.60, slab: '101–200' },
        { name: 'Residential (201–300 units)', rate: 5.60, slab: '201–300' },
        { name: 'Residential (300+ units)', rate: 8.50, slab: '300+' },
        { name: 'Commercial (LT)', rate: 8.50, slab: 'All' },
        { name: 'Commercial (HT)', rate: 7.80, slab: 'All' },
        { name: 'Industrial (LT)', rate: 6.95, slab: 'All' },
        { name: 'Industrial (HT)', rate: 6.20, slab: 'All' },
        { name: 'EV Charging Points', rate: 6.00, slab: 'All' },
        { name: 'Agricultural', rate: 0.00, slab: 'Free (up to 2500 units)' },
    ],
};
