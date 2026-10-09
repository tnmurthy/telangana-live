import { DATA_SOURCES, CORRECTIONS } from '../data/dataSources';

export default function SourcesPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-10">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white mb-3">Where our data comes from</h1>
                <p className="text-text-secondary">
                    Every live figure on Telangana.live, its source and how often it updates. When a source is down we
                    show nothing rather than guess.
                </p>
            </header>

            <section aria-labelledby="sources-heading" className="space-y-3">
                <h2 id="sources-heading" className="text-xl text-white font-bold">Sources</h2>
                {DATA_SOURCES.map((s) => (
                    <article key={s.dataset} className="glass-card p-4 space-y-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <h3 className="text-white font-semibold">{s.dataset}</h3>
                            <span className="text-[11px] text-text-muted">{s.refresh}</span>
                        </div>
                        <p className="text-sm text-text-secondary">
                            {s.sourceUrl ? (
                                <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{s.source}</a>
                            ) : s.source}
                        </p>
                        <p className="text-xs text-text-muted">{s.notes}</p>
                    </article>
                ))}
            </section>

            <section aria-labelledby="corrections-heading" className="space-y-3">
                <h2 id="corrections-heading" className="text-xl text-white font-bold">Corrections</h2>
                <ul className="space-y-2">
                    {CORRECTIONS.map((c) => (
                        <li key={c.what} className="text-sm text-text-secondary">
                            <span className="text-text-muted mr-2">{c.date}</span>{c.what}
                        </li>
                    ))}
                </ul>
            </section>

            <p className="text-xs text-text-muted">
                Spotted a wrong figure? Write to <a href="mailto:legal@telangana.live" className="underline">legal@telangana.live</a>.
            </p>
        </div>
    );
}
