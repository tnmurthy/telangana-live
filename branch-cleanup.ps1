$ErrorActionPreference = "Stop"
Write-Host "Starting branch cleanup..."

$staleBranches = @(
    "copilot/improve-news-update-smoothness",
    "copilot/audit-jobs-and-workflows",
    "copilot/create-automated-job-for-updates",
    "copilot/fix-anthropic-dependency-issue",
    "copilot/fix-portal-loading-issue",
    "copilot/update-weather-scripts",
    "copilot/fix-argument-error-finance-only"
)

foreach ($branch in $staleBranches) {
    Write-Host "  Deleting: $branch"
    git push origin --delete $branch 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Deleted OK"
    } else {
        Write-Host "  Already gone, skipping"
    }
}

Write-Host "Creating clean dev branch..."
git checkout -b dev
git push -u origin dev
git checkout master

Write-Host "Done! Branches: master (prod) + dev (development)"