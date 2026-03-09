import { useParams } from 'react-router-dom';
import { partners } from '../data/partners';
import PartnerCard from '../components/PartnerCard';
import DailyRatesDashboard from '../components/DailyRatesDashboard';
import WeatherCard from '../components/WeatherCard';
import BasthiDawakhana from '../components/BasthiDawakhana';
import MetroCard from '../components/MetroCard';

const regionMetadata = {
    hyderabad: {
        title: 'Hyderabad Central',
        subtitle: 'Heritage, Old City & Residual GHMC Focus',
        icon: '🏛️',
        district: 'Hyderabad'
    },
    cyberabad: {
        title: 'Cyberabad IT Corridor',
        subtitle: 'CMC - Madhapur, Gachibowli & Hitech City Focus',
        icon: '💻',
        district: 'Rangareddy'
    },
    malkajgiri: {
        title: 'Malkajgiri Residential',
        subtitle: 'MMC - East Hyderabad & Residential Focus',
        icon: '🏘️',
        district: 'Medchal-Malkajgiri'
    }
};

export default function SubRegionPage() {
    const { region } = useParams();
    const meta = regionMetadata[region] || regionMetadata.hyderabad;
    const regionPartners = partners[region] || [];

    return (
        <div className="space-y-8 sm:space-y-10 animate-fade-in">
            {/* Region Header */}
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">
                    {meta.icon}
                </div>
                <div className="relative z-10">
                    <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">
                        {meta.title}
                    </h2>
                    <p className="text-text-secondary font-medium italic">
                        {meta.subtitle}
                    </p>
                </div>
            </div>

            {/* Partner Spotlight Section */}
            <section id="spotlight">
                <div className="section-header">
                    <div>
                        <h3 className="section-title flex items-center gap-2">
                            <span className="gold-text">🌟</span> Partner Spotlight
                        </h3>
                        <p className="section-subtitle">Local businesses & services in {meta.title}</p>
                    </div>
                    <span className="date-badge">Sponsored</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {regionPartners.map(partner => (
                        <PartnerCard key={partner.id} partner={partner} />
                    ))}
                </div>
            </section>

            {/* Localized Rates & Weather Wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <DailyRatesDashboard />
                </div>
                <div>
                    <WeatherCard selectedDistrict={meta.district} />
                </div>
            </div>

            {/* Local Transport focus */}
            <MetroCard />

            {/* Local Health Finder */}
            <BasthiDawakhana />

        </div>
    );
}
