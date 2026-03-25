from fastapi import APIRouter, Depends, HTTPException, Body
from models.user import User
from models.cart import Cart
from models.order import Order, OrderItem, ShippingInfo
from models.product import Product
from core.security import get_current_user, get_admin_user
from beanie import PydanticObjectId
from typing import List, Dict, Any

router = APIRouter(prefix="/api/orders", tags=["Orders"])

async def get_populated_order(order: Order) -> Dict[str, Any]:
    ret = order.model_dump()
    ret["_id"] = str(order.id)
    ret["user"] = str(order.user)
    
    user = await User.get(order.user)
    if user:
        ret["user"] = {"_id": str(user.id), "firstName": user.firstName, "lastName": user.lastName, "email": user.email}
    
    populated_items = []
    for item in order.items:
        p = await Product.get(item.product)
        item_dict = item.model_dump()
        if p:
            p_dict = p.model_dump()
            p_dict["_id"] = str(p.id)
            item_dict["product"] = p_dict
        populated_items.append(item_dict)
    
    ret["items"] = populated_items
    return ret

@router.get("/admin/all")
async def get_all_orders(admin: User = Depends(get_admin_user)):
    orders = await Order.find_all().sort("-createdAt").to_list()
    return [await get_populated_order(o) for o in orders]

@router.post("")
async def create_order(
    shippingInfo: ShippingInfo = Body(...),
    shippingMethod: str = Body(...),
    paymentMethod: str = Body(...),
    user: User = Depends(get_current_user)
):
    cart = await Cart.find_one(Cart.user == user.id)
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    valid_items = []
    subtotal = 0.0

    for item in cart.items:
        product = await Product.get(item.product)
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

    shipping_costs = {
        "standard": 10,
        "priority": 20,
        "express": 35
    }

    shipping_cost = shipping_costs.get(shippingMethod, 10.0)
    tax_amount = subtotal * 0.085
    total = subtotal + shipping_cost + tax_amount

    payment_status = "Pending"
    if paymentMethod == "Card":
        payment_status = "Paid"

    order_items = [
        OrderItem(product=vi["product"].id, quantity=vi["quantity"], price=vi["price"])
        for vi in valid_items
    ]

    order = Order(
        user=user.id,
        items=order_items,
        shippingInfo=shippingInfo,
        shippingMethod=shippingMethod,
        shippingCost=shipping_cost,
        taxAmount=tax_amount,
        subtotal=subtotal,
        total=total,
        paymentMethod=paymentMethod,
        paymentStatus=payment_status
    )

    for vi in valid_items:
        pr = vi["product"]
        pr.stock -= vi["quantity"]
        await pr.save()

    cart.items = []
    await cart.save()

    await order.insert()
    return await get_populated_order(order)

@router.get("")
async def get_my_orders(user: User = Depends(get_current_user)):
    orders = await Order.find(Order.user == user.id).sort("-createdAt").to_list()
    return [await get_populated_order(o) for o in orders]

@router.get("/{id}")
async def get_order_by_id(id: PydanticObjectId, user: User = Depends(get_current_user)):
    order = await Order.get(id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if str(order.user) != str(user.id) and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return await get_populated_order(order)
