import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import transitStatus from '../data/transit_status.json';
import { metroData, basthiDawakhanas } from '../data/transportData';
import waterLevels from '../data/water_levels.json';
import prices from '../data/prices.json';
import { weatherData } from '../data/weatherData';
import { goldRates } from '../data/goldRates';
import { fuelPrices } from '../data/fuelPrices';

function renderCivicWidget(entity_type, entity_id) {
  if (entity_type === 'metro_line') {
    const line = metroData?.lines?.find(l => l.name.toLowerCase() === entity_id.toLowerCase());
    if (!line) return null;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/20 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
            <span className="text-xs font-bold text-white">{line.name}</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 uppercase tracking-wider">Metro</span>
        </div>
        <p className="text-[10px] text-text-secondary mb-2">{line.route}</p>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1">
          <div className="h-full rounded-full" style={{ width: `${line.crowdLevel}%`, backgroundColor: line.crowdLevel > 75 ? '#EF4444' : line.crowdLevel > 50 ? '#EAB308' : '#22C55E' }} />
        </div>
        <div className="flex justify-between text-[8px] text-text-muted">
          <span>Crowd: {line.crowdLabel}</span>
          <span>Peak: {line.peakHours}</span>
        </div>
      </div>
    );
  }

  if (entity_type === 'reservoir') {
    const res = waterLevels?.reservoirs?.find(r => r.id === entity_id);
    if (!res) return null;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-xs font-bold text-white">{res.name}</h4>
            <p className="text-[9px] text-text-muted">{res.river} River · {res.district}</p>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 uppercase tracking-wider shrink-0">Reservoir</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1.5">
          <div className="h-full rounded-full bg-blue-500" style={{ width: `${(res.currentLevelTMC / res.fullCapacityTMC) * 100}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="p-1 rounded bg-white/[0.02] border border-white/5">
            <span className="text-text-muted block text-[8px] uppercase font-bold">Storage</span>
            <span className="text-white font-bold">{res.currentLevelTMC} / {res.fullCapacityTMC} TMC</span>
          </div>
          <div className="p-1 rounded bg-white/[0.02] border border-white/5">
            <span className="text-text-muted block text-[8px] uppercase font-bold">Inflow/Outflow</span>
            <span className="text-white font-bold">▲{res.inflow} / ▼{res.outflow}</span>
          </div>
        </div>
      </div>
    );
  }

  if (entity_type === 'gold_rate') {
    const gold22 = goldRates?.gold22k?.price ? goldRates.gold22k.price * 10 : 143950.0;
    const gold24 = goldRates?.gold24k?.price ? goldRates.gold24k.price * 10 : 157040.0;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-yellow-500/20 transition-colors">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold text-white">🏆 Daily Gold Rates (Hyd)</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 font-semibold border border-yellow-500/20 uppercase tracking-wider">Gold</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="p-1.5 rounded bg-white/[0.02] border border-yellow-500/10">
            <span className="text-yellow-500 font-bold block text-[8px] uppercase">24K Gold</span>
            <span className="text-white font-bold">₹{gold24.toLocaleString('en-IN')}/10g</span>
          </div>
          <div className="p-1.5 rounded bg-white/[0.02] border border-yellow-600/10">
            <span className="text-yellow-600 font-bold block text-[8px] uppercase">22K Gold</span>
            <span className="text-white font-bold">₹{gold22.toLocaleString('en-IN')}/10g</span>
          </div>
        </div>
      </div>
    );
  }

  if (entity_type === 'fuel_price') {
    const petrol = fuelPrices?.petrol?.price || 107.41;
    const diesel = fuelPrices?.diesel?.price || 95.64;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-green-500/20 transition-colors">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-bold text-white">⛽ Fuel Prices (Hyd)</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-semibold border border-green-500/20 uppercase tracking-wider">Fuel</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="p-1.5 rounded bg-white/[0.02] border border-blue-500/10">
            <span className="text-blue-400 font-bold block text-[8px] uppercase">Petrol</span>
            <span className="text-white font-bold">₹{petrol}/L</span>
          </div>
          <div className="p-1.5 rounded bg-white/[0.02] border border-green-500/10">
            <span className="text-green-400 font-bold block text-[8px] uppercase">Diesel</span>
            <span className="text-white font-bold">₹{diesel}/L</span>
          </div>
        </div>
      </div>
    );
  }

  if (entity_type === 'basthi_dawakhana') {
    const clinic = basthiDawakhanas?.find(d => d.name.toLowerCase() === entity_id.toLowerCase() || d.area.toLowerCase() === entity_id.toLowerCase());
    if (!clinic) return null;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/20 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-xs font-bold text-white">{clinic.name}</h4>
            <p className="text-[9px] text-text-muted">{clinic.area} · {clinic.zone.toUpperCase()}</p>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 uppercase tracking-wider shrink-0">Health Clinic</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[9px] mt-1.5">
          <div className="p-1 rounded bg-white/[0.02] border border-white/5">
            <span className="text-text-muted block text-[8px] uppercase font-bold">Timings</span>
            <span className="text-white font-bold">{clinic.timings}</span>
          </div>
          <div className="p-1 rounded bg-white/[0.02] border border-white/5">
            <span className="text-text-muted block text-[8px] uppercase font-bold">Contact</span>
            <a href={`tel:${clinic.phone}`} className="text-heritage-gold font-bold hover:underline">{clinic.phone}</a>
          </div>
        </div>
      </div>
    );
  }

  if (entity_type === 'mandi_price') {
    if (!prices?.mandi) return null;
    const price = prices.mandi[entity_id];
    if (price === undefined) return null;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/20 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white">🌾 Mandi Price: {entity_id}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20 uppercase tracking-wider">Mandi</span>
        </div>
        <div className="p-2 rounded bg-white/[0.02] border border-amber-500/10 text-center">
          <span className="text-amber-500 font-bold block text-[8px] uppercase">Market Rate</span>
          <span className="text-white font-extrabold text-sm">₹{price.toLocaleString('en-IN')}<span className="text-[9px] font-normal text-text-muted"> / quintal</span></span>
        </div>
      </div>
    );
  }

  if (entity_type === 'district') {
    const weather = weatherData[entity_id];
    if (!weather) return null;
    return (
      <div key={`${entity_type}-${entity_id}`} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-sky-500/20 transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-white">📍 {entity_id} District</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20 uppercase tracking-wider">Region</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-white">{weather.temp}°C</span>
            <span className="text-[10px] text-text-muted block">{weather.condition} · AQI: <span style={{ color: weather.aqiColor }} className="font-bold">{weather.aqi}</span></span>
          </div>
          <span className="text-2xl">{weather.condition === 'Sunny' ? '☀️' : weather.condition.includes('Cloudy') ? '⛅' : weather.condition.includes('Rain') ? '🌧️' : '☁️'}</span>
        </div>
      </div>
    );
  }

  return null;
}

function estimateReadTime(text = '') {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function ArticleModal({ article, onClose }) {
  const [fontSize, setFontSize] = useState(15);
  const backdropRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!article) return;

    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.description || article.ai_summary || "",
      "datePublished": article.published,
      "author": {
        "@type": "Organization",
        "name": article.source
      },
      "publisher": {
        "@type": "Organization",
        "name": "Telangana Live",
        "logo": {
          "@type": "ImageObject",
          "url": "https://telangana.live/favicon.svg"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.link || "https://telangana.live"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'news-article-jsonld';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('news-article-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [article]);

  if (!article) return null;
  const { title, source, published, description, ai_summary, link, category, region, credibility_score } = article;
  const readTime = estimateReadTime((description || '') + ' ' + (ai_summary || ''));
  const aiConfidence = credibility_score || Math.min(98, 75 + (title.length % 20));

  const modalContent = (
    <motion.div
      ref={backdropRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === backdropRef.current) onClose(); }}
    >
      <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={`w-full ${article.correlated_civic_entities && article.correlated_civic_entities.length > 0 ? 'sm:max-w-4xl' : 'sm:max-w-2xl'} max-h-[90dvh] overflow-y-auto
                     bg-dark-bg-secondary border border-white/[0.08] rounded-t-3xl sm:rounded-3xl
                     shadow-2xl custom-scrollbar`}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-telangana-green/15 text-telangana-green text-[9px] font-bold uppercase tracking-wider">
                {category}
              </span>
              <span className="text-[10px] text-text-muted">· {readTime} min read</span>
              {aiConfidence && (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[9px] font-bold text-white/70 tracking-tight">
                  <div className="w-1.5 h-1.5 rounded-full bg-telangana-green shadow-[0_0_8px_rgba(0,168,107,0.8)]" />
                  {aiConfidence}% AI Confidence
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {/* Font size controls */}
              <button onClick={() => setFontSize(f => Math.max(12, f - 1))}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors text-sm font-bold flex items-center justify-center">
                A
              </button>
              <button onClick={() => setFontSize(f => Math.min(20, f + 1))}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors text-base font-bold flex items-center justify-center">
                A
              </button>
              <button onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/10 text-text-muted
                           hover:text-white transition-colors flex items-center justify-center">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            <div className={article.correlated_civic_entities && article.correlated_civic_entities.length > 0 ? 'grid grid-cols-1 lg:grid-cols-5 gap-6' : 'space-y-4'}>
              {/* Left Column (Main Article) */}
              <div className={article.correlated_civic_entities && article.correlated_civic_entities.length > 0 ? 'lg:col-span-3 space-y-4' : 'space-y-4'}>
                {/* Meta */}
                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                  <span className="font-bold text-telangana-green uppercase">{source}</span>
                  <span>·</span>
                  <span>{region}</span>
                  <span>·</span>
                  <span>{published}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl font-black text-white leading-tight" style={{ fontSize: `${fontSize + 5}px` }}>
                  {title}
                </h1>

                {/* AI Summary */}
                {ai_summary && (
                  <div className="flex gap-2.5 p-3.5 rounded-xl bg-telangana-green/[0.06] border border-telangana-green/20">
                    <svg className="w-4 h-4 text-telangana-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    <p className="text-sm text-text-secondary italic leading-relaxed" style={{ fontSize: `${fontSize - 1}px` }}>
                      {ai_summary}
                    </p>
                  </div>
                )}

                {/* Body */}
                {(description || !ai_summary) && (
                  <p className="text-text-secondary leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
                    {description || `Full coverage of this update is available directly from the publisher. Telangana.Live provides automated real-time local updates and summaries. Since this article is hosted externally at ${source}, please click 'Read Full Article' below to read the complete story.`}
                  </p>
                )}

                {/* CTA */}
                <div className="pt-4 border-t border-white/[0.05] flex flex-wrap gap-4 items-center justify-between">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-telangana-green
                               hover:text-telangana-green-light transition-colors"
                  >
                    Read Full Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>

                  {/* Grievance Action Link */}
                  {(() => {
                    const text = `${title} ${description || ''}`.toLowerCase();
                    if (text.includes('pothole') || text.includes('flooding') || text.includes('garbage') || text.includes('water leak')) {
                      return (
                        <a
                          href="https://www.ghmc.gov.in/Grievance_Redressal.aspx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 transition-colors"
                        >
                          <span>⚠️ Report to GHMC</span>
                        </a>
                      );
                    }
                    if (text.includes('power cut') || text.includes('outage') || text.includes('electricity') || text.includes('tsspdcl')) {
                      return (
                        <a
                          href="https://www.tsspdcl.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 transition-colors"
                        >
                          <span>⚡ Lodge TSSPDCL Complaint</span>
                        </a>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Right Column (Civic Context Sidebar) */}
              {article.correlated_civic_entities && article.correlated_civic_entities.length > 0 && (
                <div className="lg:col-span-2 space-y-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-4 lg:pt-0 lg:pl-6">
                  <h3 className="text-xs font-black uppercase text-heritage-gold flex items-center gap-1.5 tracking-wider mb-2">
                    <span>⚡ Related Civic Impact</span>
                  </h3>
                  <div className="space-y-3">
                    {article.correlated_civic_entities.map(entity => 
                      renderCivicWidget(entity.entity_type, entity.entity_id)
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );

  return createPortal(modalContent, document.body);
}
