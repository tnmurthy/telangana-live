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
        <div className="space-y-8 sm:space-y-10">
            {/* Section 1: Daily Rates */}
            <DailyRatesDashboard />

            {/* Section 2: Fuel Prices */}
            <FuelPriceWidget />

            {/* Section 3: District + Weather + Tariff */}
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

            {/* Section 4: Public Transport */}
            <MetroCard />

            {/* Section 5: Basthi Dawakhana */}
            <BasthiDawakhana />

            {/* Section 6: Citizen's Poll */}
            <div id="poll">
                <CitizenPoll />
            </div>

            {/* Section 7: Services */}
            <ServicesDirectory />
        </div>
    );
}
