import contextlib
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.config import get_settings
from core.database import engine, Base

from routes import auth, users, products, cart, orders, payment, ai, contact

settings = get_settings()

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Import all models so Base.metadata knows about them
    import models.user
    import models.product
    import models.order
    import models.cart
    import models.contact

    # Create all tables - wrapped in try/except so Vercel doesn't crash on cold start
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Connected to MySQL and created tables via SQLAlchemy")
    except Exception as e:
        print(f"Warning: Could not connect to database on startup: {e}")
    
    yield
    
    # Shutdown
    try:
        await engine.dispose()
    except Exception:
        pass

app = FastAPI(title="BeanBliss Backend API (MySQL)", lifespan=lifespan)

# CORS Configuration
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://bean-bliss-coffee-restro.vercel.app",
    "https://bean-bliss-coffee-restro.vercel.app/",
    "https://beanliss-backend.vercel.app",
    "https://beanliss-backend.vercel.app/",
    "https://beanbliss-frontend.vercel.app",
    "https://beanbliss-frontend.vercel.app/",
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
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    traceback.print_exc()
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
