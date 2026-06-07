# Telangana.live 2.0: Autonomous Deployment Strategy

This document defines the scheduling matrix for the platform's autonomous agents. By deploying these as Cron Jobs (via GitHub Actions, Vercel Cron, or Railway), the platform achieves 100% "Zero-Touch" operation.

## 🤖 Agent Fleet Scheduling Matrix

| Category | Agent | Target Source | Frequency | Cron Expression | Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Safety** | `RainfallScraper` | TSDPS Sensors | **Every 15 Mins** | `*/15 * * * *` | Triggers immediate flood/rain push alerts. |
| **Utility** | `PowerScraper` | TSSPDCL Portal | **Every 30 Mins** | `*/30 * * * *` | Updates live grid status and outage ETA. |
| **Utility** | `HMWSSBScraper` | HMWSSB Portal | **Hourly** | `0 * * * *` | Refreshes water countdowns and reservoir levels. |
| **Market** | `MandiScraper` | TS Marketing Dept | **Daily (Morning)**| `0 6 * * *` | Updates daily commodity wholesale/retail prices. |
| **Bridge** | `BridgeAgent` | V1 Supabase | **Hourly** | `0 * * * *` | Syncs legacy news/reports to V2 AI engine. |
| **Accountability**| `TenderScraper` | e-Procurement | **Daily (Midnight)**| `0 0 * * *` | Finds new public works projects in specific wards. |
| **Accountability**| `LADFundScraper` | Planning Dept | **Weekly** | `0 0 * * 0` | Updates MLA/MP budget utilization bars. |
| **Culture** | `PanchangAgent` | Almanac API | **Daily (Midnight)**| `0 0 * * *` | Refreshes Tithi, Nakshatra, and Sunrise data. |
| **Audit** | `MonitoringTower` | Internal Agents | **Post-Run** | N/A | Triggered internally by `main_ingestion.py` |

---

## 🛠️ Implementation Guide (GitHub Actions)

To automate this without human involvement, create a file at `.github/workflows/pulse_ingestion.yml` in your repository:

```yaml
name: Pulse Ingestion Engine (V2)

on:
  schedule:
    # Runs every 30 minutes
    - cron: "*/30 * * * *"
  workflow_dispatch: # Allows manual trigger

jobs:
  run-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          cd v2/backend
          pip install -r requirements.txt
          
      - name: Run Master Ingestion Engine
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          cd v2/backend
          python main_ingestion.py
```

### 💡 Recommendation for the Final Setup:
Instead of setting up 8 separate Cron jobs, the `main_ingestion.py` script is designed to run **every 30 minutes**. Inside the script, you can easily add "Time Gates" (e.g., *If time is 6 AM, run Mandi Scraper, else skip*), keeping your deployment structure incredibly simple.
