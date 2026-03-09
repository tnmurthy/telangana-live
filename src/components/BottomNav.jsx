import { NavLink, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();

    const items = [
        {
            label: 'Home', href: '/', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: 'Rates', href: '/#rates', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            label: 'Directory', href: '/#services', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            label: 'News', href: '/#ticker-section', hasBadge: true, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            )
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card-bg-solid/90 backdrop-blur-2xl border-t border-white/[0.06] z-50 md:hidden safe-bottom">
            <div className="grid grid-cols-4 max-w-lg mx-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${isActive && location.hash === (item.href.split('#')[1] || '')
                                ? 'text-heritage-gold'
                                : 'text-text-muted hover:text-heritage-gold'
                            }`
                        }
                    >
                        <div className="mb-0.5">{item.icon}</div>
                        <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                        {item.hasBadge && (
                            <span className="absolute top-1.5 right-1/4 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-live"></span>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
