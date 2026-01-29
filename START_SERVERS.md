# 🚀 Quick Start - Start Your Servers

## ✅ Servers Should Be Starting!

I've started both servers in separate PowerShell windows. You should see:

1. **Backend Window** - Running FastAPI on port 8000
2. **Frontend Window** - Running Next.js on port 3000

## 📍 Access Your Application

Wait 10-15 seconds for servers to fully start, then:

### 🌐 Open in Browser:
**http://localhost:3000**

You should see the ALGORHYTHM landing page!

## 🔍 Check Server Status

### Backend (Port 8000)
- Visit: http://localhost:8000/health
- Should show: `{"status": "healthy"}`
- API Docs: http://localhost:8000/docs

### Frontend (Port 3000)
- Visit: http://localhost:3000
- Should show: ALGORHYTHM landing page

## 🐛 If Servers Didn't Start

### Manual Start (if needed):

**Terminal 1 - Backend:**
```powershell
cd c:\portfolio\Portfoliooptimizer\backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```powershell
cd c:\portfolio\Portfoliooptimizer\frontend
npm run dev
```

## ✅ What You Should See

1. **Landing Page** - Beautiful ALGORHYTHM homepage
2. **Sign Up/Login** - Create account or login
3. **Dashboard** - After login, see your portfolio dashboard
4. **Features** - AI recommendations, news, analysis

---

**Refresh your browser at http://localhost:3000 if you still see the error!**

