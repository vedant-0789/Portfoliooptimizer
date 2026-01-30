# Quick Start Guide - ALGORHYTHM

## 🚀 Fast Setup (Windows)

### Step 1: Install Backend Dependencies

Open PowerShell in the project root and run:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Step 2: Create Environment Files

**Backend (.env):**
Create `backend\.env` file with:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_optimizer
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

**Frontend (.env.local):**
Create `frontend\.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Step 3: Install Frontend Dependencies

Open a NEW PowerShell window:

```powershell
cd frontend
npm install
```

### Step 4: Start the Application

**Option A: Use the provided scripts (Easiest)**

1. **Terminal 1 - Backend:**
   ```powershell
   .\start_backend.ps1
   ```

2. **Terminal 2 - Frontend:**
   ```powershell
   .\start_frontend.ps1
   ```

**Option B: Manual Start**

1. **Terminal 1 - Backend:**
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   uvicorn main:app --reload
   ```

2. **Terminal 2 - Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## ⚠️ Important Notes

### Database (PostgreSQL)

**Option 1: Use PostgreSQL (Recommended)**
1. Install PostgreSQL: https://www.postgresql.org/download/windows/
2. Create database:
   ```sql
   CREATE DATABASE portfolio_optimizer;
   ```
3. Update `DATABASE_URL` in `backend\.env`

**Option 2: Use SQLite (Simpler for testing)**
The app will work without PostgreSQL, but some features may be limited.

### Redis (Optional)

**Option 1: Use Redis (Recommended)**
1. Install Redis: https://github.com/microsoftarchive/redis/releases
2. Start Redis server
3. Update `REDIS_URL` in `backend\.env`

**Option 2: Skip Redis**
The app will work without Redis, but caching will be disabled.

## 🎯 First Steps After Starting

1. **Visit**: http://localhost:3000
2. **Register**: Create a new account
3. **Login**: Sign in with your credentials
4. **Create Portfolio**: Add your first portfolio
5. **Add Holdings**: Add stocks to your portfolio
6. **Explore**: Check out AI recommendations, news, and analysis!

## 🐛 Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify Python virtual environment is activated
- Check if all dependencies are installed: `pip list`

### Frontend won't start
- Check if port 3000 is available
- Verify Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`

### Database connection error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Try creating database manually

### Redis connection error
- Redis is optional - app will work without it
- Or install and start Redis server

## 📝 Next Steps

1. Get API keys (optional but recommended):
   - NewsAPI: https://newsapi.org/register
   - Alpha Vantage: https://www.alphavantage.co/support/#api-key
   
2. Add API keys to `backend\.env`

3. Explore features:
   - Portfolio optimization
   - AI recommendations
   - News sentiment analysis
   - Risk metrics
   - Price predictions

---

**Need help? Check SETUP.md for detailed instructions!**

