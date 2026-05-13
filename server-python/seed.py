import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal, engine, Base
from models.product import Product
from models.user import User
from core.security import get_password_hash

async def seed_data():
    async with AsyncSessionLocal() as session:
        # 1. Create an Admin User
        admin_email = "admin@beanbliss.com"
        from sqlalchemy import select
        result = await session.execute(select(User).where(User.email == admin_email))
        admin = result.scalars().first()
        
        if not admin:
            admin = User(
                firstName="Admin",
                lastName="BeanBliss",
                email=admin_email,
                password=get_password_hash("admin123"),
                role="admin",
                phone="1234567890"
            )
            session.add(admin)
            print("Admin user created (admin@beanbliss.com / admin123)")

        # 2. Add Coffee Products
        products = [
            {
                "name": "Midnight Espresso",
                "description": "A bold, intense shot of pure energy. Dark roasted beans with a velvety crema and notes of dark chocolate.",
                "price": 3.50,
                "category": "Espresso",
                "image": "https://images.unsplash.com/photo-1510707577719-af7c183f1e59?auto=format&fit=crop&q=80&w=800",
                "stock": 100,
                "featured": True
            },
            {
                "name": "Classic Cappuccino",
                "description": "Perfectly balanced espresso with equal parts steamed milk and dense milk foam. Dusted with premium cocoa.",
                "price": 4.50,
                "category": "Classic",
                "image": "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800",
                "stock": 85,
                "featured": True
            },
            {
                "name": "Vanilla Silk Latte",
                "description": "Smooth espresso combined with creamy steamed milk and a hint of Madagascar vanilla bean syrup.",
                "price": 5.25,
                "category": "Signature",
                "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
                "stock": 120,
                "featured": True
            },
            {
                "name": "Caramel Macchiato",
                "description": "Freshly steamed milk with vanilla-flavored syrup marked with espresso and topped with a caramel drizzle.",
                "price": 5.50,
                "category": "Signature",
                "image": "https://images.unsplash.com/photo-1485808191679-5f63bb3fd24b?auto=format&fit=crop&q=80&w=800",
                "stock": 90,
                "featured": False
            },
            {
                "name": "Nitro Cold Brew",
                "description": "Slow-steeped for 20 hours and infused with nitrogen for a naturally sweet flavor and cascading velvety crema.",
                "price": 4.95,
                "category": "Cold",
                "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=800",
                "stock": 50,
                "featured": True
            },
            {
                "name": "Mocha Fusion",
                "description": "Rich espresso combined with bittersweet chocolate sauce and steamed milk, topped with whipped cream.",
                "price": 5.75,
                "category": "Classic",
                "image": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=800",
                "stock": 70,
                "featured": False
            }
        ]

        for p_data in products:
            result = await session.execute(select(Product).where(Product.name == p_data["name"]))
            existing = result.scalars().first()
            if not existing:
                product = Product(**p_data)
                session.add(product)
                print(f"Added product: {p_data['name']}")

        await session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    # Ensure tables exist
    async def main():
        async with engine.begin() as conn:
            # Re-import models for Base.metadata
            import models.user
            import models.product
            import models.order
            import models.cart
            import models.contact
            await conn.run_sync(Base.metadata.create_all)
        await seed_data()
    
    asyncio.run(main())
