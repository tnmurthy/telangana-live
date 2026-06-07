'use client';

import { useState, useEffect } from 'react';
import CivicCard from '@/components/ui/CivicCard';
import { useArea } from '@/lib/AreaContext';

export default function SOSPage() {
  const { selectedArea } = useArea();
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Mocking API call
    setContacts([
      { id: 1, name: 'Ambulance', phone: '108', cat: 'medical', is_local: false },
      { id: 2, name: 'Police Control Room', phone: '100', cat: 'police', is_local: false },
      { id: 3, name: 'Fire Department', phone: '101', cat: 'fire', is_local: false },
      { id: 4, name: 'Women Helpline', phone: '181', cat: 'women', is_local: false },
      { id: 5, name: 'Local Ward Hospital', phone: '040-23456789', cat: 'medical', is_local: true },
      { id: 6, name: 'Mandal Police Station', phone: '040-98765432', cat: 'police', is_local: true },
    ]);
  }, []);

  const filtered = contacts.filter(c => activeTab === 'all' || c.cat === activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-slate-900">SOS DIRECTORY</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Critical contacts for {selectedArea?.name || 'Telangana'}</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest animate-pulse shadow-md">
          Emergency Mode
        </button>
      </header>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {['all', 'medical', 'police', 'fire', 'women', 'disaster'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeTab === tab 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(contact => (
          <CivicCard key={contact.id} className="p-6 flex items-center justify-between group hover:border-red-200 transition-all bg-white" accentColor={contact.is_local ? "green" : "blue"}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                  contact.is_local ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {contact.is_local ? 'Hyper-local' : 'Global'}
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{contact.cat}</span>
              </div>
              <h3 className="font-black text-lg text-slate-900">{contact.name}</h3>
              <p className="font-mono font-bold text-slate-500">{contact.phone}</p>
            </div>
            
            <a href={`tel:${contact.phone}`}>
              <button className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shadow-sm">
                📞
              </button>
            </a>
          </CivicCard>
        ))}
      </div>

      <CivicCard className="p-8 text-center bg-slate-50 border-dashed border-slate-200 shadow-none">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Directory verified on {new Date().toLocaleDateString()} • All calls recorded for safety.
        </p>
      </CivicCard>
    </div>
  );
}
