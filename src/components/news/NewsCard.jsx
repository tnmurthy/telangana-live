import React from 'react';
import './NewsCard.module.css';

export function NewsCard({ article }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('te-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWhatsAppShare = () => {
    const text = `${article.title}\n\nRead more: ${article.url}\n\nvia Telangana.live`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <article className="news-card">
      {article.imageUrl && (
        <div className="news-card__image">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="news-card__content">
        <div className="news-card__meta">
          <span className="news-card__source">{article.source.toUpperCase()}</span>
          <span className="news-card__category">{article.category}</span>
          <span className="news-card__date">{formatDate(article.publishedAt)}</span>
        </div>

        <h3 className="news-card__title">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        <p className="news-card__description">{article.description}</p>

        {article.district.length > 0 && (
          <div className="news-card__districts">
            {article.district.map(d => (
              <span key={d} className="district-tag">{d}</span>
            ))}
          </div>
        )}

        <div className="news-card__actions">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-read-more"
          >
            Read Full Article
          </a>
          <button 
            onClick={handleWhatsAppShare}
            className="btn-share-whatsapp"
          >
            📱 Share on WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}
