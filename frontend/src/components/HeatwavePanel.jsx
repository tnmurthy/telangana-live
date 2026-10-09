import { useEmergency } from '../hooks/useEmergency';
import { weatherData } from '../data/weatherData';
import UpdatedAt from './UpdatedAt';
import { Icons } from './Icons';

// Shown while an official heatwave alert is active. It used to show a fixed
// "IMD Begumpet" reading from 9 March (39°C, UV 11) and ORS points with
// made-up distances (TL-48). It now shows the current Hyderabad reading from
// the hourly weather job and links to search for help nearby.

const MAPS = (query) => `https://www.google.com/maps/search/${encodeURIComponent(query)}`;

export default function HeatwavePanel() {
    const { isEmergencyActive, emergencyType } = useEmergency();

    if (!isEmergencyActive || emergencyType !== 'heatwave') return null;

    const now = weatherData.Hyderabad;

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <Icons.Power className="w-5 h-5 text-red-400" /> Staying Safe in the Heat
                    </h2>
                    {now && <UpdatedAt timestamp={now.observedAt} maxAgeHours={3} />}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {now && (
                    <div className="glass-card p-5 border-red-500/20">
                        <p className="label-xs mb-2">Hyderabad now</p>
                        <span className="price-value text-4xl text-red-400">{now.temp}°C</span>
                        <p className="text-xs text-text-muted mt-2">Feels like {now.feelsLike}°C · {now.source}</p>
                    </div>
                )}

                <div className="glass-card p-5 sm:col-span-2">
                    <ul className="text-sm text-text-secondary space-y-1 list-disc pl-5 mb-3">
                        <li>Stay indoors in the hottest hours, drink water often, and wear light cotton clothes.</li>
                        <li>Dizziness, confusion or no sweating in the heat can be heatstroke: call 108.</li>
                    </ul>
                    <div className="flex flex-wrap gap-2">
                        <a href="tel:108" className="bg-red-500/15 text-red-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-500/25 transition-all border border-red-500/20">
                            Ambulance (108)
                        </a>
                        <a href={MAPS('hospital near me')} target="_blank" rel="noopener noreferrer" className="bg-green-500/15 text-green-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-green-500/25 transition-all border border-green-500/20">
                            Nearest hospital ↗
                        </a>
                        <a href={MAPS('Basthi Dawakhana near me')} target="_blank" rel="noopener noreferrer" className="bg-blue-500/15 text-blue-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-500/25 transition-all border border-blue-500/20">
                            Nearest Basthi Dawakhana ↗
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
