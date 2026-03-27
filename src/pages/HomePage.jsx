import { useState } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="space-y-5 overflow-hidden">
            {/* Row 1: Daily Rates + Fuel Prices — side by side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in">
                <DailyRatesDashboard />
                <FuelPriceWidget />
            </section>

            {/* AI Pulse Banner */}
            <section className="animate-in delay-75">
                <Link to="/ai-pulse" className="block w-full bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-emerald-900/40 border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all group overflow-hidden relative">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full group-hover:bg-purple-500/30 transition-colors"></div>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                           <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 text-purple-400 group-hover:scale-110 transition-transform">
                               ✨
                           </div>
                           <div>
                               <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">AI Pulse Briefing <span className="bg-green-500 text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold animate-pulse">Live</span></h3>
                               <p className="text-sm text-text-muted">Daily track of coding gains, context limits & spend across OpenAI, Anthropic, Google.</p>
                           </div>
                        </div>
                        <div className="text-purple-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-xl font-bold">
                            &rarr;
                        </div>
                    </div>
                </Link>
            </section>

            {/* Row 2: District + Weather + Tariff — 3 columns */}
            <section id="districts" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in delay-100">
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
            <div className="animate-in delay-150">
                <MetroCard />
            </div>

            {/* Row 4: Basthi Dawakhana */}
            <div className="animate-in delay-200">
                <BasthiDawakhana />
            </div>

            {/* Row 5: Citizen Poll + Services — side by side */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-in delay-300">
                <div id="poll">
                    <CitizenPoll />
                </div>
                <ServicesDirectory />
            </section>
        </div>
    );
}
