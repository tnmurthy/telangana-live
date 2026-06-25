import { useState } from 'react';
import { useEmergency } from '../hooks/useEmergency';
import { Icons } from './Icons';

export default function EmergencySimulator() {
  const { isEmergencyActive, emergencyType, activateEmergency, deactivateEmergency } = useEmergency();
  const [isOpen, setIsOpen] = useState(false);

  const modes = [
    { id: 'heatwave', label: '🔥 Heatwave', color: 'bg-orange-600' },
    { id: 'flood', label: '🌊 Flood', color: 'bg-cyan-600' },
    { id: 'coldwave', label: '❄️ Coldwave', color: 'bg-blue-600' },
    { id: 'critical', label: '🚨 Critical Crisis', color: 'bg-red-600' },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      {isOpen && (
        <div className="flex flex-col gap-2 p-3 bg-dark-bg/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl pointer-events-auto animate-in">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 px-1">Emergency Simulator</p>
          
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => activateEmergency(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all 
                         ${emergencyType === mode.id ? mode.color : 'bg-white/5 hover:bg-white/10'}`}
            >
              {mode.label}
            </button>
          ))}

          <button
            onClick={deactivateEmergency}
            className={`mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                       ${!isEmergencyActive ? 'bg-telangana-green text-dark-bg' : 'bg-white/5 text-text-muted hover:text-white'}`}
          >
            Normal Mode
          </button>
        </div>
      )}

      <button
        id="emergency-simulator-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 pointer-events-auto
                   ${isEmergencyActive ? 'bg-red-600 animate-pulse' : 'bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10'}`}
        aria-label="Toggle Emergency Simulator"
      >
        <Icons.Emergency className={`w-6 h-6 ${isEmergencyActive ? 'text-white' : 'text-text-muted'}`} />
      </button>
    </div>
  );
}
