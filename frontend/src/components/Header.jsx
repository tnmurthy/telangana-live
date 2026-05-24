import { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { useAppContext } from '../context/AppContext';
import confetti from 'canvas-confetti';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const { searchQuery, setSearchQuery, theme, toggleTheme, streak } = useAppContext();
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Confetti on streak milestone
    useEffect(() => {
        if (streak.reads === 5) {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.2 }, colors: ['#00a86b', '#d4a843', '#ffffff'] });
        }
    }, [streak.reads]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearch = useCallback((e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim()) navigate('/search');
    }, [setSearchQuery, navigate]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        inputRef.current?.focus();
    }, [setSearchQuery]);

    return (
        <header className={`sticky top-0 z-[60] transition-all duration-500 ${
            scrolled
            ? 'bg-dark-bg/85 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-white/[0.04] py-1.5'
            : 'bg-dark-bg/95 backdrop-blur-xl py-2.5'
        }`}>
            <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
                <div className="flex items-center gap-4 lg:gap-6 justify-between h-12 lg:h-14">

                    {/* Left: Branding */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-text-secondary transition-colors" aria-label="Menu">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                        </button>
                        <Link to="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-telangana-green to-emerald-600 flex items-center justify-center shadow-lg shadow-telangana-green/20 group-hover:shadow-telangana-green/30 transition-all duration-300 group-hover:scale-105">
                              <span className="text-white font-black text-base tracking-tighter">T</span>
                            </div>
                            <div className="hidden sm:flex flex-col -space-y-0.5">
                              <h1 className="font-heading font-extrabold text-[1.05rem] text-white tracking-tight leading-none">
                                   telangana<span className="text-telangana-green">.live</span>
                              </h1>
                              <span className="text-[9px] text-text-muted font-medium tracking-[0.15em] uppercase">Civic Portal</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Search Bar */}
                    <div className={`flex-grow max-w-xl transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
                        <div className={`relative flex items-center rounded-xl transition-all duration-300 border ${
                            searchFocused
                            ? 'bg-white/[0.08] border-telangana-green/40 shadow-[0_0_24px_rgba(0,168,107,0.08)]'
                            : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1]'
                        }`}>
                            <div className="pl-3.5 text-text-muted">
                                <Icons.Search className="w-4 h-4" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search topics, locations, or news..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="w-full bg-transparent border-none py-2.5 px-3 text-sm text-white placeholder:text-text-muted/70 focus:ring-0 outline-none font-medium"
                            />
                            {searchQuery && (
                                <button onClick={clearSearch} className="pr-3 text-text-muted hover:text-white transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                        {/* Reading streak */}
                        {streak.count > 0 && (
                            <div
                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-heritage-gold/10 border border-heritage-gold/20 cursor-default"
                                title={`${streak.reads} articles read today`}
                            >
                                <span className="text-sm">🔥</span>
                                <span className="text-[10px] font-bold text-heritage-gold">{streak.count}d</span>
                            </div>
                        )}

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-all duration-200"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark'
                                ? <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
                                : <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
                            }
                        </button>

                        <button className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-all duration-200" title="Notifications">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>
                        </button>
                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-telangana-green to-emerald-500 flex items-center justify-center text-white font-bold text-[11px] cursor-pointer hover:shadow-lg hover:shadow-telangana-green/20 transition-all duration-300 ring-2 ring-white/5 hover:ring-white/10">
                            TG
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
