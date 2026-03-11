import { alerts } from '../data/alerts';
import ShareWhatsApp from './ShareWhatsApp';

export default function NewsTicker() {
    const tickerItems = [...alerts, ...alerts];

    return (
        <div className="bg-dark-bg/70 backdrop-blur-xl border-b border-card-border overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center h-10">
                {/* LIVE Badge */}
                <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-red-500/8 border-r border-card-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live"></span>
                    <span className="text-[10px] font-heading font-bold text-red-400 uppercase tracking-[0.15em]">Live</span>
                </div>
                {/* Ticker */}
                <div className="overflow-hidden flex-1 group">
                    <div className="animate-ticker flex whitespace-nowrap py-2.5 gap-10 group-hover:pause">
                        {tickerItems.map((alert, idx) => (
                            <span key={`${alert.id}-${idx}`} className="text-sm text-text-secondary inline-flex items-center gap-3 font-medium group/item hover:text-white transition-colors">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${alert.type === 'power' ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
                                {alert.message}
                                <span className="text-text-muted text-xs">· {alert.time}</span>
                                <ShareWhatsApp
                                    type="weather"
                                    data={{ district: 'Telangana', temp: 'N/A', condition: alert.message }}
                                    className="p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                />
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
