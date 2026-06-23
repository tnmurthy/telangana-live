# 📡 Telangana Right-Leaning Media Integration Spec

This file acts as the configuration blueprint and architectural map for the news aggregator webapp's data pipeline.

---

## 📂 1. Core RSS Feed Registry

These verified XML targets provide structured news data. For optimal performance and to bypass security rules, ingest these feeds via a server-side proxy rather than client-side fetch requests.


| Source Key | Language | Focus | Data Format | Target RSS Feed Endpoint |
| :--- | :--- | :--- | :--- | :--- |
| `nijam_ts` | Telugu | Regional / State | XML (Atom/RSS2) | `https://nijamtoday.com` |
| `nijam_main` | Telugu | Geopolitical | XML (Atom/RSS2) | `https://nijamtoday.com` |
| `organiser_ts` | English | State Desk | Custom XML | `https://organiser.org` |
| `organiser_main` | English | National / Policy | Custom XML | `https://organiser.org` |
| `the_commune` | English | Southern States | XML (Atom/RSS2) | `https://thecommunein.com` |
| `swarajya_mag` | English | Electoral Analysis | Custom API Feed | `https://swarajyamag.com` |
| `vsk_ts` | Telugu | Grassroot / Cultural | XML (Atom/RSS2) | `https://vsktelangana.org` |
| `opindia_telugu`| Telugu | Counter-Narratives| Enterprise XML | `https://opindia.com` |

---

## 🗄️ 2. Webapp Unified JSON Schema

All disparate XML payloads must normalize into this standard structure prior to database insertion.

```json
{
  "$schema": "https://json-schema.org",
  "title": "NormalizedNewsItem",
  "type": "object",
  "required": ["id", "source_key", "title", "link", "published_at", "language", "content_summary"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique SHA-256 hash derived from the entry link to avoid duplicate writes."
    },
    "source_key": {
      "type": "string",
      "enum": ["nijam_ts", "nijam_main", "organiser_ts", "organiser_main", "the_commune", "swarajya_mag", "vsk_ts", "opindia_telugu"]
    },
    "title": {
      "type": "string",
      "description": "Raw string title (supports standard Unicode UTF-8 character encoding for Telugu script)."
    },
    "link": {
      "type": "string",
      "format": "uri"
    },
    "published_at": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 standardized timestamp (YYYY-MM-DDTHH:mm:ssZ)."
    },
    "language": {
      "type": "string",
      "enum": ["te", "en"]
    },
    "content_summary": {
      "type": "string",
      "description": "Sanitized string snippet of body text, stripped of residual HTML markups."
    },
    "meta_tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Extracted internal categories or keyword markers."
    }
  }
}
```

---

## ✂️ 3. Regular Expression (Regex) Sanitization Suite

Use these target expressions inside your ingestion engine to clean payloads and strip HTML structures before delivering text arrays to your front-end components.

### A. Remove HTML tags from summaries
Cleans standard XML wrapper garbage without destroying Unicode text elements.
* **Expression:** `<[^>]*>`
* **Substitution:** `""`

### B. Isolate Telugu Unicode Characters
Use this target pattern if you need to strip mixed-language strings down to isolate pure Telugu text sequences for specialized database column indexing.
* **Expression:** `[^\u0C00-\u0C7F\s\d,.:!?\-\"\']`
* **Substitution:** `""` (Removes non-Telugu character sets while keeping local numbers and standard structural punctuations)

### C. Extract Raw Image URL from Media Enclosures
Locates embedded content imagery within RSS description structures.
* **Expression:** `src=["'](.*?\.(?:png|jpg|jpeg|webp))["']`
* **Capture Group:** `$1` returns the exact target destination image URL.

---

## 🛡️ 4. Edge-Case Ingestion Guidelines

1. **User-Agent Masquerading:** Sites using Cloudflare profiles block raw python-requests scripts. Add a standard desktop wrapper block inside your header engine setup:
   ```python
   headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
   ```
2. **Database Duplication:** Always enforce unique indices using the `id` field (SHA-256 generation scheme) to guarantee that re-running the automation pipeline does not flood the UI feed layout with repeat item elements.
