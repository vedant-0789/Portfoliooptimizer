# 🚀 START HERE - Get Your Project Running!

## ✅ What's Already Done

- ✅ Python 3.13.9 installed
- ✅ Node.js v22.16.0 installed  
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Virtual environment created
- ✅ Database configured to use SQLite (no PostgreSQL needed!)

## 🎯 Quick Start (3 Steps)

### Step 1: Create Environment Files

**Create `backend\.env` file** with this content:
```env
DATABASE_URL=
REDIS_URL=redis://localhost:6379
SECRET_KEY=algorhythm-secret-key-change-in-production-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALPHA_VANTAGE_API_KEY=
FINNHUB_API_KEY=
NEWS_API_KEY=
ENCRYPTION_KEY=algorhythm-encryption-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Create `frontend\.env.local` file** with this content:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 2: Start Backend (Terminal 1)

Open PowerShell in the project root and run:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

You should see:
```
🚀 Starting ALGORHYTHM Portfolio Optimizer...
✅ Connected to Redis (or warning if Redis not available)
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Start Frontend (Terminal 2)

Open a **NEW** PowerShell window and run:

```powershell
cd frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🎉 You're Ready!

1. Visit http://localhost:3000
2. Click "Sign Up" to create an account
3. Login and start using ALGORHYTHM!

## ⚠️ Important Notes

### Redis (Optional)
- If you see Redis connection errors, that's OK!
- The app will work without Redis (caching will be disabled)
- To use Redis: Install from https://github.com/microsoftarchive/redis/releases

### Database
- Using SQLite by default (no setup needed!)
- Database file: `backend/portfolio_optimizer.db`
- To use PostgreSQL later, just update `DATABASE_URL` in `.env`

### API Keys (Optional)
- App works without API keys
- For full news features, get free keys:
  - NewsAPI: https://newsapi.org/register
  - Alpha Vantage: https://www.alphavantage.co/support/#api-key

## 🐛 Troubleshooting

### Backend won't start
- Make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`
- Check port 8000 is free
- Try: `python -m uvicorn main:app --reload`

### Frontend won't start
- Check port 3000 is free
- Try: `npm run dev -- -p 3001` (uses port 3001 instead)

### Can't connect to backend
- Make sure backend is running on port 8000
- Check `frontend\.env.local` has correct URL

## 📚 Next Steps

1. Explore the dashboard
2. Create a portfolio
3. Add some holdings
4. Check out AI recommendations
5. View news and sentiment analysis

---

**Need help? Check QUICK_START.md or SETUP.md for more details!**

