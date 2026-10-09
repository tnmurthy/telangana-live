import type { Metadata } from "next";
import { Cpu } from "lucide-react";
import TechPulseFeedView from "@/components/TechPulseFeed";
import LLMPricingTable from "@/components/LLMPricingTable";
import AIMarketRadar from "@/components/AIMarketRadar";
import { fetchAIMarketPulse } from "@/lib/aiMarketPulse";

export const metadata: Metadata = {
  title: "Tech & AI Pulse — Telangana & Hyderabad | Telangana.live",
  description:
    "Sourced local news on AI scams and digital safety, government technology programmes, trending AI models, and live LLM model pricing & cost benchmarks.",
  alternates: { canonical: "https://www.telangana.live/tech-pulse" },
  openGraph: {
    title: "Tech & AI Pulse — Telangana & Hyderabad | Telangana.live",
    description: "Trending AI models on Hugging Face, OpenRouter pricing benchmark, and tech updates in Vizag.",
    url: "https://www.telangana.live/tech-pulse",
    images: [
      {
        url: "https://www.telangana.live/api/og?title=Tech%20%26%20AI%20Pulse%20%E2%80%94%20Live%20Intelligence&subtitle=Real-time%20LLM%20pricing%2C%20Hugging%20Face%20trending%20models%20%26%20local%20cyber%20alerts&tag=AI%20RADAR&category=Tech%20Intelligence&metrics=Live%20Benchmark",
        width: 1200,
        height: 630,
        alt: "Tech & AI Pulse Telangana.live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech & AI Pulse — Telangana & Hyderabad | Telangana.live",
    description: "Trending AI models on Hugging Face, OpenRouter pricing benchmark, and tech updates in Vizag.",
    images: ["https://www.telangana.live/api/og?title=Tech%20%26%20AI%20Pulse%20%E2%80%94%20Live%20Intelligence&subtitle=Real-time%20LLM%20pricing%2C%20Hugging%20Face%20trending%20models%20%26%20local%20cyber%20alerts&tag=AI%20RADAR"],
  },
};

// Sourced stories and live market radar snapshots;
// fully deterministic and verified.
export default async function TechPulsePage() {
  const marketPulseData = await fetchAIMarketPulse();

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
          <Cpu size={24} aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tech &amp; AI Pulse</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Technology intelligence that matters to people in Hyderabad, Warangal and across Telangana: verified news feeds,
            cyber alerts, trending open-source models, and live AI pricing benchmarks.
          </p>
        </div>
      </header>

      {/* Proactive AI Market & Architecture Radar */}
      <section aria-labelledby="ai-market-radar">
        <AIMarketRadar initialData={marketPulseData} />
      </section>

      {/* Local Tech News Feed */}
      <section aria-labelledby="local-tech-feed">
        <TechPulseFeedView />
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
          Stories are found through Google News and sorted into sections automatically; headlines are the
          outlets&rsquo; own. Nothing older than two weeks is shown.
        </p>
      </section>

      {/* Automated LLM Model Pricing & Cost Benchmark Widget */}
      <section aria-labelledby="llm-cost-benchmark" className="pt-4 border-t border-slate-200 dark:border-white/10">
        <LLMPricingTable />
      </section>
    </div>
  );
}
