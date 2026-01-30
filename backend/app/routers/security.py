"""Security and fraud detection router"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Transaction
from app.routers.auth import get_current_user
from app.schemas import SecurityAlert
from app.services.fraud_detection import detect_fraud, analyze_transaction

router = APIRouter()


@router.get("/alerts", response_model=List[SecurityAlert])
async def get_security_alerts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get security alerts for user"""
    # Get suspicious transactions
    suspicious_transactions = db.query(Transaction).filter(
        Transaction.portfolio.has(user_id=current_user.id),
        Transaction.is_suspicious == True
    ).all()
    
    alerts = []
    for transaction in suspicious_transactions:
        alerts.append(SecurityAlert(
            alert_type="SUSPICIOUS_TRANSACTION",
            severity="HIGH",
            message=f"Suspicious transaction detected: {transaction.transaction_type} {transaction.quantity} {transaction.symbol}",
            timestamp=transaction.transaction_date,
            transaction_id=transaction.id
        ))
    
    return alerts


@router.post("/analyze-transaction/{transaction_id}")
async def analyze_transaction_security(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze transaction for fraud"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.portfolio.has(user_id=current_user.id)
    ).first()
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    risk_score = await analyze_transaction(transaction)
    transaction.risk_score = risk_score
    transaction.is_suspicious = risk_score > 0.7
    
    db.commit()
    
    return {
        "transaction_id": transaction_id,
        "risk_score": risk_score,
        "is_suspicious": transaction.is_suspicious,
        "recommendation": "REVIEW" if transaction.is_suspicious else "SAFE"
    }

