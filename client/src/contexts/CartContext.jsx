import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const loadCart = async () => {
    if (!isAuthenticated()) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
          calculateTotals(parsedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage', error);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const cartData = await cartAPI.get();
      const cartItems = (cartData.items || []).filter(item => item.product != null);
      setCart(cartItems);
      calculateTotals(cartItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Reload cart when token changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadCart();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateTotals = (items) => {
    const itemsTotal = items.reduce((total, item) => total + item.quantity, 0);
    const priceTotal = items.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );
    setTotalItems(itemsTotal);
    setTotalPrice(priceTotal);
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated()) {
      // Fallback to localStorage
      const productId = product._id || product.id;
      const existingItemIndex = cart.findIndex(
        item => (item.product._id || item.product.id) === productId
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = [...cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
      } else {
        updatedCart = [...cart, { product, quantity }];
      }

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotals(updatedCart);
      return;
    }

    try {
      const productId = product._id || product.id;
      if (!productId) throw new Error('Product ID is required');

      const cartData = await cartAPI.addItem(String(productId), quantity);
      const cartItems = (cartData.items || []).filter(item => item.product != null);
      setCart(cartItems);
      calculateTotals(cartItems);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) {
      // Fallback to localStorage
      const updatedCart = cart.filter(item => {
        const id = item._id || (item.product?._id || item.product?.id);
        return id !== itemId;
      });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotals(updatedCart);
      return;
    }

    try {
      const cartData = await cartAPI.removeItem(itemId);
      const cartItems = (cartData.items || []).filter(item => item.product != null);
      setCart(cartItems);
      calculateTotals(cartItems);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (!isAuthenticated()) {
      // Fallback to localStorage
      const updatedCart = cart.map(item => {
        const id = item._id || (item.product?._id || item.product?.id);
        return id === itemId ? { ...item, quantity } : item;
      });
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      calculateTotals(updatedCart);
      return;
    }

    try {
      const cartData = await cartAPI.updateItem(itemId, quantity);
      const cartItems = (cartData.items || []).filter(item => item.product != null);
      setCart(cartItems);
      calculateTotals(cartItems);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) {
      setCart([]);
      localStorage.removeItem('cart');
      calculateTotals([]);
      return;
    }

    try {
      await cartAPI.clear();
      setCart([]);
      calculateTotals([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
