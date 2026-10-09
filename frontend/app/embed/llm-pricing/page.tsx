import type { Metadata } from "next";
import { LLMPricingTable } from "@/components/LLMPricingTable";

export const metadata: Metadata = {
  title: "Live LLM Cost Benchmark Widget | Telangana.live",
  description: "Embeddable live LLM pricing and token cost calculator powered by OpenRouter data.",
  robots: { index: false, follow: false },
};

export default function EmbedLLMPricingPage() {
  return (
    <div className="p-3 bg-white dark:bg-slate-950 min-h-screen">
      <LLMPricingTable />
    </div>
  );
}
