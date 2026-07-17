import { useState, useEffect } from 'react';
import { civicServicesAPI } from '../services/civicServicesAPI';
import { services as staticServicesFallback } from '../data/services';
import { Icons } from './Icons';
import { useAppContext } from '../context/AppContext';

function ServiceCard({ service, onExpand, isExpanded, variant = 'default' }) {
    const isDistrict = variant === 'district';
    if (!service) return null;
    return (
        <div className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-white/[0.03]' : 'glass-card'} overflow-hidden transition-all duration-500 ${isExpanded ? 'ring-1 ring-deep-pink/20' : ''}`}>
            <button onClick={onExpand} className="w-full p-5 sm:p-6 text-left group">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-deep-pink/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-deep-pink/15 transition-all duration-500">
                        {Icons[service.icon] ? Icons[service.icon]({ className: "w-8 h-8 text-deep-pink" }) : <Icons.Briefcase className="w-8 h-8 text-deep-pink" />}
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
            <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[850px] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-white/[0.05] p-5 space-y-4">
                    {service.offerings && (
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-heritage-gold tracking-wider mb-2">
                                🔑 Key Services & Offerings
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {service.offerings.map((offering, idx) => (
                                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/80 font-medium">
                                        {offering}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-[10px] font-black uppercase text-heritage-gold tracking-wider mb-2">
                            📍 Available Options
                        </h4>
                        <div className="space-y-0.5">
                            {service.items && service.items.map((item, idx) => (
                                <div key={idx}
                                    className="py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-all duration-200"
                                    style={{ animationDelay: `${idx * 30}ms` }}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-semibold text-white truncate">
                                                {item.url ? (
                                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-deep-pink transition-colors">
                                                        {item.name} ↗
                                                    </a>
                                                ) : item.name}
                                            </h4>
                                            <p className="text-xs text-text-muted mt-0.5">{item.area}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.type?.toLowerCase().includes('government') ? 'bg-telangana-green/15 text-green-400' : 'bg-heritage-gold/10 text-heritage-gold'
                                                }`}>
                                                {item.type}
                                            </span>
                                            {item.rating && <div className="text-xs text-heritage-gold mt-1 font-semibold">★ {item.rating}</div>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServicesDirectory({ region, variant = 'default' }) {
    const isDistrict = variant === 'district';
    const [expanded, setExpanded] = useState(null);
    const [apiServices, setApiServices] = useState({});
    const [loading, setLoading] = useState(true);
    const { myDistrict } = useAppContext();

    useEffect(() => {
        let isMounted = true;
        const fetchServices = async () => {
            setLoading(true);
            const queryDistrict = region || myDistrict;
            const data = await civicServicesAPI.getServices(queryDistrict);
            if (isMounted) {
                setApiServices(data);
                setLoading(false);
            }
        };
        fetchServices();
        return () => { isMounted = false; };
    }, [myDistrict, region]);

    // Use dynamic API data if available, otherwise gracefully degrade to static mock data
    const activeServices = Object.keys(apiServices).length > 0 ? apiServices : staticServicesFallback;
    const serviceKeys = Object.keys(activeServices);

    return (
        <section id="services" className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5' : ''} animate-fade-in`}>
            <div className="mb-6">
                <h2 className="section-title">Services Directory</h2>
                <p className="text-sm text-text-muted mt-1">Official registries and civic portals</p>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`${isDistrict ? 'rounded-2xl border border-white/10 bg-white/[0.03]' : 'glass-card'} h-32 animate-pulse flex items-center p-6 gap-4`}>
                            <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                <div className="h-3 bg-white/5 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceKeys.map((key) => (
                        <ServiceCard 
                            key={key}
                            service={activeServices[key]} 
                            isExpanded={expanded === key}
                            onExpand={() => setExpanded(expanded === key ? null : key)} 
                            variant={isDistrict ? 'district' : 'default'}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
