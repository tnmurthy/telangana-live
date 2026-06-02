import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/Icons';

export default function PanchangPage() {
    const [panchangData, setPanchangData] = useState(null);
    const [query, setQuery] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [isQuerying, setIsQuerying] = useState(false);

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
    }, []);

    const handleQuerySubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsQuerying(true);
        setQueryResult(null);
        
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
                
                <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
                    <Icons.Calendar className="w-5 h-5 text-heritage-gold" />
                    Today's Details
                </h2>
                
                {panchangData ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-text-muted mb-1">Vikram Samvat</p>
                            <p className="text-lg font-semibold text-white">{panchangData.year}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">Month</p>
                            <p className="text-lg font-semibold text-white">{panchangData.month} / {panchangData.teluguMonth}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">Tithi</p>
                            <p className="text-lg font-semibold text-white">{panchangData.tithi}</p>
                        </div>
                        <div>
                            <p className="text-sm text-text-muted mb-1">Paksha</p>
                            <p className="text-lg font-semibold text-heritage-gold-light">{panchangData.paksha}</p>
                        </div>
                    </div>
                ) : (
                    <div className="animate-pulse flex space-x-4">
                        <div className="h-10 bg-white/5 rounded w-full"></div>
                    </div>
                )}
            </div>

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
