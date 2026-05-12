from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    shippingMethod = Column(String(50), default="standard")
    shippingCost = Column(Float, default=0.0)
    taxAmount = Column(Float, default=0.0)
    subtotal = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(50), default="Pending")
    paymentMethod = Column(String(50), default="Card")
    paymentStatus = Column(String(50), default="Pending")

    # Shipping info flattened into the orders table
    ship_firstName = Column(String(100), nullable=True)
    ship_lastName = Column(String(100), nullable=True)
    ship_email = Column(String(255), nullable=True)
    ship_phone = Column(String(50), nullable=True)
    ship_address = Column(String(500), nullable=True)
    ship_city = Column(String(100), nullable=True)
    ship_state = Column(String(100), nullable=True)
    ship_zipCode = Column(String(20), nullable=True)
    ship_country = Column(String(100), nullable=True)

    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan", lazy="selectin")
    user = relationship("User", lazy="selectin")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", lazy="selectin")
