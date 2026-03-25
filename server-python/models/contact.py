from typing import Optional
from pydantic import EmailStr, Field
from beanie import Document
from datetime import datetime

class Contact(Document):
    name: str
    email: EmailStr
    subject: str
    message: str
    status: str = 'new' # 'new', 'read', 'responded'
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "contacts"
