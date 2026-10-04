import { Link } from 'react-router-dom';

// Temporary stand-in for /ai-pulse. The previous page showed a hard-coded
// placeholder (2024 models, invented benchmark scores) dated "today" every
// day; it is hidden until the Tech & AI Pulse section is rebuilt on real,
// dated sources (backlog TL-17, docs/DATA_STANDARDS.md rule 1).
export default function AIPulseRebuildingPage() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="glass-card p-10 max-w-lg w-full">
                <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">Tech &amp; AI Pulse is being rebuilt</h1>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    We&rsquo;re rebuilding this section around sourced, dated local news: digital-safety and
                    AI-scam alerts, government technology programmes, and tech jobs and skilling in Telangana.
                </p>
                <Link
                    to="/news"
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/15 transition-all"
                >
                    Read the latest news
                </Link>
            </div>
        </div>
    );
}
