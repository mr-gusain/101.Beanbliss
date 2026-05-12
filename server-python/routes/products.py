from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from models.user import User
from models.product import Product
from core.security import get_admin_user
from core.upload import upload_image
from core.database import get_db
from typing import Optional

router = APIRouter(prefix="/api/products", tags=["Products"])

def _serialize_product(p: Product) -> dict:
    return {
        "_id": str(p.id),
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "discountPrice": p.discountPrice,
        "category": p.category,
        "image": p.image,
        "images": p.images or [],
        "rating": p.rating,
        "stock": p.stock,
        "featured": p.featured,
        "specs": p.specs,
        "colors": p.colors or [],
        "createdAt": p.createdAt.isoformat() if p.createdAt else None,
        "updatedAt": p.updatedAt.isoformat() if p.updatedAt else None,
    }

@router.get("")
async def get_products(
    category: Optional[str] = None,
    featured: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Product)

    if category:
        stmt = stmt.where(Product.category == category)
    if featured == "true":
        stmt = stmt.where(Product.featured == True)
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            or_(Product.name.ilike(pattern), Product.description.ilike(pattern))
        )

    stmt = stmt.order_by(Product.createdAt.desc())
    result = await db.execute(stmt)
    products = result.scalars().all()
    return [_serialize_product(p) for p in products]

@router.get("/{id}")
async def get_product(id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _serialize_product(product)

@router.post("")
async def create_product(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
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
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return _serialize_product(product)

@router.put("/{id}")
async def update_product(
    id: int,
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    stock: int = Form(...),
    image: Optional[UploadFile] = File(None),
    admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = name
    product.description = description
    product.price = price
    product.category = category
    product.stock = stock
    
    if image:
        product.image = await upload_image(image)
        
    await db.commit()
    await db.refresh(product)
    return _serialize_product(product)

@router.delete("/{id}")
async def delete_product(id: int, admin: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.id == id))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(product)
    await db.commit()
    return {"message": "Product deleted successfully"}
