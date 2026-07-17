import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const MOCK_ALERTS = [
  { type: 'warning', text: '⚠️ Property Tax deadline for {district} is tomorrow.' },
  { type: 'info', text: '⚡ Scheduled power maintenance in {district} from 2 PM - 4 PM.' },
  { type: 'success', text: '🏥 New Basthi Dawakhana opened near {district} center.' },
];

export default function ProactiveAlerts() {
  const { myDistrict } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    if (myDistrict) {
      // Simulate fetching a hyper-local alert based on the selected district
      const randomAlert = MOCK_ALERTS[Math.floor(Math.random() * MOCK_ALERTS.length)];
      setCurrentAlert({
        ...randomAlert,
        text: randomAlert.text.replace('{district}', myDistrict)
      });
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [myDistrict]);

  if (!myDistrict) return null;

  const getAlertStyles = (type) => {
    switch (type) {
      case 'warning': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'info': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'success': return 'bg-telangana-green/10 border-telangana-green/30 text-telangana-green';
      default: return 'bg-gray-800 border-gray-700 text-gray-300';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && currentAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
        >
          <div className={`backdrop-blur-xl border rounded-2xl p-4 shadow-2xl flex items-start gap-3 ${getAlertStyles(currentAlert.type)}`}>
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug">
                {currentAlert.text}
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors opacity-70 hover:opacity-100"
              aria-label="Dismiss alert"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
