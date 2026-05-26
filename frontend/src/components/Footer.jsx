import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-dark-bg-secondary/60 border-t border-white/[0.04] mt-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-telangana-green to-emerald-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-heritage-gold" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth={32} strokeLinecap="round" strokeLinejoin="round">
                <path d="M 160 440 V 220" />
                <path d="M 352 440 V 220" strokeWidth={32} />
                <path d="M 100 220 H 412" strokeWidth={40} />
                <path d="M 120 160 H 392" strokeWidth={24} />
                <path d="M 160 160 Q 256 80 352 160" />
                <path d="M 210 220 Q 256 180 302 220" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-sm text-white">
              TG<span className="text-telangana-green">News</span>
              <span className="text-text-muted font-normal text-xs ml-1">Civic Portal</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-text-muted">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/news" className="hover:text-white transition-colors">News</Link>
            <Link to="/ai-pulse" className="hover:text-white transition-colors">AI Pulse</Link>
            <Link to="/rates/gold" className="hover:text-white transition-colors">Rates</Link>
            <Link to="/health/basthi-dawakhana" className="hover:text-white transition-colors">Health</Link>
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-text-muted/50">
            © {year} Telangana.live — All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
