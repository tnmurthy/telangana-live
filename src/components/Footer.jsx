import { Link } from 'react-router-dom';
import { Icons } from './Icons';

export default function Footer() {
    const quickLinks = [
        { label: 'Gold & Silver Rates', href: '/rates/gold', isRoute: true },
        { label: 'Fuel Prices', href: '/rates/fuel', isRoute: true },
        { label: 'District Weather', href: '/dashboard', isRoute: true },
        { label: 'Metro & Transport', href: '/transport/metro', isRoute: true },
        { label: 'AI Pulse Briefing', href: '/ai-pulse', isRoute: true },
        { label: 'Basthi Dawakhana', href: '/health/basthi-dawakhana', isRoute: true },
    ];

    return (
        <footer className="border-t border-white/[0.04] mt-12 mb-16 md:mb-0 relative">
            {/* Top gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-telangana-green/15 to-transparent" />

            <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading font-extrabold text-lg text-white mb-2.5 tracking-tight">
                            telangana<span className="green-text">.live</span>
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                            Your comprehensive daily portal for Telangana — gold rates, fuel prices, weather, news, and local services.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-[10px] text-text-muted mb-3.5 uppercase tracking-[0.15em]">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            {quickLinks.map((link) => (
                                <Link key={link.label} to={link.href}
                                    className="text-sm text-text-secondary hover:text-telangana-green transition-colors duration-200 inline-flex items-center gap-1 group">
                                    <svg className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-50 group-hover:ml-0 transition-all duration-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-heading font-bold text-[10px] text-text-muted mb-3.5 uppercase tracking-[0.15em]">Connect</h4>
                        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                            Data updated daily. For live feeds, connect our APIs.
                        </p>
                        <div className="flex gap-2">
                            {[
                                { label: 'Twitter/X', icon: 'X' },
                                { label: 'WhatsApp', icon: 'WhatsApp' },
                                { label: 'Telegram', icon: 'Telegram' },
                            ].map((social) => (
                                <a key={social.label} href="#"
                                    className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm text-text-muted hover:border-telangana-green/30 hover:bg-telangana-green/5 hover:text-telangana-green transition-all duration-300"
                                    title={social.label}>
                                    {Icons[social.icon] ? Icons[social.icon]({ className: "w-4 h-4" }) : social.label[0]}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="divider mb-6"></div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p className="text-[11px] text-text-muted">© 2026 telangana.live — Made with passion in Telangana</p>
                    <p className="text-[11px] text-text-muted/60">All rates are indicative. Verify with official sources.</p>
                </div>
            </div>
        </footer>
    );
}
