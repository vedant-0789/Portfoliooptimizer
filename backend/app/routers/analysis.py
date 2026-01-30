"""Portfolio analysis router"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np
import pandas as pd

from app.database import get_db
from app.models import User, Portfolio, Holding
from app.routers.auth import get_current_user
from app.schemas import RiskMetrics, PerformanceMetrics, OptimizationRequest, OptimizationResponse
from app.services.market_data import get_stock_data
from app.services.portfolio_optimizer import optimize_portfolio

router = APIRouter()


@router.get("/{portfolio_id}/risk", response_model=RiskMetrics)
async def get_risk_metrics(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate risk metrics for portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    holdings = portfolio.holdings
    if not holdings:
        raise HTTPException(status_code=400, detail="Portfolio has no holdings")
    
    # Get historical data for all holdings
    symbols = [h.symbol for h in holdings]
    returns_data = {}
    
    for symbol in symbols:
        try:
            data = await get_stock_data(symbol, period="1y")
            prices = data["prices"]
            returns = np.diff(prices) / prices[:-1]
            returns_data[symbol] = returns
        except:
            continue
    
    if not returns_data:
        raise HTTPException(status_code=400, detail="Unable to fetch market data")
    
    # Calculate portfolio weights
    total_value = sum(h.total_value for h in holdings)
    weights = {h.symbol: h.total_value / total_value for h in holdings if h.symbol in returns_data}
    
    # Calculate portfolio returns
    min_length = min(len(returns) for returns in returns_data.values())
    portfolio_returns = np.zeros(min_length)
    for symbol, returns in returns_data.items():
        if symbol in weights:
            portfolio_returns += weights[symbol] * returns[:min_length]
    
    # Calculate metrics
    mean_return = np.mean(portfolio_returns) * 252  # Annualized
    std_return = np.std(portfolio_returns) * np.sqrt(252)  # Annualized volatility
    
    # Sharpe Ratio (assuming risk-free rate of 0.05)
    risk_free_rate = 0.05
    sharpe_ratio = (mean_return - risk_free_rate) / std_return if std_return > 0 else 0
    
    # Sortino Ratio (only downside deviation)
    downside_returns = portfolio_returns[portfolio_returns < 0]
    downside_std = np.std(downside_returns) * np.sqrt(252) if len(downside_returns) > 0 else std_return
    sortino_ratio = (mean_return - risk_free_rate) / downside_std if downside_std > 0 else 0
    
    # Beta (simplified - would need market data)
    beta = 1.0  # Placeholder
    
    # Alpha (simplified)
    alpha = mean_return - (risk_free_rate + beta * (mean_return - risk_free_rate))
    
    # VaR (95% confidence)
    var_95 = np.percentile(portfolio_returns, 5) * np.sqrt(252)
    
    # Max Drawdown
    cumulative = np.cumprod(1 + portfolio_returns)
    running_max = np.maximum.accumulate(cumulative)
    drawdown = (cumulative - running_max) / running_max
    max_drawdown = np.min(drawdown)
    
    return RiskMetrics(
        sharpe_ratio=float(sharpe_ratio),
        sortino_ratio=float(sortino_ratio),
        beta=float(beta),
        alpha=float(alpha),
        var_95=float(var_95),
        max_drawdown=float(max_drawdown),
        volatility=float(std_return)
    )


@router.get("/{portfolio_id}/performance", response_model=PerformanceMetrics)
async def get_performance_metrics(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate performance metrics for portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    # Calculate returns
    total_return = (portfolio.current_value - portfolio.initial_capital) / portfolio.initial_capital
    annualized_return = total_return  # Simplified
    
    return PerformanceMetrics(
        total_return=float(total_return),
        annualized_return=float(annualized_return),
        cumulative_return=float(total_return),
        best_day=0.0,  # Would need daily data
        worst_day=0.0  # Would need daily data
    )


@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_portfolio_weights(
    request: OptimizationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Optimize portfolio using Modern Portfolio Theory"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == request.portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    result = await optimize_portfolio(portfolio, request.risk_tolerance)
    return result

