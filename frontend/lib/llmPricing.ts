/**
 * LLM Model Pricing Benchmark & Calculator Types and Utilities
 * Live dynamic synchronization with OpenRouter API (https://openrouter.ai/api/v1/models)
 * with robust local cache fallback (/data/llm_pricing.json) and client-side revalidation.
 */


/** The fields of an OpenRouter /models entry that this module reads. */
interface OpenRouterModel {
  id: string;
  name?: string;
  created?: number;
  context_length?: number;
  architecture?: { instruct_type?: string | null };
  pricing?: { prompt?: string; completion?: string };
  reasoning?: { default_enabled?: boolean; mandatory?: boolean };
}

export type ModelCategory = 'all' | 'economy' | 'balanced' | 'reasoning';

export interface LLMModelPricing {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'DeepSeek' | 'Mistral' | 'Meta' | string;
  category: 'economy' | 'balanced' | 'reasoning';
  inputPricePerM: number;    // USD per 1M input tokens
  outputPricePerM: number;   // USD per 1M output tokens
  contextWindow: number;     // Context window in tokens (e.g. 1000000)
  description?: string;
  latencyTier?: 'Ultra-Fast' | 'Fast' | 'Standard' | 'Deep Reasoning';
  badge?: string;
  isPopular?: boolean;
}

export interface LLMPricingData {
  updatedAt: string;
  source: string;
  models: LLMModelPricing[];
}

export const FALLBACK_MODELS: LLMModelPricing[] = [
  // Google
  {
    id: 'google/gemini-2.0-flash-lite-001',
    name: 'Gemini 2.0 Flash-Lite',
    provider: 'Google',
    category: 'economy',
    inputPricePerM: 0.075,
    outputPricePerM: 0.30,
    contextWindow: 1048576,
    description: 'Ultra-low latency, high-efficiency model built for high-frequency civic & agent workloads.',
    latencyTier: 'Ultra-Fast',
    badge: 'Lowest Cost',
    isPopular: true,
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    category: 'economy',
    inputPricePerM: 0.10,
    outputPricePerM: 0.40,
    contextWindow: 1048576,
    description: 'Google frontier workhorse model with native multimodal capabilities and 1M token context.',
    latencyTier: 'Fast',
    badge: 'Popular',
    isPopular: true,
  },
  {
    id: 'google/gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro Exp',
    provider: 'Google',
    category: 'balanced',
    inputPricePerM: 1.25,
    outputPricePerM: 5.00,
    contextWindow: 2000000,
    description: 'Google experimental frontier model with massive context window and superior coding & agent capabilities.',
    latencyTier: 'Fast',
    badge: 'Top Google',
  },
  // Anthropic
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    category: 'balanced',
    inputPricePerM: 0.80,
    outputPricePerM: 4.00,
    contextWindow: 200000,
    description: 'Anthropic fast compact model with blazing speed and strong coding/tool performance.',
    latencyTier: 'Ultra-Fast',
  },
  {
    id: 'anthropic/claude-3.7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    category: 'reasoning',
    inputPricePerM: 3.00,
    outputPricePerM: 15.00,
    contextWindow: 200000,
    description: 'Frontier hybrid reasoning and coding model from Anthropic with instantaneous or thinking-step answers.',
    latencyTier: 'Fast',
    badge: 'Top Coder',
    isPopular: true,
  },
  // OpenAI
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    category: 'economy',
    inputPricePerM: 0.15,
    outputPricePerM: 0.60,
    contextWindow: 128000,
    description: 'Cost-efficient omni small model for high-volume conversational & extraction tasks.',
    latencyTier: 'Ultra-Fast',
    badge: 'Popular',
    isPopular: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    category: 'balanced',
    inputPricePerM: 2.50,
    outputPricePerM: 10.00,
    contextWindow: 128000,
    description: 'OpenAI flagship versatile multimodal model with strong real-world benchmarks.',
    latencyTier: 'Fast',
    isPopular: true,
  },
  {
    id: 'openai/o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    category: 'reasoning',
    inputPricePerM: 1.10,
    outputPricePerM: 4.40,
    contextWindow: 200000,
    description: 'Cost-effective STEM and logic reasoning model with thinking capabilities.',
    latencyTier: 'Deep Reasoning',
    badge: 'Reasoning',
    isPopular: true,
  },
  {
    id: 'openai/o1',
    name: 'o1',
    provider: 'OpenAI',
    category: 'reasoning',
    inputPricePerM: 15.00,
    outputPricePerM: 60.00,
    contextWindow: 200000,
    description: 'OpenAI flagship deep reasoning foundation model trained with large-scale reinforcement learning.',
    latencyTier: 'Deep Reasoning',
    badge: 'Frontier Reasoning',
    isPopular: true,
  },
  // DeepSeek
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    category: 'economy',
    inputPricePerM: 0.14,
    outputPricePerM: 0.28,
    contextWindow: 163840,
    description: '671B MoE model delivering frontier intelligence at fraction-of-a-cent prices.',
    latencyTier: 'Fast',
    badge: 'Extreme Value',
    isPopular: true,
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    category: 'reasoning',
    inputPricePerM: 0.70,
    outputPricePerM: 2.50,
    contextWindow: 64000,
    description: 'Open-weights reinforcement learning reasoning model rivaling top proprietary labs.',
    latencyTier: 'Deep Reasoning',
    badge: 'Open Reasoning',
    isPopular: true,
  },
  // Mistral & Meta
  {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large 2411',
    provider: 'Mistral',
    category: 'balanced',
    inputPricePerM: 2.00,
    outputPricePerM: 6.00,
    contextWindow: 128000,
    description: 'European flagship weights model with high multilingual proficiency and tool calling.',
    latencyTier: 'Fast',
    badge: 'Multilingual',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Meta',
    category: 'economy',
    inputPricePerM: 0.10,
    outputPricePerM: 0.32,
    contextWindow: 131072,
    description: 'State-of-the-art open-weights 70B model matching previous-gen 405B capabilities at low cost.',
    latencyTier: 'Fast',
    badge: 'Open Source',
    isPopular: true,
  },
];

