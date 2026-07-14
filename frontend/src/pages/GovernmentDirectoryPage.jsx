import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Building2, ExternalLink, Landmark, MapPinned, Search, ShieldCheck } from 'lucide-react';
import { governmentDirectory, governmentDirectoryCategories } from '../data/governmentDirectoryData';
import districtsData from '../data/districts.json';

const categoryIcon = { Departments: Building2, 'State bodies': Landmark, 'Citizen services': ShieldCheck };

export default function GovernmentDirectoryPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const districtEntries = useMemo(() => Object.entries(districtsData)
    .map(([slug, meta]) => ({ slug, ...meta }))
    .sort((a, b) => a.district.localeCompare(b.district)), []);
  const entries = useMemo(() => {
    const term = query.trim().toLowerCase();
    return governmentDirectory.filter((entry) => (activeCategory === 'All' || entry.category === activeCategory)
      && (!term || [entry.name, entry.description, entry.tag, entry.category].join(' ').toLowerCase().includes(term)));
  }, [activeCategory, query]);

  return <main className="max-w-6xl mx-auto px-4 mt-6 pb-24 space-y-8 animate-fade-in">
    <Helmet>
      <title>Telangana Government Directory | Telangana.live</title>
      <meta name="description" content="A Telangana-focused directory of official departments, state bodies, citizen services and district portals." />
      <link rel="canonical" href="https://telangana.live/government" />
    </Helmet>

    <section className="relative overflow-hidden rounded-[28px] border border-heritage-gold/20 bg-[#101a15] px-6 py-8 sm:px-9 sm:py-10 shadow-2xl shadow-black/20">
      <div className="absolute -right-12 -top-16 h-72 w-72 rounded-full bg-heritage-gold/10 blur-3xl" /><div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-telangana-green/10 blur-3xl" />
      <div className="relative grid gap-7 lg:grid-cols-[1.35fr_.85fr] lg:items-end"><div>
        <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-heritage-gold"><Landmark className="h-4 w-4" /> Official links directory</div>
        <h1 className="max-w-2xl font-heading text-3xl font-black tracking-tight text-white sm:text-5xl">Telangana Government <span className="text-telangana-green">Directory</span></h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">Find official Telangana departments, state bodies, digital citizen services and district portals in one focused starting point.</p>
      </div><div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/15 p-3 backdrop-blur-sm">
        <div className="rounded-xl bg-white/[0.04] p-3"><strong className="block text-xl text-white">33</strong><span className="text-[10px] uppercase tracking-wider text-text-muted">Districts</span></div><div className="rounded-xl bg-white/[0.04] p-3"><strong className="block text-xl text-white">3</strong><span className="text-[10px] uppercase tracking-wider text-text-muted">Directory types</span></div><div className="rounded-xl bg-white/[0.04] p-3"><strong className="block text-xl text-white">100%</strong><span className="text-[10px] uppercase tracking-wider text-text-muted">Official links</span></div>
      </div></div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center"><label className="relative block"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search departments, services or topics..." className="w-full rounded-xl border border-white/10 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-telangana-green/60 focus:ring-1 focus:ring-telangana-green/30 placeholder:text-text-muted" /></label><div className="flex gap-2 overflow-x-auto pb-1 lg:justify-end">{governmentDirectoryCategories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${activeCategory === category ? 'bg-telangana-green text-[#062218]' : 'border border-white/10 bg-white/[0.025] text-text-secondary hover:border-white/25 hover:text-white'}`}>{category}</button>)}</div></section>

    <section aria-live="polite"><div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-xl font-black text-white">{activeCategory === 'All' ? 'Official directory' : activeCategory}</h2><span className="text-xs text-text-muted">{entries.length} links</span></div>{entries.length ? <div className="grid gap-3 md:grid-cols-2">{entries.map((entry) => { const Icon = categoryIcon[entry.category]; return <a key={entry.name} href={entry.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-telangana-green/40 hover:bg-white/[0.05]"><div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-telangana-green/10 text-telangana-green ring-1 ring-telangana-green/20"><Icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-bold leading-snug text-white group-hover:text-telangana-green">{entry.name}</h3><ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-text-muted group-hover:text-telangana-green" /></div><p className="mt-1.5 text-sm leading-6 text-text-secondary">{entry.description}</p><span className="mt-3 inline-flex rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">{entry.tag}</span></div></div></a>; })}</div> : <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-text-muted">No official directory links match “{query}”.</div>}</section>

    <section className="rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-white/[0.045] to-transparent p-6 sm:p-7">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-heritage-gold">
            <MapPinned className="h-5 w-5" />
            <h2 className="font-heading text-xl font-black">District pages</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            These are the existing district pages already used across Telangana.live for local news, services and district-specific context.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {districtEntries.map((district) => (
          <Link
            key={district.slug}
            to={`/${district.slug}`}
            className="group rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3 transition hover:-translate-y-0.5 hover:border-telangana-green/35 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-white group-hover:text-telangana-green">{district.title}</p>
                <p className="mt-1 text-[11px] leading-5 text-text-muted">{district.subtitle}</p>
              </div>
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-text-muted group-hover:text-telangana-green" />
            </div>
          </Link>
        ))}
      </div>
    </section>
    <p className="border-l-2 border-heritage-gold/70 pl-3 text-xs leading-5 text-text-muted">Telangana.live is an independent civic guide. Transactions, applications and official records are handled on the linked government websites.</p>
  </main>;
}
