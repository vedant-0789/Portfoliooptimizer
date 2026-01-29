"""Portfolio optimization service using Modern Portfolio Theory"""

import numpy as np
from scipy.optimize import minimize
from app.models import Portfolio
from app.services.market_data import get_stock_data
from app.schemas import OptimizationResponse


async def optimize_portfolio(portfolio: Portfolio, risk_tolerance: float) -> OptimizationResponse:
    """Optimize portfolio weights using Modern Portfolio Theory"""
    holdings = portfolio.holdings
    if not holdings:
        raise ValueError("Portfolio has no holdings")
    
    symbols = [h.symbol for h in holdings]
    
    # Get historical returns
    returns_data = []
    valid_symbols = []
    
    for symbol in symbols:
        try:
            data = await get_stock_data(symbol, period="1y")
            prices = data["prices"]
            returns = np.diff(prices) / prices[:-1]
            returns_data.append(returns)
            valid_symbols.append(symbol)
        except:
            continue
    
    if not returns_data:
        raise ValueError("Unable to fetch market data")
    
    # Align returns to same length
    min_length = min(len(r) for r in returns_data)
    returns_matrix = np.array([r[:min_length] for r in returns_data])
    
    # Calculate expected returns and covariance matrix
    mean_returns = np.mean(returns_matrix, axis=1) * 252  # Annualized
    cov_matrix = np.cov(returns_matrix) * 252  # Annualized
    
    # Current weights
    total_value = sum(h.total_value for h in holdings if h.symbol in valid_symbols)
    current_weights = np.array([
        h.total_value / total_value for h in holdings if h.symbol in valid_symbols
    ])
    
    # Objective function: maximize Sharpe ratio (minimize negative Sharpe)
    risk_free_rate = 0.05
    
    def objective(weights):
        portfolio_return = np.sum(mean_returns * weights)
        portfolio_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        sharpe = (portfolio_return - risk_free_rate) / portfolio_std if portfolio_std > 0 else 0
        return -sharpe  # Minimize negative Sharpe
    
    # Constraints
    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}
    
    # Bounds: weights between 0 and 1
    bounds = tuple((0, 1) for _ in range(len(valid_symbols)))
    
    # Risk tolerance constraint
    def risk_constraint(weights):
        portfolio_std = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
        max_risk = risk_tolerance * np.sqrt(np.dot(current_weights.T, np.dot(cov_matrix, current_weights)))
        return max_risk - portfolio_std
    
    constraints_list = [constraints]
    if risk_tolerance < 1.0:
        constraints_list.append({'type': 'ineq', 'fun': risk_constraint})
    
    # Optimize
    result = minimize(
        objective,
        current_weights,
        method='SLSQP',
        bounds=bounds,
        constraints=constraints_list
    )
    
    optimal_weights = result.x
    optimal_weights_dict = {symbol: float(weight) for symbol, weight in zip(valid_symbols, optimal_weights)}
    
    # Calculate expected return and risk
    expected_return = float(np.sum(mean_returns * optimal_weights))
    expected_risk = float(np.sqrt(np.dot(optimal_weights.T, np.dot(cov_matrix, optimal_weights))))
    sharpe_ratio = float((expected_return - risk_free_rate) / expected_risk) if expected_risk > 0 else 0
    
    # Generate recommendations
    recommendations = []
    for symbol, current_w, optimal_w in zip(valid_symbols, current_weights, optimal_weights):
        if abs(optimal_w - current_w) > 0.05:  # Significant difference
            action = "INCREASE" if optimal_w > current_w else "DECREASE"
            recommendations.append({
                "symbol": symbol,
                "action": action,
                "current_weight": float(current_w),
                "recommended_weight": float(optimal_w),
                "change": float(optimal_w - current_w)
            })
    
    return OptimizationResponse(
        optimal_weights=optimal_weights_dict,
        expected_return=expected_return,
        expected_risk=expected_risk,
        sharpe_ratio=sharpe_ratio,
        recommendations=recommendations
    )

