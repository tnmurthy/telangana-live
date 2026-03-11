import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

/* ── Heroicons-style SVG icons (MIT licensed, inlined) ── */
const icons = {
    sparkles: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
    ),
    fuel: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
        </svg>
    ),
    book: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
    ),
    train: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V11.25c0-2.209-1.791-4-4-4h-.338l-.933-2.8A2.25 2.25 0 0 0 14.967 3H9.033a2.25 2.25 0 0 0-2.137 1.547l-.934 2.8A4.001 4.001 0 0 0 2 11.25v5.625A1.125 1.125 0 0 0 3.375 18" />
        </svg>
    ),
    bus: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V11.25A4 4 0 0 0 17.25 7.25H6.75A4 4 0 0 0 2.75 11.25v5.625c0 .621.504 1.125 1.125 1.125" />
        </svg>
    ),
    hospital: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3 0h.008v.008H18V7.5Z" />
        </svg>
    ),
    ambulance: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    ),
    sos: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
    ),
    building: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
    ),
    chip: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm1.5-12h7.5v7.5h-7.5V7.5Z" />
        </svg>
    ),
    homes: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    ),
    pin: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    ),
    search: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    ),
    ballot: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
    ),
};

const megaMenuData = [
    {
        label: 'Rates',
        links: [
            { label: 'Gold & Silver', href: '/rates/gold', icon: icons.sparkles },
            { label: 'Petrol & Diesel', href: '/rates/fuel', icon: icons.fuel },
            { label: 'Daily Shloka', href: '/#districts', icon: icons.book },
        ]
    },
    {
        label: 'Transport',
        links: [
            { label: 'Metro Phase 1', href: '/transport/metro', icon: icons.train },
            { label: 'MMTS Schedule', href: '/transport/metro', icon: icons.train },
            { label: 'RTC Free Bus', href: '/transport/metro', icon: icons.bus },
        ]
    },
    {
        label: 'Healthcare',
        links: [
            { label: 'Basthi Dawakhana', href: '/health/basthi-dawakhana', icon: icons.hospital },
            { label: 'Hospitals', href: '/#services', icon: icons.ambulance },
            { label: 'Emergency', href: '/#ticker-section', icon: icons.sos },
        ]
    },
    {
        label: 'Regions',
        links: [
            { label: 'Hyderabad', href: '/hyderabad', icon: icons.building },
            { label: 'Cyberabad', href: '/cyberabad', icon: icons.chip },
            { label: 'Malkajgiri', href: '/malkajgiri', icon: icons.homes },
        ]
    },
    {
        label: 'Civic',
        links: [
            { label: 'Report Issue', href: '/report', icon: icons.pin },
            { label: 'Know Your Ward', href: '/report', icon: icons.search },
            { label: "Citizen's Poll", href: '/#poll', icon: icons.ballot },
        ]
    }
];

function NavDropdown({ item }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative group"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="px-4 py-2 text-sm font-medium text-green-100/70 hover:text-white rounded-lg hover:bg-white/10 transition-all flex items-center gap-1.5"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={`${item.label} menu`}
            >
                {item.label}
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Panel */}
            <div
                role="menu"
                className={`absolute top-full left-0 mt-1 w-64 glass-card p-3 shadow-2xl transition-all duration-300 origin-top z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className="space-y-1">
                    {item.links.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.href}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/10 ${isActive ? 'bg-heritage-gold/10 text-heritage-gold' : 'text-text-secondary hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-text-muted">{link.icon}</span>
                            <div>
                                <p className="text-xs font-bold leading-none">{link.label}</p>
                                <p className="text-[10px] text-text-muted mt-1 leading-none uppercase tracking-widest font-medium">Browse Live</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-telangana-green/95 backdrop-blur-xl shadow-lg shadow-black/20'
            : 'bg-gradient-to-r from-telangana-green via-telangana-green-dark to-telangana-green'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14 sm:h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group" aria-label="telangana.live Home">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-heritage-gold/15 flex items-center justify-center border border-heritage-gold/30 group-hover:bg-heritage-gold/25 group-hover:border-heritage-gold/50 transition-all duration-300 animate-glow">
                            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" aria-hidden="true">
                                <path d="M6 32 L6 18 Q6 8 14 8 L14 6 L16 6 L16 8 Q20 4 24 8 L24 6 L26 6 L26 8 Q34 8 34 18 L34 32" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
                                <path d="M14 32 L14 20 Q14 14 20 14 Q26 14 26 20 L26 32" stroke="#D4AF37" strokeWidth="1.8" fill="none" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-heading font-black text-lg sm:text-xl text-white leading-none tracking-tight">
                                telangana<span className="gold-text">.live</span>
                            </h1>
                            <p className="text-[8px] sm:text-[9px] text-green-200/50 tracking-[0.3em] uppercase font-bold">2026 Civic Portal</p>
                        </div>
                    </Link>

                    {/* Desktop Nav - Mega Menu */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {megaMenuData.map((item) => (
                            <NavDropdown key={item.label} item={item} />
                        ))}
                        <Link to="/#rates" className="ml-3 px-4 py-2 rounded-full bg-heritage-gold text-dark-bg text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-md shadow-heritage-gold/20">
                            Live Status
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden text-white p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu - Accordion style */}
            <div className={`lg:hidden transition-all duration-500 overflow-hidden bg-telangana-green-dark/95 backdrop-blur-3xl ${menuOpen ? 'max-h-screen opacity-100 border-t border-white/5' : 'max-h-0 opacity-0'}`}>
                <nav className="px-4 py-6 space-y-5">
                    {megaMenuData.map((category) => (
                        <div key={category.label}>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-200/40 mb-2.5 px-2">{category.label}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {category.links.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.href}
                                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] text-sm text-green-100 hover:text-heritage-gold transition-all active:scale-95"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="text-text-muted">{link.icon}</span>
                                        <span className="font-bold whitespace-nowrap text-xs">{link.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
}
