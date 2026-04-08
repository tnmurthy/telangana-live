import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import newsData from '../data/news.json';
import { schemes } from '../data/schemesData';
import { services } from '../data/services';
import NewsCard from '../components/NewsCard';

// Flatten services into a searchable list
const CATEGORY_ROUTES = {
    Hospitals: '/health/basthi-dawakhana',
    Schools: '/dashboard',
    Markets: '/dashboard',
    Parks: '/dashboard',
};

function flattenServices() {
    const flat = [];
    for (const [key, category] of Object.entries(services)) {
        const route = CATEGORY_ROUTES[category.label] || '/dashboard';
        (category.items || []).forEach(item => {
            flat.push({
                id: `svc-${key}-${item.name}`,
                name: item.name,
                area: item.area,
                type: item.type,
                category: category.label,
                route,
            });
        });
    }
    return flat;
}

const flatServices = flattenServices();

function highlight(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
        regex.test(part)
            ? <mark key={i} className="bg-heritage-gold/30 text-heritage-gold rounded px-0.5">{part}</mark>
            : part
    );
}

function SectionHeader({ icon, title, count }) {
    return (
        <div className="flex items-center gap-2.5 px-1 mb-4">
            <span className="text-xl">{icon}</span>
            <h2 className="text-base font-bold text-white tracking-tight font-heading">{title}</h2>
            <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
            <div className="flex-grow h-px bg-gradient-to-r from-white/[0.08] to-transparent ml-2" />
        </div>
    );
}

export default function SearchPage() {
    const { searchQuery } = useAppContext();
    const q = (searchQuery || '').trim().toLowerCase();

    const matchedNews = useMemo(() => {
        if (!q) return newsData.slice(0, 10);
        return newsData.filter(n =>
            n.title.toLowerCase().includes(q) ||
            (n.description || '').toLowerCase().includes(q) ||
            (n.region || '').toLowerCase().includes(q) ||
            (n.source || '').toLowerCase().includes(q) ||
            (n.category || '').toLowerCase().includes(q)
        );
    }, [q]);

    const matchedSchemes = useMemo(() => {
        if (!q) return [];
        return schemes.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.benefit.toLowerCase().includes(q) ||
            s.eligibility.toLowerCase().includes(q)
        );
    }, [q]);

    const matchedServices = useMemo(() => {
        if (!q) return [];
        return flatServices.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.area || '').toLowerCase().includes(q) ||
            (s.type || '').toLowerCase().includes(q) ||
            (s.category || '').toLowerCase().includes(q)
        );
    }, [q]);

    const totalResults = matchedNews.length + matchedSchemes.length + matchedServices.length;

    return (
        <div className="space-y-8 pb-20 animate-in">
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">🔍</span>
                    <div>
                        <h1 className="text-lg font-black text-white">
                            {q ? (
                                <>Search results for: <span className="text-heritage-gold">&ldquo;{q}&rdquo;</span></>
                            ) : (
                                'Search Telangana Portal'
                            )}
                        </h1>
                        <p className="text-xs text-text-muted mt-1">
                            {q
                                ? `${totalResults} result${totalResults !== 1 ? 's' : ''} across News, Schemes & Services`
                                : 'Use the search bar above to find news, government schemes, hospitals, schools and more.'}
                        </p>
                    </div>
                </div>
            </div>

            {q && totalResults === 0 && (
                <div className="glass-card p-10 text-center space-y-3">
                    <span className="text-5xl">😶‍🌫️</span>
                    <p className="text-base font-bold text-white">No results found</p>
                    <p className="text-sm text-text-muted">Try different keywords or browse by category using the sidebar.</p>
                </div>
            )}

            {/* News */}
            {matchedNews.length > 0 && (
                <section>
                    <SectionHeader icon="📰" title="News" count={matchedNews.length} />
                    <div className="grid grid-cols-1 gap-4">
                        {matchedNews.map((news, idx) => (
                            <NewsCard key={news.link || idx} news={news} />
                        ))}
                    </div>
                </section>
            )}

            {/* Government Schemes */}
            {matchedSchemes.length > 0 && (
                <section>
                    <SectionHeader icon="🏛️" title="Government Schemes" count={matchedSchemes.length} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {matchedSchemes.map(scheme => (
                            <Link
                                key={scheme.id}
                                to="/schemes"
                                className="glass-card p-4 hover-lift border border-white/5 group"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{scheme.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white group-hover:text-heritage-gold transition-colors">
                                            {highlight(scheme.name, q)}
                                        </p>
                                        <p className="text-[11px] text-text-muted mt-0.5">{scheme.category}</p>
                                        <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                                            {highlight(scheme.benefit, q)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Services Directory */}
            {matchedServices.length > 0 && (
                <section>
                    <SectionHeader icon="🏥" title="Services Directory" count={matchedServices.length} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchedServices.map(svc => (
                            <Link
                                key={svc.id}
                                to={svc.route}
                                className="detail-box flex items-start gap-3 hover-lift group"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white group-hover:text-telangana-green transition-colors">
                                        {highlight(svc.name, q)}
                                    </p>
                                    <p className="text-[10px] text-text-muted mt-0.5">
                                        {svc.category} · {highlight(svc.area, q)}
                                    </p>
                                    {svc.type && (
                                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded-full text-text-muted">
                                            {svc.type}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
