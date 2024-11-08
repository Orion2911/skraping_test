# backend/app/routers/execution.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database import get_db
from services.scraping_manager import ScrapingManager
from models import Execution

router = APIRouter(
    prefix="/execution",
    tags=["execution"]
)

@router.post("/start")
async def start_execution(
    headless: bool = False,
    db: Session = Depends(get_db)
):
    """Inicia uma nova execução do scraper."""
    try:
        manager = ScrapingManager(db)
        execution = await manager.start_execution(headless)
        await manager.run_scraping()
        return {"message": "Execution started", "execution_id": execution.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop/{execution_id}")
async def stop_execution(
    execution_id: int,
    db: Session = Depends(get_db)
):
    """Para uma execução específica."""
    execution = db.query(Execution).filter(Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    try:
        manager = ScrapingManager(db)
        await manager.stop_execution()
        return {"message": "Execution stopped successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{execution_id}")
async def get_execution_status(
    execution_id: int,
    db: Session = Depends(get_db)
):
    """Obtém o status de uma execução específica."""
    execution = db.query(Execution).filter(Execution.id == execution_id).first()
    if not execution:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    return execution.to_dict()

@router.get("/list")
async def list_executions(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Lista todas as execuções com paginação."""
    executions = db.query(Execution)\
        .order_by(Execution.start_time.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    return [execution.to_dict() for execution in executions]