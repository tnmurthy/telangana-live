import { Link } from 'react-router-dom';

// A page whose data we don't hold. These pages used to show made-up figures
// (forecasts, budgets, tax rates, jobs, water timings, ...) as real (TL-47);
// they now say so plainly and send people to the authority that publishes
// the real thing.
export default function OfficialSource({ title, intro, sources, children }) {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-6">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white mb-3">{title}</h1>
                <p className="text-text-secondary">{intro}</p>
            </header>

            {sources.map((s) => {
                const body = (
                    <>
                        <div className="text-white font-semibold">{s.name}{s.href.startsWith('/') ? '' : ' ↗'}</div>
                        <p className="text-sm text-text-muted mt-1">{s.what}</p>
                    </>
                );
                const className = 'glass-card p-5 block hover:border-telangana-green/40 transition-colors';
                return s.href.startsWith('/')
                    ? <Link key={s.href} to={s.href} className={className}>{body}</Link>
                    : <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className={className}>{body}</a>;
            })}

            {children}
        </div>
    );
}
