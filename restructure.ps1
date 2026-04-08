$ErrorActionPreference = "Stop"
Write-Host "Starting telangana-live repo restructure..."

# 1. Create folders
$dirs = @(
    "frontend/src", "frontend/public",
    "backend/agents", "backend/api", "backend/scripts", "backend/config",
    "docs/architecture", "docs/archive",
    "deployment"
)
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  created $dir"
    }
}

# 2. Move frontend files
Write-Host "Moving frontend files..."
$frontendFiles = @(
    "index.html", "vite.config.js", "vite.config.ts",
    "tailwind.config.js", "tailwind.config.ts",
    "tsconfig.json", "tsconfig.app.json", "tsconfig.node.json",
    "eslint.config.js", "eslint.config.ts",
    "package.json", "package-lock.json", "postcss.config.js"
)
foreach ($f in $frontendFiles) {
    if (Test-Path $f) {
        git mv $f "frontend/$f"
        Write-Host "  moved $f to frontend/"
    }
}
if (Test-Path "src")        { git mv src frontend/src;                   Write-Host "  moved src/ to frontend/src/" }
if (Test-Path "public")     { git mv public frontend/public;             Write-Host "  moved public/ to frontend/public/" }
if (Test-Path "components") { git mv components frontend/src/components; Write-Host "  moved components/ to frontend/src/components/" }

# 3. Move backend files
Write-Host "Moving backend files..."
$backendFiles = @(
    "main.py", "scheduler.py", "database.py", "config.py",
    "requirements.txt", "requirements-dev.txt", "setup.py", "pyproject.toml"
)
foreach ($f in $backendFiles) {
    if (Test-Path $f) {
        git mv $f "backend/$f"
        Write-Host "  moved $f to backend/"
    }
}
if (Test-Path "agents")  { git mv agents  backend/agents;  Write-Host "  moved agents/ to backend/agents/" }
if (Test-Path "api")     { git mv api     backend/api;     Write-Host "  moved api/ to backend/api/" }
if (Test-Path "scripts") { git mv scripts backend/scripts; Write-Host "  moved scripts/ to backend/scripts/" }

# 4. Move deployment configs
Write-Host "Moving deployment configs..."
$deployFiles = @("nginx.conf", "Dockerfile", "docker-compose.yml", ".dockerignore", "wrangler.toml")
foreach ($f in $deployFiles) {
    if (Test-Path $f) {
        git mv $f "deployment/$f"
        Write-Host "  moved $f to deployment/"
    }
}

# 5. Archive redundant docs
Write-Host "Archiving redundant docs..."
$archiveDocs = @(
    "DEPLOYMENT.md", "DESIGN_SUMMARY.md", "PROJECT_SUMMARY.md",
    "INDEX.md", "QUICKSTART.md", "SETUP.md", "CONTRIBUTING.md"
)
foreach ($f in $archiveDocs) {
    if (Test-Path $f) {
        git mv $f "docs/archive/$f"
        Write-Host "  archived $f to docs/archive/"
    }
}

# 6. Commit
Write-Host "Committing restructure..."
git add -A
git commit -m "refactor: restructure repo into frontend/ backend/ docs/ deployment/"

Write-Host "Done! Run: git push origin master"