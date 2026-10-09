"use client";

import { useState } from "react";
import { Share2, Check, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppShareButtonProps {
  title: string;
  summary?: string;
  category?: string;
  area?: string;
  url?: string;
  className?: string;
  compact?: boolean;
}

export default function WhatsAppShareButton({
  title,
  summary,
  category = "Civic Alert",
  area,
  url,
  className,
  compact = false,
}: WhatsAppShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getFullShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "https://www.vizag.live";
  };

  const generateWhatsAppMessage = () => {
    const shareUrl = getFullShareUrl();
    const areaTag = area ? `📍 *Area:* ${area}\n` : "";
    const summaryTag = summary ? `\n_${summary}_\n` : "";

    const text = `🚨 *${category.toUpperCase()} | Vizag.live*\n` +
      `📢 *${title}*\n` +
      areaTag +
      summaryTag +
      `\n🔗 *Check live status & details:* ${shareUrl}\n\n` +
      `_Shared via Vizag.live — Visakhapatnam's Civic & Tech Portal_`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(getFullShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  if (compact) {
    return (
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <a
          href={generateWhatsAppMessage()}
          target="_blank"
          rel="noopener noreferrer"
          title="Share to WhatsApp"
          aria-label="Share alert to WhatsApp"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
        >
          <MessageCircle size={13} aria-hidden="true" />
          <span>Share</span>
        </a>
        <button
          onClick={handleCopyLink}
          title="Copy link"
          aria-label="Copy link to clipboard"
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <a
        href={generateWhatsAppMessage()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95"
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span>Share to WhatsApp</span>
      </a>
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={14} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
