import { RSSParser } from './rssParser';

const RSS_SOURCES = [
  { 
    url: 'https://timesofindia.indiatimes.com/rssfeeds/2950623.cms', 
    source: 'toi',
    name: 'Times of India'
  },
  { 
    url: 'https://www.thehansindia.com/feeds/telangana', 
    source: 'hans',
    name: 'Hans India'
  },
  { 
    url: 'https://www.eenadu.net/telangana/rss.xml', 
    source: 'eenadu',
    name: 'Eenadu'
  }
];

class NewsService {
  constructor() {
    this.parser = new RSSParser();
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  async fetchAllNews(options = {}) {
    const { forceRefresh = false, limit = 50 } = options;
    const cacheKey = 'all_news';
    
    // Check cache
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data.slice(0, limit);
      }
    }

    // Fetch from all sources in parallel
    try {
      const promises = RSS_SOURCES.map(({ url, source }) =>
        this.parser.fetchFeed(url, source)
      );

      const results = await Promise.all(promises);
      
      // Combine and sort by date
      const allArticles = results
        .flat()
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      // Cache result
      this.cache.set(cacheKey, {
        data: allArticles,
        timestamp: Date.now()
      });

      return allArticles.slice(0, limit);
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async fetchNewsBySource(source, limit = 20) {
    const allNews = await this.fetchAllNews({ limit: 200 });
    return allNews.filter(article => article.source === source).slice(0, limit);
  }

  async fetchNewsByCategory(category, limit = 20) {
    const allNews = await this.fetchAllNews({ limit: 200 });
    return allNews.filter(article => 
      article.category.toLowerCase() === category.toLowerCase()
    ).slice(0, limit);
  }

  async fetchNewsByDistrict(district, limit = 20) {
    const allNews = await this.fetchAllNews({ limit: 200 });
    return allNews.filter(article => 
      article.district.includes(district)
    ).slice(0, limit);
  }

  clearCache() {
    this.cache.clear();
  }
}

export const newsService = new NewsService();
