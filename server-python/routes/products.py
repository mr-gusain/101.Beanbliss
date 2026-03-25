from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from models.user import User
from models.product import Product
from core.security import get_admin_user
from core.upload import upload_image
from beanie import PydanticObjectId
from typing import Optional

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("")
async def get_products(
    category: Optional[str] = None,
    featured: Optional[str] = None,
    search: Optional[str] = None
):
    query = {}
    if category:
        query["category"] = category
    if featured == "true":
        query["featured"] = True
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
        
    products = await Product.find(query).sort("-createdAt").to_list()
    # Convert PydanticObjectId to string _id for frontend compatibility
    res = []
    for p in products:
        d = p.model_dump()
        d["_id"] = str(p.id)
        res.append(d)
    return res

@router.get("/{id}")
async def get_product(id: PydanticObjectId):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    d = product.model_dump()
    d["_id"] = str(product.id)
    return d

@router.post("")
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: User = Depends(get_admin_user)
):
    image_url = ""
    if image:
        image_url = await upload_image(image)
        
    product = Product(
        name=name,
        description=description,
        price=price,
        category=category,
        stock=stock,
        image=image_url
    )
    await product.insert()
    d = product.model_dump()
    d["_id"] = str(product.id)
    return d

@router.put("/{id}")
async def update_product(
    id: PydanticObjectId,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: User = Depends(get_admin_user)
):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = name
    product.description = description
    product.price = price
    product.category = category
    product.stock = stock
    
    if image:
        product.image = await upload_image(image)
        
    await product.save()
    d = product.model_dump()
    d["_id"] = str(product.id)
    return d

@router.delete("/{id}")
async def delete_product(id: PydanticObjectId, admin: User = Depends(get_admin_user)):
    product = await Product.get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await product.delete()
    return {"message": "Product deleted successfully"}
