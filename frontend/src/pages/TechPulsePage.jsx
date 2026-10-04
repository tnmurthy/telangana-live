import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { loadTechPulse, freshItems } from '../services/techPulseService';

// Tech & AI Pulse: sourced, dated local news in three sections. Replaces the
// old /ai-pulse page, which showed a fixed 2024 model briefing as "today".
// Items come from backend/scripts/tech_pulse.py; nothing here is generated.

const SECTIONS = [
    {
        key: 'safety',
        title: 'Digital safety',
        blurb: 'AI scams, cyber fraud and police advisories.',
        accent: 'border-red-500/40',
        tag: 'text-red-300',
    },
    {
        key: 'govt',
        title: 'Government & AI',
        blurb: 'State technology programmes, policy and investment.',
        accent: 'border-sky-500/40',
        tag: 'text-sky-300',
    },
    {
        key: 'jobs',
        title: 'Jobs & skills',
        blurb: 'Tech hiring, layoffs and skilling programmes.',
        accent: 'border-emerald-500/40',
        tag: 'text-emerald-300',
    },
];

function StoryRow({ item }) {
    return (
        <li>
            <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl px-3 py-3 -mx-3 hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40 transition-colors"
            >
                <span className="block text-white font-medium leading-snug">{item.title}</span>
                <span className="block mt-1 text-xs text-text-secondary">
                    {item.source} · {item.time}
                </span>
            </a>
        </li>
    );
}

function Section({ section, items, loading }) {
    return (
        <section aria-labelledby={`tp-${section.key}`} className={`glass-card p-6 border-t-2 ${section.accent}`}>
            <h2 id={`tp-${section.key}`} className="text-lg font-bold text-white tracking-tight">{section.title}</h2>
            <p className={`text-sm mt-1 mb-4 ${section.tag}`}>{section.blurb}</p>
            {loading && <p className="text-sm text-text-secondary">Loading…</p>}
            {!loading && items.length === 0 && (
                <p className="text-sm text-text-secondary">
                    No local stories in this section in the last two weeks.
                </p>
            )}
            {!loading && items.length > 0 && (
                <ul className="divide-y divide-white/5">
                    {items.map((item) => <StoryRow key={item.id} item={item} />)}
                </ul>
            )}
        </section>
    );
}

export default function TechPulsePage() {
    const [feed, setFeed] = useState(undefined);

    useEffect(() => {
        let active = true;
        loadTechPulse().then((data) => { if (active) setFeed(data); });
        return () => { active = false; };
    }, []);

    const loading = feed === undefined;
    const items = freshItems(feed);
    const maxAgeDays = feed?.maxAgeDays || 14;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Helmet>
                <title>Tech &amp; AI Pulse — Telangana | Telangana.live</title>
                <meta
                    name="description"
                    content="Sourced local news on AI scams and digital safety, government technology programmes, and tech jobs and skilling in Telangana."
                />
            </Helmet>

            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Tech &amp; AI Pulse</h1>
                <p className="text-text-secondary mt-2 max-w-2xl">
                    Technology news that matters to people in Telangana, from the last {maxAgeDays} days.
                    Every story links to the outlet that reported it.
                </p>
                {feed === null && (
                    <p role="status" className="mt-4 text-sm text-yellow-300">
                        This feed could not be loaded right now. <Link to="/news" className="underline">Read the latest news</Link> instead.
                    </p>
                )}
            </header>

            <div className="grid gap-6 lg:grid-cols-3">
                {SECTIONS.map((section) => (
                    <Section key={section.key} section={section} items={items[section.key]} loading={loading} />
                ))}
            </div>

            <p className="mt-8 text-xs text-text-secondary max-w-3xl">
                Stories are found through Google News and sorted into sections automatically; headlines are the
                outlets&rsquo; own. Nothing older than {maxAgeDays} days is shown.
            </p>
        </div>
    );
}
