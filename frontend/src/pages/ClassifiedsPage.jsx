import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { classifiedsService } from '../services/classifiedsService';
import { Icons } from '../components/Icons';

// Custom Map Marker for Classifieds
function createCategoryIcon(category) {
    const color = category === 'Vehicles' ? '#3b82f6' : 
                  category === 'Electronics' ? '#8b5cf6' : 
                  category === 'Furniture' ? '#f59e0b' : '#10b981';
                  
    return L.divIcon({
        className: 'custom-pin',
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:12px;">₹</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
}

function MapUpdater({ center }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
}

// Format expiry time relative to now
function getExpiryText(expiresAt) {
    if (!expiresAt) return 'Expires soon';
    const hours = Math.round((new Date(expiresAt) - new Date()) / 3600000);
    if (hours <= 0) return 'Expired';
    if (hours < 24) return `Expires in ${hours}h`;
    return `Expires in ${Math.round(hours / 24)}d`;
}

export default function ClassifiedsPage() {
    const [classifieds, setClassifieds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [mapCenter, setMapCenter] = useState([17.4326, 78.4072]); // Default Hyderabad
    
    // Form State
    const [rawText, setRawText] = useState('');
    const [phone, setPhone] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchClassifieds = async () => {
            const data = await classifiedsService.getActiveClassifieds();
            setClassifieds(data);
            setLoading(false);
        };
        fetchClassifieds();
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate OTP wait...
        await new Promise(r => setTimeout(r, 1000));
        
        // Post via service (mock AI processing)
        const newPost = await classifiedsService.postClassified(
            rawText,
            mapCenter[0] + (Math.random() - 0.5) * 0.02, // slight jitter for MVP
            mapCenter[1] + (Math.random() - 0.5) * 0.02,
            'Jubilee Hills',
            phone
        );
        
        setClassifieds([newPost, ...classifieds]);
        setShowPostForm(false);
        setRawText('');
        setPhone('');
        setSubmitting(false);
        alert('Item successfully processed by AI and posted!');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="glass-card section-block relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 pointer-events-none">🛒</div>
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="heading-liquid text-3xl sm:text-4xl text-telangana-green mb-2">Smart Classifieds</h2>
                        <p className="text-text-secondary font-medium">Hyper-local map of items for sale near you.</p>
                    </div>
                    <button 
                        onClick={() => setShowPostForm(!showPostForm)}
                        className="btn-liquid btn-liquid-primary bg-telangana-green text-black"
                    >
                        {showPostForm ? 'Cancel' : 'Sell an Item'}
                    </button>
                </div>
            </div>

            {/* Post Ad Form (Conditional) */}
            {showPostForm && (
                <div className="glass-card p-6 border border-telangana-green/30 animate-slide-up">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Icons.Sparkles className="w-5 h-5 text-telangana-green" /> AI Quick Post
                    </h3>
                    <p className="text-sm text-text-muted mb-4">Just describe what you are selling. Our AI will automatically categorize it and set the price.</p>
                    <form onSubmit={handlePostSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">What are you selling?</label>
                            <textarea 
                                value={rawText}
                                onChange={e => setRawText(e.target.value)}
                                placeholder="E.g., Selling my 2018 Royal Enfield Classic 350 for ₹1,20,000. Mint condition."
                                className="w-full bg-dark-surface border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-telangana-green h-24"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">WhatsApp Number (For Buyers to contact you)</label>
                            <input 
                                type="text"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full bg-dark-surface border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-telangana-green"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="btn-liquid bg-telangana-green text-black w-full py-4 text-base disabled:opacity-50"
                        >
                            {submitting ? 'AI Processing...' : 'Generate & Post'}
                        </button>
                    </form>
                </div>
            )}

            {/* Map & Trending Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative z-0 group">
                    {/* Floating Map HUD */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md border border-white/10 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-telangana-green animate-pulse"></span>
                            Showing {classifieds.length} active listings near you
                        </div>
                    </div>
                    
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />
                        <MapUpdater center={mapCenter} />
                        
                        {classifieds.map(item => (
                            item.lat && item.lng && (
                                <Marker 
                                    key={item.id} 
                                    position={[item.lat, item.lng]}
                                    icon={createCategoryIcon(item.category)}
                                >
                                    <Popup className="classifieds-popup">
                                        <div className="p-1">
                                            <div className="font-bold text-white text-base mb-1">{item.title}</div>
                                            <div className="text-xl font-black text-green-500 my-1">
                                                {item.price ? `₹${item.price.toLocaleString()}` : 'Make Offer'}
                                            </div>
                                            <div className="text-xs text-gray-300 mb-3">{item.category}</div>
                                            <a 
                                                href={`https://wa.me/${item.whatsapp_number}?text=Hi, I saw your ${item.title} on Telangana.Live`}
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="btn-liquid bg-[#25D366] text-white w-full"
                                            >
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
                
                {/* Trending Hashtags Sidebar */}
                <div className="glass-card p-6 border border-white/10 hidden lg:block">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Icons.TrendingUp className="w-5 h-5 text-telangana-green" /> Trending Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['#PS5', '#RoyalEnfield', '#IKEA', '#Rentals', '#Bicycles', '#Laptops', '#UsedBooks', '#Pets'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold hover:bg-telangana-green/20 hover:text-telangana-green hover:border-telangana-green/30 cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-text-muted mb-3 uppercase tracking-wider">Top Wards</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between items-center"><span className="text-telangana-green font-medium">Jubilee Hills</span> <span className="bg-white/10 px-2 rounded-full text-xs">12</span></li>
                            <li className="flex justify-between items-center"><span className="text-telangana-green font-medium">Madhapur</span> <span className="bg-white/10 px-2 rounded-full text-xs">8</span></li>
                            <li className="flex justify-between items-center"><span className="text-telangana-green font-medium">Kukatpally</span> <span className="bg-white/10 px-2 rounded-full text-xs">5</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            <div>
                <h3 className="text-2xl font-bold mb-6">Latest Listings Near You</h3>
                {loading ? (
                    <div className="animate-pulse h-32 bg-white/5 rounded-xl"></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {classifieds.map(item => (
                            <div key={item.id} className="glass-card overflow-hidden group hover:border-telangana-green/30 transition-colors">
                                {item.image_url && (
                                    <img 
                                        src={item.image_url} 
                                        alt={item.title} 
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-telangana-green bg-telangana-green/10 px-2 py-1 rounded">
                                            {item.category}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1">
                                            <Icons.Clock className="w-3 h-3" /> {getExpiryText(item.expires_at)}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 truncate">{item.title}</h4>
                                    <p className="text-xl font-black text-white mb-3">
                                        {item.price ? `₹${item.price.toLocaleString()}` : 'Contact Seller'}
                                    </p>
                                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                                        {item.description}
                                    </p>
                                    <a 
                                        href={`https://wa.me/${item.whatsapp_number}?text=Hi, I saw your ${item.title} on Telangana.Live`}
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="btn-liquid bg-[#25D366] text-white w-full py-3 text-sm"
                                    >
                                        <Icons.Chat className="w-5 h-5" /> Chat on WhatsApp
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
