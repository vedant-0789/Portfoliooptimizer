from flask import Flask, render_template, jsonify, request
import yfinance as yf
import random
from datetime import datetime, time
import pytz
import os

app = Flask(__name__)

# --- CONFIGURATION ---
INDIAN_STOCKS = {
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "INFY": "INFY.NS",
    "NIFTY": "^NSEI",
    "SENSEX": "^BSESN"
}

def is_market_open():
    """Check if Indian Market is currently open (9:15 AM - 3:30 PM IST, Mon-Fri)"""
    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    
    # Check weekend
    if now.weekday() >= 5:
        return False
        
    market_start = time(9, 15)
    market_end = time(15, 30)
    current_time = now.time()
    
    return market_start <= current_time <= market_end

@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route('/api/market-status')
def market_status():
    open_status = is_market_open()
    ist = pytz.timezone('Asia/Kolkata')
    now = datetime.now(ist)
    return jsonify({
        'is_open': open_status,
        'status': "LIVE" if open_status else "MARKET CLOSED",
        'timestamp': now.isoformat(),
        'next_session': "Monday 09:15 AM" if now.weekday() >= 4 else "Tomorrow 09:15 AM"
    })

@app.route('/api/live/<stock>')
def live_price(stock):
    """Fetch live price for Indian Stocks using yfinance with robust fallbacks"""
    ticker_map = {
        "NIFTY": "^NSEI",
        "SENSEX": "^BSESN",
        "RELIANCE": "RELIANCE.NS",
        "TCS": "TCS.NS",
        "HDFCBANK": "HDFCBANK.NS",
        "INFY": "INFY.NS"
    }
    symbol = stock.upper()
    ticker = ticker_map.get(symbol, f"{symbol}.NS")
    market_open = is_market_open()
    
    try:
        stock_obj = yf.Ticker(ticker)
        # Try both fast_info and history as fallbacks
        price = 0
        prev_close = 0
        
        try:
            info = stock_obj.fast_info
            price = info.last_price
            prev_close = info.previous_close
        except:
            hist = stock_obj.history(period="2d")
            if not hist.empty:
                price = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0]
        
        if price == 0 or prev_close == 0:
            raise ValueError("Data not available")

        change = price - prev_close
        percent = (change / prev_close) * 100
            
        return jsonify({
            'symbol': symbol,
            'price': round(price, 2),
            'change': round(change, 2),
            'percent': round(percent, 2),
            'currency': '₹',
            'is_live': market_open
        })
    except Exception as e:
        # Fallback simulation with more accurate real market figures
        base_prices = {
            "RELIANCE": 2980, "TCS": 3850, "NIFTY": 24950, "SENSEX": 82300, "HDFCBANK": 1650, "INFY": 1520
        }
        base_price = base_prices.get(symbol, 1000)
        
        # Micro-fluctuation for demo if market is open
        fluctuation = (random.random() - 0.5) * 0.002 if market_open else 0
        sim_price = base_price * (1 + fluctuation)
        
        return jsonify({
            'symbol': symbol,
            'price': round(sim_price, 2),
            'change': round(sim_price * 0.001, 2),
            'percent': 0.15,
            'currency': '₹',
            'note': 'simulated',
            'is_live': market_open
        })

@app.route('/api/news')
def get_news():
    """Simulated Global & Google News with Sentiment"""
    news_pool = [
        {"title": "Global Tech Stocks Rally as AI Demand Surges", "sentiment": "Bullish", "impact": "High"},
        {"title": "US Federal Reserve hints at potential rate cuts in Q3", "sentiment": "Bullish", "impact": "Extreme"},
        {"title": "Oil prices stabilize amid easing Middle East tensions", "sentiment": "Neutral", "impact": "Medium"},
        {"title": "Indian Economy projected to grow at 7.2% in FY26", "sentiment": "Bullish", "impact": "High"},
        {"title": "Eurozone inflation hits 2-year low; ECB considers pivot", "sentiment": "Bullish", "impact": "Medium"},
        {"title": "Global Logistics Hub in Mumbai attracts $5B investment", "sentiment": "Bullish", "impact": "High"},
        {"title": "Tesla faces investigation over autopilot software", "sentiment": "Bearish", "impact": "Medium"},
        {"title": "Reliance expanding Green Hydrogen capacity by 20%", "sentiment": "Bullish", "impact": "High"}
    ]
    # Return 6 random news
    return jsonify(random.sample(news_pool, 6))

