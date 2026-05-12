from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from models.cart import Cart, CartItem
from models.product import Product
from core.security import get_current_user
from core.database import get_db
from typing import Dict, Any

router = APIRouter(prefix="/api/cart", tags=["Cart"])

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

def _serialize_cart(cart: Cart) -> dict:
    items = []
    for item in cart.items:
        if item.product:
            items.append({
                "product": _serialize_product(item.product),
                "quantity": item.quantity,
                "_id": str(item.product_id)
            })
    return {
        "_id": str(cart.id),
        "user": str(cart.user_id),
        "items": items,
        "createdAt": cart.createdAt.isoformat() if cart.createdAt else None,
        "updatedAt": cart.updatedAt.isoformat() if cart.updatedAt else None,
    }

async def _get_or_create_cart(user: User, db: AsyncSession) -> Cart:
    result = await db.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalars().first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    return cart

@router.get("")
async def get_cart(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    cart = await _get_or_create_cart(user, db)
    return _serialize_cart(cart)

@router.post("")
async def add_to_cart(
    productId: str = Body(...), 
    quantity: int = Body(default=1), 
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pid = int(productId)
    result = await db.execute(select(Product).where(Product.id == pid))
    product = result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = await _get_or_create_cart(user, db)

    existing_item = next((i for i in cart.items if i.product_id == pid), None)
    current_qty = existing_item.quantity if existing_item else 0

    if product.stock < current_qty + quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. You already have {current_qty} in cart. Only {product.stock - current_qty} more available."
        )

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(cart_id=cart.id, product_id=pid, quantity=quantity)
        db.add(new_item)

    await db.commit()
    await db.refresh(cart)
    return _serialize_cart(cart)

@router.put("/{itemId}")
async def update_cart_item(
    itemId: str, 
    quantity: int = Body(...), 
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    pid = int(itemId)
    result = await db.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalars().first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = next((i for i in cart.items if i.product_id == pid), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    if quantity <= 0:
        await db.delete(item)
    else:
        prod_result = await db.execute(select(Product).where(Product.id == pid))
        product = prod_result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.stock < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Only {product.stock} available.")
        item.quantity = quantity

    await db.commit()
    await db.refresh(cart)
    return _serialize_cart(cart)

@router.delete("/{itemId}")
async def remove_from_cart(itemId: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    pid = int(itemId)
    result = await db.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalars().first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = next((i for i in cart.items if i.product_id == pid), None)
    if item:
        await db.delete(item)
        await db.commit()
        await db.refresh(cart)
    return _serialize_cart(cart)

@router.delete("")
async def clear_cart(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalars().first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    for item in cart.items:
        await db.delete(item)
    await db.commit()
    return {"message": "Cart cleared successfully"}
