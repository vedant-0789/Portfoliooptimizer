# ALGORHYTHM - AI-Powered Portfolio Optimizer

## 🚀 Unique Selling Points

### 1. **AI-Powered Portfolio Optimization**
- Machine learning algorithms for optimal asset allocation
- Real-time risk-adjusted return optimization
- Personalized investment strategies based on user profile

### 2. **Live News Integration & Sentiment Analysis** 🆕
- **Real-time news aggregation** from multiple sources (NewsAPI, Alpha Vantage)
- **Sentiment analysis** using NLP (TextBlob) on all news articles
- **News-driven predictions** - predictions adjust based on current news sentiment
- **Market sentiment dashboard** - overall market mood visualization
- **Stock-specific news** - relevant news for each holding
- **Portfolio news feed** - aggregated news for all holdings

### 3. **Predictive Analytics Engine**
- Market trend prediction using deep learning models
- **Enhanced with news sentiment** - predictions incorporate real-world events
- Sentiment analysis from news and social media
- Volatility forecasting for risk management

### 3. **Advanced Security & Fraud Detection**
- Real-time transaction monitoring
- Anomaly detection using AI
- Blockchain-based transaction verification
- Multi-factor authentication

### 4. **Comprehensive Analysis Tools**
- Risk metrics (Sharpe ratio, Sortino ratio, Beta, VaR)
- Tax optimization strategies
- Performance attribution analysis
- Sector and geographic diversification insights

### 5. **Smart Recommendations**
- AI-driven stock recommendations
- Portfolio rebalancing suggestions
- Tax-loss harvesting opportunities
- Risk-adjusted investment opportunities

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (React with TypeScript)
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **WebSocket** for real-time updates

### Backend
- **FastAPI** (Python) for high-performance API
- **PostgreSQL** for data storage
- **Redis** for caching and real-time data

### AI/ML
- **TensorFlow/PyTorch** for deep learning models
- **Scikit-learn** for traditional ML algorithms
- **NLP models** for sentiment analysis
- **Time series forecasting** for predictions

### Security
- **JWT** authentication
- **bcrypt** for password hashing
- **2FA** support
- **Encryption** at rest and in transit

## 📁 Project Structure

```
Portfoliooptimizer/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend
├── ml-models/          # AI/ML models and training scripts
├── docs/              # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Redis 6+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Portfoliooptimizer
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Variables**
Create `.env` files in both frontend and backend directories with necessary API keys and database credentials.

5. **Run the Application**
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

## 🎯 Features

### Core Features
- ✅ Portfolio optimization using Modern Portfolio Theory
- ✅ **Live news aggregation from multiple sources** 🆕
- ✅ **Sentiment analysis on news articles** 🆕
- ✅ **News-driven price predictions** 🆕
- ✅ Real-time market data integration
- ✅ Risk analysis and metrics
- ✅ Performance tracking and analytics
- ✅ AI-powered stock recommendations (enhanced with news)
- ✅ Predictive market analysis (enhanced with sentiment)
- ✅ Tax optimization strategies
- ✅ Security monitoring and fraud detection

### Advanced Features
- 🔄 Real-time portfolio rebalancing
- 📊 Advanced charting and visualization
- 🔔 Smart alerts and notifications
- 📱 Responsive design (mobile-friendly)
- 🌐 Multi-currency support
- 📈 Backtesting capabilities

## 🔒 Security Features

- End-to-end encryption
- Two-factor authentication
- Real-time fraud detection
- Secure API endpoints
- Rate limiting
- Input validation and sanitization

## 📊 AI/ML Capabilities

1. **Portfolio Optimization**: Genetic algorithms and gradient descent
2. **Price Prediction**: LSTM and Transformer models
3. **Risk Assessment**: Monte Carlo simulations
4. **Sentiment Analysis**: NLP models for news and social media
5. **Anomaly Detection**: Isolation Forest and Autoencoders

## 🎨 UI/UX Highlights

- Modern, clean interface inspired by Zerodha and AngelOne
- Intuitive navigation
- Real-time data updates
- Interactive charts and graphs
- Dark mode support
- Responsive design

## 📈 Performance Metrics

- Portfolio performance tracking
- Risk-adjusted returns (Sharpe, Sortino ratios)
- Drawdown analysis
- Sector allocation
- Geographic diversification

## 🤝 Contributing

This is a hackathon project. Contributions and suggestions are welcome!

## 📝 License

This project is created for CodeAThon hackathon.

## 👥 Team

- PARTH SARDESHMUKH

---

**Built with ❤️ for CodeAThon Hackathon**

