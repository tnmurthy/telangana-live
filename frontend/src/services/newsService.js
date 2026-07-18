const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

class NewsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache for local dev
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

    try {
      const response = await fetch(`${API_URL}/api/civic/news`);
      if (!response.ok) throw new Error('Network response was not ok');
      const allArticles = await response.json();

      // Cache result
      this.cache.set(cacheKey, {
        data: allArticles,
        timestamp: Date.now()
      });

      return allArticles.slice(0, limit);
    } catch (error) {
      console.error('Error fetching news from API:', error);
      // Fallback to local json if API fails (e.g. backend not running during dev)
      try {
        const localData = await import('../data/news.json');
        return localData.default.slice(0, limit);
      } catch (e) {
         return [];
      }
    }
  }

  async fetchNewsBySource(source, limit = 20) {
    const allNews = await this.fetchAllNews({ limit: 200 });
    return allNews.filter(article => article.source === source).slice(0, limit);
  }

  async fetchNewsByCategory(category, limit = 20) {
    const allNews = await this.fetchAllNews({ limit: 200 });
    return allNews.filter(article => 
      (article.category || '').toLowerCase() === category.toLowerCase()
    ).slice(0, limit);
  }

  async fetchNewsByDistrict(district, limit = 20) {
    if (!district) return [];
    try {
      const response = await fetch(`${API_URL}/api/civic/news?district=${encodeURIComponent(district)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const articles = await response.json();
      return articles.slice(0, limit);
    } catch (error) {
        console.error('Error fetching district news from API:', error);
        // Fallback
        const allNews = await this.fetchAllNews({ limit: 200 });
        return allNews.filter(article => 
          (article.region || '').toLowerCase().includes(district.toLowerCase()) || 
          (article.description || '').toLowerCase().includes(district.toLowerCase())
        ).slice(0, limit);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const newsService = new NewsService();
