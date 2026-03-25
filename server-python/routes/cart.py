from fastapi import APIRouter, Depends, HTTPException, Body
from models.user import User
from models.cart import Cart, CartItem
from models.product import Product
from core.security import get_current_user
from beanie import PydanticObjectId
from typing import List, Dict, Any

router = APIRouter(prefix="/api/cart", tags=["Cart"])

async def get_populated_cart(cart: Cart) -> Dict[str, Any]:
    items = []
    for item in cart.items:
        p = await Product.get(item.product)
        if p:
            item_dict = {"product": p.model_dump(), "quantity": item.quantity, "_id": str(item.product)}
            item_dict["product"]["_id"] = str(p.id)
            items.append(item_dict)
    
    return {
        "_id": str(cart.id),
        "user": str(cart.user),
        "items": items,
        "createdAt": cart.createdAt,
        "updatedAt": cart.updatedAt
    }

@router.get("")
async def get_cart(user: User = Depends(get_current_user)):
    cart = await Cart.find_one(Cart.user == user.id)
    if not cart:
        cart = Cart(user=user.id, items=[])
        await cart.insert()
    return await get_populated_cart(cart)

@router.post("")
async def add_to_cart(
    productId: str = Body(...), 
    quantity: int = Body(default=1), 
    user: User = Depends(get_current_user)
):
    product = await Product.get(PydanticObjectId(productId))
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = await Cart.find_one(Cart.user == user.id)
    if not cart:
        cart = Cart(user=user.id, items=[])
        await cart.insert()

    existing_item = next((i for i in cart.items if str(i.product) == productId), None)
    current_qty = existing_item.quantity if existing_item else 0

    if product.stock < current_qty + quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"Insufficient stock. You already have {current_qty} in cart. Only {product.stock - current_qty} more available."
        )

    if existing_item:
        existing_item.quantity += quantity
    else:
        cart.items.append(CartItem(product=PydanticObjectId(productId), quantity=quantity))

    await cart.save()
    return await get_populated_cart(cart)

@router.put("/{itemId}")
async def update_cart_item(
    itemId: str, 
    quantity: int = Body(...), 
    user: User = Depends(get_current_user)
):
    cart = await Cart.find_one(Cart.user == user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    item = next((i for i in cart.items if str(i.product) == itemId), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    if quantity <= 0:
        cart.items = [i for i in cart.items if str(i.product) != itemId]
    else:
        product = await Product.get(PydanticObjectId(itemId))
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if product.stock < quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock. Only {product.stock} available.")
        item.quantity = quantity

    await cart.save()
    return await get_populated_cart(cart)

@router.delete("/{itemId}")
async def remove_from_cart(itemId: str, user: User = Depends(get_current_user)):
    cart = await Cart.find_one(Cart.user == user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart.items = [i for i in cart.items if str(i.product) != itemId]
    await cart.save()
    return await get_populated_cart(cart)

@router.delete("")
async def clear_cart(user: User = Depends(get_current_user)):
    cart = await Cart.find_one(Cart.user == user.id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart.items = []
    await cart.save()
    return {"message": "Cart cleared successfully"}
