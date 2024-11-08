# backend/app/models/search.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Search(Base):
    __tablename__ = "searches"

    id = Column(Integer, primary_key=True, index=True)
    keyword_id = Column(Integer, ForeignKey("keywords.id"))
    execution_id = Column(Integer, ForeignKey("executions.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    total_ads = Column(Integer, default=0)
    lidery_position = Column(Integer, nullable=True)  # Posição onde Lidery foi encontrada, se encontrada

    keyword = relationship("Keyword", back_populates="searches")
    competitor_appearances = relationship("CompetitorAppearance", back_populates="search")

    def to_dict(self):
        return {
            "id": self.id,
            "keyword_id": self.keyword_id,
            "execution_id": self.execution_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "total_ads": self.total_ads,
            "lidery_position": self.lidery_position
        }