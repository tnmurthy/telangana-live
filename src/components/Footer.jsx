import { Link } from 'react-router-dom';
import { Icons } from './Icons';

export default function Footer() {
    const quickLinks = [
        { label: 'Gold & Silver Rates', href: '/dashboard#rates', isRoute: true },
        { label: 'Fuel Prices', href: '/dashboard#rates', isRoute: true },
        { label: 'District Weather', href: '/dashboard#districts', isRoute: true },
        { label: 'Power Tariff', href: '/dashboard#districts', isRoute: true },
        { label: 'Hospitals', href: '/dashboard#services', isRoute: true },
        { label: 'Schools', href: '/dashboard#services', isRoute: true },
        { label: 'AI Pulse Briefing', href: '/ai-pulse', isRoute: true },
        { label: 'Content Cockpit 🔐', href: '/admin/cockpit', isRoute: true },
    ];

    return (
        <footer className="border-t border-white/[0.04] mt-16 mb-20 md:mb-0 relative">
            {/* Top gradient line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-heritage-gold/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading font-extrabold text-xl text-white mb-3 tracking-tight">
                            telangana<span className="gold-text">.live</span>
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            Your comprehensive daily portal for Telangana — gold rates, fuel prices, weather, news, and local services for all 33 districts.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-bold text-xs text-text-muted mb-4 uppercase tracking-[0.15em]">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            {quickLinks.map((link) => (
                                link.isRoute ? (
                                    <Link key={link.label} to={link.href}
                                        className="text-sm text-text-secondary hover:text-heritage-gold transition-all duration-300 hover:translate-x-1 inline-block flex items-center gap-1">
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a key={link.label} href={link.href}
                                        className="text-sm text-text-secondary hover:text-heritage-gold transition-all duration-300 hover:translate-x-1 inline-block">
                                        {link.label}
                                    </a>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-heading font-bold text-xs text-text-muted mb-4 uppercase tracking-[0.15em]">Connect</h4>
                        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                            Data is updated daily. For live feeds, connect our APIs.
                        </p>
                        <div className="flex gap-2">
                            {[
                                { label: 'Twitter/X', icon: 'X' },
                                { label: 'WhatsApp', icon: 'WhatsApp' },
                                { label: 'Telegram', icon: 'Telegram' },
                            ].map((social) => (
                                <a key={social.label} href="#"
                                    className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm hover:border-heritage-gold/30 hover:bg-heritage-gold/5 hover:text-heritage-gold transition-all duration-300 hover-lift"
                                    title={social.label}>
                                    {Icons[social.icon] ? Icons[social.icon]({ className: "w-5 h-5" }) : social.label[0]}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">© 2026 telangana.live — Made with passion in Telangana</p>
                    <p className="text-xs text-text-muted">All rates are indicative. Verify with official sources.</p>
                </div>
            </div>
        </footer>
    );
}
