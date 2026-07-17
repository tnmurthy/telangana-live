import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { trackEvent } from '../hooks/usePageTracking';
import useJsonLd from '../hooks/useJsonLd';

const SplashScreen = () => {
  const homepageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Telangana.live",
    "url": "https://telangana.live/",
    "description": "Telangana local information portal with district pages, government links, news, services, alerts and everyday civic utilities."
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Telangana.live",
    "url": "https://telangana.live/",
    "sameAs": [
      "https://telangana.live/dashboard",
      "https://telangana.live/government"
    ]
  };

  useJsonLd(homepageSchema, 'homepage-schema');
  useJsonLd(orgSchema, 'homepage-org-schema');

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <Helmet>
        <title>Telangana.live - Telangana local information, district pages and government links</title>
        <meta
          name="description"
          content="Telangana.live is a local information portal for Telangana with district pages, government directory links, news, services, alerts and civic utilities."
        />
        <link rel="canonical" href="https://telangana.live/" />
        <meta property="og:title" content="Telangana.live - Telangana local information, district pages and government links" />
        <meta
          property="og:description"
          content="Telangana.live is a local information portal for Telangana with district pages, government directory links, news, services, alerts and civic utilities."
        />
        <meta property="og:url" content="https://telangana.live/" />
        <meta name="twitter:title" content="Telangana.live - Telangana local information, district pages and government links" />
      </Helmet>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-telangana-green/8 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] bg-heritage-gold/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 max-w-3xl w-full space-y-10">
        <div className="flex flex-col items-center space-y-5 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-telangana-green rounded-2xl flex items-center justify-center shadow-2xl shadow-telangana-green/25 hover:scale-105 transition-transform duration-500 ring-1 ring-white/10">
            <Icons.Govt className="w-10 h-10 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-heading">
              telangana<span className="green-text font-black">.live</span>
            </h1>
            <p className="text-text-muted text-sm font-medium tracking-[0.2em] uppercase">
              Telangana local information portal
            </p>
          </div>
        </div>

        <div className="glass-card p-8 animate-in delay-200">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live · 2026
            </div>

            <h2 className="text-2xl font-semibold text-white leading-tight font-heading">
              Local Telangana information for citizens, districts and everyday civic needs
            </h2>

            <p className="text-text-muted text-sm leading-relaxed max-w-lg mx-auto">
              News, district pages, government links, emergency contacts, jobs, ration, schemes and utility updates — everything citizens need, in one place.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-telangana-green">What this site is</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Telangana.live is an independent civic guide for Telangana. It connects people to district pages, government directories, live updates and practical public-service shortcuts.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-left">
              <Link to="/dashboard" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">Primary hub</div>
                <div className="mt-1 font-semibold text-white">Dashboard</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">Live civic briefing, alerts and Telangana news.</p>
              </Link>
              <Link to="/government" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">Government</div>
                <div className="mt-1 font-semibold text-white">Directory</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">Helplines, office details and official resource links.</p>
              </Link>
              <Link to="/hyderabad" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">District</div>
                <div className="mt-1 font-semibold text-white">Hyderabad</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">City-level civic and district updates.</p>
              </Link>
              <Link to="/warangal" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">District</div>
                <div className="mt-1 font-semibold text-white">Warangal</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">District information and local page coverage.</p>
              </Link>
              <Link to="/services" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">Services</div>
                <div className="mt-1 font-semibold text-white">Citizen tools</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">Core government and utility services in one place.</p>
              </Link>
              <Link to="/news" className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:border-telangana-green/40 hover:bg-white/[0.05] transition-colors">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">Updates</div>
                <div className="mt-1 font-semibold text-white">News</div>
                <p className="mt-2 text-sm text-text-secondary leading-6">Crawlable, continuously refreshed Telangana news.</p>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                { icon: '📰', label: 'Live News' },
                { icon: '💧', label: 'Water Updates' },
                { icon: '🆘', label: 'SOS Contacts' },
                { icon: '📋', label: 'Gov Schemes' },
              ].map(({ icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary font-medium">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/dashboard"
                onClick={() => trackEvent('cta_click', { label: 'Explore Dashboard', location: 'Splash' })}
                className="px-7 py-3.5 bg-gradient-to-r from-telangana-green to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-telangana-green/20 transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-sm"
              >
                Explore Dashboard →
              </Link>
              <Link
                to="/schemes"
                onClick={() => trackEvent('cta_click', { label: 'Government Schemes', location: 'Splash' })}
                className="px-7 py-3.5 bg-white/[0.05] text-white border border-white/[0.08] rounded-xl font-bold hover:bg-white/[0.08] hover:border-white/[0.12] transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-sm"
              >
                Government Schemes
              </Link>
            </div>
          </div>
        </div>

        <div className="text-text-muted/30 text-[10px] font-medium uppercase tracking-[0.2em] animate-in delay-500">
          © 2026 Telangana Civic Infrastructure · v1.0
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
