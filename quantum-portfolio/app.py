from flask import Flask, render_template, jsonify, request
import yfinance as yf
import random
from datetime import datetime
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

@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')

@app.route('/api/live/<stock>')
def live_price(stock):
    """Fetch live price for Indian Stocks using yfinance"""
    ticker = INDIAN_STOCKS.get(stock.upper(), stock)
    
    try:
        # Use fast info or history
        stock_obj = yf.Ticker(ticker)
        # Fast Access to data
        data = stock_obj.fast_info
        price = data.last_price
        prev_close = data.previous_close
        
        change = price - prev_close
        percent = (change / prev_close) * 100
        
        return jsonify({
            'symbol': stock.upper(),
            'price': round(price, 2),
            'change': round(change, 2),
            'percent': round(percent, 2),
            'currency': '₹'
        })
    except Exception as e:
        # Fallback Simulation if API fails (common for free yfinance in high freq)
        base_price = {
            "RELIANCE": 2500, "TCS": 3500, "NIFTY": 24000, "SENSEX": 80000
        }.get(stock.upper(), 1000)
        
        sim_price = base_price * (1 + (random.random() - 0.5) * 0.02)
        return jsonify({
            'symbol': stock.upper(),
            'price': round(sim_price, 2),
            'change': round(sim_price * 0.01, 2),
            'percent': 1.05,
            'currency': '₹',
            'note': 'simulated'
        })

@app.route('/api/optimize', methods=['GET'])
def optimize_portfolio():
    """Simulate RL Optimization"""
    # In a real app, this would use the PPO model from models/rl_model.py
    # Here we simulate the AI proposing a new weight distribution
    
    strategies = [
        {"name": "Aggressive Alpha", "weights": [0.40, 0.30, 0.20, 0.10]},  # SmallCap, MidCap, Crypto, Bluechip
        {"name": "Balanced Growth", "weights": [0.30, 0.30, 0.30, 0.10]},
        {"name": "Quantum Safe Defense", "weights": [0.10, 0.20, 0.50, 0.20]} # Gold/Stable heavy
    ]
    
    strategy = random.choice(strategies)
    reasoning = [
        "Detected bullish sentiment in IT Sector.",
        "RBI Policy stability favors Banking stocks.",
        "Global volatility triggered defensive rotation to Gold."
    ]
    
    return jsonify({
        'weights': strategy['weights'],
        'strategy_name': strategy['name'],
        'reasoning': random.choice(reasoning),
        'alpha': round(random.uniform(1.5, 4.0), 2)  # Predicted Alpha
    })

@app.route('/api/analyze', methods=['POST'])
def analyze_user():
    """Analyze User Profile for recommendations (Onboarding)"""
    data = request.json
    risk = data.get('risk', 'Medium')
    
    if risk == 'High':
        return jsonify({
            'allocation': ['Small Cap', 'Crypto', 'Mid Cap', 'Bluechip'],
            'weights': [40, 20, 30, 10],
            'note': 'High Risk - High Reward'
        })
    elif risk == 'Low':
        return jsonify({
            'allocation': ['Gold', 'Debt', 'Index Fund', 'Bluechip'],
            'weights': [30, 40, 20, 10],
            'note': 'Wealth Preservation'
        })
    else:
        return jsonify({
            'allocation': ['Bluechip', 'Flexi Cap', 'Gold', 'Bonds'],
            'weights': [40, 30, 20, 10],
            'note': 'Balanced Growth'
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
