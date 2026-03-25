import contextlib
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from core.config import get_settings

from models.user import User
from models.product import Product
from models.order import Order
from models.cart import Cart
from models.contact import Contact

from routes import auth, users, products, cart, orders, payment, ai, contact

settings = get_settings()

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
    app.mongodb = app.mongodb_client.get_default_database()
    
    await init_beanie(
        database=app.mongodb,
        document_models=[
            User,
            Product,
            Order,
            Cart,
            Contact
        ]
    )
    print("Connected to MongoDB via Motor and initialized Beanie")
    
    yield
    
    # Shutdown
    app.mongodb_client.close()

app = FastAPI(title="MERN to Python Backend API", lifespan=lifespan)

# CORS Configuration
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://bean-bliss-coffee-restro.vercel.app",
    "https://bean-bliss-coffee-restro.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(payment.router)
app.include_router(ai.router)
app.include_router(contact.router)

# Catch-all exception handler so CORS headers are always present
# (Without this, unhandled 500 errors skip CORSMiddleware headers,
#  causing the browser to report a misleading CORS error.)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()  # Log the real error to the terminal
    origin = request.headers.get("origin")
    headers = {}
    if origin in allowed_origins:
        headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
        }
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=headers,
    )

@app.get("/api/health")
async def health_check():
    return {"status": "OK", "message": "Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
