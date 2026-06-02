import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Share2, Download, AlertTriangle, ShieldCheck } from 'lucide-react';

const HackCard = ({ card }) => {
  const matrixCode = React.useMemo(() => Math.random().toString(36).substring(2, 9), []);

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 bg-telangana-green/10 border-b border-telangana-green/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-telangana-green px-2 py-1 bg-telangana-green/10 rounded-full font-mono uppercase tracking-widest">
            GLITCH // {matrixCode}
          </span>
          <ShieldCheck className="w-5 h-5 text-telangana-green" />
        </div>
        <h3 className="text-lg font-bold text-text uppercase leading-tight">
          {card.title}
        </h3>
      </div>
      
      <div className="p-4 flex-grow flex flex-col space-y-4">
        {/* The Bug */}
        <div>
          <h4 className="text-sm font-semibold text-text-muted uppercase mb-1">The Bug</h4>
          <p className="text-sm text-text">{card.what_it_solves}</p>
        </div>
        
        {/* The Patch */}
        <div>
          <h4 className="text-sm font-semibold text-text-muted uppercase mb-1">The Patch</h4>
          <p className="text-sm text-text">{card.what_to_do}</p>
        </div>

        {/* Execute Protocol */}
        <div className="bg-background-alt p-3 rounded-xl border border-border">
          <h4 className="text-sm font-semibold text-text-muted uppercase mb-2">Execute Protocol</h4>
          <ul className="space-y-2">
            {card.steps.map((step, i) => (
              <li key={i} className="text-sm text-text flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-telangana-green/20 text-telangana-green flex items-center justify-center text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-text-strong">{step.bold_title}</strong> {step.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Note */}
        {card.note && (
          <div className="mt-auto bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase">{card.note_label}: </span>
              <span className="text-xs text-text-muted">{card.note}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between bg-background-alt">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">Source</span>
          <span className="text-xs font-medium text-text">{card.tip_domain}</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-border/50 text-text-muted transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-border/50 text-text-muted transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HackOfTheDayPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/hack-of-the-day.json')
      .then(res => res.json())
      .then(data => {
        const rawData = data.value || data;
        const approved = rawData.filter(c => c.status !== 'Rejected' || true).slice(0, 12);
        setCards(approved);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load hacks:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>Glitch in the Matrix | Telangana Live</title>
        <meta name="description" content="Digital safety tips and life hacks for Telangana citizens." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase text-text mb-2 tracking-tight">
            Glitch in the Matrix
          </h1>
          <p className="text-text-muted">
            Practical digital safety and life hacks to protect your privacy and security.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-telangana-green/20 border-t-telangana-green rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card, idx) => (
              <HackCard key={idx} card={card} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
