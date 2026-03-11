import { useEmergency } from '../hooks/useEmergency';
import { emergencyContacts } from '../data/emergencyData';
import { Icons } from './Icons';

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
                        <h2 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight uppercase flex items-center gap-2">
                            {emergencyType === 'heatwave' ? <><Icons.Power className="w-5 h-5 text-orange-400" /> Heatwave Alert</> : <><Icons.Emergency className="w-5 h-5 text-red-400" /> Crisis Dashboard</>}
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
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                                {regional && Icons[regional.icon] ? Icons[regional.icon]({ className: "w-6 h-6 text-white" }) : <Icons.Emergency className="w-6 h-6 text-white" />}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{regional?.name || 'GHMC Helpline'}</p>
                                <p className="text-red-200/70 text-xs">{regional?.desc || 'Emergency Support'} · Priority Context</p>
                            </div>
                        </div>
                        <a href={`tel:${(regional?.number || '21111111').replace(/\s/g, '')}`} className="text-white font-bold text-sm bg-white/15 px-3 py-1.5 rounded-lg hover:bg-white/25 transition-all">
                            📞 {regional?.number || '21111111'}
                        </a>
                    </div>
                )}

                {/* All contacts grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {emergencyContacts.general.map((c) => (
                        <a key={c.name} href={`tel:${c.number.replace(/\s/g, '')}`}
                            className="bg-white/[0.07] rounded-xl p-3 text-center hover:bg-white/15 transition-all border border-white/[0.06] group">
                            <div className="w-8 h-8 rounded-lg bg-white/5 mx-auto mb-2 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                {Icons[c.icon] && Icons[c.icon]({ className: "w-5 h-5 text-red-200" })}
                            </div>
                            <p className="text-[10px] text-red-100/70 font-medium leading-tight mb-1">{c.name}</p>
                            <p className="text-white font-bold text-xs group-hover:underline">{c.number}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
