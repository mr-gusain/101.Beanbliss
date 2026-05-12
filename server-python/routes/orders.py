from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User, UserNotification
from models.cart import Cart
from models.order import Order, OrderItem
from models.product import Product
from core.security import get_current_user, get_admin_user
from core.database import get_db
from typing import Optional, Dict, Any

router = APIRouter(prefix="/api/orders", tags=["Orders"])

class ShippingInfoIn(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zipCode: Optional[str] = None
    country: Optional[str] = None

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

def _serialize_order(order: Order) -> dict:
    # Build user info
    user_data = str(order.user_id)
    if order.user:
        user_data = {
            "_id": str(order.user.id),
            "firstName": order.user.firstName,
            "lastName": order.user.lastName,
            "email": order.user.email,
        }

    # Build items with populated product
    populated_items = []
    for item in order.items:
        item_dict = {
            "product": str(item.product_id),
            "quantity": item.quantity,
            "price": item.price,
        }
        if item.product:
            item_dict["product"] = _serialize_product(item.product)
        populated_items.append(item_dict)

    return {
        "_id": str(order.id),
        "user": user_data,
        "items": populated_items,
        "shippingInfo": {
            "firstName": order.ship_firstName,
            "lastName": order.ship_lastName,
            "email": order.ship_email,
            "phone": order.ship_phone,
            "address": order.ship_address,
            "city": order.ship_city,
            "state": order.ship_state,
            "zipCode": order.ship_zipCode,
            "country": order.ship_country,
        },
        "shippingMethod": order.shippingMethod,
        "shippingCost": order.shippingCost,
        "taxAmount": order.taxAmount,
        "subtotal": order.subtotal,
        "total": order.total,
        "status": order.status,
        "paymentMethod": order.paymentMethod,
        "paymentStatus": order.paymentStatus,
        "createdAt": order.createdAt.isoformat() if order.createdAt else None,
        "updatedAt": order.updatedAt.isoformat() if order.updatedAt else None,
    }

@router.get("/admin/all")
async def get_all_orders(admin: User = Depends(get_admin_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).order_by(Order.createdAt.desc()))
    orders = result.scalars().all()
    return [_serialize_order(o) for o in orders]

@router.post("")
async def create_order(
    shippingInfo: ShippingInfoIn = Body(...),
    shippingMethod: str = Body(...),
    paymentMethod: str = Body(...),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Cart).where(Cart.user_id == user.id))
    cart = result.scalars().first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    valid_items = []
    subtotal = 0.0

    for item in cart.items:
        prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = prod_result.scalars().first()
        if product and product.stock >= item.quantity:
            valid_items.append({
                "product": product,
                "quantity": item.quantity,
                "price": product.price
            })
            subtotal += product.price * item.quantity
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for {product.name if product else 'a product'}"
            )

    if not valid_items:
        raise HTTPException(status_code=400, detail="Cart contains no valid products.")

    shipping_costs = {"standard": 10, "priority": 20, "express": 35}
    shipping_cost = shipping_costs.get(shippingMethod, 10.0)
    tax_amount = subtotal * 0.085
    total = subtotal + shipping_cost + tax_amount

    payment_status = "Pending"
    if paymentMethod == "Card":
        payment_status = "Paid"

    ship = shippingInfo.model_dump()
    order = Order(
        user_id=user.id,
        shippingMethod=shippingMethod,
        shippingCost=shipping_cost,
        taxAmount=tax_amount,
        subtotal=subtotal,
        total=total,
        paymentMethod=paymentMethod,
        paymentStatus=payment_status,
        ship_firstName=ship.get("firstName"),
        ship_lastName=ship.get("lastName"),
        ship_email=ship.get("email"),
        ship_phone=ship.get("phone"),
        ship_address=ship.get("address"),
        ship_city=ship.get("city"),
        ship_state=ship.get("state"),
        ship_zipCode=ship.get("zipCode"),
        ship_country=ship.get("country"),
    )
    db.add(order)
    await db.flush()  # get order.id before adding items

    for vi in valid_items:
        oi = OrderItem(
            order_id=order.id,
            product_id=vi["product"].id,
            quantity=vi["quantity"],
            price=vi["price"]
        )
        db.add(oi)
        vi["product"].stock -= vi["quantity"]

    # Clear cart
    for item in cart.items:
        await db.delete(item)

    await db.commit()
    await db.refresh(order)
    return _serialize_order(order)

@router.get("")
async def get_my_orders(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Order).where(Order.user_id == user.id).order_by(Order.createdAt.desc())
    )
    orders = result.scalars().all()
    return [_serialize_order(o) for o in orders]

@router.get("/{id}")
async def get_order_by_id(id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return _serialize_order(order)
