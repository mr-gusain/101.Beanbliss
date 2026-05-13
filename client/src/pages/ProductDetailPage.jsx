import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Truck, ShieldCheck, RotateCcw, Plus, Minus, Check, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/products/ProductCard';
import { productsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, cart } = useCart();
  const productRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getById(id);
        setProduct(data);
        setQuantity(1);
        setAddedToCart(false);

        if (data?.category) {
          const related = await productsAPI.getAll({ category: data.category });
          setRelatedProducts(related.filter(p => (p._id || p.id) !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (productRef.current && product) {
      gsap.fromTo(
        productRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: 'power3.out',
          force3D: true,
        }
      );
    }
  }, [product]);

  const cartItem = cart.find(item => {
    const itemProductId = item.product._id || item.product.id;
    return itemProductId === id;
  });
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const availableStock = product ? (product.stock || 0) - currentCartQuantity : 0;

  const handleQuantityChange = (change) => {
    const newQty = quantity + change;
    if (newQty >= 1 && newQty <= availableStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (availableStock <= 0) {
      alert("Stock limit reached for this item");
      return;
    }

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(error.response?.data?.message || 'Failed to add to cart.');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-secondary-500 dark:text-secondary-400 mt-4 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 text-secondary-500 dark:text-secondary-400">
          <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Products</Link>
          <ChevronRight size={14} />
          <span className="text-secondary-900 dark:text-secondary-100 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div ref={productRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-white dark:bg-secondary-800 rounded-3xl p-8 lg:p-12 flex items-center justify-center border border-secondary-100/50 dark:border-secondary-700/50 shadow-soft">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full max-h-[500px] object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-3">
                {product.category && (
                  <span className="text-xs font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider bg-secondary-100 dark:bg-secondary-800 px-3 py-1 rounded-full">{product.category}</span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-xs font-bold text-warning-700 dark:text-warning-400 uppercase tracking-wider bg-warning-100 dark:bg-warning-900/30 px-3 py-1 rounded-full">Low Stock</span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i}
                      size={18}
                      className={`${i < Math.round(product.rating) ? 'text-warning-400 fill-warning-400' : 'text-secondary-200 dark:text-secondary-600'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                  ({product.rating} rating)
                </span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                {product.discountPrice ? (
                  <>
                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">₹{product.discountPrice.toFixed(2)}</span>
                    <span className="text-lg text-secondary-400 dark:text-secondary-500 line-through">₹{product.price.toFixed(2)}</span>
                    <span className="text-sm font-bold text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20 px-2 py-1 rounded-full">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">₹{product.price.toFixed(2)}</span>
                )}
              </div>

              <p className="text-secondary-600 dark:text-secondary-400 mb-8 leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 mb-3 uppercase tracking-wider">Color</h4>
                  <div className="flex gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary-600 dark:border-primary-400 ring-2 ring-primary-200 dark:ring-primary-800' : 'border-secondary-200 dark:border-secondary-600'} transition-all hover:scale-110`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-secondary-900 dark:text-secondary-100 mb-3 uppercase tracking-wider">Quantity</h4>
                <div className="inline-flex items-center gap-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl px-1 py-1 shadow-sm">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity === 1}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors disabled:opacity-30"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-bold text-lg min-w-[32px] text-center text-secondary-900 dark:text-secondary-100">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= availableStock}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors disabled:opacity-30"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-2">
                  {availableStock > 0 ? `${availableStock} available` : 'Out of stock'}
                </p>
              </div>

              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={availableStock <= 0}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${addedToCart
                    ? 'bg-success-500 text-white shadow-lg'
                    : availableStock > 0
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1'
                      : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 cursor-not-allowed'
                    }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={22} />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={22} />
                      {availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-secondary-100 dark:border-secondary-700">
                <div className="flex items-center gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                  <Truck size={18} className="text-primary-600 dark:text-primary-400 shrink-0" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                  <ShieldCheck size={18} className="text-primary-600 dark:text-primary-400 shrink-0" />
                  2-Year Warranty
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600 dark:text-secondary-400">
                  <RotateCcw size={18} className="text-primary-600 dark:text-primary-400 shrink-0" />
                  30-Day Returns
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map(rp => (
                  <ProductCard key={rp._id || rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
