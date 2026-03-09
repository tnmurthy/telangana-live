import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';

const megaMenuData = [
    {
        label: 'Rates',
        links: [
            { label: 'Gold & Silver', href: '/rates/gold', icon: '✨' },
            { label: 'Petrol & Diesel', href: '/rates/fuel', icon: '⛽' },
            { label: 'Daily Shloka', href: '/#districts', icon: '🙏' },
        ]
    },
    {
        label: 'Transport',
        links: [
            { label: 'Metro Phase 1', href: '/transport/metro', icon: '🚇' },
            { label: 'MMTS Schedule', href: '/transport/metro', icon: '🚂' },
            { label: 'RTC Free Bus', href: '/transport/metro', icon: '🚌' },
        ]
    },
    {
        label: 'Healthcare',
        links: [
            { label: 'Basthi Dawakhana', href: '/health/basthi-dawakhana', icon: '🏥' },
            { label: 'Hospitals', href: '/#services', icon: '🚑' },
            { label: 'Emergency', href: '/#ticker-section', icon: '🆘' },
        ]
    },
    {
        label: 'Regions',
        links: [
            { label: 'Hyderabad', href: '/hyderabad', icon: '🏛️' },
            { label: 'Cyberabad', href: '/cyberabad', icon: '💻' },
            { label: 'Malkajgiri', href: '/malkajgiri', icon: '🏘️' },
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
            <button className="px-4 py-2 text-sm font-medium text-green-100/70 hover:text-white rounded-lg hover:bg-white/10 transition-all flex items-center gap-1.5">
                {item.label}
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Panel */}
            <div className={`absolute top-full left-0 mt-1 w-64 glass-card p-3 shadow-2xl transition-all duration-300 origin-top z-50 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="space-y-1">
                    {item.links.map((link) => (
                        <NavLink
                            key={link.label}
                            to={link.href}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-white/10 ${isActive ? 'bg-heritage-gold/10 text-heritage-gold' : 'text-text-secondary hover:text-white'}`}
                            onClick={() => setIsOpen(false)}
                        >
                            <span className="text-xl">{link.icon}</span>
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
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-heritage-gold/15 flex items-center justify-center border border-heritage-gold/30 group-hover:bg-heritage-gold/25 group-hover:border-heritage-gold/50 transition-all duration-300 animate-glow">
                            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                                <path d="M6 32 L6 18 Q6 8 14 8 L14 6 L16 6 L16 8 Q20 4 24 8 L24 6 L26 6 L26 8 Q34 8 34 18 L34 32" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
                                <path d="M14 32 L14 20 Q14 14 20 14 Q26 14 26 20 L26 32" stroke="#D4AF37" strokeWidth="1.8" fill="none" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-heading font-black text-xl sm:text-2xl text-white leading-none tracking-tight">
                                telangana<span className="gold-text">.live</span>
                            </h1>
                            <p className="text-[9px] sm:text-[10px] text-green-200/50 tracking-[0.3em] uppercase font-bold">2026 Civic Portal</p>
                        </div>
                    </Link>

                    {/* Desktop Nav - Mega Menu */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {megaMenuData.map((item) => (
                            <NavDropdown key={item.label} item={item} />
                        ))}
                        <Link to="/#rates" className="ml-4 px-5 py-2.5 rounded-full bg-heritage-gold text-dark-bg text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-heritage-gold/20">
                            Live Status
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden text-white p-3 hover:bg-white/10 rounded-2xl transition-all duration-300"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <nav className="px-4 py-8 space-y-6">
                    {megaMenuData.map((category) => (
                        <div key={category.label}>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-200/40 mb-3 px-2">{category.label}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {category.links.map((link) => (
                                    <NavLink
                                        key={link.label}
                                        to={link.href}
                                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] text-sm text-green-100 hover:text-heritage-gold transition-all active:scale-95"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span className="text-xl">{link.icon}</span>
                                        <span className="font-bold whitespace-nowrap">{link.label}</span>
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
