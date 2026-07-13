// 30-day weather forecast for Telangana districts
// Based on typical April climate: hot/dry with pre-monsoon showers towards end of month

const conditions = [
    { label: 'Sunny', icon: '☀️', tempRange: [38, 43] },
    { label: 'Partly Cloudy', icon: '⛅', tempRange: [35, 40] },
    { label: 'Haze', icon: '🌫️', tempRange: [36, 41] },
    { label: 'Thunderstorm', icon: '⛈️', tempRange: [30, 36] },
    { label: 'Light Rain', icon: '🌧️', tempRange: [28, 34] },
    { label: 'Cloudy', icon: '☁️', tempRange: [32, 37] },
];

function seededRand(seed, min, max) {
    const x = Math.sin(seed) * 10000;
    return min + Math.floor((x - Math.floor(x)) * (max - min + 1));
}

function generateMonthForecast(districtSeed) {
    const today = new Date(2026, 3, 5); // April 5, 2026
    return Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayOfMonth = date.getDate();
        const seed = districtSeed * 100 + i;

        // April 1-15: mostly sunny/hazy; 16-25: partly cloudy; 26-30: pre-monsoon
        let condIdx;
        if (dayOfMonth <= 15) condIdx = seededRand(seed, 0, 2);
        else if (dayOfMonth <= 25) condIdx = seededRand(seed, 0, 3);
        else condIdx = seededRand(seed, 1, 5);

        const cond = conditions[condIdx];
        const maxTemp = seededRand(seed + 1, cond.tempRange[0], cond.tempRange[1]);
        const minTemp = maxTemp - seededRand(seed + 2, 7, 12);
        const humidity = seededRand(seed + 3, 25, 75);
        const windSpeed = seededRand(seed + 4, 8, 30);
        const rainChance = condIdx >= 3 ? seededRand(seed + 5, 40, 90) : seededRand(seed + 5, 0, 20);

        return {
            date: date.toISOString().split('T')[0],
            dayLabel: date.toLocaleDateString('en-IN', { weekday: 'short' }),
            dateLabel: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            condition: cond.label,
            icon: cond.icon,
            maxTemp,
            minTemp,
            humidity,
            windSpeed,
            rainChance,
        };
    });
}

export const weatherForecast = {
    'Hyderabad': generateMonthForecast(3),
    'Adilabad': generateMonthForecast(1),
    'Bhadradri Kothagudem': generateMonthForecast(2),
    'Jagtial': generateMonthForecast(4),
    'Jangaon': generateMonthForecast(5),
    'Jayashankar Bhupalpally': generateMonthForecast(6),
    'Jogulamba Gadwal': generateMonthForecast(7),
    'Kamareddy': generateMonthForecast(8),
    'Karimnagar': generateMonthForecast(9),
    'Khammam': generateMonthForecast(10),
    'Kumuram Bheem Asifabad': generateMonthForecast(11),
    'Mahabubabad': generateMonthForecast(12),
    'Mahbubnagar': generateMonthForecast(13),
    'Mancherial': generateMonthForecast(14),
    'Medak': generateMonthForecast(15),
    'Medchal-Malkajgiri': generateMonthForecast(16),
    'Mulugu': generateMonthForecast(17),
    'Nagarkurnool': generateMonthForecast(18),
    'Nalgonda': generateMonthForecast(19),
    'Narayanpet': generateMonthForecast(20),
    'Nirmal': generateMonthForecast(21),
    'Nizamabad': generateMonthForecast(22),
    'Peddapalli': generateMonthForecast(23),
    'Rajanna Sircilla': generateMonthForecast(24),
    'Rangareddy': generateMonthForecast(25),
    'Sangareddy': generateMonthForecast(26),
    'Siddipet': generateMonthForecast(27),
    'Suryapet': generateMonthForecast(28),
    'Vikarabad': generateMonthForecast(29),
    'Wanaparthy': generateMonthForecast(30),
    'Warangal': generateMonthForecast(31),
    'Hanamkonda': generateMonthForecast(32),
    'Yadadri Bhuvanagiri': generateMonthForecast(33),
};

export const availableDistricts = Object.keys(weatherForecast);
