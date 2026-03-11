import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { productsAPI } from '../services/api';
import { Filter, Search, X, ChevronDown, Star } from 'lucide-react';
import { gsap } from 'gsap';

const ProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchInputRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const handleFocusSearch = () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    };
    window.addEventListener('focusProductSearch', handleFocusSearch);
    return () => window.removeEventListener('focusProductSearch', handleFocusSearch);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (showFeaturedOnly) {
          params.featured = 'true';
        }
        if (searchTerm) {
          params.search = searchTerm;
        }
        const data = await productsAPI.getAll(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, searchTerm, showFeaturedOnly]);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);


  useEffect(() => {
    let filtered = [...products];

    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, sortBy]);


  const toggleFilters = () => {
    setShowFilters(!showFilters);

    if (!showFilters) {
      gsap.fromTo(
        '.mobile-filters',
        { x: '-100%' },
        { x: 0, duration: 0.3, ease: 'power2.out', force3D: true }
      );
    }
  };


  const clearFilters = () => {
    setSelectedCategory('all');
    setShowFeaturedOnly(false);
    setSearchTerm('');
    setPriceRange([0, 5000]);
    setSortBy('featured');
  };


  const handlePriceChange = (e, index) => {
    const value = parseInt(e.target.value);
    const newRange = [...priceRange];

    if (index === 0) {
      if (value > newRange[1]) {
        newRange[1] = value;
      }
      newRange[0] = value;
    } else {
      if (value < newRange[0]) {
        newRange[0] = value;
      }
      newRange[1] = value;
    }
    setPriceRange(newRange);
  };

  const categories = ['Hot Drinks', 'Cold Drinks', 'Pastries & Treats', 'Light Bites', 'Desserts & Sweet Treats'];

  return (
    <div className="pt-28 pb-16 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-3 tracking-tight">
            Our Collection
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 max-w-2xl text-lg">
            Premium coffee, thoughtfully prepared just for you.
          </p>
        </div>

        {/* Search and Sort - Desktop */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4 sticky z-10 bg-secondary-50/95 dark:bg-secondary-950/95 backdrop-blur-sm py-4 transition-all" style={{ top: '65px' }}>
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              type="text"
              ref={searchInputRef}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-3 w-full bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-shadow hover:shadow-md text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 dark:placeholder:text-secondary-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block relative" ref={sortDropdownRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className={`flex items-center gap-2 bg-white dark:bg-secondary-800 px-4 py-3 rounded-xl border ${showSortDropdown ? 'border-primary-500' : 'border-secondary-200 dark:border-secondary-700'} shadow-sm hover:border-primary-500 dark:hover:border-primary-500 transition-colors`}
              >
                <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Sort by:</span>
                <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 min-w-[120px] text-left">
                  {sortBy === 'featured' ? 'Featured' : 
                   sortBy === 'price-low' ? 'Price: Low to High' : 
                   sortBy === 'price-high' ? 'Price: High to Low' : 
                   'Highest Rated'}
                </span>
                <ChevronDown size={16} className={`text-secondary-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-secondary-800 rounded-xl shadow-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden z-50 py-1 transition-all duration-200 origin-top-right ${showSortDropdown ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}
              >
                <button
                  onClick={() => { setSortBy('featured'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === 'featured' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'}`}
                >
                  Featured
                </button>
                <button
                  onClick={() => { setSortBy('price-low'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === 'price-low' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortBy('price-high'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === 'price-high' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'}`}
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortBy === 'rating' ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'}`}
                >
                  Highest Rated
                </button>
              </div>
            </div>

            <button
              onClick={toggleFilters}
              className="lg:hidden flex items-center justify-center flex-1 gap-2 p-3 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-sm text-secondary-900 dark:text-secondary-100 font-medium"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-soft sticky top-40 border border-transparent dark:border-secondary-700">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-secondary-900 dark:text-white">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 uppercase tracking-wider"
                  >
                    Reset
                  </button>
                </div>

                <div className="mb-8">
                  <div className="p-4 mb-6 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/10 dark:to-primary-900/5 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${showFeaturedOnly ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105' : 'bg-white dark:bg-secondary-800 text-primary-500 shadow-sm group-hover:scale-105'}`}>
                          <Star size={18} className={`transition-all duration-300 ${showFeaturedOnly ? 'fill-white' : 'fill-primary-500/20 group-hover:fill-primary-500/40'}`} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-secondary-900 dark:text-white transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">Featured Only</span>
                          <span className="block text-xs text-secondary-500 dark:text-secondary-400">Exclusive items</span>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={showFeaturedOnly}
                          onChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
                        />
                        <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 dark:after:border-secondary-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:border-primary-600 shadow-inner"></div>
                      </div>
                    </label>
                  </div>

                  <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Categories</h4>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        id="all"
                        name="category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="h-4 w-4 text-primary-600 border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span className={`ml-3 text-sm transition-colors ${selectedCategory === 'all' ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-900 dark:group-hover:text-secondary-200'}`}>
                        All Items
                      </span>
                    </label>
                    {categories.map(category => (
                      <label key={category} className="flex items-center group cursor-pointer">
                        <input
                          type="radio"
                          id={category}
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-4 w-4 text-primary-600 border-secondary-300 dark:border-secondary-600 focus:ring-primary-500 cursor-pointer"
                        />
                        <span className={`ml-3 text-sm capitalize transition-colors ${selectedCategory === category ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-900 dark:group-hover:text-secondary-200'}`}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Price Range</h4>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs text-secondary-500 dark:text-secondary-400">Min Price</label>
                          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">${priceRange[0]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={priceRange[0]}
                          onChange={e => handlePriceChange(e, 0)}
                          className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs text-secondary-500 dark:text-secondary-400">Max Price</label>
                          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">${priceRange[1]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={priceRange[1]}
                          onChange={e => handlePriceChange(e, 1)}
                          className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mobile-filters fixed inset-0 bg-white dark:bg-secondary-900 z-50 overflow-auto lg:hidden">
              <div className="p-4 border-b border-secondary-100 dark:border-secondary-700 flex justify-between items-center sticky top-0 bg-white dark:bg-secondary-900">
                <h3 className="font-bold text-lg text-secondary-900 dark:text-white">Filters</h3>
                <button onClick={toggleFilters} className="p-2 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-full">
                  <X size={24} className="text-secondary-500 dark:text-secondary-400" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <div className="p-4 mb-6 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/10 dark:to-primary-900/5 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${showFeaturedOnly ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30 scale-105' : 'bg-white dark:bg-secondary-800 text-primary-500 shadow-sm group-hover:scale-105'}`}>
                          <Star size={18} className={`transition-all duration-300 ${showFeaturedOnly ? 'fill-white' : 'fill-primary-500/20 group-hover:fill-primary-500/40'}`} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-secondary-900 dark:text-white transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">Featured Only</span>
                          <span className="block text-xs text-secondary-500 dark:text-secondary-400">Exclusive items</span>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={showFeaturedOnly}
                          onChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
                        />
                        <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 dark:after:border-secondary-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-checked:after:border-primary-600 shadow-inner"></div>
                      </div>
                    </label>
                  </div>

                  <h4 className="font-bold mb-4 text-secondary-900 dark:text-white">Categories</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="mobile-all"
                        name="mobile-category"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                      />
                      <label htmlFor="mobile-all" className="ml-3 text-secondary-700 dark:text-secondary-300 font-medium">
                        All Items
                      </label>
                    </div>
                    {categories.map(category => (
                      <div key={`mobile-${category}`} className="flex items-center">
                        <input
                          type="radio"
                          id={`mobile-${category}`}
                          name="mobile-category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="h-5 w-5 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`mobile-${category}`} className="ml-3 text-secondary-700 dark:text-secondary-300 font-medium capitalize">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold mb-4 text-secondary-900 dark:text-white">Price Range</h4>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-secondary-500 dark:text-secondary-400">Min Price</label>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">${priceRange[0]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="50"
                        value={priceRange[0]}
                        onChange={e => handlePriceChange(e, 0)}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm text-secondary-500 dark:text-secondary-400">Max Price</label>
                        <span className="font-medium text-secondary-900 dark:text-secondary-100">${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="50"
                        value={priceRange[1]}
                        onChange={e => handlePriceChange(e, 1)}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-secondary-100 dark:border-secondary-700">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 font-semibold rounded-xl"
                  >
                    Reset
                  </button>
                  <button
                    onClick={toggleFilters}
                    className="flex-1 py-3 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30"
                  >
                    Show Results
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-100 dark:border-secondary-700 border-dashed">
                <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-secondary-50 dark:bg-secondary-700">
                  <Search size={32} className="text-secondary-400 dark:text-secondary-500" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">No products found</h3>
                <p className="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md">
                  We couldn't find any products that match your search or filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/25"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    <p className="text-secondary-500 dark:text-secondary-400 mt-4 font-medium">Loading collection...</p>
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <div key={product._id || product.id} className="product-card h-full">
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;