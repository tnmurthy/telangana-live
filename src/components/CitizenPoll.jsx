import { useState, useEffect } from 'react';
import { currentPoll, pastPolls } from '../data/pollData';
import ShareWhatsApp from './ShareWhatsApp';
import { Icons } from './Icons';

export default function CitizenPoll() {
    const STORAGE_KEY = `poll-vote-${currentPoll.id}`;
    const [voted, setVoted] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved || null;
    });
    const [votes, setVotes] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return { ...currentPoll.initialVotes, [saved]: currentPoll.initialVotes[saved] + 1 };
        }
        return currentPoll.initialVotes;
    });
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        // Hydration logic is handled in useState initializers for purity
    }, [STORAGE_KEY]);

    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

    const handleVote = (optionId) => {
        if (voted) return;
        setAnimating(true);
        setVoted(optionId);
        setVotes(prev => ({ ...prev, [optionId]: prev[optionId] + 1 }));
        localStorage.setItem(STORAGE_KEY, optionId);
        setTimeout(() => setAnimating(false), 600);
    };

    const getPercentage = (optionId) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes[optionId] / totalVotes) * 100);
    };

    const pollShareText = `🗳️ Citizen Poll on telangana.live: "${currentPoll.question}" — Vote now!`;

    return (
        <section className="animate-fade-in">
            <div className="section-header">
                <div>
                    <h2 className="section-title flex items-center gap-2">
                        <Icons.Emergency className="w-5 h-5 text-heritage-gold" /> Citizen's Poll
                    </h2>
                    <p className="section-subtitle">{currentPoll.week}</p>
                </div>
                <ShareWhatsApp type="weather" data={{ district: 'Telangana', temp: '', condition: pollShareText }} />
            </div>

            <div className="glass-card section-block">
                <h3 className="text-lg sm:text-xl font-black text-white mb-2 leading-snug">{currentPoll.question}</h3>
                <p className="text-xs text-text-muted mb-6 leading-relaxed">{currentPoll.context}</p>

                {/* Vote Buttons / Result Bars */}
                <div className="space-y-3 mb-6">
                    {currentPoll.options.map(option => {
                        const pct = getPercentage(option.id);
                        const isVoted = voted === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleVote(option.id)}
                                disabled={!!voted}
                                className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-500 text-left group ${isVoted
                                    ? 'border-white/30 bg-white/10'
                                    : voted
                                        ? 'border-white/5 bg-white/[0.02]'
                                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99]'
                                    }`}
                            >
                                {/* Result bar (shown after voting) */}
                                {voted && (
                                    <div
                                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out ${animating ? 'opacity-0' : 'opacity-100'}`}
                                        style={{ width: `${pct}%`, backgroundColor: `${option.color}15` }}
                                    ></div>
                                )}

                                <div className="relative z-10 flex items-center justify-between p-4 sm:p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            {Icons[option.icon] && Icons[option.icon]({ className: "w-6 h-6", style: { color: option.color } })}
                                        </div>
                                        <span className="text-sm font-bold text-white">{option.label}</span>
                                        {isVoted && <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold">Your Vote</span>}
                                    </div>
                                    {voted && (
                                        <div className="text-right">
                                            <span className="text-xl font-black" style={{ color: option.color }}>{pct}%</span>
                                            <p className="text-[10px] text-text-muted">{votes[option.id].toLocaleString()} votes</p>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Total votes */}
                {voted && (
                    <p className="text-xs text-text-muted text-center animate-fade-in flex items-center justify-center gap-2">
                        <Icons.Emergency className="w-3 h-3" /> {totalVotes.toLocaleString()} total votes · Results are live
                    </p>
                )}
                {!voted && (
                    <p className="text-xs text-text-muted text-center">
                        Tap an option to cast your vote. One vote per browser.
                    </p>
                )}
            </div>

            {/* Past Polls */}
            <div className="glass-card section-block mt-4">
                <h4 className="label-xs mb-3 flex items-center gap-2">
                    <Icons.IT className="w-3 h-3" /> Past Poll Results
                </h4>
                <div className="space-y-2">
                    {pastPolls.map(poll => (
                        <div key={poll.id} className="detail-box">
                            <p className="text-xs text-white font-bold mb-1">{poll.question}</p>
                            <p className="text-[10px] text-success font-bold">{poll.winner}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
