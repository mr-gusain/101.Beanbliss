from typing import List, Optional
from pydantic import BaseModel, Field
from beanie import Document, PydanticObjectId, Link
from datetime import datetime
from .user import User
from .product import Product

class OrderItem(BaseModel):
    product: PydanticObjectId
    quantity: int = Field(ge=1)
    price: float

class ShippingInfo(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None

class Order(Document):
    user: PydanticObjectId
    items: List[OrderItem]
    shippingInfo: ShippingInfo
    shippingMethod: str = 'standard' # 'standard', 'priority', 'express'
    shippingCost: float = 0.0
    taxAmount: float = 0.0
    subtotal: float
    total: float
    status: str = 'Pending' # 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    paymentMethod: str = 'Card' # 'Card', 'COD'
    paymentStatus: str = 'Pending' # 'Pending', 'Paid', 'Failed'
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
