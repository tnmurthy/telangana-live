import { describe, it, expect } from "vitest";
import {
  FALLBACK_MARKET_PULSE,
  type HFTrendingModel,
  type MarketLeaderModel,
  type ModelSunsetAlert,
} from "../../lib/aiMarketPulse";

describe("AI Market Pulse & Radar Definitions", () => {
  it("contains valid trending models from Hugging Face", () => {
    const trending = FALLBACK_MARKET_PULSE.trendingModels;
    expect(trending.length).toBeGreaterThanOrEqual(4);

    // Verify presence of notable community and vision models
    const ids = trending.map((m) => m.id);
    expect(ids).toContain("autotrust/JEV-27B-VL");
    expect(ids).toContain("Cloudflare/clef");

    for (const model of trending) {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(model.author).toBeTruthy();
      expect(model.downloads).toBeGreaterThanOrEqual(0);
      expect(model.likes).toBeGreaterThanOrEqual(0);
      expect(model.pipelineTag).toBeTruthy();
    }
  });

  it("contains leading frontier models with arena benchmarks", () => {
    const leaders = FALLBACK_MARKET_PULSE.marketLeaders;
    expect(leaders.length).toBeGreaterThanOrEqual(3);

    const names = leaders.map((m) => m.name);
    const hasClaude = names.some((n) => n.toLowerCase().includes("claude"));
    const hasDeepSeek = names.some((n) => n.toLowerCase().includes("deepseek"));

    expect(hasClaude).toBe(true);
    expect(hasDeepSeek).toBe(true);

    for (const leader of leaders) {
      expect(leader.arenaElo).toBeGreaterThan(1200);
      expect(leader.codingBenchmarkScore).toBeTruthy();
      expect(leader.pricingSummary).toBeTruthy();
      expect(leader.sweetSpot.length).toBeGreaterThan(10);
    }
  });

  it("contains sunset radar with actionable migration recommendations", () => {
    const alerts = FALLBACK_MARKET_PULSE.sunsetRadar;
    expect(alerts.length).toBeGreaterThanOrEqual(3);

    for (const alert of alerts) {
      expect(alert.modelName).toBeTruthy();
      expect(alert.provider).toBeTruthy();
      expect(alert.cutoffDate).toBeTruthy();
      expect(["sunset-imminent", "deprecated", "legacy-support"]).toContain(alert.status);
      expect(alert.recommendedSuccessor.id).toBeTruthy();
      expect(alert.recommendedSuccessor.name).toBeTruthy();
      expect(alert.recommendedSuccessor.costDelta).toBeTruthy();
      expect(alert.recommendedSuccessor.speedDelta).toBeTruthy();
    }
  });

  it("spotlights Jev architecture and decision routing with metrics", () => {
    const spotlight = FALLBACK_MARKET_PULSE.spotlight;
    expect(spotlight.id).toBe("jev-router-spotlight");
    expect(spotlight.name).toContain("Jev");
    expect(spotlight.paradigm).toContain("System 1");
    expect(spotlight.architectureHighlights.length).toBeGreaterThanOrEqual(3);
    expect(spotlight.benchmarks.length).toBeGreaterThanOrEqual(2);
    expect(spotlight.sdkUsageSnippet).toContain("typesafe.decide");
  });
});
