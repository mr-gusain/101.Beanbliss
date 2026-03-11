import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { getImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();

  const cartItem = cart.find(item => {
    const itemProductId = item.product._id || item.product.id;
    const currentProductId = product?._id || product?.id;
    return itemProductId === currentProductId;
  });
  const currentCartQuantity = cartItem ? cartItem.quantity : 0;
  const availableStock = (product?.stock || 0) - currentCartQuantity;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (availableStock <= 0) {
      alert("Stock limit reached for this item");
      return;
    }

    try {
      await addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart.';
      alert(errorMessage);
    }
  };

  return (
    <div
      className="group relative bg-white dark:bg-secondary-800 rounded-3xl overflow-hidden shadow-soft hover:shadow-hard transition-shadow duration-300 h-full flex flex-col border border-secondary-100/50 dark:border-secondary-700/50"
    >
      <Link to={`/products/${product._id || product.id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary-50 dark:bg-secondary-900/50 p-6 flex items-center justify-center">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform transition-transform duration-300 will-change-transform group-hover:scale-110"
          />

          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-4 left-4 bg-error-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wider uppercase">
              Sale
            </div>
          )}

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-4 right-4 bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 text-[10px] font-bold px-3 py-1 rounded-full border border-warning-200 dark:border-warning-700 uppercase tracking-wider">
              Low Stock
            </div>
          )}

          {/* Quick Add Button (Visible on Hover) */}

        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-3">
            <span className="text-secondary-500 dark:text-secondary-400 text-xs font-bold tracking-wider uppercase bg-secondary-50 dark:bg-secondary-700/50 px-2 py-1 rounded-md">
              {product.category || 'Tech'}
            </span>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-warning-400 fill-warning-400" />
              <span className="text-sm font-bold text-secondary-900 dark:text-secondary-100">{product.rating}</span>
            </div>
          </div>

          <h3 className="font-bold text-lg text-secondary-900 dark:text-secondary-100 mb-2 line-clamp-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-secondary-500 dark:text-secondary-400 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
            {product.description}
          </p>

          <div className="pt-4 border-t border-secondary-100 dark:border-secondary-700 flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              {product.discountPrice ? (
                <>
                  <span className="text-xs text-secondary-400 dark:text-secondary-500 line-through font-medium mb-0.5">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs text-transparent select-none mb-0.5">.</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    ${product.price ? product.price.toFixed(2) : 'N/A'}
                  </span>
                </>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={availableStock <= 0}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${availableStock > 0
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50"
                : "bg-secondary-100 dark:bg-secondary-800 text-secondary-400 cursor-not-allowed"
                }`}
              aria-label={availableStock > 0 ? "Add to cart" : "Out of stock"}
              title={availableStock > 0 ? "Add to Cart" : "Out of Stock"}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
