from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.product import Product
from models.user import User
from core.security import oauth2_scheme
from core.config import get_settings
from core.database import get_db
from openai import AsyncOpenAI
import re
import jwt as pyjwt

router = APIRouter(prefix="/api/ai", tags=["AI"])
settings = get_settings()

client = None
if settings.OPENAI_API_KEY and len(settings.OPENAI_API_KEY) > 10 and "your_openai" not in settings.OPENAI_API_KEY:
    try:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    except Exception as e:
        print("Failed to init OpenAI:", e)

def generate_offline_response(user_message: str, products: list, user_context: str) -> str:
    msg = user_message.lower().strip()
    
    if re.search(r"^(hi|hello|hey|howdy|greetings|yo|sup)", msg):
        return "👋 Hello! Welcome to BeanBliss! I can help you find the perfect product. Ask me about our Hot Drinks, Cold Drinks, Pastries, Light Bites, or Desserts!"

    if "shipping" in msg or "delivery" in msg or "ship" in msg:
        return "🚚 We offer free standard shipping on orders over $50! Standard delivery takes 3-5 business days."
    
    if "return" in msg or "refund" in msg or "exchange" in msg:
        return "🔄 We have a hassle-free 30-day return policy!"
        
    if "payment" in msg or "pay" in msg or "stripe" in msg or "card" in msg or "cod" in msg:
        return "💳 We accept Credit/Debit cards via Stripe and Cash on Delivery (COD). All transactions are 100% secure!"

    if "contact" in msg or "support" in msg or "email" in msg or "call" in msg:
        return "📧 You can reach our support team at support@beanbliss.com."

    if "account" in msg or "profile" in msg or "password" in msg or "login" in msg or "sign" in msg:
        if "guest" in user_context:
            return "👤 You're currently browsing as a guest. Create an account to track orders and save addresses!"
        return "👤 You can manage your account by clicking your profile icon."

    if "order" in msg or "track" in msg or "status" in msg:
        return "📦 You can track your orders from 'My Account > My Orders'."

    if "price" in msg or "cost" in msg or "cheap" in msg or "budget" in msg or "deal" in msg:
        sorted_p = sorted(products, key=lambda x: x.price)
        if sorted_p:
            affordable = "\n".join([f"• **{p.name}** — ${p.price}" for p in sorted_p[:3]])
            return f"💰 Looking for great deals? Here are our most affordable products:\n\n{affordable}\n\nCheck the Products page for all our offers!"
        return "💰 Browse our Products page to find the perfect match for your budget."

    if "recommend" in msg or "suggest" in msg or "best" in msg or "popular" in msg or "top" in msg:
        top_rated = sorted(products, key=lambda x: x.rating, reverse=True)[:3]
        if top_rated:
            recs = "\n".join([f"• **{p.name}** — ${p.price} (⭐ {p.rating}/5)" for p in top_rated])
            return f"🌟 Here are our top-rated products:\n\n{recs}\n\nWould you like to know more about any of these?"
        return "🌟 Check out our featured products!"
    
    return "I'd love to help! Tell me what you are looking for."

@router.post("/chat")
async def chat_with_ai(
    messages: List[Dict[str, str]] = Body(..., embed=True),
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    if not messages:
        raise HTTPException(status_code=400, detail="Messages array is required")

    try:
        result = await db.execute(select(Product).limit(20))
        products = result.scalars().all()
    except Exception as e:
        products = []
        print(e)
    
    latest_user_message = messages[-1].get("content", "")
    user_context = "User is a guest."

    if token:
        try:
            payload = pyjwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("sub")
            user_result = await db.execute(select(User).where(User.id == int(user_id)))
            user = user_result.scalars().first()
            if user:
                user_context = f"User: {user.firstName} {user.lastName} ({user.email})."
        except Exception:
            pass

    if client:
        try:
            product_context = "\n".join([
                f"- {p.name} (${p.price}): {p.description[:100]}... (Stock: {p.stock}, Rating: {p.rating}/5)"
                for p in products
            ])
            system_msg = {
                "role": "system",
                "content": f"""You are the BeanBliss AI Assistant, a helpful and knowledgeable shopping assistant for a cafe store.

Your capabilities:
1. Recommend products based on user needs.
2. Answer questions about product specifications, price, and availability.
3. Assist with account-related questions.
4. Provide general support.

Top Products Available:
{product_context}

Current User Context:
{user_context}

Tone: Professional, friendly, and enthusiastic. Keep responses concise (under 3-4 sentences). Do not invent products not in the list."""
            }
            
            conv_history = [system_msg] + messages[-10:]
            
            completion = await client.chat.completions.create(
                messages=conv_history,
                model="gpt-3.5-turbo",
            )
            return {"message": completion.choices[0].message.model_dump(exclude_none=True)}
        except Exception as e:
            print("OpenAI call failed:", e)

    reply = generate_offline_response(latest_user_message, products, user_context)
    return {"message": {"role": "assistant", "content": reply}}
