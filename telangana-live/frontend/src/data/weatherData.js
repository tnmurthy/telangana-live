const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Haze', 'Clear', 'Thunderstorm'];
const aqiLabels = ['Good', 'Satisfactory', 'Moderate', 'Poor', 'Very Poor', 'Severe'];
const aqiColors = ['#22C55E', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#991B1B'];

function generateWeather(seed) {
    const temp = 24 + (seed % 15);
    const humidity = 40 + (seed % 45);
    const windSpeed = 5 + (seed % 20);
    const condIdx = seed % conditions.length;
    const aqiVal = 30 + (seed * 7) % 350;
    let aqiLabelIdx = 0;
    if (aqiVal <= 50) aqiLabelIdx = 0;
    else if (aqiVal <= 100) aqiLabelIdx = 1;
    else if (aqiVal <= 200) aqiLabelIdx = 2;
    else if (aqiVal <= 300) aqiLabelIdx = 3;
    else if (aqiVal <= 400) aqiLabelIdx = 4;
    else aqiLabelIdx = 5;

    return {
        temp,
        feelsLike: temp + 2,
        condition: conditions[condIdx],
        humidity,
        windSpeed,
        aqi: aqiVal,
        aqiLabel: aqiLabels[aqiLabelIdx],
        aqiColor: aqiColors[aqiLabelIdx],
    };
}

export const weatherData = {
    'Adilabad': generateWeather(1),
    'Bhadradri Kothagudem': generateWeather(2),
    'Hyderabad': generateWeather(3),
    'Jagtial': generateWeather(4),
    'Jangaon': generateWeather(5),
    'Jayashankar Bhupalpally': generateWeather(6),
    'Jogulamba Gadwal': generateWeather(7),
    'Kamareddy': generateWeather(8),
    'Karimnagar': generateWeather(9),
    'Khammam': generateWeather(10),
    'Kumuram Bheem Asifabad': generateWeather(11),
    'Mahabubabad': generateWeather(12),
    'Mahbubnagar': generateWeather(13),
    'Mancherial': generateWeather(14),
    'Medak': generateWeather(15),
    'Medchal-Malkajgiri': generateWeather(16),
    'Mulugu': generateWeather(17),
    'Nagarkurnool': generateWeather(18),
    'Nalgonda': generateWeather(19),
    'Narayanpet': generateWeather(20),
    'Nirmal': generateWeather(21),
    'Nizamabad': generateWeather(22),
    'Peddapalli': generateWeather(23),
    'Rajanna Sircilla': generateWeather(24),
    'Rangareddy': generateWeather(25),
    'Sangareddy': generateWeather(26),
    'Siddipet': generateWeather(27),
    'Suryapet': generateWeather(28),
    'Vikarabad': generateWeather(29),
    'Wanaparthy': generateWeather(30),
    'Warangal': generateWeather(31),
    'Yadadri Bhuvanagiri': generateWeather(32),
    'Hanumakonda': generateWeather(33),
};
