# backend/app/routers/keywords.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Keyword
from config import settings

router = APIRouter(
    prefix="/keywords",
    tags=["keywords"]
)

@router.get("/")
async def list_keywords(db: Session = Depends(get_db)):
    """Lista todas as palavras-chave."""
    keywords = db.query(Keyword).all()
    return [keyword.to_dict() for keyword in keywords]

@router.post("/")
async def add_keywords(
    keywords: List[str],
    db: Session = Depends(get_db)
):
    """Adiciona novas palavras-chave."""
    added = []
    for keyword_text in keywords:
        try:
            # Verifica se já existe
            existing = db.query(Keyword)\
                .filter(Keyword.text == keyword_text)\
                .first()
            
            if not existing:
                keyword = Keyword(text=keyword_text)
                db.add(keyword)
                db.commit()
                added.append(keyword_text)
        except Exception as e:
            db.rollback()
            continue
    
    return {
        "message": f"Added {len(added)} keywords",
        "added": added
    }

@router.delete("/{keyword_id}")
async def delete_keyword(
    keyword_id: int,
    db: Session = Depends(get_db)
):
    """Remove uma palavra-chave."""
    keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")
    
    try:
        db.delete(keyword)
        db.commit()
        return {"message": "Keyword deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{keyword_id}/toggle")
async def toggle_keyword(
    keyword_id: int,
    db: Session = Depends(get_db)
):
    """Ativa/desativa uma palavra-chave."""
    keyword = db.query(Keyword).filter(Keyword.id == keyword_id).first()
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")
    
    try:
        keyword.is_active = not keyword.is_active
        db.commit()
        return {
            "message": f"Keyword {'activated' if keyword.is_active else 'deactivated'} successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))