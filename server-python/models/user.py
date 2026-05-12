from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    firstName = Column(String(100), nullable=False)
    lastName = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(20), default="user")
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    addresses = relationship("UserAddress", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    paymentMethods = relationship("UserPaymentMethod", back_populates="user", cascade="all, delete-orphan", lazy="selectin")
    notifications = relationship("UserNotification", back_populates="user", cascade="all, delete-orphan", lazy="selectin")


class UserAddress(Base):
    __tablename__ = "user_addresses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="Home")
    street = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zipCode = Column(String(20), nullable=True)
    country = Column(String(100), nullable=True)
    isDefault = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class UserPaymentMethod(Base):
    __tablename__ = "user_payment_methods"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50))
    last4 = Column(String(4), nullable=True)
    brand = Column(String(50), nullable=True)
    expiryDate = Column(String(10), nullable=True)
    isDefault = Column(Boolean, default=False)

    user = relationship("User", back_populates="paymentMethods")


class UserNotification(Base):
    __tablename__ = "user_notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), default="info")
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    createdAt = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
