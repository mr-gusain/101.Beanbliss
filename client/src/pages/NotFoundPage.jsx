import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';

const NotFoundPage = () => {
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200 dark:bg-primary-800 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-200 dark:bg-secondary-800 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-primary-600 leading-none select-none drop-shadow-sm">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-10">
              <AlertTriangle size={200} className="text-secondary-900 dark:text-secondary-100" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6 tracking-tight">
            Page Not Found
          </h2>

          <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <form onSubmit={handleSearch} className="bg-white dark:bg-secondary-800 p-2 rounded-2xl shadow-soft border border-secondary-200 dark:border-secondary-700 max-w-md mx-auto mb-10 flex items-center">
            <Search className="text-secondary-400 dark:text-secondary-500 ml-4 shrink-0" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 font-medium"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white rounded-xl px-6 py-2.5 font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1"
            >
              <Home size={20} />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 font-bold rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white hover:border-secondary-300 dark:hover:border-secondary-600 transition-all shadow-sm hover:shadow"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
