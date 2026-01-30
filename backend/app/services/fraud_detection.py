"""Fraud detection and security analysis service"""

from app.models import Transaction
import numpy as np


async def detect_fraud(transaction: Transaction) -> bool:
    """Detect if transaction is fraudulent"""
    risk_score = await analyze_transaction(transaction)
    return risk_score > 0.7


async def analyze_transaction(transaction: Transaction) -> float:
    """Analyze transaction and return risk score (0.0 to 1.0)"""
    risk_score = 0.0
    
    # Check for unusual transaction size
    if transaction.total_amount > 100000:  # Large transaction
        risk_score += 0.2
    
    # Check for unusual quantity
    if transaction.quantity > 10000:  # Large quantity
        risk_score += 0.15
    
    # Check for rapid transactions (would need transaction history)
    # This is simplified - in production, would check user's transaction history
    
    # Price deviation check (would need current market price)
    # If transaction price deviates significantly from market, increase risk
    
    # Time-based checks (would need user's typical trading patterns)
    
    return min(1.0, risk_score)

