"use client";

import { useState } from "react";
import { Code2, Copy, Check, ExternalLink, X } from "lucide-react";

interface EmbedBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmbedBadgeModal({ isOpen, onClose }: EmbedBadgeModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const embedCodeIframe = `<iframe 
  src="https://www.telangana.live/embed/llm-pricing" 
  width="100%" 
  height="540" 
  style="border:1px solid rgba(0,0,0,0.1); border-radius:12px; overflow:hidden;" 
  title="Live LLM Cost Benchmark | Telangana.live"
></iframe>`;

  const embedCodeBadge = `<!-- Live LLM Benchmark Badge by Telangana.live -->
<a href="https://www.telangana.live/tech-pulse" target="_blank" rel="noopener noreferrer">
  <img src="https://www.telangana.live/api/badge/llm-cheapest" alt="Cheapest LLM Benchmark" />
</a>`;

  const handleCopy = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (e) {
      console.error("Failed to copy embed code:", e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Code2 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Embed Live LLM Benchmark on Your Site
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Display real-time model pricing, rankings &amp; cost calculations on your blog, docs, or dashboard.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Option 1: Live Interactive Widget Iframe */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Interactive Cost Table (iFrame)
            </span>
            <button
              onClick={() => handleCopy(embedCodeIframe, "iframe")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {copiedType === "iframe" ? (
                <>
                  <Check size={13} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-slate-300 text-[11px] font-mono rounded-xl overflow-x-auto border border-white/10">
            {embedCodeIframe}
          </pre>
        </div>

        {/* Option 2: Lightweight SVG Markdown / HTML Badge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Markdown / HTML Live Badge
            </span>
            <button
              onClick={() => handleCopy(embedCodeBadge, "badge")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {copiedType === "badge" ? (
                <>
                  <Check size={13} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={13} /> Copy Code
                </>
              )}
            </button>
          </div>
          <pre className="p-3 bg-slate-950 text-slate-300 text-[11px] font-mono rounded-xl overflow-x-auto border border-white/10">
            {embedCodeBadge}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated live every 6h via OpenRouter</span>
          </div>
          <a
            href="/tech-pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
          >
            <span>Preview on Tech Pulse</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
