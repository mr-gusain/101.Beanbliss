from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from models.user import User, Address, PaymentMethod, Notification
from core.security import get_current_user, get_admin_user
from beanie import PydanticObjectId

router = APIRouter(prefix="/api/users", tags=["Users"])

class ProfileUpdate(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str = None

@router.get("")
async def get_all_users(admin: User = Depends(get_admin_user)):
    users = await User.find_all().to_list()
    result = []
    for u in users:
        d = u.model_dump()
        d["_id"] = str(u.id)
        del d["password"]
        result.append(d)
    return result

@router.get("/profile")
async def get_profile(user: User = Depends(get_current_user)):
    d = user.model_dump()
    d["_id"] = str(user.id)
    del d["password"]
    return d

@router.put("/profile")
async def update_profile(data: ProfileUpdate, user: User = Depends(get_current_user)):
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.email = data.email
    user.phone = data.phone
    await user.save()
    d = user.model_dump()
    d["_id"] = str(user.id)
    del d["password"]
    return d

@router.post("/addresses")
async def add_address(addr: Address, user: User = Depends(get_current_user)):
    user.addresses.append(addr)
    await user.save()
    return user.addresses

@router.put("/addresses/{id}")
async def update_address(id: int, addr: Address, user: User = Depends(get_current_user)):
    if 0 <= id < len(user.addresses):
        if addr.isDefault:
            for a in user.addresses:
                a.isDefault = False
        user.addresses[id] = addr
        await user.save()
    return user.addresses

@router.delete("/addresses/{id}")
async def delete_address(id: int, user: User = Depends(get_current_user)):
    if 0 <= id < len(user.addresses):
        user.addresses.pop(id)
        await user.save()
    return user.addresses

@router.post("/payment-methods")
async def add_payment(pm: PaymentMethod, user: User = Depends(get_current_user)):
    if pm.isDefault:
        for p in user.paymentMethods:
            p.isDefault = False
    user.paymentMethods.append(pm)
    await user.save()
    return user.paymentMethods

@router.delete("/payment-methods/{id}")
async def delete_payment(id: int, user: User = Depends(get_current_user)):
    if 0 <= id < len(user.paymentMethods):
        user.paymentMethods.pop(id)
        await user.save()
    return user.paymentMethods

@router.put("/notifications/{id}/read")
async def mark_notification_read(id: int, user: User = Depends(get_current_user)):
    if 0 <= id < len(user.notifications):
        user.notifications[id].read = True
        await user.save()
    return user.notifications

@router.put("/notifications/read-all")
async def mark_all_notifications_read(user: User = Depends(get_current_user)):
    for n in user.notifications:
        n.read = True
    await user.save()
    return user.notifications

@router.delete("/notifications/{id}")
async def delete_notification(id: int, user: User = Depends(get_current_user)):
    if 0 <= id < len(user.notifications):
        user.notifications.pop(id)
        await user.save()
    return user.notifications

@router.delete("/notifications")
async def clear_notifications(user: User = Depends(get_current_user)):
    user.notifications = []
    await user.save()
    return user.notifications
