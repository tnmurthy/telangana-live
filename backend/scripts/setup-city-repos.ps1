# =============================================================
# setup-city-repos.ps1
# Bootstrap independent city portal repos from telangana-live
#
# Usage (run from PowerShell as normal user — no admin needed):
#   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned   # once, if needed
#   .\scripts\setup-city-repos.ps1
#
# Or override defaults:
#   $env:GITHUB_USER = "tnmurthy"
#   $env:WORK_DIR    = "C:\Projects\city-portals"
#   .\scripts\setup-city-repos.ps1
#
# Prerequisites:
#   - git          : winget install --id Git.Git
#   - gh CLI       : winget install --id GitHub.cli
#   - Logged in    : gh auth login
# =============================================================

#Requires -Version 5.1

$ErrorActionPreference = 'Stop'

# ── Config ───────────────────────────────────────────────────
$GitHubUser = if ($env:GITHUB_USER) { $env:GITHUB_USER } else { "tnmurthy" }
$BaseRepo   = "https://github.com/$GitHubUser/telangana-live"
$WorkDir    = if ($env:WORK_DIR) { $env:WORK_DIR } else { "$HOME\city-portals" }

$Cities = @(
    [PSCustomObject]@{
        RepoName = "vijayawada-live"
        CityName = "Vijayawada"
        State    = "Andhra Pradesh"
        Domain   = "vijayawada.live"
    }
    [PSCustomObject]@{
        RepoName = "visakhapatnam-live"
        CityName = "Visakhapatnam"
        State    = "Andhra Pradesh"
        Domain   = "vizag.live"
    }
    [PSCustomObject]@{
        RepoName = "tiruvannamalai-live"
        CityName = "Tiruvannamalai"
        State    = "Tamil Nadu"
        Domain   = "tiruvannamalai.live"
    }
)

# ── Helpers ──────────────────────────────────────────────────
function Write-OK   { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host " --> $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "[!]  $msg" -ForegroundColor Yellow }
function Write-Err  { param($msg) Write-Host "[ERR] $msg" -ForegroundColor Red; exit 1 }

# ── Preflight checks ─────────────────────────────────────────
Write-Info "Checking prerequisites..."

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Err "git is not installed. Run: winget install --id Git.Git"
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Err "GitHub CLI (gh) is not installed. Run: winget install --id GitHub.cli"
}

$authCheck = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Err "Not logged in to GitHub. Run: gh auth login"
}

# ── Create work dir ──────────────────────────────────────────
if (-not (Test-Path $WorkDir)) {
    New-Item -ItemType Directory -Path $WorkDir | Out-Null
}
Write-Info "Working directory: $WorkDir"
Write-Host ""

