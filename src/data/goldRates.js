// Mock gold & silver rates — calibrated to March 27, 2026
export const goldRates = {
    city: 'Hyderabad',
    date: '2026-03-27',
    gold22k: { price: 14820, change: -180, unit: '₹/gram' },
    gold24k: { price: 16170, change: -195, unit: '₹/gram' },
    silver: { price: 96500, change: 200, unit: '₹/kg' },
    history: [
        { date: '21 Mar', gold22k: 15000, gold24k: 16365, silver: 96300 },
        { date: '22 Mar', gold22k: 14950, gold24k: 16300, silver: 96400 },
        { date: '23 Mar', gold22k: 14900, gold24k: 16250, silver: 96450 },
        { date: '24 Mar', gold22k: 14880, gold24k: 16220, silver: 96500 },
        { date: '25 Mar', gold22k: 14850, gold24k: 16200, silver: 96550 },
        { date: '26 Mar', gold22k: 14830, gold24k: 16180, silver: 96600 },
        { date: '27 Mar', gold22k: 14820, gold24k: 16170, silver: 96700 },
    ],
};
