import { useState } from 'react';
import newsData from '../data/news.json';
import NewsClusterModal from './NewsClusterModal';
import { countPublishedToday } from '../utils/timeUtils';

export default function PulseCounter() {
  // Real count of stories published today (IST) in the synced feed. It used
  // to start from every stored story and tick up at random every 7 seconds
  // "to simulate live updates".
  const displayCount = countPublishedToday(newsData);
  const [isClusterOpen, setIsClusterOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsClusterOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full
                   bg-slate-900 border border-telangana-green/40
                   px-3 py-1.5 shadow-xl shadow-black/40 cursor-pointer select-none
                   hover:border-telangana-green hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
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
