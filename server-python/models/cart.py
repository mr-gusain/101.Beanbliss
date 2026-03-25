from typing import List
from pydantic import BaseModel, Field
from beanie import Document, PydanticObjectId
from datetime import datetime

class CartItem(BaseModel):
    product: PydanticObjectId
    quantity: int = Field(default=1, ge=1)

class Cart(Document):
    user: PydanticObjectId
    items: List[CartItem] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "carts"
