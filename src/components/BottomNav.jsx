import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function BottomNav() {
    const items = [
        {
            label: 'Home', href: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            label: 'Report', href: '/report', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
            )
        },
        {
            label: 'Jobs', href: '/jobs', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            )
        },
        {
            label: 'News', href: '/news', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5" />
                </svg>
            )
        },
    ];

    return (
        <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
            className="fixed bottom-0 left-0 right-0 bg-dark-bg/90 backdrop-blur-2xl border-t border-white/[0.06] z-50 md:hidden safe-bottom"
        >
            <div className="grid grid-cols-4 max-w-lg mx-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        aria-label={`Navigate to ${item.label}`}
                        className={({ isActive }) =>
                            `flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${
                                isActive ? 'text-telangana-green' : 'text-text-muted hover:text-telangana-green/70'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottom-nav-indicator"
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={{ scaleX: 1, opacity: 1 }}
                                            exit={{ scaleX: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-telangana-green rounded-b-full"
                                        />
                                    )}
                                </AnimatePresence>
                                <motion.div
                                    className="mb-0.5"
                                    animate={{ scale: isActive ? 1.15 : 1 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                    {item.icon}
                                </motion.div>
                                <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </motion.nav>
    );
}
