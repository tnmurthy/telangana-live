# 🏗️ IMPLEMENTATION ROADMAP - Telangana.live

**Last Updated:** April 8, 2026  
**Status:** Planning & Development Phase

---

## 📰 1. News & Content Aggregation System

**Status:** 🟡 In Development | **Priority:** P0 (Immediate)

### Overview
Build a comprehensive news aggregation system that pulls content from multiple Telugu & English sources, processes it through AI summarization, and presents it in a user-friendly format with district-wise filtering.

### Tech Stack
- **RSS Feed Parser:** `feedparser` (Python)
- **Web Scraper:** `BeautifulSoup4` + `Selenium` for dynamic content
- **AI Summarization:** Gemini Flash API (Google AI)
- **Database:** Supabase (PostgreSQL)
- **Deduplication:** Cosine similarity (sentence-transformers)
- **Frontend:** React/Next.js with infinite scroll

### News Sources (Phase 1)

1. **Times of India (TOI) - Telangana Edition**
   - RSS: `https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms`
   - Categories: Politics, Crime, Infrastructure

2. **Hans India**
   - RSS: `https://www.thehansindia.com/feeds/telangana`
   - Focus: Local Telangana news, business

3. **Eenadu (Telugu)**
   - Scraping: Direct HTML parsing (no RSS)
   - Target: Telugu-language content for bilingual support

### Implementation Timeline (6 Weeks)

#### Week 1-2: Core Infrastructure
- [ ] Set up Supabase table: `news_articles`
- [ ] Create RSS feed parser script
- [ ] Implement basic web scraper for Eenadu
- [ ] Set up cron job for hourly updates

#### Week 3-4: AI & Deduplication  
- [ ] Integrate Gemini Flash for summarization
- [ ] Build deduplication engine (title similarity check)
- [ ] Add category classification (Politics, Crime, Sports, etc.)
- [ ] Implement district tagging (NLP-based location extraction)

#### Week 5-6: Frontend & UX
- [ ] Create `/news` route in Next.js
- [ ] Build news card components (bilingual)
- [ ] Add filtering: District, Category, Date range
- [ ] Implement infinite scroll/pagination
- [ ] WhatsApp share button for articles

### Database Schema

```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_telugu TEXT,
  summary TEXT,
  content TEXT,
  source VARCHAR(50),
  category VARCHAR(50),
  district VARCHAR(50),
  url TEXT UNIQUE,
  image_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚙️ 2. Automated Content Pipeline

**Status:** 🟡 Planning | **Priority:** P0 (Immediate)

### Overview
Create an end-to-end automated pipeline that scrapes, processes, enriches, and publishes content to the Telangana.live platform on a scheduled basis.

### Pipeline Architecture

```
Step 1: Content Sources
   ↓
   [RSS Feeds] [Web Scrapers] [Government APIs]
   ↓
Step 2: Data Extraction & Parsing
   ↓
   [Extract: Title, Content, Date, Images]
   ↓
Step 3: AI Processing
   ↓
   [Gemini: Summarize, Translate, Categorize, Extract Locations]
   ↓
Step 4: Deduplication Check
   ↓
   [Check existing articles → Skip if duplicate]
   ↓
Step 5: Database Insert
   ↓
   [Supabase: Insert into news_articles]
   ↓
Step 6: Frontend Update
   ↓
   [Auto-refresh on /news page]
```

### Automation Tools

**Option 1: n8n Workflow (Recommended)**
- Visual workflow builder
- Schedule: Every 1 hour
- Nodes: HTTP Request → Gemini AI → Supabase Insert
- Cost: Free for basic usage

**Option 2: GitHub Actions**
- Python script in `.github/workflows/`
- Cron: `0 * * * *` (hourly)
- Free tier: 2000 minutes/month

### Sample Python Pipeline Code

```python
import feedparser
from supabase import create_client
import google.generativeai as genai

def fetch_and_process_news():
    # 1. Fetch RSS feeds
    feed = feedparser.parse('https://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms')
    
    for entry in feed.entries[:10]:
        # 2. Extract data
        article = {
            'title': entry.title,
            'url': entry.link,
            'published_at': entry.published
        }
        
        # 3. AI Summarization
        article['summary'] = genai.generate(entry.description)
        
        # 4. Insert into Supabase
        supabase.table('news_articles').insert(article).execute()
```

---

## 🛠️ 3. Low-Level Design (LLD) Components

### 3.1 Content Scraper Module (newsAggregator.js)

**Purpose:** Fetch and parse content from multiple news sources

```javascript
class NewsAggregator {
  constructor(sources) {
    this.sources = sources; // Array of source configs
    this.articles = [];
  }

  async fetchRSS(feedUrl) {
    // Parse RSS feed using xml2js
    return parsedItems;
  }

  async scrapeWebPage(url, selectors) {
    // Use Puppeteer for dynamic content
    return scrapedContent;
  }

  normalizeArticle(rawData, source) {
    return {
      title: rawData.title.trim(),
      url: rawData.link,
      source: source.name,
      publishedAt: new Date(rawData.pubDate)
    };
  }
}
```

### 3.2 AI Processing Service (aiEnrichment.js)

**Purpose:** Enhance articles with AI-generated summaries and metadata

**Functions:**
1. `summarizeArticle(content)` - Generate 2-3 sentence summary using Gemini Flash
2. `translateToTelugu(text)` - Translate title/summary to Telugu
3. `extractLocations(content)` - Extract district names using NLP
4. `categorizeArticle(title, content)` - Classify into Politics/Crime/Sports/etc.

```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash" });

async function summarizeArticle(content) {
  const prompt = `Summarize this Telugu news article in 2-3 sentences: ${content}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 3.3 Deduplication Engine (deduplicator.js)

**Purpose:** Prevent duplicate articles from different sources

**Algorithm:** Cosine Similarity on title embeddings

```javascript
import { SentenceTransformer } from 'sentence-transformers';

async function isDuplicate(newArticle, existingArticles) {
  const newEmbedding = await model.encode(newArticle.title);
  
  for (let existing of existingArticles) {
    const similarity = cosineSimilarity(newEmbedding, existing.embedding);
    if (similarity > 0.85) return true; // 85% similarity threshold
  }
  return false;
}
```

### 3.4 News Page Component (NewsPage.jsx)

**Route:** `/news`  
**Purpose:** Display news articles with filtering and infinite scroll

```jsx
function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({
    district: 'all',
    category: 'all',
    dateRange: '7days'
  });

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  return (
    <div>
      <FilterBar filters={filters} onChange={setFilters} />
      <ArticleGrid articles={articles} />
      <InfiniteScroll onLoadMore={loadMore} />
    </div>
  );
}
```

---

## 📊 Success Metrics

- Daily Active Users (DAU)
- Page views per session
- News article engagement rate
- Telugu education section conversion
- Premium subscription sign-ups
- WhatsApp share CTR
- District-wise traffic distribution

---

## 🚀 Next Steps

1. ✅ Documentation completed in Notion
2. ⏳ Set up development environment
3. ⏳ Create Supabase tables
4. ⏳ Implement RSS parser (Week 1)
5. ⏳ Deploy to staging environment
6. ⏳ User testing and feedback
7. ⏳ Production deployment

---

**Maintained by:** Product Owner  
**Contact:** For questions, refer to Notion workspace
