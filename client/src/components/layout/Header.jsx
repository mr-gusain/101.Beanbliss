import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Search, Package, Coffee, CupSoda, Croissant, Sandwich, Cookie, Heart, Star, IceCream } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

const SEARCH_FOCUS_EVENT = 'focusProductSearch';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle mobile menu animation 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(
        '.mobile-menu',
        { opacity: 0, height: 0 },
        { opacity: 1, height: 'auto', duration: 0.3, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.mobile-link',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.25, delay: 0.05, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle scroll behavior (throttled with rAF)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle user menu outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Common styles
  const textColorClass = isScrolled
    ? 'text-secondary-900 dark:text-secondary-100'
    : 'text-secondary-800 dark:text-secondary-100';
  const iconHoverClass = 'hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-primary-600 dark:hover:text-primary-400';

  return (
    <>
      <header
        ref={ headerRef }
        className={ `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? 'bg-white/90 dark:bg-secondary-900/90 backdrop-blur-md shadow-sm py-3 border-b border-secondary-100 dark:border-secondary-800'
          : 'bg-transparent py-6'
          }` }
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */ }
            <Link to="/" className="flex items-center gap-2 group relative z-50">
              <span className={ `text-2xl font-bold tracking-tight transition-colors duration-300 ${textColorClass}` } style={ { letterSpacing: '-2.5px' } }>
                Bean<span className="text-primary-600 dark:text-primary-400">Bliss</span>
              </span>
            </Link>

            {/* Desktop Navigation */ }
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/"
                className={ `text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 relative group ${textColorClass} hover:text-primary-600 dark:hover:text-primary-400` }
              >
                Home
                <span className={ `absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full` }></span>
              </Link>

              {/* Categories Dropdown */ }
              <div className="relative group/cat">
                <button className={ `flex items-center gap-1 text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 group ${textColorClass} hover:text-primary-600 dark:hover:text-primary-400` }>
                  Categories
                  <ChevronDown size={ 14 } className="stroke-[3px] transition-transform duration-300 group-hover/cat:rotate-180" />
                </button>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transform opacity-0 scale-95 translate-y-2 invisible group-hover/cat:opacity-100 group-hover/cat:scale-100 group-hover/cat:translate-y-0 group-hover/cat:visible transition-all duration-300 origin-top z-50">
                  <div className="p-2 space-y-1">
                    { [
                      { id: 'Hot Drinks', name: 'Hot Drinks', icon: <Coffee size={ 18 } />, color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' },
                      { id: 'Cold Drinks', name: 'Cold Drinks', icon: <CupSoda size={ 18 } />, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
                      { id: 'Pastries & Treats', name: 'Pastries & Treats', icon: <Croissant size={ 18 } />, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30' },
                      { id: 'Light Bites', name: 'Light Bites', icon: <Sandwich size={ 18 } />, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
                      { id: 'Desserts & Sweet Treats', name: 'Desserts & Sweet Treats', icon: <Cookie size={ 18 } />, color: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30' },
                    ].map((cat) => (
                      <Link
                        key={ cat.id }
                        to={ `/products?category=${cat.id}` }
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors group/item"
                      >
                        <div className={ `w-8 h-8 rounded-lg flex items-center justify-center ${cat.color} group-hover/item:scale-110 transition-transform` }>
                          { cat.icon }
                        </div>
                        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors">
                          { cat.name }
                        </span>
                      </Link>
                    )) }
                    <div className="h-px bg-secondary-100 dark:bg-secondary-700 my-1 mx-2"></div>
                    <Link
                      to="/products"
                      className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
                {/* Bridge to prevent closing on gap */ }
                <div className="absolute top-full left-0 w-full h-4 bg-transparent"></div>
              </div>

              <Link
                to="/faqs"
                className={ `text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 relative group ${textColorClass} hover:text-primary-600 dark:hover:text-primary-400` }
              >
                FAQs
                <span className={ `absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full` }></span>
              </Link>

              <Link
                to="/contact"
                className={ `text-sm font-bold tracking-wide transition-all duration-300 hover:-translate-y-0.5 relative group ${textColorClass} hover:text-primary-600 dark:hover:text-primary-400` }
              >
                Contact Us
                <span className={ `absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 transition-all duration-300 group-hover:w-full` }></span>
              </Link>
            </nav>

            {/* Desktop Actions */ }
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */ }
              <ThemeToggle />

              <button
                onClick={ () => {
                  navigate('/products');
                  setTimeout(() => window.dispatchEvent(new Event(SEARCH_FOCUS_EVENT)), 100);
                } }
                className={ `p-2 rounded-full transition-all duration-300 ${textColorClass} ${iconHoverClass}` }
                aria-label="Search products"
              >
                <Search size={ 20 } className="stroke-[2.5px]" />
              </button>

              <Link
                to="/cart"
                className={ `relative p-2 rounded-full transition-all duration-300 group ${textColorClass} ${iconHoverClass}` }
              >
                <ShoppingCart size={ 20 } className="stroke-[2.5px]" />
                { totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-secondary-900 group-hover:scale-110 transition-transform">
                    { totalItems }
                  </span>
                ) }
              </Link>

              { isAuthenticated ? (
                <div className="relative" ref={ userMenuRef }>
                  <button
                    onClick={ () => setShowUserMenu(!showUserMenu) }
                    className={ `flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-300 border ${isScrolled
                      ? 'bg-secondary-50 dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 hover:border-primary-200 dark:hover:border-primary-700'
                      : 'bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border-secondary-200 dark:border-secondary-700 text-secondary-900 dark:text-secondary-100 hover:bg-white/80 dark:hover:bg-secondary-800/80'
                      }` }
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      { user?.firstName?.charAt(0) }
                    </div>
                    <span className="text-sm font-bold max-w-[80px] truncate">{ user?.firstName }</span>
                    <ChevronDown size={ 14 } className={ `transition-transform duration-300 stroke-[3px] ${showUserMenu ? 'rotate-180' : ''}` } />
                  </button>

                  {/* Dropdown Menu */ }
                  <div className={ `absolute right-0 mt-3 w-60 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-all duration-300 origin-top-right transform ${showUserMenu ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
                    }` }>
                    <div className="p-4 border-b border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-900/50">
                      <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100 truncate">{ user?.firstName } { user?.lastName }</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{ user?.email }</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to="/account"
                        onClick={ () => setShowUserMenu(false) }
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <User size={ 16 } />
                        My Account
                      </Link>
                      <button
                        onClick={ () => {
                          setShowUserMenu(false);
                          navigate('/account');
                          setTimeout(() => window.dispatchEvent(new CustomEvent('switchAccountSection', { detail: 'orders' })), 100);
                        } }
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <Package size={ 16 } />
                        My Orders
                      </button>
                      { user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={ () => setShowUserMenu(false) }
                          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <div className="w-4 h-4 rounded bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">A</span>
                          </div>
                          Admin Dashboard
                        </Link>
                      ) }
                      <div className="h-px bg-secondary-100 dark:bg-secondary-700 my-1 mx-2"></div>
                      <button
                        onClick={ handleLogout }
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-error-600 dark:text-error-400 rounded-xl hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                      >
                        <LogOut size={ 16 } />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className={ `text-sm font-bold transition-colors ${textColorClass} hover:text-primary-600 dark:hover:text-primary-400` }
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-secondary-900 dark:bg-primary-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:-translate-y-0.5 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              ) }
            </div>

            {/* Mobile Toggle */ }
            <div className="flex lg:hidden items-center gap-3">
              <ThemeToggle />
              <Link
                to="/cart"
                className={ `relative p-1 ${textColorClass}` }
              >
                <ShoppingCart size={ 24 } className="stroke-[2.5px]" />
                { totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white dark:ring-secondary-900">
                    { totalItems }
                  </span>
                ) }
              </Link>
              <button
                onClick={ () => setIsOpen(!isOpen) }
                className={ `p-1 z-50 relative transition-transform duration-300 ${isOpen ? 'rotate-90 text-secondary-900 dark:text-secondary-100' : textColorClass}` }
              >
                { isOpen ? <X size={ 28 } className="stroke-[2.5px]" /> : <Menu size={ 28 } className="stroke-[2.5px]" /> }
              </button>
            </div>
          </div>
        </div>
      </header >

      {/* Mobile Menu Overlay */ }
      {
        isOpen && (
          <div
            className="fixed inset-0 z-40 bg-secondary-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={ () => setIsOpen(false) }
          />
        )
      }

      {/* Mobile Menu */ }
      <div className={ `mobile-menu fixed top-0 left-0 right-0 z-40 bg-white dark:bg-secondary-900 shadow-2xl lg:hidden transition-all duration-500 rounded-b-3xl ${isOpen ? 'max-h-screen opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'}` }>
        <div className="pt-28 pb-10 px-6 container mx-auto">
          <nav className="flex flex-col space-y-2">
            <Link to="/" className="mobile-link flex items-center justify-between p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 font-bold text-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              Home <ChevronDown size={ 18 } className="-rotate-90 text-secondary-400" />
            </Link>
            <Link to="/faqs" className="mobile-link flex items-center justify-between p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 font-bold text-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              FAQs <ChevronDown size={ 18 } className="-rotate-90 text-secondary-400" />
            </Link>
            <Link to="/contact" className="mobile-link flex items-center justify-between p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 font-bold text-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              Contact Us <ChevronDown size={ 18 } className="-rotate-90 text-secondary-400" />
            </Link>
            <Link to="/products" className="mobile-link flex items-center justify-between p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 font-bold text-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
              Products <ChevronDown size={ 18 } className="-rotate-90 text-secondary-400" />
            </Link>

            <div className="mobile-link my-2 pl-4 border-l-2 border-secondary-100 dark:border-secondary-700">
              <button
                onClick={ () => setIsMobileCategoryOpen(!isMobileCategoryOpen) }
                className="w-full flex items-center justify-between py-2 pr-2 text-lg font-bold text-secondary-900 dark:text-secondary-100"
              >
                Categories
                <ChevronDown
                  size={ 18 }
                  className={ `text-secondary-400 transition-transform duration-300 ${isMobileCategoryOpen ? 'rotate-180' : ''}` }
                />
              </button>

              <div className={ `overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}` }>
                <div className="pt-2 pb-2 space-y-1">
                  { [
                    { id: 'Hot Drinks', name: 'Hot Drinks' },
                    { id: 'Cold Drinks', name: 'Cold Drinks' },
                    { id: 'Pastries & Treats', name: 'Pastries & Treats' },
                    { id: 'Light Bites', name: 'Light Bites' },
                    { id: 'Desserts & Sweet Treats', name: 'Desserts & Sweet Treats' },
                  ].map((cat) => (
                    <Link
                      key={ cat.id }
                      to={ `/products?category=${cat.id}` }
                      className="block py-2 text-secondary-600 dark:text-secondary-400 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      onClick={ () => setIsOpen(false) }
                    >
                      { cat.name }
                    </Link>
                  )) }
                </div>
              </div>
            </div>

            <div className="h-px bg-secondary-100 dark:bg-secondary-700 my-4 mobile-link"></div>

            { isAuthenticated ? (
              <>
                <div className="mobile-link flex items-center gap-4 p-4 rounded-2xl border border-secondary-100 dark:border-secondary-700 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                    { user?.firstName?.charAt(0) }
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900 dark:text-secondary-100">{ user?.firstName } { user?.lastName }</p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">{ user?.email }</p>
                  </div>
                </div>

                <Link to="/account" className="mobile-link flex items-center gap-3 p-4 rounded-2xl hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-semibold transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
                    <User size={ 18 } />
                  </div>
                  My Account
                </Link>
                <button
                  onClick={ () => {
                    setIsOpen(false);
                    navigate('/account');
                    setTimeout(() => window.dispatchEvent(new CustomEvent('switchAccountSection', { detail: 'orders' })), 100);
                  } }
                  className="mobile-link w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-semibold transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
                    <Package size={ 18 } />
                  </div>
                  My Orders
                </button>
                <button
                  onClick={ handleLogout }
                  className="mobile-link w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-error-50 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 font-semibold transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-error-50 dark:bg-error-900/30 flex items-center justify-center text-error-500 dark:text-error-400">
                    <LogOut size={ 18 } />
                  </div>
                  Sign Out
                </button>
              </>
            ) : (
              <div className="mobile-link grid grid-cols-2 gap-4 mt-2">
                <Link to="/login" className="py-4 text-center text-secondary-900 dark:text-secondary-100 font-bold rounded-xl border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="py-4 text-center bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            ) }
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;