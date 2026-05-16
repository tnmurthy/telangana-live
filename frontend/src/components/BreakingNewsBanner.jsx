import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alerts } from '../data/alerts';

const BREAKING_TYPES = new Set(['power', 'water', 'emergency']);

export default function BreakingNewsBanner() {
  const [breakingAlerts, setBreakingAlerts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const resp = await fetch('/data/alerts.json');
        if (resp.ok) {
          const data = await resp.json();
          const filtered = data.filter(a => BREAKING_TYPES.has(a.type));
          setBreakingAlerts(filtered);
          if (filtered.length > 0) {
            setItem(filtered[0]);
            setVisible(true);
          }
        }
      } catch (err) {
        console.error("Failed to load alerts", err);
      }
    }
    loadAlerts();
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (breakingAlerts.length > 0) {
      setItem(breakingAlerts[idx % breakingAlerts.length]);
    }
  }, [idx, breakingAlerts]);

  if (!item || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-40 bg-[#c00] border-b border-white/5 overflow-hidden group"
      >
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 h-10 sm:h-11 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white text-[#c00] rounded-[3px] px-2 py-0.5
                             text-[10px] font-black uppercase tracking-widest shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#c00] animate-pulse" />
              Breaking
            </motion.span>
            
            <div className="flex-grow min-w-0">
               <motion.p 
                key={item.id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[13px] sm:text-[14px] font-bold text-white truncate leading-none tracking-tight"
               >
                {item.message}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <span className="text-[10px] sm:text-[11px] text-white/60 font-semibold uppercase tracking-tighter hidden md:block">
              {item.time}
            </span>
            
            <div className="flex items-center gap-1 border-l border-white/10 pl-3">
              {breakingAlerts.length > 1 && (
                <button 
                  onClick={() => setIdx(i => (i + 1) % breakingAlerts.length)}
                  className="p-1.5 rounded hover:bg-white/10 text-white/80 transition-colors"
                  title="Next Update"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setVisible(false)}
                className="p-1.5 rounded hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
