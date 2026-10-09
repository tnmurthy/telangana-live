// The tracker ranked named MLAs and MPs by an "accountability score" built
// from attendance, questions and fund-use figures that were made up, credited
// to the Legislative Assembly, with invented phone numbers (TL-44). Until a
// sourced dataset exists the page points to the official records instead.

const SOURCES = [
  {
    name: 'MyNeta (Association for Democratic Reforms)',
    href: 'https://myneta.info/',
    what: 'Candidate affidavits: criminal cases, assets, liabilities and education, for every Telangana MLA and MP.',
  },
  {
    name: 'Election Commission of India: results',
    href: 'https://results.eci.gov.in/',
    what: 'Official constituency-wise results for Assembly and Lok Sabha elections.',
  },
];

export default function PoliticianTrackerPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🏛️</div>
        <div className="relative z-10">
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Your Representatives</h2>
          <p className="text-text-secondary">
            We don't publish performance scores for MLAs or MPs yet. We'll add them only when every figure
            comes from a published record we can cite.
          </p>
        </div>
      </div>

      <div className="glass-card section-block space-y-4">
        <h3 className="label-xs">Where to look today</h3>
        {SOURCES.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-telangana-green/40 transition-colors"
          >
            <div className="text-white font-semibold">{s.name} ↗</div>
            <p className="text-xs text-text-muted mt-1">{s.what}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
