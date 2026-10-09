"use client";

import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  BrainCircuit,
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Download,
  Heart,
  Cpu,
  Boxes,
  Code2,
  Terminal,
} from "lucide-react";
import type { AIMarketPulseData } from "@/lib/aiMarketPulse";
import WhatsAppShareButton from "./WhatsAppShareButton";

interface AIMarketRadarProps {
  initialData: AIMarketPulseData;
}

export default function AIMarketRadar({ initialData }: AIMarketRadarProps) {
  const [activeTab, setActiveTab] = useState<"trending" | "leaders" | "sunset" | "spotlight">("spotlight");
  const { trendingModels, marketLeaders, sunsetRadar, spotlight, updatedAt } = initialData;

  const formattedDate = (() => {
    try {
      const d = new Date(updatedAt);
      return isNaN(d.getTime()) ? "Today" : d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Current";
    }
  })();

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="px-6 py-5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border-b border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vizag-green/20 text-vizag-green flex items-center justify-center font-bold">
            <BrainCircuit size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                AI Intelligence &amp; Market Radar
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Pulse
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tracking state-of-the-art architectures, Hugging Face trends, arena dominance &amp; deprecations • Updated {formattedDate}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setActiveTab("spotlight")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "spotlight"
                ? "bg-white dark:bg-slate-700 text-vizag-green dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Sparkles size={14} />
            <span>Jev &amp; Systems</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trending")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "trending"
                ? "bg-white dark:bg-slate-700 text-vizag-green dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Flame size={14} className="text-orange-500" />
            <span>HF Trending</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leaders")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "leaders"
                ? "bg-white dark:bg-slate-700 text-vizag-green dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award size={14} className="text-amber-500" />
            <span>Market Leaders</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sunset")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "sunset"
                ? "bg-white dark:bg-slate-700 text-rose-500 dark:text-rose-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <AlertTriangle size={14} className="text-rose-500" />
            <span>Sunset Watch</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: SPOTLIGHT (Jev / System 1 Router / Autonomous Systems) */}
        {activeTab === "spotlight" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-emerald-50/50 dark:from-indigo-950/20 dark:via-slate-900 dark:to-emerald-950/20 border border-indigo-200/50 dark:border-indigo-500/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-indigo-100 dark:border-indigo-900/40 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-black tracking-wider uppercase rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Architecture Breakthrough
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      by {spotlight.creator}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                    {spotlight.name}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {spotlight.paradigm}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {spotlight.hfRepoUrl && (
                    <a
                      href={spotlight.hfRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                    >
                      <Boxes size={14} />
                      HF Model Card
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {spotlight.demoUrl && (
                    <a
                      href={spotlight.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span>Interactive Demo</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <WhatsAppShareButton
                    title={`${spotlight.name} — ${spotlight.paradigm}`}
                    summary={spotlight.description}
                    category="AI Architecture Spotlight"
                    url="https://www.vizag.live/tech-pulse"
                    compact={true}
                  />
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                {spotlight.description}
              </p>

              {/* Benchmarks Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                {spotlight.benchmarks.map((bm, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-sm"
                  >
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                      {bm.metric}
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {bm.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Architecture Key Highlights */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Engineering Principles &amp; Advantages
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {spotlight.architectureHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700/40"
                    >
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet Example */}
              {spotlight.sdkUsageSnippet && (
                <div className="mt-5 rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] mb-2 pb-1 border-b border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Terminal size={12} />
                      Zero-Overhead Agent Dispatch
                    </span>
                    <span>TypeScript SDK</span>
                  </div>
                  <pre className="text-emerald-400 leading-relaxed">
                    <code>{spotlight.sdkUsageSnippet}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TRENDING ON HUGGING FACE */}
        {activeTab === "trending" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Top models capturing open-source developer velocity across modalities, vision-language, and edge reasoning.
              </p>
              <a
                href="https://huggingface.co/models?sort=trending"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-vizag-green hover:underline flex items-center gap-1"
              >
                View Hub <ExternalLink size={12} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendingModels.map((model) => (
                <div
                  key={model.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 hover:border-vizag-green/40 dark:hover:border-vizag-green/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {model.author}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {model.pipelineTag}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                          {model.name}
                        </h4>
                      </div>

                      <a
                        href={`https://huggingface.co/${model.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        aria-label={`Open ${model.id} on Hugging Face`}
                      >
                        <ExternalLink size={15} />
                      </a>
                    </div>

                    {model.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                        {model.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/70 dark:border-slate-700/60 text-xs">
                    <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Download size={13} className="text-slate-400" />
                        {model.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={13} className="text-rose-500 fill-rose-500/20" />
                        {model.likes.toLocaleString()}
                      </span>
                    </div>

                    {model.numParameters && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {(model.numParameters / 1e9).toFixed(1)}B params
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MARKET LEADERS & ARENA BENCHMARKS */}
        {activeTab === "leaders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Frontier models dominating Chatbot Arena Elo, software engineering benchmarks (SWE-bench), and raw reasoning efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketLeaders.map((leader) => (
                <div
                  key={leader.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    leader.isDominant
                      ? "border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-sm"
                      : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {leader.provider}
                        </span>
                        {leader.isDominant && (
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Frontier Leader
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                        {leader.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Arena Elo</div>
                      <div className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {leader.arenaElo}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/50">
                      <span className="text-slate-400 block text-[10px]">Coding Benchmark</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {leader.codingBenchmarkScore}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/50">
                      <span className="text-slate-400 block text-[10px]">API Pricing</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {leader.pricingSummary}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-indigo-400/40 pl-2">
                    &ldquo;{leader.sweetSpot}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DEPRECATION & SUNSET WATCH */}
        {activeTab === "sunset" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">Developer Notice:</span> Major AI labs (OpenAI, Anthropic, Google) deprecate older model endpoints every quarter. Below are legacy models retiring soon along with drop-in replacements that provide immediate latency and cost reductions.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {sunsetRadar.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {alert.provider}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-wider ${
                            alert.statusBadge === "Critical"
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : alert.statusBadge === "Warning"
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {alert.statusBadge}: {alert.cutoffDate}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                        {alert.modelName}
                      </h4>
                    </div>

                    {/* Migration Badge */}
                    <div className="sm:text-right">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Recommended Migration</div>
                      <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <span>{alert.recommendedSuccessor.name}</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                    {alert.impactSummary}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/60 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Zap size={13} />
                      {alert.recommendedSuccessor.speedDelta}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {alert.recommendedSuccessor.costDelta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
