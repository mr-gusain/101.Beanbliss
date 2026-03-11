import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, Truck, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { gsap } from 'gsap';
import { getImageUrl } from '../utils/imageUtils';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const cartRef = useRef(null);

  useEffect(() => {
    if (cartRef.current) {
      gsap.fromTo(
        cartRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  }, []);

  const handleRemoveItem = (itemId) => {
    const itemEl = document.getElementById(`cart-item-${itemId}`);
    if (itemEl) {
      gsap.to(itemEl, {
        opacity: 0,
        x: -30,
        height: 0,
        marginBottom: 0,
        padding: 0,
        duration: 0.25,
        ease: 'power2.in',
        force3D: true,
        onComplete: () => removeFromCart(itemId),
      });
    } else {
      removeFromCart(itemId);
    }
  };

  const handleQuantityChange = (itemId, newQuantity, stock) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950 flex flex-col items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4" ref={cartRef}>
          <div className="w-24 h-24 bg-white dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft border border-secondary-100 dark:border-secondary-700">
            <ShoppingBag size={40} className="text-secondary-400 dark:text-secondary-500" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4 tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8 text-lg">
            Discover premium coffee and add something delicious to your day.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1"
          >
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice > 150 ? 0 : 9.99;
  const estimatedTotal = totalPrice + shippingCost;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={cartRef}>
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white tracking-tight">
              Shopping Cart
              <span className="text-primary-600 dark:text-primary-400 ml-3">({totalItems})</span>
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="hidden md:flex items-center gap-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const product = item.product;
                const productId = product._id || product.id;
                const itemId = item._id || productId;

                return (
                  <div
                    key={itemId}
                    id={`cart-item-${itemId}`}
                    className="bg-white dark:bg-secondary-800 rounded-2xl shadow-sm overflow-hidden border border-secondary-100 dark:border-secondary-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-6 flex gap-6 items-center">
                      <Link to={`/products/${productId}`} className="shrink-0 w-24 h-24">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${productId}`}
                          className="font-bold text-secondary-900 dark:text-secondary-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-lg block truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 capitalize mt-1">{product.category}</p>

                        <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
                          <div className="flex items-center gap-2 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl px-1 py-1 border border-secondary-100 dark:border-secondary-600">
                            <button
                              onClick={() => handleQuantityChange(itemId, item.quantity - 1, product.stock)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-white dark:hover:bg-secondary-600 disabled:opacity-30 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-secondary-900 dark:text-secondary-100 text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(itemId, item.quantity + 1, product.stock)}
                              disabled={item.quantity >= product.stock}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-white dark:hover:bg-secondary-600 disabled:opacity-30 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              ${((product.discountPrice || product.price) * item.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => handleRemoveItem(itemId)}
                              className="p-2 text-secondary-400 dark:text-secondary-500 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                              title="Remove Item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-secondary-800 rounded-2xl shadow-soft p-8 sticky top-28 border border-secondary-100 dark:border-secondary-700">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-secondary-600 dark:text-secondary-400">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-secondary-600 dark:text-secondary-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-secondary-900 dark:text-secondary-100">
                      {shippingCost === 0 ? (
                        <span className="text-success-600 dark:text-success-400">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 bg-secondary-50 dark:bg-secondary-700/50 p-3 rounded-lg border border-secondary-100 dark:border-secondary-600 flex items-center gap-2">
                      <Truck size={14} className="shrink-0 text-primary-500 dark:text-primary-400" />
                      Add ${(150 - totalPrice).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-secondary-100 dark:border-secondary-700 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-secondary-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">${estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-8 w-full flex items-center justify-center gap-2 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>

                <div className="mt-6 space-y-3 text-xs text-secondary-500 dark:text-secondary-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-success-500 dark:text-success-400 shrink-0" />
                    Secure checkout with SSL encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-primary-500 dark:text-primary-400 shrink-0" />
                    Best price guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