# ── Process each city ────────────────────────────────────────
foreach ($City in $Cities) {
    $RepoName   = $City.RepoName
    $CityName   = $City.CityName
    $State      = $City.State
    $Domain     = $City.Domain
    $RepoDir    = Join-Path $WorkDir $RepoName
    $GitHubRepo = "$GitHubUser/$RepoName"

    Write-Host ("=" * 60) -ForegroundColor DarkGray
    Write-Info "Setting up: $CityName ($Domain)"
    Write-Host ("=" * 60) -ForegroundColor DarkGray

    # ── 1. Create GitHub repo ─────────────────────────────
    $existCheck = gh repo view $GitHubRepo 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Warn "Repo $GitHubRepo already exists — skipping creation"
    } else {
        Write-Info "Creating GitHub repo: $GitHubRepo"
        gh repo create $GitHubRepo `
            --public `
            --description "Civic portal for $CityName citizens — live news, water supply, jobs, emergency contacts" `
            --homepage "https://$Domain"
        if ($LASTEXITCODE -ne 0) { Write-Err "Failed to create repo $GitHubRepo" }
        Write-OK "Created repo: https://github.com/$GitHubRepo"
    }

    # ── 2. Clone base repo ───────────────────────────────
    if (Test-Path $RepoDir) {
        Write-Warn "Directory $RepoDir already exists — skipping clone"
    } else {
        Write-Info "Cloning base repo..."
        git clone $BaseRepo $RepoDir
        if ($LASTEXITCODE -ne 0) { Write-Err "Failed to clone $BaseRepo" }
        Write-OK "Cloned to $RepoDir"
    }

    Set-Location $RepoDir

    # ── 3. Re-point remote ───────────────────────────────
    git remote set-url origin "https://github.com/$GitHubRepo"
    Write-OK "Remote set to https://github.com/$GitHubRepo"

    # ── 4. Patch config.py ───────────────────────────────
    Write-Info "Patching config.py..."
    $configPath = Join-Path $RepoDir "config.py"
    (Get-Content $configPath -Raw) `
        -replace "'site_url': 'https://telangana\.live'", "'site_url': 'https://$Domain'" |
        Set-Content $configPath -NoNewline
    Write-OK "config.py patched"

    # ── 5. Patch index.html ──────────────────────────────
    Write-Info "Patching index.html..."
    $indexPath = Join-Path $RepoDir "index.html"
    (Get-Content $indexPath -Raw) `
        -replace '<title>.*?</title>', "<title>$CityName Live — Civic Portal for $CityName Citizens</title>" |
        Set-Content $indexPath -NoNewline
    Write-OK "index.html patched"

    # ── 6. Patch package.json ────────────────────────────
    Write-Info "Patching package.json..."
    $pkgPath = Join-Path $RepoDir "package.json"
    (Get-Content $pkgPath -Raw) `
        -replace '"name": "project"', "`"name`": `"$RepoName`"" |
        Set-Content $pkgPath -NoNewline
    Write-OK "package.json patched"

    # ── 7. Create .env.local ─────────────────────────────
    $envPath = Join-Path $RepoDir ".env.local"
    if (-not (Test-Path $envPath)) {
        Write-Info "Creating .env.local template..."
        @"
# $CityName Live - Environment Variables
# Copy values from telangana-live GitHub Secrets

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CITY_NAME=$CityName
VITE_STATE=$State
VITE_DOMAIN=$Domain
"@ | Set-Content $envPath
        Write-OK ".env.local created"
    }

    # ── 8. Create README.md ──────────────────────────────
    Write-Info "Creating README.md..."
    @"
# $CityName Live

> Civic portal for $CityName citizens - live news, water supply, emergency contacts, jobs and more.

**Domain:** [$Domain](https://$Domain)
**State:** $State
**Stack:** React 19 + Vite + Tailwind CSS + Supabase + Cloudflare Pages

## Quick Start

``````
npm install
copy .env.local.example .env.local
npm run dev
``````

## Blueprint

See [blueprint.md](docs/city-portals/$RepoName/blueprint.md) for full setup guide.

## Deploy

``````
npm run build
# Deploy dist/ to Cloudflare Pages
``````

## License

MIT
"@ | Set-Content (Join-Path $RepoDir "README.md")
    Write-OK "README.md created"

    # ── 9. Commit and push ───────────────────────────────
    Write-Info "Committing city-specific changes..."
    git add -A
    $commitMsg = @"
chore: bootstrap $CityName Live portal from telangana-live

- Update config.py: site_url -> $Domain
- Update index.html: title -> $CityName Live
- Update package.json: name -> $RepoName
- Add .env.local template
- Update README for $CityName

Next steps: swap data files per blueprint.md
"@
    git commit -m $commitMsg
    if ($LASTEXITCODE -ne 0) {
        Write-Warn "Nothing new to commit (or commit failed) — continuing"
    }

    Write-Info "Pushing to GitHub..."
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { Write-Err "Push failed for $GitHubRepo" }
    Write-OK "Pushed to https://github.com/$GitHubRepo"

    Set-Location $WorkDir
    Write-Host ""
}

# ── Summary ──────────────────────────────────────────────────
Write-Host ""
Write-Host ("=" * 60) -ForegroundColor Green
Write-Host "  All 3 city repos bootstrapped!" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Green
Write-Host ""
Write-Host "  Repos created:" -ForegroundColor White
foreach ($City in $Cities) {
    Write-Host "    -> https://github.com/$GitHubUser/$($City.RepoName)" -ForegroundColor Cyan
}
Write-Host ""
Write-Host "  Next steps for EACH repo:" -ForegroundColor White
Write-Host "    1. Swap src/data/ files (water, emergency, transport)" -ForegroundColor Gray
Write-Host "    2. Update tailwind.config.js brand colors" -ForegroundColor Gray
Write-Host "    3. Replace news_scraper.py RSS feed URLs" -ForegroundColor Gray
Write-Host "    4. Add GitHub Secrets (ANTHROPIC_API_KEY, SUPABASE_URL, etc.)" -ForegroundColor Gray
Write-Host "    5. Create Cloudflare Pages project + connect custom domain" -ForegroundColor Gray
Write-Host "    6. Create Supabase schema per blueprint.md" -ForegroundColor Gray
Write-Host ""
Write-Host "  See docs/city-portals/<city>/blueprint.md for full guide." -ForegroundColor Gray
Write-Host ""
