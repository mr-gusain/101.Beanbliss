from fastapi import APIRouter, Depends, HTTPException
from models.contact import Contact
from models.user import User
from core.security import get_admin_user

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("")
async def submit_contact(contact: Contact):
    try:
        await contact.insert()
        return {"message": "Information Submited"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_contacts(admin: User = Depends(get_admin_user)):
    try:
        contacts = await Contact.find_all().to_list()
        res = []
        for c in contacts:
            d = c.model_dump()
            d["_id"] = str(c.id)
            res.append(d)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
