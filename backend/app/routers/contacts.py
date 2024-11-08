# backend/app/routers/contacts.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from database import get_db
from models import Contact, Competitor

router = APIRouter(
    prefix="/contacts",
    tags=["contacts"]
)

@router.get("/")
async def list_contacts(
    contact_type: Optional[str] = None,
    days: int = 30,
    db: Session = Depends(get_db)
):
    """Lista todos os contatos encontrados."""
    query = db.query(Contact, Competitor)\
        .join(Competitor)
    
    if contact_type:
        query = query.filter(Contact.type == contact_type)
    
    if days:
        start_date = datetime.now() - timedelta(days=days)
        query = query.filter(Contact.first_seen >= start_date)
    
    contacts = query.order_by(Contact.times_found.desc()).all()
    
    return [
        {
            **contact[0].to_dict(),
            "competitor_domain": contact[1].domain,
            "competitor_name": contact[1].business_name
        }
        for contact in contacts
    ]

@router.get("/competitor/{competitor_id}")
async def get_competitor_contacts(
    competitor_id: int,
    db: Session = Depends(get_db)
):
    """Obtém todos os contatos de um competidor específico."""
    contacts = db.query(Contact).filter(
        Contact.competitor_id == competitor_id
    ).all()
    
    return [contact.to_dict() for contact in contacts]