"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Calculator,
  Cpu,
  Layers,
  Sparkles,
  TrendingDown,
  ExternalLink,
  RefreshCw,
  Search,
  CheckCircle2,
  DollarSign,
  Zap,
  Info,
  Code2,
} from "lucide-react";
import {
  fetchLLMPricing,
  type LLMModelPricing,
  type ModelCategory,
  FALLBACK_MODELS,
} from "@/lib/llmPricing";
import EmbedBadgeModal from "./EmbedBadgeModal";

export function LLMPricingTable() {
  const [models, setModels] = useState<LLMModelPricing[]>(FALLBACK_MODELS);
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"inputPrice" | "outputPrice" | "context">("inputPrice");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Loading…");
  const [sourceTag, setSourceTag] = useState<string>("cached");
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Calculator State
  const [calcInputTokens, setCalcInputTokens] = useState<number>(100_000);
  const [calcOutputTokens, setCalcOutputTokens] = useState<number>(25_000);
  const [calcMonthlyRequests, setCalcMonthlyRequests] = useState<number>(100);

  const loadData = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true);
    try {
      const data = await fetchLLMPricing();
      if (data && data.models?.length > 0) {
        setModels(data.models);
        setSourceTag(data.source);
        const dateObj = new Date(data.updatedAt);
        setLastUpdated(
          isNaN(dateObj.getTime())
            ? "Just now"
            : dateObj.toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
              }) + " IST"
        );
      }
    } catch (e) {
      console.error("Failed to load live LLM pricing:", e);
    } finally {
      if (showLoading) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  const handleManualRefresh = () => {
    loadData(true);
  };

  // Filter and sort models
  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        if (selectedCategory !== "all" && m.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            m.name.toLowerCase().includes(q) ||
            m.provider.toLowerCase().includes(q) ||
            m.id.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === "inputPrice") {
          diff = a.inputPricePerM - b.inputPricePerM;
        } else if (sortBy === "outputPrice") {
          diff = a.outputPricePerM - b.outputPricePerM;
        } else if (sortBy === "context") {
          diff = a.contextWindow - b.contextWindow;
        }
        return sortOrder === "asc" ? diff : -diff;
      });
  }, [models, selectedCategory, searchQuery, sortBy, sortOrder]);

  const formatContext = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
    }
    if (num >= 1_000) {
      return `${Math.round(num / 1_000)}k`;
    }
    return String(num);
  };

  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "google":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
      case "anthropic":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20";
      case "openai":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
      case "deepseek":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20";
      case "mistral":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
      case "meta":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  // Calculator monthly cost
  const calculateCost = (m: LLMModelPricing) => {
    const inputCost = (calcInputTokens / 1_000_000) * m.inputPricePerM;
    const outputCost = (calcOutputTokens / 1_000_000) * m.outputPricePerM;
    const perRequest = inputCost + outputCost;
    return perRequest * calcMonthlyRequests;
  };

  return (
    <div className="space-y-6">
      {/* Header and metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/50">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles size={12} className="animate-spin-slow" />
            Live OpenRouter Intelligence &amp; Cost Tracker
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            LLM Model Pricing &amp; Performance Benchmark
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Standardized cost benchmark for Google, Anthropic, OpenAI, DeepSeek, Mistral, and Meta frontier models.
            Compare real token economics and budget your local AI civic pipelines.
          </p>
        </div>

        <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEmbedModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-all"
              title="Embed live benchmark badge or widget on your website"
            >
              <Code2 size={13} />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/10 disabled:opacity-50"
              title="Refresh live pricing from OpenRouter"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Syncing..." : "Sync"}
            </button>
          </div>
          <div className="text-right">
            <span className="block text-[11px] text-slate-400">
              Updated: <span className="text-slate-200 font-medium">{lastUpdated}</span>
            </span>
            <span className="inline-block text-[10px] text-emerald-400 font-mono">
              ● {sourceTag}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Calculator Interactive Drawer */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-sm">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="w-8 h-8 rounded-lg bg-vizag-green/10 flex items-center justify-center text-vizag-green shrink-0">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
              Interactive Token Cost Calculator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulate prompt and generation charges across models for your workload.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Input Tokens / Request
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={calcInputTokens}
                onChange={(e) => setCalcInputTokens(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vizag-green"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                tokens
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              e.g. 100k for prompt or document context
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Output Tokens / Request
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={calcOutputTokens}
                onChange={(e) => setCalcOutputTokens(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vizag-green"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                tokens
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              e.g. 25k generated response / summary
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Invocations / Volume
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step="10"
                value={calcMonthlyRequests}
                onChange={(e) => setCalcMonthlyRequests(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vizag-green"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none">
                calls/mo
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Calculates total operational monthly run rate
            </span>
          </div>
        </div>

        {/* Quick estimate pills preview */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <DollarSign size={13} className="text-vizag-green" /> Quick Estimate / Month:
          </span>
          {models.slice(0, 4).map((m) => {
            const cost = calculateCost(m);
            return (
              <div
                key={m.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span className="font-semibold text-slate-900 dark:text-white">{m.name}:</span>
                <span className="font-bold text-vizag-green">
                  ${cost < 0.01 ? cost.toFixed(4) : cost.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/5 overflow-x-auto text-xs font-semibold">
          {[
            { id: "all", label: "All Models" },
            { id: "economy", label: "⚡ Ultra-Fast / Economy" },
            { id: "balanced", label: "⚖️ Balanced Workhorses" },
            { id: "reasoning", label: "🧠 Frontier Reasoning" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as ModelCategory)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search
            size={14}
            className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search model, lab, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-vizag-green shadow-sm"
          />
        </div>
      </div>

      {/* Model Cards & Table Display */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {/* Mobile View: High density Cards */}
        <div className="block lg:hidden divide-y divide-slate-100 dark:divide-white/5">
          {filteredModels.map((m) => {
            const monthlyCost = calculateCost(m);
            return (
              <div key={m.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getProviderColor(
                          m.provider
                        )}`}
                      >
                        {m.provider}
                      </span>
                      {m.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vizag-green/10 text-vizag-green border border-vizag-green/20">
                          {m.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {m.latencyTier || "Standard"}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mt-1 text-sm">
                      {m.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">{m.id}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Simulated Mo.
                    </span>
                    <span className="text-sm font-black text-vizag-green">
                      ${monthlyCost < 0.01 ? monthlyCost.toFixed(4) : monthlyCost.toFixed(2)}
                    </span>
                  </div>
                </div>

                {m.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {m.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Input / 1M</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${m.inputPricePerM.toFixed(m.inputPricePerM < 0.1 ? 3 : 2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Output / 1M</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      ${m.outputPricePerM.toFixed(m.outputPricePerM < 0.1 ? 3 : 2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Context</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatContext(m.contextWindow)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Model &amp; Lab</th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    if (sortBy === "inputPrice") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    else {
                      setSortBy("inputPrice");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Input Cost / 1M {sortBy === "inputPrice" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    if (sortBy === "outputPrice") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    else {
                      setSortBy("outputPrice");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Output Cost / 1M {sortBy === "outputPrice" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    if (sortBy === "context") setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    else {
                      setSortBy("context");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Context Window {sortBy === "context" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="py-3.5 px-4">Latency Tier</th>
                <th className="py-3.5 px-4 text-right">Simulated Mo. Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-sm">
              {filteredModels.map((m) => {
                const monthlyCost = calculateCost(m);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getProviderColor(
                            m.provider
                          )}`}
                        >
                          {m.provider}
                        </span>
                        {m.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vizag-green/10 text-vizag-green border border-vizag-green/20">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white mt-1">
                        {m.name}
                      </div>
                      <div className="text-xs font-mono text-slate-400">{m.id}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      ${m.inputPricePerM.toFixed(m.inputPricePerM < 0.1 ? 3 : 2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      ${m.outputPricePerM.toFixed(m.outputPricePerM < 0.1 ? 3 : 2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        {formatContext(m.contextWindow)} tokens
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {m.latencyTier || "Standard"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-vizag-green font-mono">
                        ${monthlyCost < 0.01 ? monthlyCost.toFixed(4) : monthlyCost.toFixed(2)}
                      </span>
                      <span className="block text-[10px] text-slate-400">/month</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredModels.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No models found matching your search or category criteria.
          </div>
        )}
      </div>

      {/* Footer attribution and link to OpenRouter */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2 px-1">
        <span className="flex items-center gap-1">
          <Info size={13} className="text-slate-400" />
          Pricing normalized to USD ($) per 1 Million tokens. Rates reflect OpenRouter gateway pass-through.
        </span>
        <a
          href="https://openrouter.ai/models"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-vizag-green underline"
        >
          View all 300+ models on OpenRouter <ExternalLink size={12} />
        </a>
      </div>

      {/* External Embed Modal for Developers & Blogs */}
      <EmbedBadgeModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />
    </div>
  );
}

export default LLMPricingTable;
export { LLMPricingTable as LLMPricingBenchmark };
