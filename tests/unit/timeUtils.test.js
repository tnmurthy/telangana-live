import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatRelativeTime } from '../../src/utils/timeUtils.js';

describe('formatRelativeTime', () => {
  const now = new Date('2026-04-06T12:00:00.000Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty string for null', () => {
    expect(formatRelativeTime(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatRelativeTime(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(formatRelativeTime('')).toBe('');
  });

  it('returns "Just now" for a date 30 seconds ago', () => {
    const date = new Date(now - 30 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('Just now');
  });

  it('returns "Just now" for a date within the last 59 seconds', () => {
    const date = new Date(now - 59 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('Just now');
  });

  it('returns "1m ago" for exactly 1 minute ago', () => {
    const date = new Date(now - 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1m ago');
  });

  it('returns "5m ago" for 5 minutes ago', () => {
    const date = new Date(now - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('5m ago');
  });

  it('returns "59m ago" for 59 minutes ago', () => {
    const date = new Date(now - 59 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('59m ago');
  });

  it('returns "1h ago" for exactly 1 hour ago', () => {
    const date = new Date(now - 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1h ago');
  });

  it('returns "3h ago" for 3 hours ago', () => {
    const date = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('3h ago');
  });

  it('returns "23h ago" for 23 hours ago', () => {
    const date = new Date(now - 23 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('23h ago');
  });

  it('returns "1d ago" for exactly 24 hours ago', () => {
    const date = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1d ago');
  });

  it('returns "3d ago" for 3 days ago', () => {
    const date = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('3d ago');
  });

  it('returns "6d ago" for 6 days ago', () => {
    const date = new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('6d ago');
  });

  it('returns a locale date string for dates older than 7 days', () => {
    const date = new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(date);
    // Should NOT be a relative time label
    expect(result).not.toMatch(/ago|Just now/);
    // Should be a date-like string (e.g. "27 Mar")
    expect(result.length).toBeGreaterThan(3);
  });

  it('falls back to raw string for an invalid date', () => {
    expect(formatRelativeTime('not-a-date')).toBe('not-a-date');
  });

  it('falls back to raw string for a numeric-only string that is not a valid date', () => {
    const result = formatRelativeTime('hello world');
    expect(result).toBe('hello world');
  });
});
