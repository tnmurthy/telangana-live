import React, { useState } from 'react';
import './NewsCard.module.css';

export function NewsCard({ article }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = (!imageError && (article.imageUrl || article.image_url)) ? (article.imageUrl || article.image_url) : null;
  const description = article.summary || article.description;
  const url = article.link || article.url;
  const publishedDate = article.publishedAt || article.published;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('te-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const text = `${article.title}\n\nRead more: ${url || ''}\n\nvia Telangana.live`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const districts = Array.isArray(article.district)
    ? article.district
    : (article.district ? [article.district] : []);

  return (
    <article 
      className="news-card"
      onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
      style={{ cursor: 'pointer' }}
    >
      {imageUrl && (
        <div className="news-card__image">
          <img 
            src={imageUrl} 
            alt={article.title}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="news-card__content">
        <div className="news-card__meta">
          <span className="news-card__source">{(article.source || '').toUpperCase()}</span>
          {article.category && <span className="news-card__category">{article.category}</span>}
          {publishedDate && <span className="news-card__date">{formatDate(publishedDate)}</span>}
        </div>

        <h3 className="news-card__title">
          <a href={url || '#'} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>

        {description && <p className="news-card__description">{description}</p>}

        {districts.length > 0 && (
          <div className="news-card__districts">
            {districts.map(d => (
              <span key={d} className="district-tag">{d}</span>
            ))}
          </div>
        )}

        <div className="news-card__actions">
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-read-more"
            >
              Read Full Article
            </a>
          )}
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

