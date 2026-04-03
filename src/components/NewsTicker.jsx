import { useState, useEffect } from 'react';
import { alerts as staticAlerts } from '../data/alerts';
import newsData from '../data/news.json';
import ShareWhatsApp from './ShareWhatsApp';
import { powerAlertsService } from '../services/powerAlertsService';
import { useEmergency } from '../hooks/useEmergency';

export default function NewsTicker() {
    const [dynamicAlerts, setDynamicAlerts] = useState([]);
    const { emergencyData } = useEmergency();

    useEffect(() => {
        const fetchAlerts = async () => {
            const data = await powerAlertsService.getActiveAlerts();
            if (data && data.length > 0) setDynamicAlerts(data);
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const latestNews = newsData.slice(0, 5).map(item => ({
        id: item.link,
        message: `${item.region}: ${item.title}`,
        time: 'Live',
        type: 'news',
        link: item.link
    }));

    const tickerItems = [
        ...(emergencyData?.active ? [{
            id: 'emergency-global',
            message: `⚠️ EMERGENCY: ${emergencyData.message}`,
            time: 'NOW',
            type: 'emergency',
            link: '/dashboard'
        }] : []),
        ...dynamicAlerts,
        ...staticAlerts,
        ...latestNews
    ];

    const fullTickerItems = [...tickerItems, ...tickerItems];

    const typeColors = {
        power: 'bg-amber-400',
        emergency: 'bg-red-500 animate-pulse',
        news: 'bg-telangana-green',
        default: 'bg-blue-400'
    };

    return (
        <div className="bg-dark-bg-secondary/40 backdrop-blur-sm border-b border-white/[0.03] overflow-hidden">
            <div className="max-w-[1440px] mx-auto flex items-center h-9">
                {/* LIVE Badge */}
                <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-red-500/[0.06] border-r border-white/[0.05]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live"></span>
                    <span className="text-[10px] font-heading font-bold text-red-400 uppercase tracking-[0.15em]">Live</span>
                </div>
                {/* Ticker */}
                <div className="overflow-hidden flex-1 group">
                    <div className="animate-ticker flex whitespace-nowrap py-2 gap-10 group-hover:pause">
                        {fullTickerItems.map((alert, idx) => (
                            <span key={`${alert.id}-${idx}`} className="text-[13px] text-text-secondary inline-flex items-center gap-2.5 font-medium group/item hover:text-white transition-colors">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeColors[alert.type] || typeColors.default}`}></span>
                                <span className="max-w-xs truncate">{alert.message}</span>
                                <span className="text-text-muted/50 text-[10px] font-semibold">· {alert.time}</span>
                                <ShareWhatsApp
                                    type="custom"
                                    customTitle="Live Update from Telangana.live"
                                    customContent={alert.message}
                                    customLink={alert.link || 'https://telangana.live'}
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
