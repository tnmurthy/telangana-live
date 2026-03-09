import { useEmergency } from '../context/EmergencyContext';
import { emergencyContacts } from '../data/emergencyData';

export default function CrisisDashboard({ currentRegion = 'hyderabad' }) {
    const { isEmergencyActive, emergencyType, deactivateEmergency } = useEmergency();

    if (!isEmergencyActive) return null;

    const regional = emergencyContacts.regional[currentRegion];
    const bgClass = emergencyType === 'heatwave' ? 'from-red-900 via-orange-900 to-red-900' : 'from-red-900 via-red-800 to-red-900';

    return (
        <div className={`bg-gradient-to-r ${bgClass} border-b-2 border-red-500/40 animate-fade-in`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse-live"></span>
                        <h2 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight uppercase">
                            {emergencyType === 'heatwave' ? '🌡️ Heatwave Alert' : '🆘 Crisis Dashboard'}
                        </h2>
                    </div>
                    <button onClick={deactivateEmergency} className="text-red-200/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all" title="Dismiss">
                        ✕ Dismiss
                    </button>
                </div>

                {/* Regional priority contact */}
                {regional && (
                    <div className="bg-white/10 rounded-xl p-3 mb-3 flex items-center justify-between border border-white/10">
                        <div className="flex items-center gap-2.5">
                            <span className="text-lg">{regional.icon}</span>
                            <div>
                                <p className="text-white font-semibold text-sm">{regional.name}</p>
                                <p className="text-red-200/70 text-xs">{regional.desc} · Priority for {currentRegion}</p>
                            </div>
                        </div>
                        <a href={`tel:${regional.number.replace(/\s/g, '')}`} className="text-white font-bold text-sm bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-all">
                            📞 {regional.number}
                        </a>
                    </div>
                )}

                {/* All contacts grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {emergencyContacts.general.map((c) => (
                        <a key={c.name} href={`tel:${c.number.replace(/\s/g, '')}`}
                            className="bg-white/[0.07] rounded-xl p-3 text-center hover:bg-white/15 transition-all border border-white/[0.06] group">
                            <span className="text-xl block mb-1">{c.icon}</span>
                            <p className="text-[10px] text-red-100/70 font-medium leading-tight mb-1">{c.name}</p>
                            <p className="text-white font-bold text-xs group-hover:underline">{c.number}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
