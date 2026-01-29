# Setup Guide - ALGORHYTHM Portfolio Optimizer

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.10+ ([Download](https://www.python.org/downloads/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Redis** 6+ ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

## Quick Start

### 1. Clone and Navigate

```bash
cd Portfoliooptimizer
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials and API keys

# Initialize database
# Make sure PostgreSQL is running
# Create database: createdb portfolio_optimizer

# Run migrations (if using Alembic)
alembic upgrade head

# Start backend server
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_optimizer
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALPHA_VANTAGE_API_KEY=your-api-key
FINNHUB_API_KEY=your-api-key
ENCRYPTION_KEY=your-encryption-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database Setup

1. **Create PostgreSQL Database:**

```sql
CREATE DATABASE portfolio_optimizer;
```

2. **Update DATABASE_URL in backend/.env**

3. **Tables will be created automatically** when you start the backend (using SQLAlchemy)

## Redis Setup

1. **Start Redis server:**

```bash
# On Windows (if installed via WSL or native)
redis-server

# On macOS (if installed via Homebrew)
brew services start redis

# On Linux
sudo systemctl start redis
```

2. **Verify Redis is running:**

```bash
redis-cli ping
# Should return: PONG
```

## API Keys (Recommended for Full Features)

For better market data and news features, get API keys from:

- **NewsAPI** (Free tier available): https://newsapi.org/register
  - Required for news aggregation feature
  - Add to `backend/.env`: `NEWS_API_KEY=your-key`
  
- **Alpha Vantage**: https://www.alphavantage.co/support/#api-key
  - Provides company-specific news with sentiment
  - Add to `backend/.env`: `ALPHA_VANTAGE_API_KEY=your-key`
  
- **Finnhub**: https://finnhub.io/register
  - Alternative market data source
  - Add to `backend/.env`: `FINNHUB_API_KEY=your-key`

**Note**: The system will work without API keys but with limited news sources. News features are significantly enhanced with API keys.

## Testing the Setup

1. **Backend Health Check:**
   - Visit: `http://localhost:8000/health`
   - Should return: `{"status": "healthy"}`

2. **Frontend:**
   - Visit: `http://localhost:3000`
   - Should see the landing page

3. **API Documentation:**
   - Visit: `http://localhost:8000/docs`
   - Interactive Swagger UI for testing APIs

## Common Issues

### Database Connection Error

- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify database exists: `psql -l`

### Redis Connection Error

- Ensure Redis is running
- Check REDIS_URL in .env
- Test connection: `redis-cli ping`

### Port Already in Use

- Backend (8000): Change port in `uvicorn main:app --port 8001`
- Frontend (3000): Change port in `npm run dev -- -p 3001`

### Module Not Found (Python)

- Ensure virtual environment is activated
- Reinstall: `pip install -r requirements.txt`

### Module Not Found (Node)

- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

## Production Deployment

### Backend

1. Use production WSGI server (Gunicorn)
2. Set proper SECRET_KEY
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Set up proper CORS origins

### Frontend

1. Build: `npm run build`
2. Start: `npm start`
3. Or deploy to Vercel/Netlify

## Next Steps

1. Register a new account at `/register`
2. Create your first portfolio
3. Add holdings to your portfolio
4. View AI recommendations and analysis
5. Explore risk metrics and optimization

## Support

For issues or questions, check:
- README.md for project overview
- API docs at `/docs` endpoint
- Code comments for implementation details

---

**Happy Optimizing! 🚀**

