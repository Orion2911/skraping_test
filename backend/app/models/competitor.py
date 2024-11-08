# backend/app/models/competitor.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, unique=True, index=True)
    business_name = Column(String, nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    total_appearances = Column(Integer, default=0)

    appearances = relationship("CompetitorAppearance", back_populates="competitor")
    contacts = relationship("Contact", back_populates="competitor")

    def to_dict(self):
        return {
            "id": self.id,
            "domain": self.domain,
            "business_name": self.business_name,
            "first_seen": self.first_seen.isoformat() if self.first_seen else None,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
            "total_appearances": self.total_appearances
        }