// Mock AI Daily Briefing Data - Representing a live synthesized snapshot
export const aiBriefingData = {
  date: "2026-03-27",
  
  // High-level 3-minute executive brief
  executiveBrief: [
    {
      id: "coding",
      title: "Coding & Agentic Dominance",
      description: "Anthropic's newly released Claude 3.5 Opus retains the #1 spot on SWE-bench, but OpenAI's GPT-4.5-Turbine closed the gap in autonomous tool use. GitHub Copilot Workspace has now fully integrated multi-file editing natively, heavily reducing the need for raw API calls.",
      gainedGround: "Anthropic / GitHub",
      trend: "up",
    },
    {
      id: "context",
      title: "Long-Context Wars",
      description: "Google's Gemini 2.0 Pro just unlocked a 5M token context window for all Tier 2+ developers. Perfect for dumping entire enterprise codebases. Nvidia's local Nemo-128K remains the fastest for on-prem context parsing.",
      gainedGround: "Google",
      trend: "up",
    },
    {
      id: "spend",
      title: "Impact on Stack & Spend",
      description: "OpenAI dropped GPT-4o pricing by another 10%. However, OpenAI announced the deprecation of gpt-3.5-turbo entirely by Q3 2026. If you have legacy scraper jobs on 3.5, migrate to gpt-4o-mini immediately to avoid downtime.",
      gainedGround: "OpenAI (Pricing) / Watch out for Deprecations",
      trend: "alert",
    }
  ],

  // Comparison table data
  comparisonStats: [
    {
      provider: "OpenAI",
      model: "GPT-4.5-Turbine",
      codingScore: "92%",
      agenticScore: "95%",
      contextWindow: "256K",
      pricePer1M: "$4.50",
      priceChange: -0.50, // -ve means cheaper (good)
      status: "Leading Agentic",
      color: "bg-emerald-500",
      glow: "shadow-emerald-500/50"
    },
    {
      provider: "Anthropic",
      model: "Claude 3.5 Opus",
      codingScore: "94%",
      agenticScore: "93%",
      contextWindow: "200K",
      pricePer1M: "$15.00",
      priceChange: 0,
      status: "Leading Coding",
      color: "bg-amber-500",
      glow: "shadow-amber-500/50"
    },
    {
      provider: "Google",
      model: "Gemini 2.0 Pro",
      codingScore: "88%",
      agenticScore: "85%",
      contextWindow: "5M",
      pricePer1M: "$3.50",
      priceChange: -1.00,
      status: "Leading Context",
      color: "bg-blue-500",
      glow: "shadow-blue-500/50"
    },
    {
      provider: "Nvidia",
      model: "Nemotron-4 340B",
      codingScore: "85%",
      agenticScore: "82%",
      contextWindow: "128K",
      pricePer1M: "$0.00 (Local)",
      priceChange: 0,
      status: "Leading Open-Weight",
      color: "bg-green-500",
      glow: "shadow-green-500/50"
    },
    {
      provider: "GitHub",
      model: "Copilot Workspace 2.0",
      codingScore: "N/A",
      agenticScore: "96%",
      contextWindow: "Workspace-Aware",
      pricePer1M: "Subscription",
      priceChange: 0,
      status: "Leading Integration",
      color: "bg-purple-500",
      glow: "shadow-purple-500/50"
    }
  ],

  deprecations: [
    { model: "gpt-3.5-turbo", provider: "OpenAI", date: "Sept 1, 2026", replacement: "gpt-4o-mini" },
    { model: "claude-2.1", provider: "Anthropic", date: "Dec 31, 2026", replacement: "claude-3-haiku" }
  ]
};
