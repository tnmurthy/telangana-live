import { useState, useEffect } from 'react';
import newsData from '../data/news.json';
import NewsClusterModal from './NewsClusterModal';

export default function PulseCounter() {
  const todayCount = newsData.length;
  const [displayCount, setDisplayCount] = useState(todayCount);
  const [isClusterOpen, setIsClusterOpen] = useState(false);

  // Occasionally "tick up" to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayCount(c => c + Math.floor(Math.random() * 2));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsClusterOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full
                   bg-dark-bg-secondary/90 border border-telangana-green/20 backdrop-blur-md
                   px-3 py-1.5 shadow-xl shadow-black/30 cursor-pointer select-none
                   hover:border-telangana-green/50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
        title="Stories published today (Click to view clusters)"
        aria-label="View live news clusters"
      >
        <span className="text-base leading-none">📰</span>
        <span className="text-xs font-bold text-white tabular-nums">{displayCount}</span>
        <span className="text-[9px] text-text-muted font-medium uppercase tracking-wider hidden sm:inline">
          stories today
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-telangana-green animate-pulse-live flex-shrink-0" />
      </button>

      <NewsClusterModal isOpen={isClusterOpen} onClose={() => setIsClusterOpen(false)} />
    </>
  );
}
