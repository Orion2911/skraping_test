# backend/app/routers/competition.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy import func
from database import get_db
from models import Competitor, CompetitorAppearance, Search, Keyword

router = APIRouter(
    prefix="/competition",
    tags=["competition"]
)

@router.get("/top-competitors")
async def get_top_competitors(
    limit: int = 10,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Obtém os principais competidores."""
    start_date = datetime.now() - timedelta(days=days)
    
    competitors = db.query(
        Competitor,
        func.count(CompetitorAppearance.id).label('appearances'),
        func.avg(CompetitorAppearance.position).label('avg_position')
    ).join(
        CompetitorAppearance
    ).join(
        Search
    ).filter(
        Search.timestamp >= start_date
    ).group_by(
        Competitor.id
    ).order_by(
        func.count(CompetitorAppearance.id).desc()
    ).limit(limit).all()

    return [
        {
            **competitor[0].to_dict(),
            "appearances": competitor[1],
            "average_position": float(competitor[2])
        }
        for competitor in competitors
    ]

@router.get("/competitor/{competitor_id}/details")
async def get_competitor_details(
    competitor_id: int,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Obtém detalhes específicos de um competidor."""
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()
    
    if not competitor:
        raise HTTPException(status_code=404, detail="Competitor not found")

    start_date = datetime.now() - timedelta(days=days)
    
    # Análise por palavra-chave
    keyword_analysis = db.query(
        Keyword.text,
        func.count(CompetitorAppearance.id).label('appearances'),
        func.avg(CompetitorAppearance.position).label('avg_position')
    ).join(
        Search, Search.keyword_id == Keyword.id
    ).join(
        CompetitorAppearance
    ).filter(
        CompetitorAppearance.competitor_id == competitor_id,
        Search.timestamp >= start_date
    ).group_by(
        Keyword.id
    ).all()

    return {
        **competitor.to_dict(),
        "keyword_analysis": [
            {
                "keyword": ka[0],
                "appearances": ka[1],
                "average_position": float(ka[2])
            }
            for ka in keyword_analysis
        ]
    }