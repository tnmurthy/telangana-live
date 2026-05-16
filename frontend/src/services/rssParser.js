import Parser from 'rss-parser';

export class RSSParser {
  constructor() {
    this.parser = new Parser();
  }

  /**
   * Fetch and normalize an RSS feed.
   * @param {string} url - RSS feed URL
   * @param {string} source - Source identifier (e.g., 'toi', 'eenadu')
   */
  async fetchFeed(url, source) {
    try {
      // Use a CORS proxy if running in browser, or direct in Node
      // Since this is a Vite app, we might need a proxy or the RSS sources must allow CORS
      const feed = await this.parser.parseURL(url);
      
      return feed.items.map(item => ({
        id: item.guid || item.link,
        title: item.title,
        link: item.link,
        summary: item.contentSnippet || item.content,
        publishedAt: item.pubDate || item.isoDate,
        source: source,
        category: item.categories?.[0] || 'General',
        district: this._extractDistrict(item.title + ' ' + (item.content || '')),
        imageUrl: this._extractImage(item)
      }));
    } catch (error) {
      console.error(`Error parsing RSS from ${source}:`, error);
      return [];
    }
  }

  _extractDistrict(text) {
    const districts = ['Hyderabad', 'Cyberabad', 'Malkajgiri', 'Kondapur', 'Hitech City', 'Gachibowli'];
    const found = districts.find(d => text.toLowerCase().includes(d.toLowerCase()));
    return found || 'Telangana';
  }

  _extractImage(item) {
    // Basic extraction for TOI/Eenadu style enclosures or media tags
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    return null;
  }
}
