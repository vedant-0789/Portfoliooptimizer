"""Pydantic schemas for request/response validation"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Portfolio Schemas
class PortfolioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    initial_capital: float


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    initial_capital: float
    current_value: float
    created_at: datetime

    class Config:
        from_attributes = True


# Holding Schemas
class HoldingCreate(BaseModel):
    symbol: str
    quantity: float
    average_price: float


class HoldingResponse(BaseModel):
    id: int
    symbol: str
    quantity: float
    average_price: float
    current_price: float
    total_value: float

    class Config:
        from_attributes = True


# Analysis Schemas
class RiskMetrics(BaseModel):
    sharpe_ratio: float
    sortino_ratio: float
    beta: float
    alpha: float
    var_95: float
    max_drawdown: float
    volatility: float


class PerformanceMetrics(BaseModel):
    total_return: float
    annualized_return: float
    cumulative_return: float
    best_day: float
    worst_day: float


class OptimizationRequest(BaseModel):
    portfolio_id: int
    risk_tolerance: float  # 0.0 to 1.0
    time_horizon: int  # in days
    constraints: Optional[Dict[str, Any]] = None


class OptimizationResponse(BaseModel):
    optimal_weights: Dict[str, float]
    expected_return: float
    expected_risk: float
    sharpe_ratio: float
    recommendations: List[Dict[str, Any]]


# Prediction Schemas
class PredictionRequest(BaseModel):
    symbol: str
    days_ahead: int = 7


class PredictionResponse(BaseModel):
    symbol: str
    current_price: float
    predicted_price: float
    confidence: float
    predictions: List[Dict[str, float]]


# Recommendation Schemas
class RecommendationResponse(BaseModel):
    symbol: str
    recommendation: str  # 'BUY', 'SELL', 'HOLD'
    confidence: float
    reasoning: str
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None


# Security Schemas
class SecurityAlert(BaseModel):
    alert_type: str
    severity: str
    message: str
    timestamp: datetime
    transaction_id: Optional[int] = None

