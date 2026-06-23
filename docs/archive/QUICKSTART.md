# Quick Start Guide

Get telangana-live-agents running in 5 minutes.

## 1. Prerequisites

- Python 3.8+ installed
- OpenAI API key (get at https://platform.openai.com/api-keys)
- Supabase project (create at https://supabase.com)

## 2. Clone & Setup

```bash
# Clone repository
git clone https://github.com/tnmurthy/telangana-live-agents.git
cd telangana-live-agents

# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## 3. Configure Database

1. Go to https://supabase.com and create a project
2. Go to SQL Editor
3. Copy-paste contents of `supabase-schema.sql`
4. Click "Run"
5. Copy your credentials:
   - Settings → API
   - Project URL (SUPABASE_URL)
   - anon public key (SUPABASE_KEY)
   - service_role key (SUPABASE_SERVICE_KEY)

## 4. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Add:
```env
OPENAI_API_KEY=sk-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

## 5. Test Run

```bash
python main.py
```

You should see:
- Content monitoring output
- New articles generated
- Activity logs displayed

## 6. Start Scheduler

```bash
python scheduler.py
```

Agent runs automatically at:
- **6:00 AM** - Monitor & analyze
- **6:00 PM** - Generate & quality check

## View Results

### In Supabase Dashboard

```sql
-- See generated content
SELECT title, category, created_at, token_usage FROM content;

-- See activity logs
SELECT agent, action, tokens_used, timestamp FROM activity_log;
```

### In Terminal

When scheduler is running, check the log output for each job.

## Customization

### Change Schedule Times

Edit `config.py`:
```python
'schedule_morning': '06:00',   # Change to any time
'schedule_evening': '18:00',   # Change to any time
```

### Change Content Topics

Edit `agents/content_generator.py`, in `run()` method:
```python
topics = [
    ('Your Topic Here', 'guides', 'guide'),
    ('Another Topic', 'listings', 'listing'),
    ('News Topic', 'news', 'article'),
]
```

### Change Target Website

Edit `config.py`:
```python
'site_url': 'https://your-website.com'
```

## Troubleshooting

### "ModuleNotFoundError: No module named 'anthropic'"

```bash
pip install -r requirements.txt
```

### "Authentication failed" from Supabase

- Check SUPABASE_URL and SUPABASE_KEY in .env
- Verify they're correct (no extra spaces)
- Check Supabase project is active

### "Invalid API key" from OpenAI

- Check OPENAI_API_KEY starts with `sk-`
- Verify key has no extra spaces
- Check key hasn't expired
- Verify account has credits

### Scheduler not running

```bash
# Stop current process (Ctrl+C)

# Restart with verbose output
python scheduler.py
```

## Next Steps

- [ ] Deploy to cloud (see DEPLOYMENT.md)
- [ ] Setup Slack notifications
- [ ] Configure email alerts
- [ ] Customize content categories
- [ ] Add more topics

## Support

- Check README.md for detailed docs
- See DEPLOYMENT.md for cloud setup
- Open GitHub issue for problems

## Cost Estimate

- **OpenAI**: ~$0.10-0.50/day (depending on usage)
- **Supabase**: Free tier included
- **Hosting**: $0-12/month (depending on platform)

**Total**: ~$5-20/month
