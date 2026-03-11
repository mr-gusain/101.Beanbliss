import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, Phone, MapPin, Instagram, Github, Linkedin, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.footer-content > *',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer ref={ footerRef } className="bg-white dark:bg-black text-secondary-600 dark:text-secondary-300 relative overflow-hidden transition-colors duration-300 border-t border-secondary-200 dark:border-transparent">
      {/* Decorative Background */ }
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Newsletter Section */ }
        <div className="py-16 border-b border-secondary-200 dark:border-secondary-800/50">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-white mb-4 tracking-tight">
              Stay in the Cozy loop
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 mb-8 text-lg">
              Join our inner circle for exclusive treats, cozy deals, and a little peace and quiet.
            </p>
            <form onSubmit={ handleSubscribe } className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail size={ 18 } className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500" />
                <input
                  type="email"
                  value={ email }
                  onChange={ (e) => setEmail(e.target.value) }
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-secondary-50 dark:bg-secondary-900/80 border border-secondary-200 dark:border-secondary-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-600 font-medium transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={ subscribed }
                className={ `px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${subscribed
                  ? 'bg-success-500 text-white'
                  : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  }` }
              >
                { subscribed ? '✓ Subscribed!' : <><Send size={ 18 } /> Subscribe</> }
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */ }
        <div className="footer-content py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {/* Brand Column */ }
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white" style={ { letterSpacing: '-2.5px' } }>
                Bean<span className="text-primary-600 dark:text-primary-500">Bliss</span>
              </span>
            </Link>
            <p className="text-secondary-600 dark:text-secondary-400 mb-8 leading-relaxed text-sm">
              A small, peaceful cafeteria where soft light, gentle music, and the aroma of coffee create a cozy retreat from the outside world.
            </p>
            <div className="flex gap-3">
              { [
                { icon: <Instagram size={ 18 } />, href: 'https://www.instagram.com/rashmi._prasad/', label: 'Instagram' },
                { icon: <Github size={ 18 } />, href: 'https://github.com/cnrashmi', label: 'GitHub' },
                { icon: <Linkedin size={ 18 } />, href: '', label: 'LinkedIn' },
              ].map(social => (
                <a
                  key={ social.label }
                  href={ social.href }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900 rounded-xl flex items-center justify-center text-secondary-600 dark:text-secondary-500 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white dark:hover:text-white transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary-600/20"
                  aria-label={ social.label }
                >
                  { social.icon }
                </a>
              )) }
            </div>
          </div>

          {/* Quick Links */ }
          <div>
            <h4 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3">
              { [
                { label: 'All Item', path: '/products' },
                { label: 'Cappuccino', path: '/products?category=Hot Drinks' },
                { label: ' Latte', path: '/products?category=Cold Drinks' },
                { label: 'Espresso', path: '/products?category=Hot Drinks' },
                { label: 'Macchiato', path: '/products?category=Hot Drinks' },
              ].map(link => (
                <li key={ link.label }>
                  <Link
                    to={ link.path }
                    className="text-secondary-600 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-white transition-colors text-sm font-medium group flex items-center gap-1"
                  >
                    { link.label }
                    <ArrowUpRight size={ 14 } className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0" />
                  </Link>
                </li>
              )) }
            </ul>
          </div>

          {/* Support */ }
          <div>
            <h4 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              { ['Palce Order', 'Returns & Refunds', 'About', 'FAQs', 'Contact Us'].map(item => (
                <li key={ item }>
                  <span className="text-secondary-600 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-white transition-colors text-sm font-medium cursor-pointer">
                    { item }
                  </span>
                </li>
              )) }
            </ul>
          </div>

          {/* Contact */ }
          <div>
            <h4 className="text-sm font-bold text-secondary-900 dark:text-white uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-secondary-600 dark:text-secondary-500">
              <li className="flex items-start gap-3 hover:text-primary-600 dark:hover:text-white transition-colors">
                <MapPin size={ 16 } className="mt-0.5 shrink-0 text-primary-600 dark:text-primary-500" />
                <span>New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-white transition-colors">
                <Phone size={ 16 } className="shrink-0 text-primary-600 dark:text-primary-500" />
                +91 98765-43211
              </li>
              <li className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-white transition-colors">
                <Mail size={ 16 } className="shrink-0 text-primary-600 dark:text-primary-500" />
                beanbliss@gmail.com
              </li>
              <li className="flex items-center gap-3 hover:text-primary-600 dark:hover:text-white transition-colors">
                <Mail size={ 16 } className="shrink-0 text-primary-600 dark:text-primary-500" />
                support@beanbliss.com
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */ }
        <div className="border-t border-secondary-200 dark:border-secondary-800/50 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 dark:text-secondary-600 text-sm font-medium">
            © { new Date().getFullYear() } BeanBliss. All rights reserved.
          </p>
          <div className="flex gap-6 text-secondary-500 dark:text-secondary-600 text-sm font-medium">
            <span className="hover:text-primary-600 dark:hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-primary-600 dark:hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-primary-600 dark:hover:text-white transition-colors cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
