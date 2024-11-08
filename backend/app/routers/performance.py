# backend/app/routers/performance.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy import func
from database import get_db
from models import Execution, Search, CompetitorAppearance, Competitor

router = APIRouter(
    prefix="/performance",
    tags=["performance"]
)

@router.get("/daily-stats")
async def get_daily_stats(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    """Obtém estatísticas diárias de desempenho."""
    if not start_date:
        start_date = datetime.now() - timedelta(days=30)
    if not end_date:
        end_date = datetime.now()

    stats = db.query(
        func.date(Execution.start_time).label('date'),
        func.count(Execution.id).label('total_executions'),
        func.sum(Execution.total_searches).label('total_searches'),
        func.sum(Execution.total_clicks).label('total_clicks'),
        func.sum(Execution.total_lidery_found).label('total_lidery')
    ).filter(
        Execution.start_time.between(start_date, end_date)
    ).group_by(
        func.date(Execution.start_time)
    ).all()

    return [
        {
            "date": stat.date.isoformat(),
            "total_executions": stat.total_executions,
            "total_searches": stat.total_searches or 0,
            "total_clicks": stat.total_clicks or 0,
            "total_lidery": stat.total_lidery or 0
        }
        for stat in stats
    ]

@router.get("/lidery-positions")
async def get_lidery_positions(
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Obtém estatísticas de posicionamento da Lidery."""
    start_date = datetime.now() - timedelta(days=days)
    
    positions = db.query(
        Search.lidery_position,
        func.count(Search.id).label('count')
    ).filter(
        Search.timestamp >= start_date,
        Search.lidery_position.isnot(None)
    ).group_by(
        Search.lidery_position
    ).all()

    return [
        {
            "position": pos.lidery_position,
            "count": pos.count,
            "percentage": pos.count * 100 / sum(p.count for p in positions)
        }
        for pos in positions
    ]

@router.get("/execution-calendar")
async def get_execution_calendar(
    year: int = datetime.now().year,
    month: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Obtém dados de execução para visualização em calendário."""
    query = db.query(
        func.date(Execution.start_time).label('date'),
        func.count(Execution.id).label('executions')
    ).filter(
        func.extract('year', Execution.start_time) == year
    )

    if month:
        query = query.filter(func.extract('month', Execution.start_time) == month)

    data = query.group_by(
        func.date(Execution.start_time)
    ).all()

    return [
        {
            "date": date.date.isoformat(),
            "executions": date.executions
        }
        for date in data
    ]