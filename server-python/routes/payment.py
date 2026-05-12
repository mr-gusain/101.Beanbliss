import stripe
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from models.cart import Cart
from models.product import Product
from core.security import get_current_user
from core.config import get_settings
from core.database import get_db

settings = get_settings()
router = APIRouter(prefix="/api/payment", tags=["Payment"])

stripe.api_key = settings.STRIPE_SECRET_KEY

@router.post("/create-payment-intent")
async def create_payment_intent(
    shippingMethod: str = Body(..., embed=True),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(select(Cart).where(Cart.user_id == user.id))
        cart = result.scalars().first()
        if not cart or not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        valid_items = []
        subtotal = 0.0

        for item in cart.items:
            prod_result = await db.execute(select(Product).where(Product.id == item.product_id))
            product = prod_result.scalars().first()
            if product:
                valid_items.append(item)
                subtotal += product.price * item.quantity

        if not valid_items:
            raise HTTPException(status_code=400, detail="Cart contains no valid products.")

        shipping_prices = {
            "standard": 10.0,
            "priority": 20.0,
            "express": 35.0
        }
        
        shipping_cost = shipping_prices.get(shippingMethod, 10.0)
        tax_amount = subtotal * 0.085
        total = subtotal + shipping_cost + tax_amount

        payment_intent = stripe.PaymentIntent.create(
            amount=int(round(total * 100)),
            currency="usd",
            automatic_payment_methods={"enabled": True},
            metadata={
                "userId": str(user.id),
                "cartId": str(cart.id)
            }
        )

        return {"clientSecret": payment_intent.client_secret}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
