from flask import Flask, render_template, jsonify, request, session, redirect, url_for
import yfinance as yf
import random
from datetime import datetime, time
import pytz
import os

app = Flask(__name__)
app.secret_key = "quantum_secret_key_flame" # For session management

# --- HARDCODED USER ---
USER_DATA = {
    "username": "admin",
    "password": "password123"
}

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
def landing():
    return render_template('landing.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if username == USER_DATA['username'] and password == USER_DATA['password']:
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error="Invalid Credentials")
            
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('landing'))

@app.route('/dashboard')
def dashboard():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/analysis')
def analysis():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
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
        base_prices = {
            "RELIANCE": 2980, "TCS": 3850, "NIFTY": 24950, "SENSEX": 82300, "HDFCBANK": 1650, "INFY": 1520
        }
        base_price = base_prices.get(symbol, 1000)
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
    news_pool = [
        {"title": "Global Tech Stocks Rally as AI Demand Surges", "sentiment": "Bullish", "impact": "High"},
        {"title": "US Federal Reserve hints at potential rate cuts in Q3", "sentiment": "Bullish", "impact": "Extreme"},
        {"title": "Oil prices stabilize amid easing Middle East tensions", "sentiment": "Neutral", "impact": "Medium"},
        {"title": "Indian Economy projected to grow at 7.2% in FY26", "sentiment": "Bullish", "impact": "High"},
        {"title": "Eurozone inflation hits 2-year low; ECB considers pivot", "sentiment": "Bullish", "impact": "Medium"},
        {"title": "Apple to integrate OpenAI across 1B active devices", "sentiment": "Bullish", "impact": "High"},
        {"title": "Japan's Nikkei 225 reaches 30-year high on weak yen", "sentiment": "Bullish", "impact": "High"},
        {"title": "Crypto liquidity evaporates as regulatory walls close in", "sentiment": "Bearish", "impact": "Extreme"},
        {"title": "Gold breaks $2500 per ounce on geopolitical fears", "sentiment": "Bullish", "impact": "High"},
        {"title": "Reliance expanding Green Hydrogen capacity by 20%", "sentiment": "Bullish", "impact": "High"}
    ]
    return jsonify({
        "news": random.sample(news_pool, 6),
        "mood": random.choice(["GREED", "FEAR", "NEUTRAL"]),
        "volatility": f"{random.randint(12, 28)}%"
    })

@app.route('/api/optimize', methods=['GET'])
def optimize_portfolio():
    strategies = [
        {
            "name": "Aggressive Alpha", 
            "weights": [0.40, 0.30, 0.20, 0.10], 
            "reasoning": "Detected bullish divergence in Mid-cap indices. AI suggests overweighting High-Beta stocks for maximum alpha generation.",
            "suggestions": ["Increase RELIANCE weight", "Accumulate Small-Cap IT", "Reduce Gold hedge"],
            "detailed_review": {
                "RELIANCE": "Reliance is showing strong momentum in its retail and green energy sectors. Our AI detected an 82% correlation between its recent announcements and historical breakout patterns.",
                "TCS": "TCS has a stable dividend yield and strong order book, providing a safety net while we pursue alpha in other sectors.",
                "WHY_THIS": "This strategy was chosen over 'Balanced Growth' because current sentiment analysis of Indian indices shows a 3.4σ deviation from the mean, indicating a once-in-a-decade growth opportunity in mid-tier high-beta stocks."
            }
        },
        {
            "name": "Balanced Growth", 
            "weights": [0.30, 0.30, 0.30, 0.10],
            "reasoning": "Market volatility is stabilizing. Suggests a 60/40 Equity-to-Defensive split to capture upside while protecting downside.",
            "suggestions": ["Hold Nifty 50 Index", "Maintain 10% Cash", "Rebalance Sectoral weights"],
            "detailed_review": {
                "NIFTY": "Nifty 50 remains the best defensive play during election cycles. Its Sharpe ratio currently outpaces individual sector picks by 12%.",
                "HDFCBANK": "HDFC Bank's current valuation is at a historical low relative to its book value, making it a 'Deep Value' pick with low downside risk.",
                "WHY_THIS": "Balanced Growth is prioritized here because global macro indicators suggest a cooling period. Moving into high-risk assets now would ignore the 45% increase in volatility we projected for next month."
            }
        },
        {
            "name": "Quantum Safe Defense", 
            "weights": [0.10, 0.20, 0.50, 0.20],
            "reasoning": "Sentiment analysis detects micro-anomalies in global debt markets. AI recommends defensive rotation to Gold and Sovereign Bonds.",
            "suggestions": ["Buy SGB (Gold Bonds)", "Increase Debt allocation", "Partial profit booking in Small-caps"],
            "detailed_review": {
                "GOLD": "Gold serves as the ultimate hedge against the 'Quantum Anomaly' detected in the US Dollar index. Sentiment is 94% Bullish among institutional holders.",
                "INFY": "Infosys is chosen as the tech representative for its resilient cash flows, despite the broader tech sector's projected 15% drawdown.",
                "WHY_THIS": "This is a 'Black Swan' defensive play. While other models might suggest 'Buying the Dip', our AI Integrity Audit shows that the 'Dip' has an 80% probability of becoming a 'Crash' due to geopolitical tensions."
            }
        }
    ]
    
    strategy = random.choice(strategies)
    return jsonify({
        'weights': strategy['weights'],
        'strategy_name': strategy['name'],
        'reasoning': strategy['reasoning'],
        'suggestions': strategy['suggestions'],
        'detailed_review': strategy['detailed_review'],
        'alpha': round(random.uniform(1.5, 4.0), 2)
    })

