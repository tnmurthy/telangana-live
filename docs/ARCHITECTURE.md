# Git-to-Vercel-to-Hostinger Pipeline Guide for Telangana.live

This document details the data flow and configuration steps to push code from your mobile IDE/Terminal (AntiGravity) to GitHub, trigger an automated Vercel build, and manage DNS routing through Hostinger.

---

## Part 1: The Pipeline Architecture

```text
[ AntiGravity (Code/Commit) ] 
             │
             ▼
[ GitHub Repository (Main Branch) ] 
             │
             ▼  (Automated Webhook Trigger)
[ Vercel Production Build ] 
             │
             ▼  (DNS Records / Nameservers)
[ Hostinger Domain Manager (telangana.live) ]
```

---

## Part 2: Git Initialization & Mobile Push (AntiGravity)

1. Initialize Git in your project folder within your terminal workspace:
   ```bash
   git init
   git branch -M main
   ```
2. Link your local project to your remote GitHub repository:
   ```bash
   git remote add origin https://github.com
   ```
3. Stage, commit, and push your AdSense compliance files (`index.html`, `ads.txt`, `vercel.json`):
   ```bash
   git add .
   git commit -m "feat: add adsense tracking and verification assets"
   git push -u origin main
   ```

---

## Part 3: Connecting GitHub to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** and select **Project**.
3. Under "Import Git Repository," select **GitHub** and connect your account.
4. Import your `telangana-live` repository.
5. Leave the "Framework Preset" as **Other** (since it is standard HTML/JS).
6. Click **Deploy**. Vercel will build your site and generate a `.vercel.app` preview URL.

---

## Part 4: DNS Configuration (Hostinger to Vercel)

To link your official domain (`telangana.live`) hosted on Hostinger to your new Vercel deployment:

### Option A: Recommended (Point via Vercel Nameservers)
This completely hands over DNS management to Vercel for faster loading and automated SSL handling.
1. In Vercel, go to **Project Settings > Domains**.
2. Add `telangana.live` and `www.telangana.live`.
3. Vercel will display their global Nameservers. (e.g., `://vercel-dns.com`, `://vercel-dns.com`).
4. Log into your **Hostinger Control Panel (hPanel)**.
5. Go to **Domains > telangana.live > Nameservers**.
6. Click **Change Nameservers**, paste Vercel's nameservers, and save.

### Option B: Alternative (Keep Hostinger DNS, Add A/CNAME Records)
If you run email hosting or other subdomains on Hostinger, keep Hostinger's nameservers and add these specific records inside the **Hostinger DNS Zone Editor**:


| Type | Name | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel IP) | Default |
| **CNAME** | `www` | `://vercel-dns.com` | Default |

---

## Part 5: Pipeline Validation

Every time you commit changes inside your mobile environment and push to GitHub, Vercel will automatically trigger a new production build in under 10 seconds. 

Ensure that your `https://telangana.live` and Google verification files continue to resolve properly after every push.