@app.route('/api/optimize', methods=['GET'])
def optimize_portfolio():
    """Simulate RL Optimization with detailed suggestions"""
    strategies = [
        {
            "name": "Aggressive Alpha", 
            "weights": [0.40, 0.30, 0.20, 0.10], 
            "reasoning": "Detected bullish divergence in Mid-cap indices. AI suggests overweighting High-Beta stocks for maximum alpha generation.",
            "suggestions": ["Increase RELIANCE weight", "Accumulate Small-Cap IT", "Reduce Gold hedge"]
        },
        {
            "name": "Balanced Growth", 
            "weights": [0.30, 0.30, 0.30, 0.10],
            "reasoning": "Market volatility is stabilizing. Suggests a 60/40 Equity-to-Defensive split to capture upside while protecting downside.",
            "suggestions": ["Hold Nifty 50 Index", "Maintain 10% Cash", "Rebalance Sectoral weights"]
        },
        {
            "name": "Quantum Safe Defense", 
            "weights": [0.10, 0.20, 0.50, 0.20],
            "reasoning": "Sentiment analysis detects micro-anomalies in global debt markets. AI recommends defensive rotation to Gold and Sovereign Bonds.",
            "suggestions": ["Buy SGB (Gold Bonds)", "Increase Debt allocation", "Partial profit booking in Small-caps"]
        }
    ]
    
    strategy = random.choice(strategies)
    return jsonify({
        'weights': strategy['weights'],
        'strategy_name': strategy['name'],
        'reasoning': strategy['reasoning'],
        'suggestions': strategy['suggestions'],
        'alpha': round(random.uniform(1.5, 4.0), 2)
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_user():
    """Analyze User Profile for recommendations"""
    data = request.json
    risk = data.get('risk', 'Medium')
    
    if risk == 'High':
        return jsonify({
            'allocation': ['Small Cap', 'Crypto', 'Mid Cap', 'Bluechip'],
            'weights': [40, 20, 30, 10],
            'prediction': 'High volatility expected. Target 18-22% annual returns.',
            'tip': 'Use Stop-Loss at 5% for speculative positions.'
        })
    elif risk == 'Low':
        return jsonify({
            'allocation': ['Gold', 'Debt', 'Index Fund', 'Bluechip'],
            'weights': [30, 40, 20, 10],
            'prediction': 'Stable growth. Target 8-10% annual returns beating inflation.',
            'tip': 'Focus on Dividend-paying stocks for passive income.'
        })
    else:
        return jsonify({
            'allocation': ['Bluechip', 'Flexi Cap', 'Gold', 'Bonds'],
            'weights': [40, 30, 20, 10],
            'prediction': 'Consistent wealth creation. Target 12-15% annual returns.',
            'tip': 'Monthly SIP is recommended for this risk profile.'
        })

@app.route('/api/monte-carlo')
def monte_carlo():
    """Simulate Monte Carlo path for portfolio"""
    days = 252
    iterations = 50
    start_price = 100
    
    paths = []
    for _ in range(iterations):
        path = [start_price]
        current_price = start_price
        for _ in range(days):
            daily_return = (0.05 / 252) + (0.1 / (252**0.5)) * random.normalvariate(0, 1)
            current_price *= (1 + daily_return)
            path.append(round(current_price, 2))
        paths.append(path)
        
    return jsonify({
        'paths': paths,
        'labels': list(range(days + 1))
    })

@app.route('/api/quantum-shield', methods=['POST'])
def quantum_shield():
    """Simulate Post-Quantum Cryptography Encryption"""
    data = request.json
    payload = str(data.get('payload', ''))
    
    # Simulate Lattice-based encryption by obfuscating the payload
    import base64
    import hashlib
    
    # Simple 'quantum' obfuscation
    salt = "LATTICE_SALT_256"
    pseudo_encrypted = base64.b64encode(hashlib.sha256((payload + salt).encode()).digest()).decode()
    
    return jsonify({
        'status': 'Quantum Secure',
        'algorithm': 'Dilithium-5 / Kyber-1024',
        'signature': f"sig_q_{pseudo_encrypted[:16]}...",
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
