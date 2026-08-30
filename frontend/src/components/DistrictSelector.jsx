import { useState, useRef, useEffect } from 'react';
import { districts } from '../data/districts';

export default function DistrictSelector({ selectedDistrict, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    const filtered = districts.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="text-[10px] text-text-muted uppercase tracking-[0.15em] mb-2 block font-semibold">
                📍 Select District
            </label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full glass-card px-4 py-3.5 text-left flex items-center justify-between hover:border-heritage-gold/30 transition-all duration-300 active:scale-[0.99]"
            >
                <div>
                    <span className="text-white font-semibold">{selectedDistrict}</span>
                    <span className="text-text-muted text-xs ml-2">
                        (HQ: {districts.find((d) => d.name === selectedDistrict)?.hq})
                    </span>
                </div>
                <svg className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            <div className={`absolute top-full left-0 right-0 mt-2 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                <div className="bg-slate-900 border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/60 max-h-80 overflow-hidden">
                    {/* Search */}
                    <div className="p-3 border-b border-white/[0.05]">
                        <input
                            type="text"
                            placeholder="Search districts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-heritage-gold/40 focus:ring-1 focus:ring-heritage-gold/20 transition-all"
                            autoFocus={isOpen}
                        />
                    </div>
                    {/* List */}
                    <div className="overflow-y-auto max-h-60">
                        {filtered.map((d) => (
                            <button
                                key={d.name}
                                onClick={() => { onSelect(d.name); setIsOpen(false); setSearch(''); }}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-all duration-200 ${d.name === selectedDistrict
                                        ? 'bg-telangana-green/15 text-heritage-gold border-l-2 border-heritage-gold'
                                        : 'text-text-secondary hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent'
                                    }`}
                            >
                                <span className="font-medium">{d.name}</span>
                                <span className="text-[10px] text-text-muted">{d.hq}</span>
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="px-4 py-8 text-center text-text-muted text-sm">No districts found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
