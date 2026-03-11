import { useState } from 'react';
import DailyRatesDashboard from '../components/DailyRatesDashboard';
import FuelPriceWidget from '../components/FuelPriceWidget';
import DistrictSelector from '../components/DistrictSelector';
import WeatherCard from '../components/WeatherCard';
import PowerTariffCard from '../components/PowerTariffCard';
import DailyShloka from '../components/DailyShloka';
import MetroCard from '../components/MetroCard';
import BasthiDawakhana from '../components/BasthiDawakhana';
import CitizenPoll from '../components/CitizenPoll';
import ServicesDirectory from '../components/ServicesDirectory';

export default function HomePage() {
    const [selectedDistrict, setSelectedDistrict] = useState('Hyderabad');

    return (
        <div className="space-y-5">
            {/* Row 1: Daily Rates + Fuel Prices — side by side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <DailyRatesDashboard />
                <FuelPriceWidget />
            </section>

            {/* Row 2: District + Weather + Tariff — 3 columns */}
            <section id="districts" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                    <DistrictSelector selectedDistrict={selectedDistrict} onSelect={setSelectedDistrict} />
                    <DailyShloka />
                </div>
                <div>
                    <WeatherCard selectedDistrict={selectedDistrict} />
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                    <PowerTariffCard />
                </div>
            </section>

            {/* Row 3: Public Transport */}
            <MetroCard />

            {/* Row 4: Basthi Dawakhana */}
            <BasthiDawakhana />

            {/* Row 5: Citizen Poll + Services — side by side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div id="poll">
                    <CitizenPoll />
                </div>
                <ServicesDirectory />
            </section>
        </div>
    );
}
