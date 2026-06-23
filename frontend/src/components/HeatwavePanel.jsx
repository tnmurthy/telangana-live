import { useEmergency } from '../hooks/useEmergency';
import { heatwaveData } from '../data/emergencyData';
import { Icons } from './Icons';

export default function HeatwavePanel() {
    const { isEmergencyActive, emergencyType } = useEmergency();

    if (!isEmergencyActive || emergencyType !== 'heatwave') return null;

    const { currentTemp, feelsLike, uvIndex, uvWarning, imdStation, lastUpdated, orsPoints } = heatwaveData;

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <Icons.Power className="w-5 h-5 text-red-400" /> Cooling Dashboard
                    </h2>
                    <p className="section-subtitle">{imdStation} · {lastUpdated}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Live Temp */}
                <div className="glass-card p-5 border-red-500/20">
                    <p className="label-xs mb-2 flex items-center gap-2">
                        <Icons.Power className="w-4 h-4 text-red-400" /> Live Temperature
                    </p>
                    <span className="price-value text-4xl text-red-400">{currentTemp}°C</span>
                    <p className="text-xs text-text-muted mt-2">Feels like {feelsLike}°C</p>
                </div>

                {/* UV Alert */}
                <div className="glass-card p-5 border-orange-500/20">
                    <p className="label-xs mb-2 flex items-center gap-2">
                        <Icons.Power className="w-4 h-4 text-orange-400" /> UV Index
                    </p>
                    <span className="price-value text-4xl text-orange-400">{uvIndex}</span>
                    <p className="text-xs text-orange-300/80 font-semibold mt-2">{uvWarning}</p>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-5 sm:col-span-2">
                    <p className="label-xs mb-3 flex items-center gap-2">
                        <Icons.Emergency className="w-4 h-4 text-white" /> Quick Actions
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-500/15 text-blue-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-500/25 transition-all border border-blue-500/20 flex items-center gap-2">
                            Nearest ORS Point
                        </button>
                        <a href="tel:108" className="bg-red-500/15 text-red-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-500/25 transition-all border border-red-500/20 flex items-center gap-2">
                            Helpline (108)
                        </a>
                        <button className="bg-green-500/15 text-green-300 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-green-500/25 transition-all border border-green-500/20 flex items-center gap-2">
                            Nearest Hospital
                        </button>
                    </div>
                    {/* ORS Points */}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {orsPoints.slice(0, 4).map((p) => (
                            <div key={p.name} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 text-xs">
                                <span className="text-text-secondary font-medium">{p.name}</span>
                                <span className="text-text-muted">{p.distance}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
