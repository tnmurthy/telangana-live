import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ── Helpers ────────────────────────────────────────────────────────────────

function mockFetchSuccess(payload) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(payload),
  });
}

function mockFetchFailure(status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({}),
  });
}

function mockFetchThrows(message = 'Network error') {
  global.fetch = vi.fn().mockRejectedValue(new Error(message));
}

describe('n8nService', () => {
  let n8nService;

  beforeEach(async () => {
    vi.resetModules();
    n8nService = (await import('../../src/services/n8nService.js')).n8nService;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── sendReport ─────────────────────────────────────────────────────────

  describe('sendReport', () => {
    it('returns success:true when fetch responds with ok status', async () => {
      mockFetchSuccess({ status: 'ok' });

      const result = await n8nService.sendReport({ area: 'Banjara Hills', issue: 'Pothole' });
      expect(result.success).toBe(true);
    });

    it('posts to the citizen-report endpoint', async () => {
      mockFetchSuccess({ status: 'ok' });

      await n8nService.sendReport({ area: 'Kukatpally', issue: 'Water leak' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('citizen-report'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('returns success:false when fetch throws', async () => {
      mockFetchThrows();

      const result = await n8nService.sendReport({ area: 'Gachibowli' });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns success:false when API returns non-OK status', async () => {
      mockFetchFailure(503);

      const result = await n8nService.sendReport({ area: 'LB Nagar' });
      expect(result.success).toBe(false);
    });

    it('includes source and timestamp in the request body', async () => {
      mockFetchSuccess({ status: 'ok' });

      await n8nService.sendReport({ area: 'Ameerpet' });
      const call = global.fetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.source).toBe('telangana.live');
      expect(body.timestamp).toBeDefined();
    });
  });

  // ── sendPollVote ────────────────────────────────────────────────────────

  describe('sendPollVote', () => {
    it('returns success:true when fetch succeeds', async () => {
      mockFetchSuccess({ status: 'ok' });

      const result = await n8nService.sendPollVote({ pollId: 'poll-1', option: 'A' });
      expect(result.success).toBe(true);
    });

    it('posts to the poll-vote endpoint', async () => {
      mockFetchSuccess({ status: 'ok' });

      await n8nService.sendPollVote({ pollId: 'poll-2', option: 'B' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('poll-vote'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('returns success:false when fetch throws', async () => {
      mockFetchThrows();

      const result = await n8nService.sendPollVote({ pollId: 'poll-3' });
      expect(result.success).toBe(false);
    });
  });

  // ── trackContent ────────────────────────────────────────────────────────

  describe('trackContent', () => {
    it('returns success:true when fetch succeeds', async () => {
      mockFetchSuccess({ status: 'ok' });

      const result = await n8nService.trackContent({
        title: 'Hyderabad Metro Update',
        content_id: 'abc123',
        publish_date: '2026-04-06',
      });
      expect(result.success).toBe(true);
    });

    it('posts to the antigravity-webhook endpoint', async () => {
      mockFetchSuccess({ status: 'ok' });

      await n8nService.trackContent({ title: 'Test Content' });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('antigravity-webhook'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('returns success:false when the API returns non-OK status', async () => {
      mockFetchFailure(404);

      const result = await n8nService.trackContent({ title: 'Bad Content' });
      expect(result.success).toBe(false);
    });
  });

  // ── content-type header ─────────────────────────────────────────────────

  describe('request headers', () => {
    it('sends Content-Type: application/json', async () => {
      mockFetchSuccess({ status: 'ok' });

      await n8nService.sendReport({ area: 'Secunderabad' });
      const call = global.fetch.mock.calls[0];
      expect(call[1].headers['Content-Type']).toBe('application/json');
    });
  });
});
