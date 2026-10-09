import { useState } from 'react';
import { parks } from '../data/parksData';

function ParkCard({ park }) {
    return (
        <div className="widget-card hover-lift p-4 space-y-3">
            <div className="flex items-start gap-3">
                <span className="text-2xl">{park.icon}</span>
                <div>
                    <h3 className="font-bold text-white text-sm">{park.name}</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">{park.area} · {park.type}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {park.highlights.map(h => (
                    <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-secondary">{h}</span>
                ))}
            </div>

            <a
                href={park.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-telangana-green hover:underline font-medium"
            >
                Directions ↗
            </a>
        </div>
    );
}

export default function ParksPage() {
    const [type, setType] = useState('all');
    const types = ['all', ...new Set(parks.map(p => p.type))];
    const shown = type === 'all' ? parks : parks.filter(p => p.type === type);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="glass-card section-block">
                <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">🌳 Parks &amp; Green Spaces</h2>
                <p className="text-text-secondary">
                    Parks, lakes and sanctuaries across Hyderabad and Telangana. Check timings and entry fees at the
                    park before you go.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {types.map(t => (
                    <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${type === t ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
                    >
                        {t === 'all' ? 'All' : t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shown.map(park => <ParkCard key={park.id} park={park} />)}
            </div>
        </div>
    );
}
