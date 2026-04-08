# Telangana.live Content Maintenance Agent

## 📁 Project Files Overview

### Core Application
- **config.py** - Configuration & settings
- **database.py** - Supabase connection
- **main.py** - Manual test runner
- **scheduler.py** - Automated scheduler

### AI Agents (agents/)
- **content_monitor.py** - Analyzes website
- **content_generator.py** - Creates content
- **content_updater.py** - Updates content
- **quality_checker.py** - Validates quality

### Configuration
- **.env.example** - Template for credentials
- **requirements.txt** - Python dependencies
- **.gitignore** - Git configuration
- **setup.sh** - Automated setup script

### Database
- **supabase-schema.sql** - Database schema

### Documentation
- **README.md** - Full documentation (4885 bytes)
- **QUICKSTART.md** - 5-minute setup (3365 bytes)
- **DEPLOYMENT.md** - Cloud deployment (6390 bytes)
- **PROJECT_SUMMARY.md** - This project (6407 bytes)

### CI/CD
- **.github/workflows/test.yml** - GitHub Actions

## 🚀 Quick Start

```bash
# 1. Install
pip install -r requirements.txt

# 2. Configure
cp .env.example .env
# Edit .env with your credentials

# 3. Setup Database
# Run supabase-schema.sql in Supabase SQL editor

# 4. Test
python main.py

# 5. Deploy
python scheduler.py
```

## 📊 What It Does

**Morning (6 AM)**
- Fetches telangana.live
- Analyzes content
- Identifies updates needed
- Logs to Supabase

**Evening (6 PM)**
- Generates new articles
- Creates guides & listings
- Stores in database
- Tracks token usage

## 💰 Costs

- **OpenAI API**: $0.10-0.50/day
- **Supabase**: Free
- **Hosting**: $0-12/month
- **Total**: $5-20/month

## 📦 Technologies

- Python 3.8+
- Anthropic Claude API
- Supabase (PostgreSQL)
- APSchedule

## 🔧 Customization

Edit `config.py` to:
- Change schedule times
- Switch AI models
- Update target website
- Adjust token limits

Edit `agents/content_generator.py` to:
- Add content topics
- Change categories
- Modify content types

## 📚 Documentation

| File | Size | Purpose |
|------|------|---------|
| README.md | 4885 B | Full reference |
| QUICKSTART.md | 3365 B | 5-min setup |
| DEPLOYMENT.md | 6390 B | Cloud guide |
| PROJECT_SUMMARY.md | 6407 B | Overview |

**Total Documentation**: 20KB

## 🎯 Next Steps

1. Clone from GitHub
2. Install dependencies
3. Get API credentials
4. Create Supabase project
5. Configure .env
6. Run main.py
7. Deploy to cloud

## 📞 Support

- GitHub Issues
- Check documentation
- Review code comments
- See deployment guide

## 📄 License

MIT - Free to use and modify

---

**Ready to build automation agents for telangana.live? Start with QUICKSTART.md!**
