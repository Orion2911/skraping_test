# backend/app/models/contact.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    competitor_id = Column(Integer, ForeignKey("competitors.id"))
    type = Column(String)  # whatsapp, telefone, etc
    value = Column(String)
    first_seen = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow)
    times_found = Column(Integer, default=1)

    competitor = relationship("Competitor", back_populates="contacts")

    def to_dict(self):
        return {
            "id": self.id,
            "competitor_id": self.competitor_id,
            "type": self.type,
            "value": self.value,
            "first_seen": self.first_seen.isoformat() if self.first_seen else None,
            "last_seen": self.last_seen.isoformat() if self.last_seen else None,
            "times_found": self.times_found
        }