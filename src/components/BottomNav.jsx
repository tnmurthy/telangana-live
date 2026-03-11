import { NavLink } from 'react-router-dom';
import { useEmergency } from '../hooks/useEmergency';

export default function BottomNav() {

    const { isEmergencyActive, activateEmergency } = useEmergency();

    const items = [
        {
            label: 'Home', href: '/', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            label: 'Cyberabad', href: '/cyberabad', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm1.5-12h7.5v7.5h-7.5V7.5Z" />
                </svg>
            )
        },
        {
            label: 'Malkajgiri', href: '/malkajgiri', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            label: 'Emergency', href: null, isEmergency: true, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
            )
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card-bg-solid/90 backdrop-blur-2xl border-t border-white/[0.06] z-50 md:hidden safe-bottom">
            <div className="grid grid-cols-4 max-w-lg mx-auto">
                {items.map((item) => {
                    // Emergency is a button, not a link
                    if (item.isEmergency) {
                        return (
                            <button
                                key={item.label}
                                onClick={() => activateEmergency('heatwave')}
                                aria-label={`Activate ${item.label} Mode`}
                                aria-pressed={isEmergencyActive}
                                className={`flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${isEmergencyActive
                                    ? 'text-red-400'
                                    : 'text-text-muted hover:text-red-400'
                                    }`}
                            >
                                <div className={`mb-0.5 relative ${isEmergencyActive ? 'animate-pulse-live' : ''}`}>
                                    {item.icon}
                                    {isEmergencyActive && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                    )}
                                </div>
                                <span className={`text-[9px] font-semibold tracking-wide ${isEmergencyActive ? 'text-red-400' : ''}`}>{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <NavLink
                            key={item.label}
                            to={item.href}
                            aria-label={`Navigate to ${item.label}`}
                            className={({ isActive }) =>
                                `flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${isActive
                                    ? 'text-heritage-gold'
                                    : 'text-text-muted hover:text-heritage-gold'
                                }`
                            }
                        >
                            <div className="mb-0.5">{item.icon}</div>
                            <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