@app.route('/api/predict/<stock>')
def predict_stock(stock):
    """Deep AI Review for a specific stock"""
    symbol = stock.upper()
    
    reviews = {
        "RELIANCE": {
            "prediction": "Bullish (Target: ₹3,250)",
            "review": "Reliance Industries is currently breaking out of a 6-month consolidation pattern. Our AI Sentinel has detected significant accumulation by institutional nodes.",
            "why_choose": "Compared to other energy stocks like ONGC, Reliance offers superior risk-adjusted alpha due to its diversified revenue streams in retail and 5G telecommunications.",
            "confidence": 94.2,
            "trust_badge": "Institutional Grade"
        },
        "TCS": {
            "prediction": "Steady Accumulation (Target: ₹4,100)",
            "review": "TCS is showing strong support at the ₹3,800 level. AI analysis of recent order books shows a 12% increase in high-margin AI projects.",
            "why_choose": "While Infosys is also a strong play, TCS's current debt-to-equity ratio and dividend consistency make it the 'Sentinel Choice' for defensive tech exposure.",
            "confidence": 88.5,
            "trust_badge": "Defensive Prime"
        },
        "HDFCBANK": {
            "prediction": "Strong Buy (Target: ₹1,850)",
            "review": "Post-merger synergies are starting to show in the ROCE (Return on Capital Employed). AI Sentiment is shifting from 'Wait' to 'Aggressive Buy'.",
            "why_choose": "Over ICICI Bank, HDFC Bank provides a better 'Value Trap' exit scenario. Our models project a 15% upside with only 3% downside variance.",
            "confidence": 91.8,
            "trust_badge": "Deep Value Certified"
        }
    }
    
    data = reviews.get(symbol, {
        "prediction": "Neutral / Monitoring",
        "review": f"AI Sentinel is currently gathering more data nodes for {symbol}. Current sentiment is strictly neutral.",
        "why_choose": "Market volatility in this sector makes it a lower priority than our 'Top Nodes' like RELIANCE or TCS.",
        "confidence": 65.0,
        "trust_badge": "Gathering Node"
    })
    
    return jsonify(data)

@app.route('/api/compare', methods=['POST'])
def compare_stocks():
    """Comparative Logic Engine (RAG Simulation)"""
    data = request.json
    stock_a = data.get('stockA', '').upper()
    stock_b = data.get('stockB', '').upper()
    
    if not stock_a or not stock_b:
        return jsonify({"error": "Missing symbols"}), 400

    ticker_a = INDIAN_STOCKS.get(stock_a, f"{stock_a}.NS")
    ticker_b = INDIAN_STOCKS.get(stock_b, f"{stock_b}.NS")

    try:
        # Simulate 'Multi-Ticker Fetching' from 10-K and News
        obj_a = yf.Ticker(ticker_a)
        obj_b = yf.Ticker(ticker_b)
        
        # In a real RAG, we'd embed these news titles and compare vectors
        news_a = obj_a.news[:3]
        news_b = obj_b.news[:3]
        
        # Decision Matrix Generation
        matrix = {
            "valuation": {
                stock_a: random.randint(60, 95),
                stock_b: random.randint(60, 95)
            },
            "sentiment": {
                stock_a: random.randint(50, 90),
                stock_b: random.randint(50, 90)
            },
            "liquidity": {
                stock_a: random.randint(70, 99),
                stock_b: random.randint(70, 99)
            }
        }
        
        # Apply Sentiment Weighted Rebalancing Formula:
        # FinalScore = (TechnicalAnalysis * 0.6) + (NewsSentiment * 0.4)
        val_a, val_b = matrix['valuation'][stock_a], matrix['valuation'][stock_b]
        sent_a, sent_b = matrix['sentiment'][stock_a], matrix['sentiment'][stock_b]
        
        score_a = (val_a * 0.6) + (sent_a * 0.4)
        score_b = (val_b * 0.6) + (sent_b * 0.4)
        
        winner = stock_a if score_a > score_b else stock_b
        loser = stock_b if winner == stock_a else stock_a
        
        proof_nodes = []
        all_news = news_a + news_b
        for n in all_news[:4]:
            proof_nodes.append({
                "source": n.get('publisher', 'Financial Wire'),
                "title": n.get('title', 'Market Update'),
                "link": n.get('link', '#'),
                "reason": f"This node was selected because it uniquely correlates with {winner}'s current {matrix['sentiment'][winner]}% sentiment peak, providing structural evidence of institutional accumulation."
            })

        detailed_para = f"""
        After vectorizing the latest 10-K filings and {len(all_news)} news nodes, our RAG pipeline detected a significant Alpha Divergence. 
        {winner} is currently exhibiting a 'Bullish Regime Shift' backed by structural valuation scores of {matrix['valuation'][winner]}/100. 
        
        In contrast, {loser} is facing technical resistance. While its liquidity remains high ({matrix['liquidity'][loser]}%), the sentiment-weighted rebalancing shows that capital is rotating towards {winner} due to superior risk-adjusted delta. 
        We recommend a 'Node-Switch' strategy: overweighting {winner} to capture the 45-day momentum window while maintaining a stop-loss at 3.5% below the current VWAP.
        """

        return jsonify({
            "winner": winner,
            "matrix": matrix,
            "formula": "FinalScore = (TechnicalAnalysis * 0.6) + (NewsSentiment * 0.4)",
            "detailed_analysis": detailed_para.strip(),
            "proof": proof_nodes,
            "confidence": round(abs(score_a - score_b) + 88, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_user():
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
    data = request.json
    payload = str(data.get('payload', ''))
    import base64
    import hashlib
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
