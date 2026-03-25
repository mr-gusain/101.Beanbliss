from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from datetime import datetime

class Address(BaseModel):
    type: str # 'Home', 'Work', 'Other'
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None
    isDefault: bool = False

class PaymentMethod(BaseModel):
    type: str # 'Credit Card', 'Debit Card', 'PayPal'
    last4: Optional[str] = None
    brand: Optional[str] = None
    expiryDate: Optional[str] = None
    isDefault: bool = False

class Notification(BaseModel):
    type: str = 'info' # 'order_success', 'order_cancelled', 'info', 'alert'
    title: str
    message: str
    read: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class User(Document):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    addresses: List[Address] = []
    paymentMethods: List[PaymentMethod] = []
    role: str = "user"
    notifications: List[Notification] = []
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
