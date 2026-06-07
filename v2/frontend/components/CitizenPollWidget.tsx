'use client';

import { useState } from 'react';
import CivicCard from './ui/CivicCard';

export default function CitizenPollWidget() {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState({ yes: 145, no: 12 });

  const handleVote = (type: 'yes' | 'no') => {
    setVotes({ ...votes, [type]: votes[type] + 1 });
    setVoted(true);
  };

  return (
    <CivicCard title="Citizen Poll" subtitle="Local Voice" accentColor="blue">
      <div className="space-y-4">
        <p className="text-sm font-bold text-slate-900 uppercase leading-tight">
          Should the new ward park feature a community composting zone?
        </p>
        
        {!voted ? (
          <div className="flex gap-2">
            <button 
              onClick={() => handleVote('yes')}
              className="flex-grow py-2 rounded-lg bg-emerald-600 text-white font-black text-[10px] uppercase hover:bg-emerald-700 transition-all"
            >
              Yes, Absolutely
            </button>
            <button 
              onClick={() => handleVote('no')}
              className="flex-grow py-2 rounded-lg border border-slate-200 text-slate-500 font-black text-[10px] uppercase hover:bg-slate-50 transition-all"
            >
              No Need
            </button>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-black uppercase">
                   <span className="text-emerald-600">Yes ({Math.round(votes.yes/(votes.yes+votes.no)*100)}%)</span>
                   <span className="text-slate-400">{votes.yes} Votes</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500" style={{ width: `${votes.yes/(votes.yes+votes.no)*100}%` }} />
                </div>
             </div>
             <p className="text-[9px] text-slate-400 italic text-center font-bold uppercase">Thank you for voting!</p>
          </div>
        )}
      </div>
    </CivicCard>
  );
}
