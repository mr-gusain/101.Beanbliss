import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, ArrowRight, ShoppingBag, FileText } from 'lucide-react';
import { gsap } from 'gsap';

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const playTone = (freq, time, type = 'sine', duration = 0.8) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + time);

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.2, now + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.start(now + time);
      osc.stop(now + time + duration);
    };

    playTone(523.25, 0, 'sine', 0.6);
    playTone(659.25, 0.1, 'sine', 0.6);
    playTone(783.99, 0.2, 'sine', 0.6);
    playTone(1046.50, 0.3, 'sine', 0.8);
    playTone(1174.66, 0.4, 'sine', 1.2);

    playTone(2093.00, 0.4, 'triangle', 0.5);

  } catch (err) {
    console.error('Failed to play success sound', err);
  }
};

const ThankYouPage = () => {
  const contentRef = useRef(null);
  const hasPlayedSound = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) return;

    if (!hasPlayedSound.current) {
      playSuccessSound();
      hasPlayedSound.current = true;
    }

    if (contentRef.current) {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          contentRef.current.querySelector('.check-icon'),
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        )
        .fromTo(
          contentRef.current.querySelector('h1'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          contentRef.current.querySelectorAll('.fade-in'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
    }
  }, [order, navigate]);

  if (!order) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950 flex flex-col items-center justify-center">
        <div className="bg-white dark:bg-secondary-800 p-10 rounded-3xl shadow-soft text-center max-w-md mx-4 border border-secondary-100 dark:border-secondary-700">
          <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary-400 dark:text-secondary-500">
            <ShoppingBag size={40} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4 tracking-tight">No Order Found</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-8">It seems you haven't placed an order recently or navigated here directly.</p>
          <Link to="/" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 block">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const isCOD = order.paymentMethod === 'COD';

  return (
    <div className="pt-32 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={contentRef} className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="check-icon w-24 h-24 bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-success-100 dark:border-success-800 text-success-500 dark:text-success-400">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6 tracking-tight">
              {isCOD ? 'Order Placed Successfully!' : 'Payment Successful!'}
            </h1>

            <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto fade-in leading-relaxed">
              {isCOD
                ? 'Thank you for your order. We have received your request and will ship it shortly.'
                : 'Thank you for your purchase. Your payment has been processed securely.'}
            </p>
          </div>

          <div className="bg-white dark:bg-secondary-800 rounded-3xl shadow-soft p-8 md:p-10 mb-10 fade-in border border-secondary-100 dark:border-secondary-700 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-secondary-400 dark:text-secondary-500 text-sm font-bold uppercase tracking-wider mb-1">Order Number</h3>
                  <p className="text-3xl font-bold text-secondary-900 dark:text-white tracking-tight">#{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-secondary-400 dark:text-secondary-500 text-sm font-bold uppercase tracking-wider mb-1">Date</h3>
                  <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div>
                  <h3 className="text-secondary-400 dark:text-secondary-500 text-sm font-bold uppercase tracking-wider mb-1">Email</h3>
                  <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300">{order.shippingInfo?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-secondary-400 dark:text-secondary-500 text-sm font-bold uppercase tracking-wider mb-1">Payment Method</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
                      {isCOD ? 'Cash on Delivery' : 'Credit/Debit Card (Stripe)'}
                    </span>
                    {isCOD ? <span className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs font-bold px-2 py-0.5 rounded-full">Pending</span> : <span className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 text-xs font-bold px-2 py-0.5 rounded-full">Paid</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-secondary-400 dark:text-secondary-500 text-sm font-bold uppercase tracking-wider mb-1">Total Amount</h3>
                  <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">${order.total?.toFixed(2)}</p>
                </div>

                <div className="pt-4">
                  <button onClick={() => window.print()} className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold hover:underline">
                    <FileText size={18} />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-secondary-100 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-900/30 -mx-8 -mb-8 md:-mx-10 md:-mb-10 px-8 py-6 md:px-10">
              <p className="text-secondary-600 dark:text-secondary-400 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
                <CheckCircle size={18} className="text-success-500 dark:text-success-400" />
                An email receipt has been sent to your inbox.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 fade-in">
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                <Package size={28} />
              </div>
              <h3 className="font-bold text-lg text-secondary-900 dark:text-white mb-2">1. Processing</h3>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">We are packing your items with care and preparing them for shipment.</p>
            </div>

            <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary-300 dark:bg-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="w-14 h-14 bg-secondary-50 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                <Truck size={28} />
              </div>
              <h3 className="font-bold text-lg text-secondary-900 dark:text-white mb-2">2. Shipping</h3>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">{order.shippingMethod === 'express' ? 'Express Delivery (1 Day)' : 'Standard Delivery (2-3 Days)'}</p>
            </div>

            <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-soft border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary-300 dark:bg-secondary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="w-14 h-14 bg-secondary-50 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300">
                <Calendar size={28} />
              </div>
              <h3 className="font-bold text-lg text-secondary-900 dark:text-white mb-2">3. Delivery</h3>
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">Estimated arrival: {new Date(Date.now() + (order.shippingMethod === 'express' ? 1 : 5) * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
            <Link
              to="/products"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight size={20} />
            </Link>
            <Link
              to="/account"
              className="px-8 py-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 font-bold rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white hover:border-secondary-300 dark:hover:border-secondary-600 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
