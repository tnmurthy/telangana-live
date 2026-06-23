import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Maximize2, ExternalLink, X, ChevronRight } from 'lucide-react';

const STATNOSTICS_DATA = [
  {
    title: "Labor Force Insights (PLFS V3)",
    base: "/data/statnostics/2026-03-13-mospi-plfs-v3/",
    cards: [
      {
        file: "01-marriage-labor-market-cliff",
        title: "For India's women graduates, marriage ends the career",
        desc: "Marriage is linked to a sharp exit from paid work, even among college-educated women aged 25–34."
      },
      {
        file: "02-hidden-homemaker-work",
        title: "India's 'homemakers' hide a vast pool of unpaid work",
        desc: "8.4% of women classified as doing 'domestic duties only' still worked in the survey week — mostly as unpaid family workers."
      },
      {
        file: "03-regular-jobs-not-formal",
        title: "Only 1 in 3 regular salaried jobs is truly formal",
        desc: "Most 'regular salaried' workers lack a written contract, paid leave, or social security — median pay reflects the gap."
      },
      {
        file: "04-graduate-mismatch",
        title: "More graduates farm the land than write the code",
        desc: "Among all graduate workers, farming and sales jobs far outnumber software and engineering roles."
      }
    ]
  },
  {
    title: "Labor Force Insights (PLFS V4)",
    base: "/data/statnostics/2026-03-13-mospi-plfs-v4/",
    cards: [
      {
        file: "01-household-wife-role-cliff",
        title: "In a joint family, being 'the wife' costs more than the marriage itself",
        desc: "Married graduate women listed as 'spouse of head' are far less likely to hold a regular job — even after controlling for children and social group."
      },
      {
        file: "03-teaching-nursing-precarity",
        title: "Teaching and nursing: not as stable as families believe",
        desc: "Young primary teachers earn a median ₹12,175/month and only 42% have a fully formal job. Nurses are worse off still."
      },
      {
        file: "04-teaching-gender-pay-gap",
        title: "Same classroom, half the pay: women teachers earn far less",
        desc: "Men primary school teachers earn a median ₹20,000/month — double the ₹10,000 for women in the same role."
      }
    ]
  }
];

const StatCard = ({ card, base, onOpen, index }) => {
  const imgSrc = `${base}${card.file}/infographic.avif`;
  
  // Create a Bento-box style layout where the first card spans 2 rows and columns
  const isLarge = index === 0;
  
  return (
    <div className={`bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/50 dark:border-white/10 overflow-hidden flex flex-col group hover:scale-[1.02] transition-transform duration-500 ease-out cursor-pointer ${isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`} onClick={() => onOpen(imgSrc)}>
      <div className={`relative w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden ${isLarge ? 'h-[300px] md:h-[400px]' : 'aspect-[4/3]'}`}>
        <img 
          src={imgSrc} 
          alt={card.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-sm">
          <div className="bg-white/20 text-white backdrop-blur-xl border border-white/30 px-6 py-3 rounded-full flex items-center gap-2 font-bold text-sm shadow-2xl transform translate-y-8 scale-90 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            <Maximize2 className="w-4 h-4" /> View Graphic
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
        <h3 className={`font-black text-text mb-4 leading-[1.1] tracking-tighter group-hover:text-telangana-green transition-colors duration-300 ${isLarge ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
          {card.title}
        </h3>
        <p className="text-sm md:text-base text-text-muted mb-6 flex-grow leading-relaxed font-medium">
          {card.desc}
        </p>
        <div className="pt-6 mt-auto flex justify-between items-center">
           <span className="text-[10px] bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md">
             DATA // {card.file.split('-')[0]}
           </span>
           <button className="text-telangana-green hover:text-telangana-green/80 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors group/btn">
             View SOP <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default function StatnosticsPage() {
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setLightboxImg(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <Helmet>
        <title>Insights | Telangana Live</title>
        <meta name="description" content="Data-driven graphics and insights." />
      </Helmet>
      
      <div className="relative min-h-screen bg-[#faf9f6] dark:bg-background overflow-hidden pb-24">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-telangana-green/10 to-transparent pointer-events-none" />
        <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-telangana-green/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse pointer-events-none" />
        <div className="absolute top-60 -left-40 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

        <div className="container relative mx-auto px-4 py-16 max-w-[1400px] animate-fade-in z-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-sm border border-border">
              <span className="w-2 h-2 rounded-full bg-telangana-green animate-pulse"></span>
              Live Data Desk
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text mb-6 tracking-tighter leading-none">
              Data in <span className="text-transparent bg-clip-text bg-gradient-to-r from-telangana-green to-emerald-400">Focus.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted font-medium mt-6">
              Hard statistics turned into crystal-clear insights. Explore our collection of visual data journalism powered by verified datasets.
            </p>
          </div>

          <div className="space-y-32">
            {STATNOSTICS_DATA.map((section, idx) => (
              <section key={idx} className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-border/50">
                  <h2 className="text-3xl md:text-4xl font-black text-text tracking-tighter">{section.title}</h2>
                  <span className="text-sm font-mono text-text-muted uppercase tracking-widest mt-2 md:mt-0">
                    {section.cards.length} Datasets
                  </span>
                </div>
                
                {/* Bento Box Grid Setup */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-[minmax(0,1fr)]">
                  {section.cards.map((card, i) => (
                    <StatCard 
                      key={i} 
                      card={card} 
                      base={section.base} 
                      onOpen={setLightboxImg} 
                      index={i}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" 
            onClick={() => setLightboxImg(null)}
          />
          
          <button 
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-colors border border-white/20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-[105] max-w-6xl max-h-[90vh] w-full flex justify-center items-center animate-in zoom-in-95 duration-300 ease-out">
            <img 
              src={lightboxImg} 
              alt="Expanded Graphic" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
