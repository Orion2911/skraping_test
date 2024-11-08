# backend/app/models/competitor_appearance.py

from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class CompetitorAppearance(Base):
    __tablename__ = "competitor_appearances"

    id = Column(Integer, primary_key=True, index=True)
    competitor_id = Column(Integer, ForeignKey("competitors.id"))
    search_id = Column(Integer, ForeignKey("searches.id"))
    position = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    clicked = Column(Integer, default=0)  # 0: não clicado, 1: clicado, 2: erro ao clicar

    competitor = relationship("Competitor", back_populates="appearances")
    search = relationship("Search", back_populates="competitor_appearances")

    def to_dict(self):
        return {
            "id": self.id,
            "competitor_id": self.competitor_id,
            "search_id": self.search_id,
            "position": self.position,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "clicked": self.clicked
        }