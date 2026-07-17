import { useState, useEffect } from 'react';
import { alerts as staticAlerts } from '../data/alerts';
import newsData from '../data/news.json';
import { powerAlertsService } from '../services/powerAlertsService';
import { useEmergency } from '../hooks/useEmergency';

export default function NewsTicker() {
  const [dynamicAlerts, setDynamicAlerts] = useState([]);
  const [visibleIdx, setVisibleIdx] = useState(0);
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

  const latestNews = newsData.slice(0, 8).map(item => ({
    id: item.link,
    message: `${item.region}: ${item.title}`,
    time: 'Live',
    type: 'news',
    link: item.link,
  }));

  const tickerItems = [
    ...(emergencyData?.active ? [{
      id: 'emergency-global',
      message: `⚠️ EMERGENCY: ${emergencyData.message}`,
      time: 'NOW',
      type: 'emergency',
      link: '/dashboard',
    }] : []),
    ...dynamicAlerts,
    ...staticAlerts,
    ...latestNews,
  ];

  // Cycle items for 3D conveyor effect
  useEffect(() => {
    if (tickerItems.length === 0) return;
    const t = setInterval(() => {
      setVisibleIdx(i => (i + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(t);
  }, [tickerItems.length]);

  const typeColors = {
    power: 'bg-amber-400',
    emergency: 'bg-red-500 animate-pulse',
    news: 'bg-telangana-green',
    default: 'bg-blue-400',
  };

  const typeLabel = {
    power: '⚡',
    emergency: '🚨',
    news: '📰',
    water: '💧',
    default: 'ℹ️',
  };

  return (
    <div data-testid="news-ticker" className="bg-dark-bg-secondary/40 backdrop-blur-sm border-b border-white/[0.03] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex items-center h-9">
        {/* LIVE Badge */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 h-full bg-red-500/[0.06] border-r border-white/[0.05]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live" />
          <span className="text-[10px] font-heading font-bold text-red-400 uppercase tracking-[0.15em]">Live</span>
        </div>

        {/* 3D Conveyor - desktop */}
        <div
          className="hidden md:flex flex-1 overflow-hidden items-center px-4"
          style={{ perspective: '600px' }}
        >
          <div className="relative w-full h-6 overflow-hidden" style={{ perspectiveOrigin: '50% 50%' }}>
            {tickerItems.map((item, i) => {
              const offset = ((i - visibleIdx + tickerItems.length) % tickerItems.length);
              const isActive = offset === 0;
              const isPrev = offset === tickerItems.length - 1;
              const isNext = offset === 1;

              let style = {};
              if (isActive) {
                style = { transform: 'translateY(0) rotateX(0deg)', opacity: 1, zIndex: 2 };
              } else if (isPrev) {
                style = { transform: 'translateY(-100%) rotateX(40deg)', opacity: 0, zIndex: 1 };
              } else if (isNext) {
                style = { transform: 'translateY(100%) rotateX(-40deg)', opacity: 0, zIndex: 1 };
              } else {
                style = { transform: 'translateY(200%)', opacity: 0, zIndex: 0 };
              }

              return (
                <div
                  key={`${item.id}-${i}`}
                  className="absolute inset-0 flex items-center gap-2.5 transition-all duration-500 ease-in-out"
                  style={style}
                >
                  <span className={`flex-shrink-0 text-[12px]`}>{typeLabel[item.type] || typeLabel.default}</span>
                  <a
                    href={item.link || '#'}
                    target={item.link?.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-[13px] text-text-secondary font-medium hover:text-white transition-colors truncate"
                  >
                    {item.message}
                  </a>
                  <span className="text-text-muted/50 text-[10px] font-semibold flex-shrink-0">· {item.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: plain scrolling */}
        <div className="md:hidden overflow-hidden flex-1 group">
          <div className="animate-ticker flex whitespace-nowrap py-2 gap-10">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={`m-${item.id}-${idx}`} className="text-[12px] text-text-secondary inline-flex items-center gap-2 font-medium">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${typeColors[item.type] || typeColors.default}`} />
                <span className="max-w-[200px] truncate">{item.message}</span>
                <span className="text-text-muted/50 text-[10px]">· {item.time}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Item counter */}
        <div className="flex-shrink-0 px-3 text-[9px] text-text-muted/40 font-mono hidden sm:block">
          {visibleIdx + 1}/{tickerItems.length}
        </div>
      </div>
    </div>
  );
}
