#!/usr/bin/env bash
# ============================================================
# setup-city-repos.sh
# Bootstrap independent city portal repos from telangana-live
#
# Usage:
#   chmod +x scripts/setup-city-repos.sh
#   ./scripts/setup-city-repos.sh
#
# Prerequisites:
#   - gh CLI installed and authenticated  (brew install gh && gh auth login)
#   - git installed
#   - Run from any directory (not inside a git repo)
# ============================================================

set -euo pipefail

GITHUB_USER="${GITHUB_USER:-tnmurthy}"
BASE_REPO="https://github.com/${GITHUB_USER}/telangana-live"
WORK_DIR="${WORK_DIR:-$HOME/city-portals}"

declare -A CITIES
CITIES=(
  ["vijayawada-live"]="Vijayawada|Andhra Pradesh|vijayawada.live|Krishna Blue|#1E6DB5"
  ["visakhapatnam-live"]="Visakhapatnam|Andhra Pradesh|vizag.live|Bay Teal|#0D9488"
  ["tiruvannamalai-live"]="Tiruvannamalai|Tamil Nadu|tiruvannamalai.live|Saffron|#EA580C"
)

log()  { echo -e "\033[0;32m[✓] $*\033[0m"; }
info() { echo -e "\033[0;34m[→] $*\033[0m"; }
warn() { echo -e "\033[0;33m[!] $*\033[0m"; }
err()  { echo -e "\033[0;31m[✗] $*\033[0m" >&2; exit 1; }

# ── Preflight checks ──────────────────────────────────────
command -v git >/dev/null || err "git is not installed"
command -v gh  >/dev/null || err "gh CLI is not installed. Install: brew install gh"
gh auth status >/dev/null 2>&1 || err "Not logged in to GitHub. Run: gh auth login"

mkdir -p "$WORK_DIR"
info "Working directory: $WORK_DIR"
echo ""

# ── Process each city ────────────────────────────────────
for REPO_NAME in "${!CITIES[@]}"; do
  IFS='|' read -r CITY_NAME STATE DOMAIN COLOR_NAME COLOR_HEX <<< "${CITIES[$REPO_NAME]}"
  REPO_DIR="$WORK_DIR/$REPO_NAME"
  GITHUB_REPO="${GITHUB_USER}/${REPO_NAME}"

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  info "Setting up: $CITY_NAME ($DOMAIN)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # ── 1. Create GitHub repo ──────────────────────────────
  if gh repo view "$GITHUB_REPO" >/dev/null 2>&1; then
    warn "Repo $GITHUB_REPO already exists — skipping creation"
  else
    info "Creating GitHub repo: $GITHUB_REPO"
    gh repo create "$GITHUB_REPO" \
      --public \
      --description "Civic portal for ${CITY_NAME} citizens — live news, water supply, jobs, emergency contacts" \
      --homepage "https://${DOMAIN}"
    log "Created repo: https://github.com/$GITHUB_REPO"
  fi

  # ── 2. Clone base repo ────────────────────────────────
  if [ -d "$REPO_DIR" ]; then
    warn "Directory $REPO_DIR already exists — skipping clone"
  else
    info "Cloning base repo..."
    git clone "$BASE_REPO" "$REPO_DIR"
    log "Cloned to $REPO_DIR"
  fi

  pushd "$REPO_DIR" >/dev/null

  # ── 3. Re-point remote ────────────────────────────────
  git remote set-url origin "https://github.com/$GITHUB_REPO"
  log "Remote set to https://github.com/$GITHUB_REPO"

  # ── 4. Patch config.py ────────────────────────────────
  info "Patching config.py..."
  sed -i.bak \
    -e "s|'site_url': 'https://telangana.live'|'site_url': 'https://${DOMAIN}'|g" \
    config.py
  rm -f config.py.bak
  log "config.py patched"

  # ── 5. Patch index.html (title + meta) ────────────────
  info "Patching index.html..."
  sed -i.bak \
    -e "s|<title>.*</title>|<title>${CITY_NAME} Live — Civic Portal for ${CITY_NAME} Citizens</title>|g" \
    index.html
  rm -f index.html.bak
  log "index.html patched"

  # ── 6. Patch package.json (name) ──────────────────────
  info "Patching package.json..."
  sed -i.bak \
    -e "s|\"name\": \"project\"|\"name\": \"${REPO_NAME}\"|g" \
    package.json
  rm -f package.json.bak
  log "package.json patched"

  # ── 7. Create .env.local ──────────────────────────────
  if [ ! -f ".env.local" ]; then
    info "Creating .env.local template..."
    cat > .env.local <<ENV
# ${CITY_NAME} Live — Environment Variables
# Copy from telangana-live secrets and set below

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CITY_NAME=${CITY_NAME}
VITE_STATE=${STATE}
VITE_DOMAIN=${DOMAIN}
ENV
    log ".env.local created"
  fi

  # ── 8. Create city README ─────────────────────────────
  info "Creating README.md..."
  cat > README.md <<README
# ${CITY_NAME} Live 🏙️

> Civic portal for ${CITY_NAME} citizens — live news, water supply, emergency contacts, jobs and more.

**Domain:** [${DOMAIN}](https://${DOMAIN})  
**State:** ${STATE}  
**Stack:** React 19 + Vite + Tailwind CSS + Supabase + Cloudflare Pages

## Quick Start

\`\`\`bash
npm install
cp .env.local.example .env.local   # fill in Supabase + API keys
npm run dev
\`\`\`

## Blueprint

See [blueprint.md](docs/city-portals/${REPO_NAME}/blueprint.md) for full setup guide.

## Deploy

\`\`\`bash
npm run build
# Deploy dist/ to Cloudflare Pages
\`\`\`

## License

MIT
README
  log "README.md created"

  # ── 9. Commit and push ────────────────────────────────
  info "Committing city-specific changes..."
  git add -A
  git commit -m "chore: bootstrap ${CITY_NAME} Live portal from telangana-live

- Update config.py: site_url → ${DOMAIN}
- Update index.html: title → ${CITY_NAME} Live
- Update package.json: name → ${REPO_NAME}
- Add .env.local template
- Update README for ${CITY_NAME}

Next steps: swap data files per blueprint.md" || warn "Nothing new to commit"

  info "Pushing to GitHub..."
  git push -u origin main
  log "Pushed to https://github.com/$GITHUB_REPO"

  popd >/dev/null
  echo ""
done

# ── Summary ───────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✅  All 3 city repos bootstrapped!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  Repos created:"
for REPO_NAME in "${!CITIES[@]}"; do
  echo "    → https://github.com/${GITHUB_USER}/${REPO_NAME}"
done
echo ""
echo "  Next steps for EACH repo:"
echo "    1. Swap src/data/ files (water, emergency, transport)"
echo "    2. Update tailwind.config.js brand colors"
echo "    3. Replace news_scraper.py RSS feed URLs"
echo "    4. Add GitHub Secrets (ANTHROPIC_API_KEY, SUPABASE_URL, etc.)"
echo "    5. Create Cloudflare Pages project + connect custom domain"
echo "    6. Create Supabase schema per blueprint.md"
echo ""
echo "  See docs/city-portals/<city>/blueprint.md for full guide."
echo ""
