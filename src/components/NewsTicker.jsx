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
            if (data && data.length > 0) {
                setDynamicAlerts(data);
            }
        };
        fetchAlerts();
        // Refresh every 5 minutes
        const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Combine core alerts with the 5 latest news items
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

    // Double for continuous loop
    const fullTickerItems = [...tickerItems, ...tickerItems];

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
                        {fullTickerItems.map((alert, idx) => (
                            <span key={`${alert.id}-${idx}`} className="text-sm text-text-secondary inline-flex items-center gap-3 font-medium group/item hover:text-white transition-colors">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    alert.type === 'power' ? 'bg-amber-400' : 
                                    alert.type === 'emergency' ? 'bg-red-500 animate-pulse' :
                                    alert.type === 'news' ? 'bg-telangana-green' : 'bg-blue-400'
                                }`}></span>
                                {alert.message}
                                <span className="text-text-muted text-xs">· {alert.time}</span>
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
