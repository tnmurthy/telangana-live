import React from 'react';
import { Sparkles, MapPin, ExternalLink, Users } from 'lucide-react';

const OdopWidget = ({ data }) => {
    if (!data) return null;

    return (
        <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-telangana-red/90 to-telangana-red p-[1px] shadow-lg animate-fade-in my-8">
            <div className="absolute inset-0 bg-black/10 z-0"></div>
            
            <div className="relative z-10 bg-white dark:bg-card h-full w-full rounded-[23px] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    
                    {/* Image Section */}
                    <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                        <img 
                            src={data.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80"} 
                            alt={data.productName} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-telangana-gold/90 text-black text-xs font-bold uppercase tracking-wider backdrop-blur-md mb-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                Official ODOP
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/80">
                        <div className="flex items-center gap-2 text-telangana-red mb-3">
                            <MapPin className="w-5 h-5" />
                            <span className="font-bold tracking-widest uppercase text-sm">{data.district}</span>
                        </div>
                        
                        <h3 className="text-3xl font-black text-text mb-4 leading-tight">
                            {data.productName}
                        </h3>
                        
                        <p className="text-text-muted leading-relaxed mb-6 font-medium">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-auto">
                            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl">
                                <Users className="w-5 h-5 text-text-muted" />
                                <span className="font-semibold text-text">{data.artisanCount || "1000+"} Local Artisans</span>
                            </div>
                            
                            <button className="flex items-center gap-2 bg-telangana-red hover:bg-telangana-red/90 text-white px-6 py-2 rounded-xl font-bold transition-colors ml-auto shadow-md">
                                Support Local
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OdopWidget;
