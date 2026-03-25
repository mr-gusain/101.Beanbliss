from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from models.user import User
from core.security import get_password_hash, verify_password, create_access_token, get_current_user
from datetime import timedelta
from beanie import PydanticObjectId

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
async def register_user(form_data: RegisterRequest):
    user_exists = await User.find_one(User.email == form_data.email)
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
    await new_user.insert()
    
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
async def login_user(form_data: LoginRequest):
    user = await User.find_one(User.email == form_data.email)
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
    user_dict = current_user.model_dump()
    user_dict["_id"] = str(current_user.id)
    del user_dict["password"]
    return user_dict
