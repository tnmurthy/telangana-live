import { useState, useEffect } from 'react';
import { useEmergency } from '../hooks/useEmergency';
import { emergencyContacts } from '../data/emergencyData';
import { Icons } from './Icons';
import { powerAlertsService } from '../services/powerAlertsService';

export default function CrisisDashboard({ currentRegion = 'hyderabad' }) {
    const { isEmergencyActive, emergencyType, emergencyData, deactivateEmergency } = useEmergency();
    const [powerAlerts, setPowerAlerts] = useState([]);

    useEffect(() => {
        if (isEmergencyActive) {
            const fetchPower = async () => {
                const data = await powerAlertsService.getActiveAlerts();
                setPowerAlerts(data);
            };
            fetchPower();
        }
    }, [isEmergencyActive]);

    if (!isEmergencyActive) return null;

    const regional = emergencyContacts.regional[currentRegion];
    const isHighSeverity = emergencyData?.severity === 'critical' || emergencyData?.severity === 'high';
    const getBgClass = () => {
        if (isHighSeverity) return 'from-red-950 via-red-900 to-red-950';
        if (emergencyType === 'heatwave') return 'from-orange-900 via-red-900 to-orange-900';
        if (emergencyType === 'coldwave') return 'from-blue-900 via-slate-800 to-blue-900';
        if (emergencyType === 'flood') return 'from-cyan-900 via-blue-900 to-cyan-900';
        return 'from-red-900 via-red-800 to-red-900';
    };
    const bgClass = getBgClass();

    const getHeaderContent = () => {
        if (emergencyType === 'heatwave') return <><Icons.Power className="w-5 h-5 text-orange-400" /> Heatwave Alert</>;
        if (emergencyType === 'coldwave') return <><Icons.Snowflake className="w-5 h-5 text-blue-300" /> Coldwave Alert</>;
        if (emergencyType === 'flood') return <><Icons.WaterDrop className="w-5 h-5 text-cyan-400" /> Flood Warning</>;
        return <><Icons.Emergency className="w-5 h-5 text-red-400" /> Crisis Dashboard</>;
    };

    return (
        <div className={`bg-gradient-to-r ${bgClass} border-b-2 border-red-500/40 animate-fade-in`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full animate-pulse-live ${isHighSeverity ? 'bg-red-400' : 'bg-red-500'}`}></span>
                        <h2 className="font-heading font-bold text-white text-base sm:text-lg tracking-tight uppercase flex items-center gap-2">
                            {getHeaderContent()}
                            {emergencyData?.severity && (
                                <span className={`ml-2 text-[10px] px-2 py-0.5 rounded border ${
                                    isHighSeverity ? 'bg-red-500/20 border-red-500 text-red-200' : 'bg-orange-500/20 border-orange-500 text-orange-200'
                                }`}>
                                    {emergencyData.severity.toUpperCase()}
                                </span>
                            )}
                        </h2>
                    </div>
                    <button onClick={deactivateEmergency} className="text-red-200/60 hover:text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all" title="Dismiss">
                        ✕ Dismiss
                    </button>
                </div>

                {/* Automated Watchdog Message */}
                {emergencyData?.message && (
                    <div className="bg-red-500/10 rounded-xl p-3 mb-3 border border-red-500/20">
                        <p className="text-red-100 text-sm font-medium leading-relaxed">
                            {emergencyData.message}
                        </p>
                        <p className="text-red-200/40 text-[10px] mt-1 italic">
                            Updated: {new Date(emergencyData.last_updated).toLocaleString()} · Automated Watchdog
                        </p>
                    </div>
                )}

                {/* Power Grid Status (Supabase) */}
                {powerAlerts.length > 0 && (
                    <div className="bg-amber-400/10 rounded-xl p-3 mb-3 border border-amber-400/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Icons.Power className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Power Grid Status</span>
                        </div>
                        <div className="space-y-2">
                            {powerAlerts.map(alert => (
                                <div key={alert.id} className="flex items-center justify-between text-xs">
                                    <div className="text-white">
                                        <span className="font-bold">{alert.area}</span>: {alert.message.split('due to')[1]}
                                        <p className="text-amber-200/60 text-[10px]">{alert.time}</p>
                                    </div>
                                    {alert.link && (
                                        <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">Source</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
