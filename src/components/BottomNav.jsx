import { NavLink } from 'react-router-dom';
import { useEmergency } from '../hooks/useEmergency';

export default function BottomNav() {
    const { isEmergencyActive, activateEmergency } = useEmergency();

    const items = [
        {
            label: 'Home', href: '/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            )
        },
        {
            label: 'Rates', href: '/rates/gold', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
        {
            label: 'Emergency', href: null, isEmergency: true, icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
            )
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-dark-bg/90 backdrop-blur-2xl border-t border-white/[0.06] z-50 md:hidden safe-bottom">
            <div className="grid grid-cols-4 max-w-lg mx-auto">
                {items.map((item) => {
                    if (item.isEmergency) {
                        return (
                            <button
                                key={item.label}
                                onClick={() => activateEmergency('heatwave')}
                                aria-label={`Activate ${item.label} Mode`}
                                aria-pressed={isEmergencyActive}
                                className={`flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${
                                    isEmergencyActive ? 'text-red-400' : 'text-text-muted hover:text-red-400'
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
                                `flex flex-col items-center py-2.5 transition-all duration-300 active:scale-90 relative ${
                                    isActive ? 'text-telangana-green' : 'text-text-muted hover:text-telangana-green/70'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-telangana-green rounded-b-full"></div>
                                    )}
                                    <div className="mb-0.5">{item.icon}</div>
                                    <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
