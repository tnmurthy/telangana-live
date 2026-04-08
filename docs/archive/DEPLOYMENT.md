# Deployment Guide

Deploy telangana-live-agents to the cloud for 24/7 automated content management.

## Option 1: Deploy to Render (Recommended)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Dashboard → New → Web Service
   - Connect GitHub repo
   - Choose "telangana-live-agents"

4. **Configure Service**
   - Name: `telangana-live-agents`
   - Runtime: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python scheduler.py`
   - Plan: Free or Starter

5. **Add Environment Variables**
   - Settings → Environment
   - Add:
     - `OPENAI_API_KEY` = sk-...
     - `SUPABASE_URL` = https://...
     - `SUPABASE_KEY` = eyJ...
     - `SUPABASE_SERVICE_KEY` = eyJ...

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Service will auto-restart every 24 hours

### Costs
- Free tier: Included
- Starter tier: $7/month minimum
- Plus tier: $12/month

## Option 2: Deploy to Railway

### Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - New Project → Deploy from GitHub repo
   - Select `telangana-live-agents`

3. **Configure Variables**
   - Variables section → Add variables:
     - `OPENAI_API_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `SUPABASE_SERVICE_KEY`

4. **Start Deploy**
   - Railway auto-detects Python
   - Builds and deploys automatically

5. **Set Start Command** (if needed)
   - Project → Settings → Start Command
   - Set to: `python scheduler.py`

### Costs
- Free: $5/month credit
- After: Usage-based pricing (~$0.50/hour)

## Option 3: Deploy to Heroku

### Steps

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create telangana-live-agents
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=sk-...
   heroku config:set SUPABASE_URL=https://...
   heroku config:set SUPABASE_KEY=eyJ...
   heroku config:set SUPABASE_SERVICE_KEY=eyJ...
   ```

5. **Create Procfile**
   ```
   worker: python scheduler.py
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Enable Worker Dyno**
   ```bash
   heroku ps:scale worker=1
   ```

### Costs
- Dyno (worker): $7/month minimum
- Database (if needed): separate costs

## Option 4: Deploy to AWS Lambda

### Setup

1. **Install SAM CLI**
   ```bash
   # macOS
   brew install aws-sam-cli
   
   # Windows/Linux
   # See: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
   ```

2. **Create SAM Template** (`template.yaml`)
   ```yaml
   AWSTemplateFormatVersion: '2010-09-09'
   Transform: AWS::Serverless-2016-10-31
   
   Resources:
     ContentAgentFunction:
       Type: AWS::Serverless::Function
       Properties:
         Handler: scheduler.run_scheduler
         Runtime: python3.11
         Environment:
           Variables:
             OPENAI_API_KEY: !Sub '{{resolve:secretsmanager:openai:SecretString:api_key}}'
             SUPABASE_URL: !Sub '{{resolve:secretsmanager:supabase:SecretString:url}}'
             SUPABASE_KEY: !Sub '{{resolve:secretsmanager:supabase:SecretString:key}}'
         Events:
           ScheduledEvent:
             Type: Schedule
             Properties:
               Schedule: 'cron(0 6 * * ? *)'  # 6 AM daily
   ```

3. **Build and Deploy**
   ```bash
   sam build
   sam deploy --guided
   ```

### Costs
- Lambda: $0.20 per 1M requests
- CloudWatch Logs: $0.50/GB
- Daily cost: ~$0.10

## Option 5: Deploy to Google Cloud

### Steps

1. **Install Google Cloud SDK**
   ```bash
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Create Cloud Function**
   ```bash
   gcloud functions deploy content-agent \
     --runtime python311 \
     --trigger-topic content-schedule \
     --entry-point run_scheduler \
     --set-env-vars OPENAI_API_KEY=sk-...,SUPABASE_URL=...,SUPABASE_KEY=...,SUPABASE_SERVICE_KEY=...
   ```

3. **Setup Cloud Scheduler**
   ```bash
   # Morning trigger (6 AM)
   gcloud scheduler jobs create pubsub morning-content-check \
     --schedule "0 6 * * *" \
     --topic content-schedule
   
   # Evening trigger (6 PM)
   gcloud scheduler jobs create pubsub evening-content-gen \
     --schedule "0 18 * * *" \
     --topic content-schedule
   ```

### Costs
- Cloud Functions: $0.40/million invocations
- Cloud Scheduler: $0.10/job/month
- Daily cost: ~$0.05

## Monitoring Deployments

### Render
- Dashboard → Service → Logs (real-time)

### Railway
- Project → Logs (streaming)

### Heroku
```bash
heroku logs --tail
```

### AWS
- CloudWatch → Log Groups → /aws/lambda/content-agent

### Google Cloud
```bash
gcloud functions logs read content-agent --limit 50
```

## CI/CD Pipeline

The repo includes GitHub Actions workflow (`.github/workflows/test.yml`) that:
- Runs on every push
- Tests imports
- Checks code quality
- Auto-deploys to Render (optional)

## Health Checks

Add monitoring endpoint to ensure agent is running:

```python
# Add to scheduler.py or create health_check.py
@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}
```

## Troubleshooting

### Service keeps restarting
- Check logs for errors
- Verify environment variables are set
- Ensure Supabase tables exist

### High costs
- Switch to cheaper cloud provider
- Reduce schedule frequency
- Use cheaper Claude model

### Logs not showing
- Check cloud provider's log service
- Verify logging is enabled
- Check IAM permissions

## Rollback

If something goes wrong:

### Render
- Deployments → Select previous version → Redeploy

### Railway
- Deployments → Select version → Deploy

### Heroku
```bash
heroku releases
heroku rollback v123
```

## Next Steps

1. Deploy to your preferred platform
2. Monitor first 24 hours
3. Check Supabase for generated content
4. Adjust schedule if needed
5. Enable notifications

For questions: Open an issue on GitHub
