Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow

if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "Removed .next directory" -ForegroundColor Green
}

if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "Removed out directory" -ForegroundColor Green
}

Write-Host "Build artifacts cleaned successfully!" -ForegroundColor Green
