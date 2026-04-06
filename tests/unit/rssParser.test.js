import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the rss-parser module before importing the class under test
vi.mock('rss-parser', () => ({
  default: class MockParser {
    async parseURL() {
      return { items: [] };
    }
  },
}));

import { RSSParser } from '../../src/services/rssParser.js';

describe('RSSParser', () => {
  let parser;

  beforeEach(() => {
    parser = new RSSParser();
  });

  // ─── _extractDistrict ────────────────────────────────────────────────────

  describe('_extractDistrict', () => {
    it('returns "Hyderabad" when text contains "Hyderabad"', () => {
      expect(parser._extractDistrict('News from Hyderabad city')).toBe('Hyderabad');
    });

    it('is case-insensitive for "hyderabad"', () => {
      expect(parser._extractDistrict('HYDERABAD flooding alert')).toBe('Hyderabad');
    });

    it('returns "Cyberabad" when text contains "Cyberabad"', () => {
      expect(parser._extractDistrict('Cyberabad traffic update')).toBe('Cyberabad');
    });

    it('returns "Malkajgiri" when text contains "Malkajgiri"', () => {
      expect(parser._extractDistrict('Malkajgiri water supply cut')).toBe('Malkajgiri');
    });

    it('returns "Kondapur" when text contains "Kondapur"', () => {
      expect(parser._extractDistrict('Kondapur IT park fire')).toBe('Kondapur');
    });

    it('returns "Hitech City" when text contains "Hitech City"', () => {
      expect(parser._extractDistrict('Hitech City metro station')).toBe('Hitech City');
    });

    it('returns "Gachibowli" when text contains "Gachibowli"', () => {
      expect(parser._extractDistrict('Gachibowli sports complex')).toBe('Gachibowli');
    });

    it('returns "Telangana" when no known district is found', () => {
      expect(parser._extractDistrict('A general news story about politics')).toBe('Telangana');
    });

    it('returns "Telangana" for an empty string', () => {
      expect(parser._extractDistrict('')).toBe('Telangana');
    });

    it('returns the first matching district when multiple districts appear', () => {
      // "Hyderabad" appears first in the districts array
      const result = parser._extractDistrict('Hyderabad and Gachibowli event');
      expect(result).toBe('Hyderabad');
    });
  });

  // ─── _extractImage ───────────────────────────────────────────────────────

  describe('_extractImage', () => {
    it('returns the enclosure URL when present', () => {
      const item = { enclosure: { url: 'https://example.com/img.jpg' } };
      expect(parser._extractImage(item)).toBe('https://example.com/img.jpg');
    });

    it('returns null when enclosure is missing', () => {
      expect(parser._extractImage({})).toBeNull();
    });

    it('returns null when enclosure has no url property', () => {
      expect(parser._extractImage({ enclosure: {} })).toBeNull();
    });

    it('returns null for undefined item', () => {
      expect(parser._extractImage({})).toBeNull();
    });
  });

  // ─── fetchFeed ───────────────────────────────────────────────────────────

  describe('fetchFeed', () => {
    it('returns an empty array when the RSS parser returns no items', async () => {
      const result = await parser.fetchFeed('https://example.com/rss', 'test');
      expect(result).toEqual([]);
    });

    it('returns an empty array when the parser throws', async () => {
      parser.parser.parseURL = vi.fn().mockRejectedValue(new Error('Network error'));
      const result = await parser.fetchFeed('https://bad-url.invalid/rss', 'test');
      expect(result).toEqual([]);
    });

    it('normalises feed items into the expected schema', async () => {
      const fakeItem = {
        guid: 'https://example.com/article-1',
        title: 'Breaking news from Hyderabad',
        link: 'https://example.com/article-1',
        contentSnippet: 'Summary text',
        pubDate: '2026-04-06T10:00:00Z',
        categories: ['Politics'],
      };
      parser.parser.parseURL = vi.fn().mockResolvedValue({ items: [fakeItem] });

      const result = await parser.fetchFeed('https://example.com/rss', 'toi');

      expect(result).toHaveLength(1);
      const article = result[0];
      expect(article.id).toBe('https://example.com/article-1');
      expect(article.title).toBe('Breaking news from Hyderabad');
      expect(article.link).toBe('https://example.com/article-1');
      expect(article.summary).toBe('Summary text');
      expect(article.publishedAt).toBe('2026-04-06T10:00:00Z');
      expect(article.source).toBe('toi');
      expect(article.category).toBe('Politics');
      expect(article.district).toBe('Hyderabad');
      expect(article.imageUrl).toBeNull();
    });

    it('falls back to item.link as id when guid is absent', async () => {
      const fakeItem = {
        title: 'Story',
        link: 'https://example.com/story',
        pubDate: '2026-04-06T10:00:00Z',
      };
      parser.parser.parseURL = vi.fn().mockResolvedValue({ items: [fakeItem] });

      const [article] = await parser.fetchFeed('https://example.com/rss', 'hans');
      expect(article.id).toBe('https://example.com/story');
    });

    it('sets category to "General" when no categories array', async () => {
      const fakeItem = {
        guid: 'id-1',
        title: 'Plain item',
        link: 'https://example.com/plain',
        pubDate: '2026-04-06T10:00:00Z',
      };
      parser.parser.parseURL = vi.fn().mockResolvedValue({ items: [fakeItem] });

      const [article] = await parser.fetchFeed('https://example.com/rss', 'eenadu');
      expect(article.category).toBe('General');
    });
  });
});
