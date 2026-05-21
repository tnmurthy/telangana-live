import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function StickyAnchorAd() {
    const [isVisible, setIsVisible] = useState(false);
    const location = useLocation();

    // Exclude ads on critical civic and emergency routes
    const isCriticalRoute = [
        '/emergency-contacts',
        '/weather',
        '/health/basthi-dawakhana',
        '/reservoirs'
    ].some(route => location.pathname.startsWith(route));

    useEffect(() => {
        // Show after a short delay (e.g., 2 seconds) for better UX and performance
        const closedSession = sessionStorage.getItem('sticky_ad_closed');
        if (!closedSession && !isCriticalRoute) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [location.pathname, isCriticalRoute]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('sticky_ad_closed', 'true');
    };

    const shouldShow = isVisible && !isCriticalRoute;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-[53px] md:bottom-0 left-0 right-0 z-40 bg-dark-bg/95 border-t border-white/[0.08] backdrop-blur-md px-4 py-2 flex items-center justify-center shadow-[0_-5px_15px_rgba(0,0,0,0.5)]"
                >
                    <div className="relative w-full max-w-[728px] h-[50px] md:h-[60px] flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl px-4 py-1">
                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all text-xs font-bold shadow-lg"
                            aria-label="Close Advertisement"
                        >
                            ✕
                        </button>

                        <div className="flex items-center gap-3">
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-heritage-gold/15 text-heritage-gold font-bold uppercase tracking-wider border border-heritage-gold/20 flex-shrink-0">
                                Ad
                            </span>
                            <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">T-Fiber Broadband</h4>
                                <p className="text-[10px] text-text-muted truncate hidden sm:block">Connecting every home in Telangana with high-speed fiber internet.</p>
                            </div>
                        </div>

                        <a
                            href="https://tfiber.telangana.gov.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-[10px] font-bold text-slate-950 bg-heritage-gold rounded-lg hover:bg-yellow-500 transition-all flex-shrink-0"
                        >
                            Apply ↗
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
