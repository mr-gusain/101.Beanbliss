from fastapi import APIRouter, Depends, HTTPException, status, Response
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User, UserAddress, UserPaymentMethod, UserNotification
from models.order import Order
from models.cart import Cart
from core.security import get_current_user, get_admin_user
from core.database import get_db

router = APIRouter(prefix="/api/users", tags=["Users"])

class ProfileUpdate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str = None

class AddressIn(BaseModel):
    type: str = "Home"
    street: str = None
    city: str = None
    state: str = None
    zipCode: str = None
    country: str = None
    isDefault: bool = False

class PaymentMethodIn(BaseModel):
    type: str
    last4: str = None
    brand: str = None
    expiryDate: str = None
    isDefault: bool = False

def _serialize_user(u: User) -> dict:
    return {
        "_id": str(u.id),
        "firstName": u.firstName,
        "lastName": u.lastName,
        "email": u.email,
        "phone": u.phone,
        "role": u.role,
        "addresses": [
            {"type": a.type, "street": a.street, "city": a.city, "state": a.state,
             "zipCode": a.zipCode, "country": a.country, "isDefault": a.isDefault}
            for a in u.addresses
        ],
        "paymentMethods": [
            {"type": p.type, "last4": p.last4, "brand": p.brand,
             "expiryDate": p.expiryDate, "isDefault": p.isDefault}
            for p in u.paymentMethods
        ],
        "notifications": [
            {"type": n.type, "title": n.title, "message": n.message,
             "read": n.read, "createdAt": n.createdAt.isoformat() if n.createdAt else None}
            for n in u.notifications
        ],
        "createdAt": u.createdAt.isoformat() if u.createdAt else None,
        "updatedAt": u.updatedAt.isoformat() if u.updatedAt else None,
    }

@router.get("")
async def get_all_users(admin: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return [_serialize_user(u) for u in users]

@router.get("/profile")
async def get_profile(user: User = Depends(get_current_user)):
    return _serialize_user(user)

@router.put("/profile")
async def update_profile(data: ProfileUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email
    user.phone = data.phone
    await db.commit()
    await db.refresh(user)
    return _serialize_user(user)

@router.post("/addresses")
async def add_address(addr: AddressIn, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_addr = UserAddress(user_id=user.id, **addr.model_dump())
    db.add(new_addr)
    await db.commit()
    await db.refresh(user)
    return [
        {"type": a.type, "street": a.street, "city": a.city, "state": a.state,
         "zipCode": a.zipCode, "country": a.country, "isDefault": a.isDefault}
        for a in user.addresses
    ]

@router.put("/addresses/{idx}")
async def update_address(idx: int, addr: AddressIn, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if 0 <= idx < len(user.addresses):
        if addr.isDefault:
            for a in user.addresses:
                a.isDefault = False
        target = user.addresses[idx]
        for key, val in addr.model_dump().items():
            setattr(target, key, val)
        await db.commit()
        await db.refresh(user)
    return [
        {"type": a.type, "street": a.street, "city": a.city, "state": a.state,
         "zipCode": a.zipCode, "country": a.country, "isDefault": a.isDefault}
        for a in user.addresses
    ]

@router.delete("/addresses/{idx}")
async def delete_address(idx: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if 0 <= idx < len(user.addresses):
        await db.delete(user.addresses[idx])
        await db.commit()
        await db.refresh(user)
    return [
        {"type": a.type, "street": a.street, "city": a.city, "state": a.state,
         "zipCode": a.zipCode, "country": a.country, "isDefault": a.isDefault}
        for a in user.addresses
    ]

@router.post("/payment-methods")
async def add_payment(pm: PaymentMethodIn, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if pm.isDefault:
        for p in user.paymentMethods:
            p.isDefault = False
    new_pm = UserPaymentMethod(user_id=user.id, **pm.model_dump())
    db.add(new_pm)
    await db.commit()
    await db.refresh(user)
    return [
        {"type": p.type, "last4": p.last4, "brand": p.brand,
         "expiryDate": p.expiryDate, "isDefault": p.isDefault}
        for p in user.paymentMethods
    ]

@router.delete("/payment-methods/{idx}")
async def delete_payment(idx: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if 0 <= idx < len(user.paymentMethods):
        await db.delete(user.paymentMethods[idx])
        await db.commit()
        await db.refresh(user)
    return [
        {"type": p.type, "last4": p.last4, "brand": p.brand,
         "expiryDate": p.expiryDate, "isDefault": p.isDefault}
        for p in user.paymentMethods
    ]

@router.put("/notifications/{idx}/read")
async def mark_notification_read(idx: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if 0 <= idx < len(user.notifications):
        user.notifications[idx].read = True
        await db.commit()
        await db.refresh(user)
    return [
        {"type": n.type, "title": n.title, "message": n.message,
         "read": n.read, "createdAt": n.createdAt.isoformat() if n.createdAt else None}
        for n in user.notifications
    ]

@router.put("/notifications/read-all")
async def mark_all_notifications_read(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    for n in user.notifications:
        n.read = True
    await db.commit()
    await db.refresh(user)
    return [
        {"type": n.type, "title": n.title, "message": n.message,
         "read": n.read, "createdAt": n.createdAt.isoformat() if n.createdAt else None}
        for n in user.notifications
    ]

@router.delete("/notifications/{idx}")
async def delete_notification(idx: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if 0 <= idx < len(user.notifications):
        await db.delete(user.notifications[idx])
        await db.commit()
        await db.refresh(user)
    return [
        {"type": n.type, "title": n.title, "message": n.message,
         "read": n.read, "createdAt": n.createdAt.isoformat() if n.createdAt else None}
        for n in user.notifications
    ]

@router.delete("/notifications")
async def clear_notifications(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    for n in user.notifications:
        await db.delete(n)
    await db.commit()
    await db.refresh(user)
    return []


@router.delete("/admin/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_user(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    orders_result = await db.execute(select(Order).where(Order.user_id == user_id))
    for order in orders_result.scalars().all():
        await db.delete(order)
    cart_result = await db.execute(select(Cart).where(Cart.user_id == user_id))
    cart = cart_result.scalars().first()
    if cart:
        await db.delete(cart)
    await db.delete(user)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
