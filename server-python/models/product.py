from typing import List, Optional, Dict
from pydantic import Field
from beanie import Document
from datetime import datetime

class Product(Document):
    name: str
    description: str
    price: float
    discountPrice: Optional[float] = None
    category: str
    image: str
    images: List[str] = []
    rating: float = Field(default=0, ge=0, le=5)
    stock: int = Field(default=0, ge=0)
    featured: bool = False
    specs: Optional[Dict[str, str]] = None
    colors: List[str] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "products"
