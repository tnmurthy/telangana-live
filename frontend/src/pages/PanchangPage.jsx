import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/Icons';

export default function PanchangPage() {
    const [panchangData, setPanchangData] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [isQuerying, setIsQuerying] = useState(false);
    const [loadingQuote, setLoadingQuote] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    const DIVINE_QUOTES = [
        "Consulting the celestial movements...",
        "Aligning Tithi and Nakshatra for your query...",
        "Seeking wisdom from the ancient Veda scripts...",
        "The stars are being calculated for your auspicious moment...",
        "Om Namah Shivaya - Wisdom is arriving...",
        "Analyzing Rahu Kaal and Varjyam timings...",
        "Awaiting the planetary consensus...",
        "Decoding the cosmic geometry for you..."
    ];

    // Get 3 rotating daily queries
    const getDailyQueries = () => {
        const ALL_QUERIES = [
            "Is today a good day to buy a vehicle?",
            "When is a good day to start my new business?",
            "Is it auspicious to drill a borewell today?",
            "Is today good for Griha Pravesh?",
            "Should I buy gold today?",
            "Is it a good day to sign important documents?",
            "What is the Rahu Kaal for today?",
            "Is today suitable for traveling south?",
            "Can I start a new job today?"
        ];
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const startIndex = dayOfYear % ALL_QUERIES.length;
        return [
            ALL_QUERIES[startIndex],
            ALL_QUERIES[(startIndex + 1) % ALL_QUERIES.length],
            ALL_QUERIES[(startIndex + 2) % ALL_QUERIES.length]
        ];
    };

    useEffect(() => {
        // Fetch today's panchang on mount
        const fetchPanchang = async () => {
            try {
                const res = await fetch('/api/panchang/today');
                if (res.ok) {
                    const data = await res.json();
                    setPanchangData(data);
                }
            } catch (error) {
                console.error("Failed to fetch panchang", error);
            }
        };
        fetchPanchang();

        // Live clock
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsQuerying(true);
        setQueryResult(null);
        
        // Pick a random quote to start
        setLoadingQuote(DIVINE_QUOTES[Math.floor(Math.random() * DIVINE_QUOTES.length)]);
        
        // Rotate quotes every 3 seconds while querying
        const quoteInterval = setInterval(() => {
            setLoadingQuote(prev => {
                const currentIndex = DIVINE_QUOTES.indexOf(prev);
                const nextIndex = (currentIndex + 1) % DIVINE_QUOTES.length;
                return DIVINE_QUOTES[nextIndex];
            });
        }, 3000);
        
        try {
            const res = await fetch('/api/panchang/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            
            if (res.ok) {
                const data = await res.json();
                setQueryResult(data);
            } else {
                setQueryResult({ decision: "Error", explanation: "Failed to consult the stars. Try again later." });
            }
        } catch (error) {
            setQueryResult({ decision: "Error", explanation: "Network error occurred." });
        } finally {
            setIsQuerying(false);
            clearInterval(quoteInterval);
        }
    };

    return (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header Section */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                    Telangana <span className="gold-text">Panchangam</span>
                </h1>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Daily Amavasyant calendar and AI-powered astrological guidance for auspicious timings and Muhurats.
                </p>
            </div>

            {/* Today's Panchang Card */}
            <div className="bg-dark-surface border border-white/5 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Icons.Sun className="w-48 h-48" />
                </div>
                
                {panchangData ? (
                    <>
                        {/* Dual Calendar Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-white/10 gap-6 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icons.Calendar className="w-4 h-4 text-heritage-gold" />
                                    <span className="text-text-muted text-xs uppercase tracking-widest font-semibold">Standard Calendar</span>
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-white mb-1">
                                    {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </h3>
                                <p className="text-heritage-gold text-xl font-mono font-medium tracking-wider">
                                    {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                                </p>
                            </div>

                            <div className="text-left md:text-right">
                                <div className="flex items-center md:justify-end gap-2 mb-2">
                                    <span className="text-text-muted text-xs uppercase tracking-widest font-semibold">Vikram Samvat {panchangData.year}</span>
                                    <Icons.Sparkles className="w-4 h-4 text-heritage-gold" />
                                </div>
                                <h3 className="text-3xl font-heading font-bold text-heritage-gold mb-1">
                                    {panchangData.month} {panchangData.paksha} {panchangData.tithi}
                                </h3>
                                <p className="text-text-secondary text-xl font-medium italic">
                                    {panchangData.teluguMonth} మాసం
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Column 1: Core Tithi & Month */}
                            <div className="space-y-4">
                                <h3 className="text-heritage-gold font-semibold mb-2 border-b border-white/10 pb-1">Hindu Calendar</h3>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Vikram Samvat</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.year}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Month</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.month} / {panchangData.teluguMonth}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Tithi</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.tithi}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Paksha</span>
                                    <span className="text-sm font-semibold text-heritage-gold-light">{panchangData.paksha}</span>
                                </div>
                            </div>

                            {/* Column 2: Panchang Elements */}
                            <div className="space-y-4">
                                <h3 className="text-heritage-gold font-semibold mb-2 border-b border-white/10 pb-1">Daily Elements</h3>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Nakshatra</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.nakshatra}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Yoga</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.yoga}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-text-muted">Karana</span>
                                    <span className="text-sm font-semibold text-white">{panchangData.karana}</span>
                                </div>
                            </div>

                            {/* Column 3: Timings */}
                            <div className="space-y-4">
                                <h3 className="text-heritage-gold font-semibold mb-2 border-b border-white/10 pb-1">Timings (Hyderabad)</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="block text-xs text-text-muted">Sunrise</span>
                                        <span className="text-sm font-semibold text-white">{panchangData.sunrise}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-text-muted">Sunset</span>
                                        <span className="text-sm font-semibold text-white">{panchangData.sunset}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-text-muted">Moonrise</span>
                                        <span className="text-sm font-semibold text-white">{panchangData.moonrise}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-text-muted">Moonset</span>
                                        <span className="text-sm font-semibold text-white">{panchangData.moonset}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Auspicious & Inauspicious Timings Section */}
                        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                                <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                                    <Icons.Sun className="w-4 h-4" /> Auspicious Timing
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">Abhijit Muhurat</span>
                                    <span className="text-sm font-bold text-white">{panchangData.abhijit}</span>
                                </div>
                            </div>
                            <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                                    <Icons.X className="w-4 h-4" /> Inauspicious Timing
                                </h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">Rahu Kaal</span>
                                    <span className="text-sm font-bold text-white">{panchangData.rahu_kaal}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="animate-pulse flex space-x-4">
                        <div className="h-10 bg-white/5 rounded w-full"></div>
                    </div>
                )}
            </div>

            {/* Additional Insights Sections */}
            {panchangData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Upcoming Festivals Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                            {Icons.Calendar && <Icons.Calendar className="w-6 h-6 text-heritage-gold" />}
                            Upcoming Festivals & Vrats
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {panchangData.festivals?.map((fest, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-dark-surface border border-white/5 rounded-xl p-5 flex gap-4"
                                >
                                    <div className="flex-shrink-0 w-16 h-16 bg-heritage-gold/10 rounded-lg flex flex-col items-center justify-center border border-heritage-gold/20">
                                        <span className="text-[10px] uppercase font-bold text-heritage-gold">{fest.date?.split(' ')[0]}</span>
                                        <span className="text-xl font-bold text-white">{fest.date?.split(' ')[1]}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{fest.name}</h4>
                                        <p className="text-xs text-text-muted leading-relaxed">
                                            {fest.significance}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Moon Phase & Astronomical Card */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
                            {Icons.Moon && <Icons.Moon className="w-6 h-6 text-heritage-gold" />}
                            Astronomical
                        </h2>
                        <div className="bg-dark-surface border border-white/5 rounded-xl p-6 relative overflow-hidden h-full">
                            <div className="absolute -bottom-10 -right-10 opacity-5">
                                {Icons.Moon && <Icons.Moon className="w-40 h-48" />}
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <span className="text-xs uppercase tracking-widest text-text-muted font-bold block mb-2">Current Moon Phase</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                                            {Icons.Moon && <Icons.Moon className="w-6 h-6 text-heritage-gold" />}
                                        </div>
                                        <span className="text-xl font-bold text-white">{panchangData.moonPhase}</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <span className="text-xs uppercase tracking-widest text-text-muted font-bold block mb-2">Eclipses (Grahan)</span>
                                    <div className="bg-white/5 rounded-lg p-3">
                                        <p className="text-sm text-text-secondary italic">No eclipses occurring in the next 30 days.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rituals & Remedies Section */}
            {panchangData && (
                <div className="mb-10">
                    <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                        {Icons.Sparkles && <Icons.Sparkles className="w-6 h-6 text-heritage-gold" />}
                        Daily Rituals & Remedies
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {panchangData.rituals?.map((ritual, idx) => (
                            <div key={idx} className="bg-dark-surface border border-white/5 rounded-xl p-5 border-l-4 border-l-heritage-gold">
                                <h4 className="font-bold text-white mb-2">{ritual.title}</h4>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {ritual.description}
                                </p>
                            </div>
                        ))}
                        <div className="bg-heritage-gold/5 border border-heritage-gold/20 rounded-xl p-5 flex flex-col justify-center">
                            <p className="text-sm text-heritage-gold font-medium text-center italic">
                                "Spiritual practices today yield 10x results due to {panchangData.yoga} Yoga."
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Query Section */}
            <div className="bg-gradient-to-br from-heritage-gold/10 to-transparent border border-heritage-gold/20 rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-heritage-gold mb-2 flex items-center gap-2">
                        <Icons.Sparkles className="w-6 h-6" />
                        Ask the Astrologer AI
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Planning something important? Ask if today is a good day to buy a vehicle, start a business, or drill a borewell.
                    </p>
                </div>

                <form onSubmit={handleQuerySubmit} className="relative mb-4">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Is today a good day to buy a vehicle?"
                        className="w-full bg-dark-bg border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder-text-muted focus:outline-none focus:border-heritage-gold focus:ring-1 focus:ring-heritage-gold transition-all"
                        disabled={isQuerying}
                    />
                    <button 
                        type="submit" 
                        disabled={isQuerying || !query.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-heritage-gold text-dark-bg px-4 rounded-lg font-semibold hover:bg-heritage-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isQuerying ? (
                            <div className="w-5 h-5 border-2 border-dark-bg/30 border-t-dark-bg rounded-full animate-spin"></div>
                        ) : (
                            <Icons.ArrowRight className="w-5 h-5" />
                        )}
                    </button>
                </form>

                {/* Suggested Queries */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {panchangData && getDailyQueries().map((q, idx) => (
                        <button
                            key={idx}
                            onClick={() => setQuery(q)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary text-xs px-3 py-1.5 rounded-full transition-colors text-left"
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Loading State with Progress Bar and Divine Quote */}
                {isQuerying && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-6 rounded-xl border border-heritage-gold/20 bg-dark-surface flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className="w-full max-w-md bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                                className="bg-heritage-gold h-full"
                                initial={{ width: "0%" }}
                                animate={{ width: "95%" }}
                                transition={{ duration: 15, ease: "linear" }}
                            />
                        </div>
                        <div className="flex items-center gap-3 text-heritage-gold">
                            <Icons.Sparkles className="w-5 h-5 animate-pulse" />
                            <p className="text-lg font-medium italic">
                                "{loadingQuote}"
                            </p>
                        </div>
                        <p className="text-text-muted text-xs uppercase tracking-widest">
                            Calculating Muhurat
                        </p>
                    </motion.div>
                )}

                {/* Query Result */}
                {queryResult && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-6 rounded-xl border ${
                            queryResult.decision === 'Yes' ? 'bg-green-500/10 border-green-500/30' :
                            queryResult.decision === 'No' ? 'bg-red-500/10 border-red-500/30' :
                            'bg-yellow-500/10 border-yellow-500/30'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${
                                queryResult.decision === 'Yes' ? 'bg-green-500/20 text-green-400' :
                                queryResult.decision === 'No' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {queryResult.decision === 'Yes' ? <Icons.Check className="w-6 h-6" /> :
                                 queryResult.decision === 'No' ? <Icons.X className="w-6 h-6" /> :
                                 <Icons.Clock className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 ${
                                    queryResult.decision === 'Yes' ? 'text-green-400' :
                                    queryResult.decision === 'No' ? 'text-red-400' :
                                    'text-yellow-400'
                                }`}>
                                    {queryResult.decision}
                                </h3>
                                <p className="text-white leading-relaxed">
                                    {queryResult.explanation}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