const PROVIDER_RULES: [RegExp, string][] = [
  [/^(google|gemini)\//i, 'Google'],
  [/^(anthropic|claude)\//i, 'Anthropic'],
  [/^(openai|o1|o3|gpt)\//i, 'OpenAI'],
  [/^(deepseek)\//i, 'DeepSeek'],
  [/^(mistral|mistralai)\//i, 'Mistral'],
  [/^(meta-llama|meta)\//i, 'Meta'],
];

export function detectProvider(modelId: string): string {
  for (const [regex, prov] of PROVIDER_RULES) {
    if (regex.test(modelId)) return prov;
  }
  const prefix = modelId.split('/')[0] || 'Other';
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export function computeCategory(
  inputPricePerM: number,
  modelId: string,
  modelName: string = '',
  hasReasoning = false
): 'economy' | 'balanced' | 'reasoning' {
  const combined = `${modelId} ${modelName}`.toLowerCase();
  const hasReasoningKw =
    combined.includes('-r1') ||
    combined.includes('/r1') ||
    combined.includes('deepseek-r1') ||
    combined.includes('/o1') ||
    combined.includes('/o3') ||
    combined.includes('o1-') ||
    combined.includes('o3-') ||
    combined.includes('reasoning') ||
    combined.includes('thinking');

  if (hasReasoning || hasReasoningKw || inputPricePerM >= 4.0) {
    return 'reasoning';
  }
  if (inputPricePerM <= 0.80) {
    return 'economy';
  }
  return 'balanced';
}

export function computeLatencyTier(
  contextWindow: number,
  category: 'economy' | 'balanced' | 'reasoning',
  inputPricePerM: number,
  modelId: string
): 'Ultra-Fast' | 'Fast' | 'Standard' | 'Deep Reasoning' {
  const combined = modelId.toLowerCase();
  if (category === 'reasoning' || combined.includes('o1') || combined.includes('o3') || combined.includes('r1')) {
    return 'Deep Reasoning';
  }
  if (combined.includes('flash-lite') || combined.includes('haiku') || combined.includes('mini') || inputPricePerM <= 0.15) {
    return 'Ultra-Fast';
  }
  if (combined.includes('flash') || inputPricePerM <= 2.50 || contextWindow <= 131072) {
    return 'Fast';
  }
  return 'Standard';
}

const EXCLUDE_MODEL_REGEX = /(:free$|:nitro$|:exact$|:extended$|:online$|-base$|-base-|-embedding|embed|whisper|rerank|moderation|tts|stt|guard|clip|vl-base|router|adapter)/i;

const FRONTIER_KEYWORDS = [
  'claude-3.7-sonnet', 'claude-3-7-sonnet', 'claude-3.5-sonnet', 'claude-3.5-haiku',
  'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-pro', 'gemini-2.5-pro',
  'gpt-4.5', 'gpt-4o', 'gpt-4o-mini', 'o3-mini', 'o1', 'o1-mini', 'o1-preview',
  'deepseek-r1', 'deepseek-chat', 'deepseek-v3',
  'mistral-large-2411', 'mistral-large', 'mistral-small',
  'llama-3.3-70b', 'llama-3.3-70b-instruct', 'llama-3.1-405b', 'llama-3.1-70b',
];

/**
 * Fetch live models from OpenRouter or local static snapshot fallback.
 * Automatically discovers and integrates frontier models dynamically.
 */
export async function fetchLLMPricing(): Promise<LLMPricingData> {
  const staticFallback: LLMPricingData = {
    updatedAt: '2026-10-07T05:00:00Z',
    source: 'snapshot',
    models: FALLBACK_MODELS,
  };

  // Try static snapshot first if available in public data
  let baseData = staticFallback;
  try {
    const res = await fetch('/data/llm_pricing.json', { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.models) && json.models.length > 0) {
        baseData = json;
      }
    }
  } catch {
    // Keep fallback
  }

  // Live client-side revalidation with OpenRouter (non-blocking, tolerant to CORS/Rate-limit)
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeout = setTimeout(() => controller?.abort(), 4000);

    const orRes = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Accept: 'application/json' },
      signal: controller?.signal,
    });
    clearTimeout(timeout);

    if (orRes.ok) {
      const orJson = await orRes.json();
      const openRouterList: OpenRouterModel[] = Array.isArray(orJson?.data) ? orJson.data : [];

      if (openRouterList.length > 0) {
        const liveMap = new Map<string, OpenRouterModel>();
        const dynamicCandidates: { score: number; created: number; item: OpenRouterModel }[] = [];

        for (const item of openRouterList) {
          if (!item?.id) continue;
          liveMap.set(item.id, item);

          // Check if valid chat/instruct model
          if (EXCLUDE_MODEL_REGEX.test(item.id)) continue;
          if (item.architecture?.instruct_type === 'none') continue;

          const promptCost = parseFloat(item.pricing?.prompt);
          if (isNaN(promptCost) || promptCost < 0) continue;

          // Score relevance for dynamic inclusion
          let score = 0;
          const lowerId = item.id.toLowerCase();
          for (const kw of FRONTIER_KEYWORDS) {
            if (lowerId.includes(kw)) {
              score += 100;
              break;
            }
          }
          const provider = detectProvider(item.id);
          if (['Google', 'Anthropic', 'OpenAI', 'DeepSeek', 'Mistral', 'Meta'].includes(provider)) {
            score += 50;
          }
          if (item.created) {
            score += Math.min(50, item.created / 1000000);
          }

          if (score >= 50) {
            dynamicCandidates.push({ score, created: item.created || 0, item });
          }
        }

        // Sort candidates
        dynamicCandidates.sort((a, b) => b.score - a.score || b.created - a.created);

        // Map existing base models
        const modelMap = new Map<string, LLMModelPricing>();

        for (const m of baseData.models) {
          const liveItem = liveMap.get(m.id);
          if (!liveItem?.pricing) {
            modelMap.set(m.id, m);
            continue;
          }

          const promptCost = parseFloat(liveItem.pricing.prompt);
          const completionCost = parseFloat(liveItem.pricing.completion);

          const inputPerM = !isNaN(promptCost) && promptCost >= 0 ? Number((promptCost * 1_000_000).toFixed(4)) : m.inputPricePerM;
          const outputPerM = !isNaN(completionCost) && completionCost >= 0 ? Number((completionCost * 1_000_000).toFixed(4)) : m.outputPricePerM;
          const contextWindow = liveItem.context_length || m.contextWindow;

          modelMap.set(m.id, {
            ...m,
            inputPricePerM: inputPerM,
            outputPricePerM: outputPerM,
            contextWindow,
          });
        }

        // Add dynamically discovered newer frontier models
        for (const { item } of dynamicCandidates) {
          if (modelMap.has(item.id)) continue;
          if (modelMap.size >= 24) break; // Keep benchmark concise and high-signal

          const promptCost = parseFloat(item.pricing.prompt);
          const completionCost = parseFloat(item.pricing.completion);
          const inputPricePerM = !isNaN(promptCost) && promptCost >= 0 ? Number((promptCost * 1_000_000).toFixed(4)) : 0;
          const outputPricePerM = !isNaN(completionCost) && completionCost >= 0 ? Number((completionCost * 1_000_000).toFixed(4)) : 0;
          const contextWindow = item.context_length || 128000;
          const provider = detectProvider(item.id);
          const rawName = item.name || item.id.split('/')[1] || item.id;
          const cleanName = rawName.replace(new RegExp(`^${provider}:\\s*`, 'i'), '');

          const hasReasoning = Boolean(item.reasoning?.mandatory || item.reasoning?.default_enabled);
          const category = computeCategory(inputPricePerM, item.id, cleanName, hasReasoning);
          const latencyTier = computeLatencyTier(contextWindow, category, inputPricePerM, item.id);

          modelMap.set(item.id, {
            id: item.id,
            name: cleanName,
            provider,
            category,
            inputPricePerM,
            outputPricePerM,
            contextWindow,
            description: (item.description || '').split('\n')[0].slice(0, 180),
            latencyTier,
            badge: item.id.includes('claude-3.7') ? 'Hybrid Thinking' : undefined,
            isPopular: ['flash-001', 'gpt-4o', 'sonnet'].some((k) => item.id.includes(k)),
          });
        }

        return {
          updatedAt: new Date().toISOString(),
          source: 'openrouter-live',
          models: Array.from(modelMap.values()),
        };
      }
    }
  } catch {
    // Network or CORS issue, gracefully return baseData
  }

  return baseData;
}
