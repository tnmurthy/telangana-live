export const alerts = [
    { id: 1, type: 'power', message: '⚡ Scheduled power outage in Secunderabad (Div 3) on 10 Mar, 10AM–2PM', district: 'Hyderabad', time: '2 hours ago' },
    { id: 2, type: 'water', message: '💧 Water supply disruption in Kukatpally due to pipeline repair — expected restoration by 6PM', district: 'Hyderabad', time: '3 hours ago' },
    { id: 3, type: 'power', message: '⚡ Unscheduled power cut in Karimnagar Industrial Area — TSSPDCL crew deployed', district: 'Karimnagar', time: '1 hour ago' },
    { id: 4, type: 'water', message: '💧 HMWSSB: Low pressure expected in Malkajgiri zone on 10 Mar morning', district: 'Medchal-Malkajgiri', time: '4 hours ago' },
    { id: 5, type: 'power', message: '⚡ Transformer maintenance in Warangal East — 11 Mar, 9AM–1PM', district: 'Warangal', time: '5 hours ago' },
    { id: 6, type: 'water', message: '💧 Mission Bhagiratha: New pipeline commissioning in Siddipet district completed', district: 'Siddipet', time: '6 hours ago' },
];

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
