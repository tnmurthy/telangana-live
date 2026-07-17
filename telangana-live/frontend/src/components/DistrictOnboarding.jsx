import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { districts } from '../data/districts';
import { useAppContext } from '../context/AppContext';

export default function DistrictOnboarding() {
  const { showDistrictPrompt, saveDistrict, dismissDistrictPrompt } = useAppContext();
  const [selected, setSelected] = useState('');
  const navigate = useNavigate();

  if (!showDistrictPrompt) return null;

  const popular = ['Hyderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Warangal', 'Karimnagar', 'Nizamabad'];

  const routeMap = {
    'hyderabad': 'hyderabad',
    'warangal': 'warangal',
    'karimnagar': 'karimnagar',
    'medchal-malkajgiri': 'malkajgiri',
    'malkajgiri': 'malkajgiri',
    'cyberabad': 'cyberabad'
  };

  const handleSelectPopular = (d) => {
    saveDistrict(d);
    const targetRoute = routeMap[d.toLowerCase()];
    if (targetRoute) {
      navigate(`/${targetRoute}`);
    }
  };

  const handleSetDistrict = () => {
    saveDistrict(selected);
    const targetRoute = routeMap[selected.toLowerCase()];
    if (targetRoute) {
      navigate(`/${targetRoute}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        className="glass-card border-telangana-green/20 p-5 mb-6 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-telangana-green/8 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">📍 Personalise Your Feed</h3>
            <p className="text-xs text-text-muted mt-0.5">Pick your district for local news at the top</p>
          </div>
          <button onClick={dismissDistrictPrompt} className="p-1 text-text-muted hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick pick */}
        <div className="flex flex-wrap gap-2 mb-3">
          {popular.map(d => (
            <button
              key={d}
              onClick={() => handleSelectPopular(d)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all
                ${selected === d
                  ? 'bg-telangana-green/20 border-telangana-green text-telangana-green-light'
                  : 'bg-white/[0.04] border-white/10 text-text-secondary hover:border-white/20'}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Full dropdown */}
        <div className="flex gap-2">
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            className="flex-grow bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2
                       text-xs text-text-secondary focus:outline-none focus:border-telangana-green/40"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>
          <button
            onClick={handleSetDistrict}
            className="px-4 py-2 bg-telangana-green/20 hover:bg-telangana-green/30
                       border border-telangana-green/30 rounded-xl text-xs font-bold
                       text-telangana-green transition-all"
          >
            Set
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
