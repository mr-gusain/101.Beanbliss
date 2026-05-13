import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../components/products/ProductCard';
import { productsAPI } from '../services/api';
import { ArrowRight, ShieldCheck, Store, Truck, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await productsAPI.getAll({ featured: true });
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);


  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.hero-text',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out', force3D: true }
      )
        .fromTo('.hero-image',
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out', force3D: true },
          '-=0.4'
        );

      gsap.fromTo(
        '.feature-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.4,
          force3D: true,
          scrollTrigger: {
            trigger: '.features-section',
            start: 'top 85%',
            once: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950">
      {/* Hero Section */ }
      <section
        ref={ heroRef }
        className="relative min-h-[100vh] flex items-center pt-32 pb-12 overflow-hidden"
      >
        {/* Abstract Background Shapes */ }
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-200/20 dark:bg-primary-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-200/20 dark:bg-accent-800/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-2 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm border border-white/40 dark:border-secondary-700/40 rounded-full text-sm font-semibold text-primary-600 dark:text-primary-400 mb-6 hero-text shadow-sm">
                Credited By: <span className="text-gradient">Rashmi Prasad</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-secondary-900 dark:text-white mb-6 hero-text">
                Future Favorites,<br />
                <span className="text-gradient">Brewed for You.</span>
              </h1>
              <p className="text-lg md:text-xl text-secondary-500 dark:text-secondary-400 mb-8 max-w-lg hero-text leading-relaxed">
                Experience the next generation of coffee. Premium beans, stunning flavor, and unbeatable comfort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 hero-text">
                <Link
                  to="/products"
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary-500/30 hover:-translate-y-1 text-center"
                >
                  Order Now
                </Link>
                <Link
                  to="/products"
                  className="px-8 py-4 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 text-secondary-800 dark:text-secondary-200 font-semibold rounded-xl border border-secondary-200 dark:border-secondary-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 text-center"
                >
                  View Featured
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 hero-image relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"
                  alt="Premium Coffee"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating elements */ }
              <div className="absolute -bottom-12 -left-12 z-20 hidden md:block">
                <div className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-md p-4 rounded-2xl shadow-hard border border-white/40 dark:border-secondary-700/40">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center text-success-600 dark:text-success-400">
                      <Store size={ 24 } />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400 font-medium">Welcome, Sir/Ma'am</p>
                      <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">BeanBliss</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */ }
      <section
        ref={ featuredRef }
        className="py-24 bg-secondary-50 dark:bg-secondary-950 relative"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-2">
                Trending Now
              </h2>
              <p className="text-secondary-500 dark:text-secondary-400">Top picks from our premium collection</p>
            </div>
            <Link
              to="/products"
              className="group flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              View Collection
              <ArrowRight size={ 20 } className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          { loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              { [1, 2, 3, 4].map((n) => (
                <div key={ n } className="h-[400px] bg-white dark:bg-secondary-800 rounded-2xl animate-pulse"></div>
              )) }
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              { featuredProducts.map((product) => (
                <div key={ product._id || product.id } className="product-card">
                  <ProductCard product={ product } />
                </div>
              )) }
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-secondary-800 rounded-2xl shadow-sm">
              <p className="text-secondary-500 dark:text-secondary-400 text-lg">No featured products currently available.</p>
            </div>
          ) }
        </div>
      </section>

      {/* Features / Benefits */ }
      <section className="py-20 bg-white dark:bg-secondary-900 features-section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-item p-8 rounded-2xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 text-center hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                <Truck size={ 28 } />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Free Pastry With Any Coffee</h3>
              <p className="text-secondary-500 dark:text-secondary-400">
                On all orders before 10am. Baked fresh and served warm to your table.
              </p>
            </div>

            <div className="feature-item p-8 rounded-2xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 text-center hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={ 28 } />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Verified Freshness</h3>
              <p className="text-secondary-500 dark:text-secondary-400">
                Every pastry is 100% original recipe, baked fresh daily, and comes with our promise of quality.
              </p>
            </div>

            <div className="feature-item p-8 rounded-2xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-100 dark:border-secondary-700 text-center hover:shadow-medium transition-shadow">
              <div className="w-14 h-14 mx-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
                <Clock size={ 28 } />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Always Fresh</h3>
              <p className="text-secondary-500 dark:text-secondary-400">
                Coffee brewed around the clock. Your perfect cup is just a click away anytime you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */ }
      <section className="py-24 bg-secondary-50 dark:bg-black relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 dark:bg-primary-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 dark:bg-accent-600/30 rounded-full blur-[100px]"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6 tracking-tight">
            Ready to Upgrade Your Coffee Break?
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of happy customers who have found their perfect quiet spot
          </p>
          <Link
            to={ isAuthenticated ? "/products" : "/signup" }
            className="inline-block px-10 py-4 bg-primary-600 text-white hover:bg-primary-700 dark:bg-white dark:text-secondary-900 dark:hover:bg-secondary-100 font-bold rounded-xl shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-white/10 hover:-translate-y-1 transition-all"
          >
            { isAuthenticated ? "Shop Now" : "Create an Account" }
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
