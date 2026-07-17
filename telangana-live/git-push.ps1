# Git Push Helper Script
Write-Host "Stashing local changes..." -ForegroundColor Cyan
git stash

Write-Host "Pulling latest changes from origin..." -ForegroundColor Cyan
git pull origin master

Write-Host "Re-applying local changes..." -ForegroundColor Cyan
git stash pop

Write-Host "Staging files..." -ForegroundColor Cyan
git add .

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "feat: monetization strategy, dynamic scheduler, and layout updates"

Write-Host "Pushing to remote origin..." -ForegroundColor Cyan
git push origin master

Write-Host "Git push workflow complete!" -ForegroundColor Green
