// Gold and silver rates were read from retail-rate pages whose terms may not
// allow it (Goodreturns, Mint, Live Chennai). We no longer publish our own
// rates; this page explains where to find the reference rate (TL-46).

const SOURCES = [
    {
        name: 'IBJA reference rates',
        href: 'https://ibjarates.com/',
        what: 'Daily gold and silver rates published by the India Bullion and Jewellers Association, used by many jewellers as a benchmark.',
    },
];

const TIPS = [
    'Retail prices are the reference rate plus making charges, which vary by jeweller and design.',
    'GST of 3% applies to the value of gold jewellery; making charges attract GST separately.',
    'Ask for a BIS hallmark (HUID) on every piece.',
];

export default function GoldLandingPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in space-y-8">
            <header>
                <h1 className="text-3xl font-heading font-bold text-white mb-3">Gold &amp; Silver Rates in Hyderabad</h1>
                <p className="text-text-secondary">
                    We don&apos;t publish our own gold or silver rates. Check the reference rate and your jeweller&apos;s
                    quote before you buy.
                </p>
            </header>

            {SOURCES.map((s) => (
                <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-5 block hover:border-heritage-gold/40 transition-colors"
                >
                    <div className="text-white font-semibold">{s.name} ↗</div>
                    <p className="text-sm text-text-muted mt-1">{s.what}</p>
                </a>
            ))}

            <section className="glass-card p-5 space-y-2">
                <h2 className="text-white font-bold">Before you buy</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                    {TIPS.map((t) => <li key={t}>{t}</li>)}
                </ul>
            </section>
        </div>
    );
}
