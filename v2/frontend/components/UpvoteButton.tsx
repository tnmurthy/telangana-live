'use client';

import { useState } from 'react';

interface UpvoteButtonProps {
  reportId: number;
  initialCount: number;
}

export default function UpvoteButton({ reportId, initialCount }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleUpvote = async () => {
    if (isVoting || hasVoted) return;
    setIsVoting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/civic/report/${reportId}/upvote`, {
        method: 'POST'
      });
      const data = await response.json();
      setCount(data.new_count);
      setHasVoted(true);
    } catch (error) {
      console.error('Upvote error');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <button 
      onClick={handleUpvote}
      disabled={isVoting || hasVoted}
      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
        hasVoted 
          ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
          : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      <span>{hasVoted ? '✓ IMPACTS ME' : '☝️ IMPACTS ME'}</span>
      <span className={`px-1.5 py-0.5 rounded-md ${hasVoted ? 'bg-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
        {count}
      </span>
    </button>
  );
}
