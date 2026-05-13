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
          setBreakingAlerts(data.filter(a => BREAKING_TYPES.has(a.type)));
        } else {
          // Fallback to static data
          setBreakingAlerts(alerts.filter(a => BREAKING_TYPES.has(a.type)));
        }
      } catch (err) {
        setBreakingAlerts(alerts.filter(a => BREAKING_TYPES.has(a.type)));
      }
    }
    loadAlerts();
    
    // Refresh every 5 minutes in the UI
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!breakingAlerts.length) return;
    setItem(breakingAlerts[idx % breakingAlerts.length]);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, [idx, breakingAlerts]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cycle to next alert when one dismisses
  useEffect(() => {
    if (!visible && breakingAlerts.length > 1) {
      const t = setTimeout(() => setIdx(i => i + 1), 1500);
      return () => clearTimeout(t);
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={idx}
          initial={{ y: -56, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -56, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between gap-3
                     bg-red-600/95 backdrop-blur-md px-4 py-2.5 shadow-2xl shadow-red-900/40"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-0.5
                             text-[9px] font-black text-white uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
              Breaking
            </span>
            <p className="text-[13px] font-semibold text-white truncate">{item.message}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-white/60 font-medium hidden sm:block">{item.time}</span>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
