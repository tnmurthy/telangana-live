import { metroData, mmtsData } from '../data/transportData';
import ShareWhatsApp from './ShareWhatsApp';
import { Icons } from './Icons';

function CrowdMeter({ level, label, color }) {
    return (
        <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${level}%`, backgroundColor: color }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color }}>{level}%</span>
            <span className="text-[10px] text-text-muted">{label}</span>
        </div>
    );
}

export default function MetroCard() {
    const crowdColors = (level) => level < 50 ? '#22C55E' : level < 75 ? '#EAB308' : '#EF4444';

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <Icons.Airport className="w-6 h-6 rotate-[225deg]" /> Public Transport
                    </h2>
                    <p className="section-subtitle">Metro & MMTS Live Updates</p>
                </div>
            </div>

            {/* Metro Takeover Banner */}
            <div className="glass-card p-4 mb-4 border-blue-500/15 flex items-center gap-3 bg-blue-500/5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Icons.Heritage className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{metroData.takeover.headline}</p>
                    <p className="text-xs text-text-muted mt-0.5">{metroData.takeover.detail}</p>
                </div>
                <span className="date-badge hidden sm:inline-block">{metroData.takeover.date}</span>
            </div>

            {/* Metro Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {metroData.lines.map((line) => (
                    <div key={line.name} className="glass-card p-4 hover-lift-blue">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></span>
                                <span className="text-sm font-bold text-white">{line.name}</span>
                            </div>
                            <ShareWhatsApp type="metro" data={{ line: line.name, status: 'Operational', crowdLabel: line.crowdLabel }} />
                        </div>
                        <p className="text-xs text-text-secondary mb-1">{line.route}</p>
                        <CrowdMeter level={line.crowdLevel} label={line.crowdLabel} color={crowdColors(line.crowdLevel)} />
                        <p className="text-[10px] text-text-muted mt-2">Peak: {line.peakHours}</p>
                    </div>
                ))}
            </div>


            {/* MMTS + Ladies Special */}
            <div className="glass-card section-block">
                <h3 className="label-xs mb-3 flex items-center gap-2">
                    <Icons.IT className="w-4 h-4" /> MMTS Schedule
                </h3>
                <div className="space-y-3 mb-4">
                    {mmtsData.routes.map((route) => (
                        <div key={route.name} className={`detail-box ${route.highlight ? 'border-heritage-gold/20' : ''}`}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-white">{route.name}</span>
                                <span className="text-[10px] text-text-muted">{route.frequency}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {route.stops.map((stop, i) => (
                                    <span key={stop} className="text-[10px] text-text-secondary">
                                        {stop}{i < route.stops.length - 1 ? ' →' : ''}
                                    </span>
                                ))}
                            </div>
                            {route.highlightNote && (
                                <div className="text-xs text-heritage-gold mt-2 font-medium flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-heritage-gold animate-pulse" />
                                    {route.highlightNote}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Ladies Special */}
                <div className="detail-box border-deep-pink/20 bg-deep-pink/[0.03]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-deep-pink/10 flex items-center justify-center">
                            {Icons[mmtsData.ladiesSpecial.icon] && Icons[mmtsData.ladiesSpecial.icon]({ className: "w-5 h-5 text-deep-pink" })}
                        </div>
                        <span className="text-sm font-bold text-deep-pink">{mmtsData.ladiesSpecial.name}</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">{mmtsData.ladiesSpecial.route}</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {mmtsData.ladiesSpecial.timings.map((t) => (
                            <span key={t} className="text-[10px] bg-deep-pink/10 text-deep-pink-light px-2 py-0.5 rounded-md font-semibold">{t}</span>
                        ))}
                    </div>
                    <p className="text-[10px] text-text-muted">{mmtsData.ladiesSpecial.note}</p>
                </div>
            </div>
        </section>
    );
}
