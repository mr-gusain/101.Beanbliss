from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from core.security import get_password_hash, verify_password, create_access_token, get_current_user
from core.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    phone: str = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
async def register_user(form_data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.email))
    user_exists = result.scalars().first()
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_pw = get_password_hash(form_data.password)
    new_user = User(
        firstName=form_data.firstName,
        lastName=form_data.lastName,
        email=form_data.email,
        password=hashed_pw,
        phone=form_data.phone
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    token = create_access_token(subject=str(new_user.id))
    
    return {
        "_id": str(new_user.id),
        "firstName": new_user.firstName,
        "lastName": new_user.lastName,
        "email": new_user.email,
        "phone": new_user.phone,
        "role": new_user.role,
        "token": token
    }

@router.post("/login")
async def login_user(form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == form_data.email))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(subject=str(user.id))
    
    return {
        "_id": str(user.id),
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "token": token
    }

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "_id": str(current_user.id),
        "firstName": current_user.firstName,
        "lastName": current_user.lastName,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role,
        "addresses": [
            {"type": a.type, "street": a.street, "city": a.city, "state": a.state,
             "zipCode": a.zipCode, "country": a.country, "isDefault": a.isDefault}
            for a in current_user.addresses
        ],
        "paymentMethods": [
            {"type": p.type, "last4": p.last4, "brand": p.brand,
             "expiryDate": p.expiryDate, "isDefault": p.isDefault}
            for p in current_user.paymentMethods
        ],
        "notifications": [
            {"type": n.type, "title": n.title, "message": n.message,
             "read": n.read, "createdAt": n.createdAt.isoformat() if n.createdAt else None}
            for n in current_user.notifications
        ],
        "createdAt": current_user.createdAt.isoformat() if current_user.createdAt else None,
        "updatedAt": current_user.updatedAt.isoformat() if current_user.updatedAt else None,
    }
