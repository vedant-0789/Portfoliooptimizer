# Quick Start Script - Start Both Servers
Write-Host "🚀 ALGORHYTHM - Starting Servers..." -ForegroundColor Green
Write-Host ""

# Check if ports are in use
$port8000 = netstat -ano | findstr ":8000"
$port3000 = netstat -ano | findstr ":3000"

if ($port8000) {
    Write-Host "⚠️  Port 8000 is already in use. Backend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "Starting Backend on port 8000..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\venv\Scripts\Activate.ps1; Write-Host '🚀 Backend Starting...' -ForegroundColor Green; uvicorn main:app --reload --host 0.0.0.0 --port 8000"
    Start-Sleep -Seconds 2
}

if ($port3000) {
    Write-Host "⚠️  Port 3000 is already in use. Frontend may already be running." -ForegroundColor Yellow
} else {
    Write-Host "Starting Frontend on port 3000..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '🚀 Frontend Starting...' -ForegroundColor Green; npm run dev"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "⏳ Wait 15-20 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "📍 Then open in your browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Gray
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host ""

