import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icons } from './Icons';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-[60] transition-all duration-300 ${
            scrolled 
            ? 'bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 py-2' 
            : 'bg-dark-bg py-3'
        }`}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 lg:gap-8 justify-between h-12 lg:h-14">
                    
                    {/* Left: Branding */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button className="lg:hidden p-2 hover:bg-white/5 rounded-full text-text-secondary">
                          <Icons.Info size="md" /> {/* Burger Menu Placeholder */}
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-telangana-green/20 flex items-center justify-center border border-telangana-green/30">
                              <span className="text-telangana-green font-black text-lg">T</span>
                            </div>
                            <span className="font-heading font-black text-lg text-white hidden sm:block tracking-tight">
                                Live<span className="text-telangana-green">TN</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Search Bar (Google News Style) */}
                    <div className={`flex-grow max-w-2xl transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
                        <div className={`relative group flex items-center rounded-2xl transition-all border ${
                            searchFocused 
                            ? 'bg-white/10 border-telangana-green/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' 
                            : 'bg-white/5 border-transparent hover:bg-white/[0.08]'
                        }`}>
                            <div className="pl-4 text-text-muted">
                                <Icons.Search className="w-4 h-4" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search for civic topics, locations, or news..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="w-full bg-transparent border-none py-2.5 lg:py-3 px-3 text-sm text-white placeholder:text-text-muted focus:ring-0 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <button className="p-2.5 hover:bg-white/5 rounded-full text-text-muted hover:text-white transition-colors" title="Settings">
                            <Icons.Info size="md" />
                        </button>
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-tr from-telangana-green to-emerald-400 border-2 border-white/10 flex items-center justify-center text-dark-bg font-black text-xs cursor-pointer hover:shadow-lg hover:shadow-telangana-green/20 transition-all">
                            JS
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
