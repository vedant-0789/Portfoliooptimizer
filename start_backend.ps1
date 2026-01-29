# Backend Startup Script for Windows
Write-Host "🚀 Starting ALGORHYTHM Backend..." -ForegroundColor Green

# Navigate to backend directory
Set-Location $PSScriptRoot\backend

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Check if .env exists, if not create it
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_optimizer

# Redis (optional - can use SQLite if Redis not available)
REDIS_URL=redis://localhost:6379

# JWT Secret
SECRET_KEY=algorhythm-secret-key-change-in-production-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Keys (Optional - add your keys here for full features)
ALPHA_VANTAGE_API_KEY=
FINNHUB_API_KEY=
NEWS_API_KEY=

# Security
ENCRYPTION_KEY=algorhythm-encryption-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3000
"@ | Out-File -FilePath .env -Encoding utf8
    Write-Host ".env file created!" -ForegroundColor Green
}

# Install dependencies if needed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt

# Start the server
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000

