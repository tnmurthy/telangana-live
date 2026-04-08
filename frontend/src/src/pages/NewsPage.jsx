import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService';
import { NewsCard } from '../components/news/NewsCard';
import './NewsPage.css';

export function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const news = await newsService.fetchAllNews({ limit: 50 });
      setArticles(news);
      setError(null);
    } catch (err) {
      setError('Failed to load news. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    newsService.clearCache();
    loadNews();
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="loading">Loading latest news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="error">
          {error}
          <button onClick={loadNews}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <header className="news-header">
        <h1>📰 Latest Telangana News</h1>
        <button onClick={handleRefresh} className="btn-refresh">
          🔄 Refresh
        </button>
      </header>

      <div className="news-list">
        {articles.length === 0 ? (
          <p>No news articles found.</p>
        ) : (
          articles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
