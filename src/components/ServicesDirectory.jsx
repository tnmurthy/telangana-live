import { useState } from 'react';
import { services } from '../data/services';

function ServiceCard({ service, onExpand, isExpanded }) {
    return (
        <div className={`glass-card overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-1 ring-deep-pink/20' : ''}`}>
            <button onClick={onExpand} className="w-full p-5 sm:p-6 text-left group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-deep-pink/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-deep-pink/15 transition-all duration-500">
                        {service.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-heading font-bold text-white text-xl tracking-tight group-hover:text-deep-pink transition-colors duration-300">
                            {service.label}
                        </h3>
                        <p className="text-xs text-text-muted font-medium">{service.count}+ listings across Telangana</p>
                    </div>
                    <svg className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">{service.description}</p>
            </button>

            {/* Expanded Items */}
            <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-white/[0.05]">
                    {service.items.map((item, idx) => (
                        <div key={idx}
                            className="px-5 sm:px-6 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-200"
                            style={{ animationDelay: `${idx * 30}ms` }}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                                    <p className="text-xs text-text-muted mt-0.5">{item.area}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.type.includes('Government') ? 'bg-telangana-green/15 text-green-400' : 'bg-heritage-gold/10 text-heritage-gold'
                                        }`}>
                                        {item.type}
                                    </span>
                                    <div className="text-xs text-heritage-gold mt-1 font-semibold">★ {item.rating}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ServicesDirectory() {
    const [expanded, setExpanded] = useState(null);

    return (
        <section id="services" className="animate-fade-in">
            <div className="mb-6">
                <h2 className="section-title">Services Directory</h2>
                <p className="text-sm text-text-muted mt-1">Essential services across all districts</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ServiceCard service={services.hospitals} isExpanded={expanded === 'hospitals'}
                    onExpand={() => setExpanded(expanded === 'hospitals' ? null : 'hospitals')} />
                <ServiceCard service={services.schools} isExpanded={expanded === 'schools'}
                    onExpand={() => setExpanded(expanded === 'schools' ? null : 'schools')} />
            </div>
        </section>
    );
}
