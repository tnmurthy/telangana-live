# Telangana.live Content Maintenance Agent

Automated content management system for telangana.live using AI agents and Supabase.

## Features

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
- **Content Generator**: Creates new articles, guides, and listings using Claude
- **Content Updater**: Updates existing content with new information
- **Quality Checker**: Validates grammar, SEO, and accuracy
- **Automated Scheduling**: Runs twice daily (6 AM and 6 PM)
- **Token Tracking**: Monitors API usage and costs
- **Activity Logging**: Complete audit trail in Supabase

## Architecture

```
agents/
├── content_monitor.py    - Fetches and analyzes website
├── content_generator.py  - Creates new content
├── content_updater.py    - Updates existing content
└── quality_checker.py    - Validates and improves quality

database.py              - Supabase connection and queries
config.py               - Configuration settings
scheduler.py            - Scheduled job runner
main.py                 - Manual test runner
```

## Prerequisites

- Python 3.8+
- OpenAI API key
- Supabase project

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/tnmurthy/telangana-live-agents.git
cd telangana-live-agents
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Supabase

1. Create a project at https://supabase.com
2. Go to SQL Editor and run:
   ```bash
   cat supabase-schema.sql | copy-paste into Supabase SQL Editor
   ```
3. Get your credentials from Settings → API:
   - Project URL (SUPABASE_URL)
   - Anon Public Key (SUPABASE_KEY)
   - Service Role Key (SUPABASE_SERVICE_KEY)

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Usage

### Manual Test Run

```bash
python main.py
```

This runs a complete cycle:
1. Monitors content
2. Generates new articles
3. Shows activity logs

### Start Scheduler (Automated)

```bash
python scheduler.py
```

Runs automatically at:
- **6:00 AM**: Content monitoring and analysis
- **6:00 PM**: Content generation and quality checks

### Deploy to Cloud

#### Using Render

1. Push repo to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables
5. Set start command: `python scheduler.py`
6. Deploy

#### Using Railway

1. Push repo to GitHub
2. Create new project on Railway
3. Connect GitHub repo
4. Add environment variables
5. Deploy (automatic)

## Database Schema

### content table
```sql
- id: bigint (PK)
- title: text (unique)
- category: text (guides, listings, news)
- content: text
- source_url: text
- generated_code: text
- status: text (active, archived)
- created_at: timestamp
- updated_at: timestamp
- token_usage: integer
```

### activity_log table
```sql
- id: bigint (PK)
- agent: text
- action: text
- status: text (success, error)
- timestamp: timestamp
- details: text
- tokens_used: integer
```

## Configuration

Edit `config.py` to customize:

```python
'site_url': 'https://telangana.live'        # Target website
'model': 'gpt-4o'                           # Claude model
'schedule_morning': '06:00'                 # Morning run time
'schedule_evening': '18:00'                 # Evening run time
```

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


```sql
SELECT title, category, token_usage, created_at FROM content ORDER BY created_at DESC;
```

## Costs

Tracked per operation:
- Each content generation: ~500-1000 tokens
- Each quality check: ~300-500 tokens
- Daily cost: ~$0.10-0.50 (depending on model)

## Troubleshooting

### "No module named 'supabase'"
```bash
pip install -r requirements.txt
```

### Supabase connection error
- Verify SUPABASE_URL and SUPABASE_KEY in .env
- Check Supabase project is active
- Verify network connectivity

### OpenAI API errors
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

For issues and questions:
- GitHub Issues: https://github.com/tnmurthy/telangana-live-agents/issues
- Email: your-email@example.com

## Roadmap

- [ ] WordPress integration
- [ ] Image generation for content
- [ ] Multi-language support
- [ ] Email alerts
- [ ] Dashboard UI
- [ ] Slack notifications
