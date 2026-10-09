import { metroData } from '../data/transportData';
import newsData from '../data/news.json';
import { Icons } from './Icons';

// Crowd meters, peak hours, a metro "takeover" banner, MMTS timings and
// transit alerts from a fixed May file used to be here; none was sourced
// (TL-47). The card lists the lines, real news about them, and where to check
// timings.
const LINKS = [
    { name: 'Hyderabad Metro', href: 'https://ltmetro.com/', what: 'Timings, fares and service updates' },
    { name: 'TGSRTC', href: 'https://www.tgsrtc.telangana.gov.in/', what: 'City bus routes and passes' },
    { name: 'South Central Railway', href: 'https://scr.indianrailways.gov.in/', what: 'MMTS timetable' },
];

export default function MetroCard({ variant = 'default' }) {
    const isDistrict = variant === 'district';

    return (
        <section className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-[#15181d] p-4 sm:p-5 shadow-md' : ''} animate-fade-in`}>
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <Icons.Airport className="w-6 h-6 rotate-[225deg]" /> Public Transport
                    </h2>
                    <p className="section-subtitle">Metro lines and where to check timings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {metroData.lines.map((line) => {
                    const correlatedNews = newsData?.filter((article) =>
                        article.correlated_civic_entities?.some((ent) => ent.entity_type === 'metro_line' && ent.entity_id === line.name)
                    ) || [];
                    return (
                        <div key={line.name} className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-white/[0.03] p-4' : 'glass-card p-4'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: line.color }}></span>
                                <span className="text-sm font-bold text-white">{line.name}</span>
                            </div>
                            <p className="text-xs text-text-secondary">{line.route}</p>
                            {correlatedNews.slice(0, 1).map((news) => (
                                <a key={news.link} href={news.link} target="_blank" rel="noopener noreferrer" className="mt-3 block text-[11px] text-text-muted hover:text-white">
                                    📰 {news.title}
                                </a>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LINKS.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="detail-box block hover:bg-white/[0.06] transition-colors">
                        <span className="text-sm font-semibold text-white">{l.name} ↗</span>
                        <p className="text-[11px] text-text-muted mt-0.5">{l.what}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
