from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.contact import Contact
from models.user import User
from core.security import get_admin_user
from core.database import get_db

router = APIRouter(prefix="/api/contact", tags=["Contact"])

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("")
async def submit_contact(data: ContactIn, db: AsyncSession = Depends(get_db)):
    try:
        contact = Contact(**data.model_dump())
        db.add(contact)
        await db.commit()
        return {"message": "Information Submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_contacts(admin: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(Contact))
        contacts = result.scalars().all()
        return [
            {
                "_id": str(c.id),
                "name": c.name,
                "email": c.email,
                "subject": c.subject,
                "message": c.message,
                "status": c.status,
                "createdAt": c.createdAt.isoformat() if c.createdAt else None,
            }
            for c in contacts
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
