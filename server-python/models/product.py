from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, JSON
from datetime import datetime
from core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    discountPrice = Column(Float, nullable=True)
    category = Column(String(100), nullable=False, index=True)
    image = Column(String(500), default="")
    images = Column(JSON, default=list)       # stored as JSON array
    rating = Column(Float, default=0)
    stock = Column(Integer, default=0)
    featured = Column(Boolean, default=False)
    specs = Column(JSON, nullable=True)        # stored as JSON object
    colors = Column(JSON, default=list)        # stored as JSON array
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
