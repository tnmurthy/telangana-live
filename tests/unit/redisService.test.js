import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────────────

function makeJsonResponse(payload, ok = true) {
  return {
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(payload),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// redisService
// ═══════════════════════════════════════════════════════════════════════════

// We need to supply env values before the module loads, because the module
// reads VITE_UPSTASH_REDIS_REST_URL / TOKEN at import time.
// Vitest lets us set import.meta.env via the config; here we just patch the
// module internals via re-import isolation tricks wouldn't work easily, so we
// test the observable behaviour instead.

describe('redisService', () => {
  let redisService;

  beforeEach(async () => {
    // Reset module registry so each test gets a fresh instance
    vi.resetModules();
    redisService = (await import('../../src/services/redisService.js')).redisService;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('when REDIS credentials are not configured', () => {
    it('get() returns null immediately without fetching', async () => {
      // The module reads env at load time; without VITE_ vars set, both are
      // undefined → the service returns null early.
      global.fetch = vi.fn();
      const result = await redisService.get('some-key');
      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('set() returns false immediately without fetching', async () => {
      global.fetch = vi.fn();
      const result = await redisService.set('some-key', { a: 1 });
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('get() returns null when fetch throws', async () => {
      // Patch the internal URL/token by re-importing with env overrides
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const result = await svc.get('key');
      expect(result).toBeNull();
    });

    it('set() returns false when fetch throws', async () => {
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const result = await svc.set('key', { v: 1 });
      expect(result).toBe(false);
    });

    it('get() returns null when result is absent from JSON response', async () => {
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      global.fetch = vi.fn().mockResolvedValue(makeJsonResponse({ result: null }));
      const result = await svc.get('key');
      expect(result).toBeNull();
    });

    it('get() deserialises a JSON result string correctly', async () => {
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      const payload = { petrol: 107 };
      global.fetch = vi.fn().mockResolvedValue(
        makeJsonResponse({ result: JSON.stringify(payload) })
      );

      const result = await svc.get('tg:rates:fuel:hyderabad');
      expect(result).toEqual(payload);
    });

    it('set() returns true when Upstash responds with "OK"', async () => {
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      global.fetch = vi.fn().mockResolvedValue(makeJsonResponse({ result: 'OK' }));
      const result = await svc.set('key', { v: 1 });
      expect(result).toBe(true);
    });

    it('set() appends ?EX=<ttl> to the URL when expiry is provided', async () => {
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_URL', 'https://redis.example.com');
      vi.stubEnv('VITE_UPSTASH_REDIS_REST_TOKEN', 'token123');
      vi.resetModules();
      const { redisService: svc } = await import('../../src/services/redisService.js');

      global.fetch = vi.fn().mockResolvedValue(makeJsonResponse({ result: 'OK' }));
      await svc.set('key', { v: 1 }, 3600);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('?EX=3600'),
        expect.any(Object)
      );
    });
  });
});
