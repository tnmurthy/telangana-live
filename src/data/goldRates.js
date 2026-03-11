// Mock gold & silver rates — calibrated to March 9, 2026 baselines from PM
export const goldRates = {
    city: 'Hyderabad',
    date: '2026-03-09',
    gold22k: { price: 14820, change: -180, unit: '₹/gram' },
    gold24k: { price: 16170, change: -195, unit: '₹/gram' },
    silver: { price: 96500, change: 200, unit: '₹/kg' },
    history: [
        { date: '03 Mar', gold22k: 15200, gold24k: 16580, silver: 95800 },
        { date: '04 Mar', gold22k: 15150, gold24k: 16525, silver: 95650 },
        { date: '05 Mar', gold22k: 15100, gold24k: 16470, silver: 95900 },
        { date: '06 Mar', gold22k: 15050, gold24k: 16415, silver: 96100 },
        { date: '07 Mar', gold22k: 15020, gold24k: 16380, silver: 96250 },
        { date: '08 Mar', gold22k: 15000, gold24k: 16365, silver: 96300 },
        { date: '09 Mar', gold22k: 14820, gold24k: 16170, silver: 96500 },
    ],
};
