# backend/app/models/execution.py

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from database import Base

class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_searches = Column(Integer, default=0)
    total_clicks = Column(Integer, default=0)
    total_lidery_found = Column(Integer, default=0)
    is_running = Column(Boolean, default=True)
    execution_mode = Column(String, default="visible")  # visible ou headless
    status = Column(String, default="running")
    error_message = Column(String, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "total_searches": self.total_searches,
            "total_clicks": self.total_clicks,
            "total_lidery_found": self.total_lidery_found,
            "is_running": self.is_running,
            "execution_mode": self.execution_mode,
            "status": self.status,
            "error_message": self.error_message
        }