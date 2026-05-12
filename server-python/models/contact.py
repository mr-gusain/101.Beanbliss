from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from core.database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(500), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="new")
    createdAt = Column(DateTime, default=datetime.utcnow)
