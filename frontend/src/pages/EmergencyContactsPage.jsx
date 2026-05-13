export default function EmergencyContactsPage() {
  const categories = [
    {
      title: 'Police',
      emoji: '🚔',
      color: 'border-blue-500/30 bg-blue-500/5',
      badge: 'bg-blue-500/20 text-blue-300',
      contacts: [
        { name: 'Police Emergency', number: '100', description: 'All-India police emergency helpline' },
        { name: 'Dial 100 Hyderabad', number: '100', description: 'Hyderabad Police instant response' },
        { name: 'Cyber Crime', number: '1930', description: 'Report online fraud and cyber crime' },
      ],
    },
    {
      title: 'Medical & Ambulance',
      emoji: '🚑',
      color: 'border-red-500/30 bg-red-500/5',
      badge: 'bg-red-500/20 text-red-300',
      contacts: [
        { name: '108 Ambulance', number: '108', description: 'Free ambulance service — Telangana' },
        { name: '104 Health Helpline', number: '104', description: 'Mobile medical unit & health advice' },
        { name: 'AIIMS Bibinagar', number: '08682-282000', description: 'All India Institute of Medical Sciences' },
      ],
    },
    {
      title: 'Fire',
      emoji: '🔥',
      color: 'border-orange-500/30 bg-orange-500/5',
      badge: 'bg-orange-500/20 text-orange-300',
      contacts: [
        { name: 'Fire Emergency', number: '101', description: 'Telangana State Fire & Emergency Services' },
        { name: 'Disaster Management', number: '1070', description: 'State Disaster Response & Coordination' },
      ],
    },
    {
      title: 'Women Safety',
      emoji: '🛡️',
      color: 'border-purple-500/30 bg-purple-500/5',
      badge: 'bg-purple-500/20 text-purple-300',
      contacts: [
        { name: 'Women Helpline', number: '181', description: '24/7 women safety & domestic violence helpline' },
        { name: 'SHE Teams Hyderabad', number: '8712661100', description: 'Rapid response for women safety in public' },
        { name: 'Anti-Trafficking Helpline', number: '1098', description: 'Report trafficking and child exploitation' },
      ],
    },
    {
      title: 'Civic Services',
      emoji: '🏙️',
      color: 'border-green-500/30 bg-green-500/5',
      badge: 'bg-green-500/20 text-green-300',
      contacts: [
        { name: 'GHMC Control Room', number: '040-23221111', description: 'Garbage, roads, flooding — GHMC helpline' },
        { name: 'HMWSSB Water', number: '155313', description: 'Water supply complaints & emergencies' },
        { name: 'TSSPDCL Electricity', number: '1912', description: 'Power outage, line fault, billing issues' },
        { name: 'TSRTC Bus Helpline', number: '040-69440000', description: 'RTC bus complaints and information' },
      ],
    },
    {
      title: 'Child & Senior',
      emoji: '👨‍👩‍👧',
      color: 'border-yellow-500/30 bg-yellow-500/5',
      badge: 'bg-yellow-500/20 text-yellow-300',
      contacts: [
        { name: 'Childline', number: '1098', description: '24/7 helpline for children in distress' },
        { name: 'Senior Citizen Helpline', number: '14567', description: 'Elder care, abuse reporting, assistance' },
      ],
    },
  ];

  const hospitals = [
    { district: 'Hyderabad', list: [
      { name: 'Gandhi Hospital', phone: '040-20020102', specialty: 'Multi-Specialty Government' },
      { name: 'NIMS Hospital', phone: '040-23401234', specialty: 'Neuroscience & Super Specialty' },
      { name: 'Osmania General Hospital', phone: '040-24600100', specialty: 'General & Teaching Hospital' },
    ]},
    { district: 'Warangal', list: [
      { name: 'MGM Hospital Warangal', phone: '0870-2578888', specialty: 'Multi-Specialty Government' },
    ]},
    { district: 'Nizamabad', list: [
      { name: 'Government Hospital Nizamabad', phone: '08462-222100', specialty: 'District Government Hospital' },
    ]},
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="glass-card section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🆘</div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge-live bg-red-500/20 text-red-400 border border-red-500/30">⚡ Emergency</span>
          </div>
          <h2 className="section-title text-3xl sm:text-4xl gold-text mb-2">Emergency Contacts</h2>
          <p className="text-text-secondary font-medium italic">Telangana Critical Helplines & Quick Response Numbers · 2026</p>
          <p className="mt-3 text-xs text-telangana-green/80 font-semibold">📌 Bookmark this page — works offline</p>
        </div>
      </div>

      {/* Quick dial top 3 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: '🚔', number: '100', label: 'Police' },
          { emoji: '🚑', number: '108', label: 'Ambulance' },
          { emoji: '🔥', number: '101', label: 'Fire' },
        ].map(item => (
          <a key={item.number} href={`tel:${item.number}`}
            className="glass-card section-block text-center hover-lift border border-white/10 active:scale-95 transition-transform">
            <div className="text-4xl mb-2">{item.emoji}</div>
            <div className="text-2xl font-bold gold-text">{item.number}</div>
            <div className="text-[11px] text-text-muted mt-1 uppercase tracking-wide font-semibold">{item.label}</div>
          </a>
        ))}
      </div>

      {/* Category cards */}
      {categories.map(cat => (
        <div key={cat.title} className={`glass-card section-block border ${cat.color}`}>
          <h3 className="label-xs mb-4">{cat.emoji} {cat.title}</h3>
          <div className="space-y-2">
            {cat.contacts.map(c => (
              <a key={c.number} href={`tel:${c.number}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-telangana-green transition-colors">{c.name}</p>
                  <p className="text-xs text-text-muted truncate">{c.description}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-sm font-bold tracking-wide ${cat.badge}`}>{c.number}</span>
                  <span className="text-text-muted group-hover:text-telangana-green transition-colors text-lg">📞</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}

      {/* Hospital Quick List */}
      <div className="glass-card section-block">
        <h3 className="label-xs mb-4">🏥 Government Hospitals by District</h3>
        <div className="space-y-4">
          {hospitals.map(d => (
            <div key={d.district}>
              <p className="text-xs font-bold text-telangana-green uppercase tracking-wider mb-2">{d.district}</p>
              <div className="space-y-2">
                {d.list.map(h => (
                  <a key={h.name} href={`tel:${h.phone}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                    <div>
                      <p className="text-sm font-semibold text-white">{h.name}</p>
                      <p className="text-xs text-text-muted">{h.specialty}</p>
                    </div>
                    <span className="text-xs font-bold text-heritage-gold group-hover:text-telangana-green transition-colors">{h.phone}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card section-block bg-telangana-green/5 border border-telangana-green/20 text-center">
        <p className="text-sm text-text-secondary">
          ⚠️ Numbers verified as of 2026. In life-threatening emergencies, call <strong className="text-white">112</strong> (Integrated Emergency Number — Police + Fire + Ambulance)
        </p>
      </div>
    </div>
  );
}
