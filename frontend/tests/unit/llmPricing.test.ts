import { describe, it, expect } from "vitest";
import { FALLBACK_MODELS, type LLMModelPricing } from "../../lib/llmPricing";

describe("LLM Pricing Definitions", () => {
  it("contains all required models across providers", () => {
    const requiredProviders = ["Google", "Anthropic", "OpenAI", "DeepSeek", "Mistral", "Meta"];
    const foundProviders = new Set(FALLBACK_MODELS.map((m) => m.provider));

    for (const provider of requiredProviders) {
      expect(foundProviders.has(provider), `Missing provider: ${provider}`).toBe(true);
    }
  });

  it("includes all upgraded frontier releases across major labs", () => {
    const modelIds = FALLBACK_MODELS.map((m) => m.id);

    // Google
    expect(modelIds).toContain("google/gemini-2.0-flash-lite-001");
    expect(modelIds).toContain("google/gemini-2.0-flash-001");
    expect(modelIds).toContain("google/gemini-2.0-pro-exp-02-05");

    // Anthropic
    expect(modelIds).toContain("anthropic/claude-3.5-haiku");
    expect(modelIds).toContain("anthropic/claude-3.7-sonnet");
    expect(modelIds).not.toContain("anthropic/claude-3-opus");

    // OpenAI
    expect(modelIds).toContain("openai/gpt-4o-mini");
    expect(modelIds).toContain("openai/gpt-4o");
    expect(modelIds).toContain("openai/o3-mini");
    expect(modelIds).toContain("openai/o1");

    // DeepSeek
    expect(modelIds).toContain("deepseek/deepseek-chat");
    expect(modelIds).toContain("deepseek/deepseek-r1");

    // Mistral & Meta
    expect(modelIds).toContain("mistralai/mistral-large-2411");
    expect(modelIds).toContain("meta-llama/llama-3.3-70b-instruct");
  });

  it("verifies prices are non-negative numbers and contexts are valid", () => {
    for (const model of FALLBACK_MODELS) {
      expect(model.inputPricePerM).toBeGreaterThanOrEqual(0);
      expect(model.outputPricePerM).toBeGreaterThanOrEqual(0);
      expect(model.contextWindow).toBeGreaterThanOrEqual(16000);
      expect(model.name.length).toBeGreaterThanOrEqual(2);
      expect(["economy", "balanced", "reasoning"]).toContain(model.category);
      expect(["Ultra-Fast", "Fast", "Standard", "Deep Reasoning"]).toContain(model.latencyTier);
    }
  });
});
