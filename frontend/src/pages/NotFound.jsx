import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="glass-card p-10 max-w-lg w-full">
                <h1 className="text-8xl font-black gold-text mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Page Not Found</h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                    The page you're looking for might have been moved, deleted, or doesn't exist in the 2026 civic dataset.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/15 transition-all group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
