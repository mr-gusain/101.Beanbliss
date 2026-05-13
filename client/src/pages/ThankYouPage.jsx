import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, ArrowRight, ShoppingBag, FileText, Coffee } from 'lucide-react';
import { gsap } from 'gsap';

/* ─── Cafeteria success chime (warm bell + wood knock feel) ─── */
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
      gain.gain.linearRampToValueAtTime(0.15, now + time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);
      osc.start(now + time);
      osc.stop(now + time + duration);
    };

    // Warm bell-like chimes
    playTone(392, 0, 'sine', 0.7);
    playTone(523.25, 0.15, 'sine', 0.7);
    playTone(659.25, 0.3, 'sine', 0.8);
    playTone(783.99, 0.45, 'triangle', 1.0);
  } catch (err) {
    console.error('Failed to play success sound', err);
  }
};

/* ─── Inline Styles (cafeteria-specific animations) ─── */
const cafeteriaStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

  @keyframes steamRise {
    0% { transform: translateY(0) scaleX(1); opacity: 0.6; }
    50% { transform: translateY(-18px) scaleX(1.5); opacity: 0.3; }
    100% { transform: translateY(-38px) scaleX(0.8); opacity: 0; }
  }

  @keyframes floatBean {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-12px) rotate(8deg); }
    50% { transform: translateY(-6px) rotate(-5deg); }
    75% { transform: translateY(-16px) rotate(3deg); }
  }

  @keyframes latteSwirl {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes gentlePulse {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.04); opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes warmGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(166, 123, 91, 0.15); }
    50% { box-shadow: 0 0 40px rgba(166, 123, 91, 0.3); }
  }

  .steam-line {
    animation: steamRise 2.5s ease-out infinite;
  }

  .steam-line:nth-child(2) { animation-delay: 0.4s; }
  .steam-line:nth-child(3) { animation-delay: 0.8s; }

  .float-bean {
    animation: floatBean 5s ease-in-out infinite;
  }

  .float-bean:nth-child(2) { animation-delay: 1s; }
  .float-bean:nth-child(3) { animation-delay: 2s; }
  .float-bean:nth-child(4) { animation-delay: 3s; }
  .float-bean:nth-child(5) { animation-delay: 0.5s; }
  .float-bean:nth-child(6) { animation-delay: 1.5s; }

  .latte-swirl {
    animation: latteSwirl 8s linear infinite;
  }

  .warm-glow {
    animation: warmGlow 3s ease-in-out infinite;
  }

  .cafeteria-card {
    background: linear-gradient(145deg, rgba(253,248,246,0.95) 0%, rgba(242,232,229,0.9) 100%);
    backdrop-filter: blur(20px);
  }

  .dark .cafeteria-card {
    background: linear-gradient(145deg, rgba(64,58,50,0.95) 0%, rgba(51,45,39,0.9) 100%);
  }

  .receipt-divider {
    background-image: radial-gradient(circle, currentColor 1.5px, transparent 1.5px);
    background-size: 12px 3px;
    background-repeat: repeat-x;
    height: 3px;
  }

  .cafeteria-bg-pattern {
    background-image:
      radial-gradient(circle at 20% 50%, rgba(166,123,91,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(245,138,11,0.05) 0%, transparent 50%),
      radial-gradient(circle at 60% 80%, rgba(166,123,91,0.04) 0%, transparent 50%);
  }

  .tracking-step-connector {
    background: linear-gradient(to right, #a67b5b 50%, #d4cec5 50%);
    background-size: 200% 100%;
    transition: background-position 0.5s ease;
  }

  .tracking-step-connector.active {
    background-position: 0% 0%;
  }

  .tracking-step-connector.inactive {
    background-position: 100% 0%;
  }
`;

/* ─── Floating coffee beans background ─── */
const FloatingBeans = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[
      { top: '8%', left: '5%', size: 22, rotate: 25, opacity: 0.08 },
      { top: '15%', right: '10%', size: 18, rotate: -35, opacity: 0.06 },
      { top: '55%', left: '3%', size: 16, rotate: 60, opacity: 0.05 },
      { top: '70%', right: '5%', size: 24, rotate: -10, opacity: 0.07 },
      { top: '35%', right: '15%', size: 14, rotate: 45, opacity: 0.04 },
      { top: '85%', left: '12%', size: 20, rotate: -50, opacity: 0.06 },
    ].map((bean, i) => (
      <div
        key={i}
        className="float-bean absolute"
        style={{ top: bean.top, left: bean.left, right: bean.right, opacity: bean.opacity }}
      >
        <svg width={bean.size} height={bean.size} viewBox="0 0 24 24" style={{ transform: `rotate(${bean.rotate}deg)` }}>
          <ellipse cx="12" cy="12" rx="8" ry="11" fill="currentColor" className="text-primary-700 dark:text-primary-400" />
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" className="text-primary-900 dark:text-primary-300" opacity="0.5" />
        </svg>
      </div>
    ))}
  </div>
);

/* ─── Animated coffee cup with steam ─── */
const CoffeeCupIcon = ({ className = '' }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    {/* Steam lines */}
    <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="steam-line w-1 h-5 rounded-full bg-primary-400/40 dark:bg-primary-300/30" />
      ))}
    </div>
    {/* Cup */}
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-primary-800 dark:via-primary-700 dark:to-primary-600 flex items-center justify-center shadow-lg warm-glow border border-primary-200/50 dark:border-primary-600/50">
      <Coffee size={36} className="text-primary-700 dark:text-primary-200" strokeWidth={2} />
    </div>
    {/* Latte art ring */}
    <div className="absolute inset-0 latte-swirl">
      <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-primary-400/30 dark:bg-primary-300/20" />
    </div>
  </div>
);

/* ─── Order Step Card ─── */
const StepCard = ({ icon: Icon, step, title, desc, active, delay }) => (
  <div
    className={`
      relative p-6 rounded-2xl border transition-all duration-500 group overflow-hidden
      ${active
        ? 'bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/40 dark:to-accent-900/20 border-primary-300 dark:border-primary-600 shadow-md'
        : 'cafeteria-card border-secondary-200 dark:border-secondary-700 shadow-soft hover:shadow-md'
      }
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Top accent bar */}
    <div className={`absolute top-0 left-0 w-full h-1 transition-transform duration-700 origin-left ${
      active
        ? 'bg-gradient-to-r from-primary-500 to-accent-500 scale-x-100'
        : 'bg-primary-300 dark:bg-secondary-600 scale-x-0 group-hover:scale-x-100'
    }`} />

    {/* Step number badge */}
    <div className={`
      absolute top-4 right-4 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center
      ${active
        ? 'bg-primary-600 text-white dark:bg-primary-500'
        : 'bg-secondary-200 text-secondary-500 dark:bg-secondary-700 dark:text-secondary-400'
      }
    `}>
      {step}
    </div>

    <div className={`
      w-14 h-14 rounded-xl flex items-center justify-center mb-4
      transition-all duration-500 group-hover:scale-110
      ${active
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 dark:bg-primary-500'
        : 'bg-secondary-100 text-secondary-500 dark:bg-secondary-700 dark:text-secondary-400'
      }
    `}>
      <Icon size={26} />
    </div>

    <h3 className={`font-bold text-lg mb-2 ${
      active ? 'text-primary-800 dark:text-primary-200' : 'text-secondary-800 dark:text-white'
    }`}>
      {title}
    </h3>
    <p className="text-secondary-500 dark:text-secondary-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

/* ═══════════════════════════════════════════════
   ☕ MAIN COMPONENT — Cafeteria Thank You Page
   ═══════════════════════════════════════════════ */
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
      const tl = gsap.timeline();

      tl.fromTo(
        contentRef.current.querySelector('.coffee-hero'),
        { scale: 0.4, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
      )
      .fromTo(
        contentRef.current.querySelector('h1'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        contentRef.current.querySelector('.subtitle-text'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      )
      .fromTo(
        contentRef.current.querySelector('.receipt-card'),
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo(
        contentRef.current.querySelectorAll('.step-card'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.5, ease: 'back.out(1.5)' },
        '-=0.3'
      )
      .fromTo(
        contentRef.current.querySelectorAll('.action-btn'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' },
        '-=0.2'
      );
    }
  }, [order, navigate]);

  /* ── No order state ── */
  if (!order) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-primary-50 via-secondary-50 to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 flex flex-col items-center justify-center cafeteria-bg-pattern relative">
        <style>{cafeteriaStyles}</style>
        <FloatingBeans />
        <div className="cafeteria-card p-10 rounded-3xl shadow-hard text-center max-w-md mx-4 border border-primary-200/50 dark:border-secondary-700 relative z-10">
          <CoffeeCupIcon className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            No Order Found
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed">
            It seems you haven't placed an order recently. Let&apos;s brew something fresh for you!
          </p>
          <Link
            to="/"
            className="px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:-translate-y-1 block"
          >
            ☕ Back to the Menu
          </Link>
        </div>
      </div>
    );
  }

  const isCOD = order.paymentMethod === 'COD';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gradient-to-b from-primary-50 via-secondary-50 to-primary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 cafeteria-bg-pattern relative">
      <style>{cafeteriaStyles}</style>
      <FloatingBeans />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div ref={contentRef} className="max-w-4xl mx-auto">

          {/* ── Hero Section ── */}
          <div className="text-center mb-14">
            <div className="coffee-hero inline-block mb-8">
              <div className="relative">
                {/* Success ring */}
                <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-success-400 to-primary-400 opacity-20 blur-md animate-pulse-slow" />
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/40 dark:to-success-800/30 flex items-center justify-center border-2 border-success-300 dark:border-success-600 shadow-lg">
                  <CheckCircle size={44} className="text-success-600 dark:text-success-400" strokeWidth={2.5} />
                </div>
                {/* Decorative coffee bean */}
                <div className="absolute -right-3 -bottom-1 w-8 h-8 rounded-lg bg-primary-200 dark:bg-primary-700 flex items-center justify-center rotate-12 shadow-sm">
                  <span className="text-sm">☕</span>
                </div>
              </div>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary-900 dark:text-white mb-5 tracking-tight leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isCOD ? 'Order Brewed Successfully!' : 'Payment Brewed to Perfection!'}
            </h1>

            <p className="subtitle-text text-lg md:text-xl text-secondary-500 dark:text-secondary-400 max-w-2xl mx-auto leading-relaxed">
              {isCOD
                ? 'Your order is in the queue! We\'re crafting it with the same care as a perfect espresso. ☕'
                : 'Your payment went through smooth as a fresh latte. Thank you for your order! ☕'}
            </p>
          </div>

          {/* ── Receipt Card (styled like a café receipt) ── */}
          <div className="receipt-card cafeteria-card rounded-3xl shadow-hard p-0 mb-12 border border-primary-200/60 dark:border-secondary-700 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-2 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-600" />

            {/* Receipt header */}
            <div className="px-8 pt-8 pb-5 md:px-10 md:pt-10 text-center border-b border-dashed border-primary-200 dark:border-secondary-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-100 dark:bg-primary-800/40 rounded-full text-primary-700 dark:text-primary-300 text-sm font-semibold mb-3">
                <Coffee size={14} />
                <span>Order Receipt</span>
              </div>
              <p className="text-4xl md:text-5xl font-extrabold text-primary-700 dark:text-primary-300 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
              </p>
            </div>

            {/* Receipt body */}
            <div className="px-8 py-8 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500 mb-0.5">Date</p>
                    <p className="text-secondary-800 dark:text-secondary-200 font-medium">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600 dark:text-primary-400">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M7 15h0M2 9.5h20" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500 mb-0.5">Payment</p>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary-800 dark:text-secondary-200 font-medium">
                        {isCOD ? 'Cash on Delivery' : 'Card (Stripe)'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isCOD
                          ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400'
                          : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                      }`}>
                        {isCOD ? 'Pending' : 'Paid'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600 dark:text-primary-400">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500 mb-0.5">Email</p>
                    <p className="text-secondary-800 dark:text-secondary-200 font-medium">{order.shippingInfo?.email}</p>
                  </div>
                </div>
              </div>

              {/* Right column — Total */}
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold uppercase tracking-wider text-secondary-400 dark:text-secondary-500 mb-2">Total Amount</p>
                <p
                  className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  ₹{order.total?.toFixed(2)}
                </p>
                <div className="mt-5">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-700/50 font-semibold text-sm transition-all hover:-translate-y-0.5"
                  >
                    <FileText size={16} />
                    Print Receipt
                  </button>
                </div>
              </div>
            </div>

            {/* Perforated divider */}
            <div className="mx-8 md:mx-10 receipt-divider text-primary-300 dark:text-secondary-600" />

            {/* Receipt footer */}
            <div className="px-8 py-5 md:px-10 flex items-center justify-center gap-2 text-secondary-500 dark:text-secondary-400">
              <CheckCircle size={16} className="text-success-500 dark:text-success-400" />
              <span className="text-sm">A confirmation email has been sent to your inbox.</span>
            </div>
          </div>

          {/* ── Order Tracking Steps ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            <div className="step-card">
              <StepCard
                icon={Package}
                step={1}
                title="Brewing Your Order"
                desc="We're carefully preparing and packing your items with love."
                active={true}
                delay={0}
              />
            </div>
            <div className="step-card">
              <StepCard
                icon={Truck}
                step={2}
                title="On Its Way"
                desc={order.shippingMethod === 'express' ? 'Express Delivery — arrives tomorrow!' : 'Standard Delivery — 2-3 business days.'}
                active={false}
                delay={150}
              />
            </div>
            <div className="step-card">
              <StepCard
                icon={Calendar}
                step={3}
                title="Delivered Fresh"
                desc={`Estimated arrival: ${new Date(Date.now() + (order.shippingMethod === 'express' ? 1 : 5) * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                active={false}
                delay={300}
              />
            </div>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="action-btn px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:-translate-y-1 flex items-center justify-center gap-2 text-lg"
            >
              ☕ Browse More <ArrowRight size={20} />
            </Link>
            <Link
              to="/account"
              className="action-btn px-8 py-4 cafeteria-card border border-primary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 font-bold rounded-xl hover:border-primary-400 dark:hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300 transition-all flex items-center justify-center gap-2 shadow-soft hover:shadow-md hover:-translate-y-0.5"
            >
              Order History
            </Link>
          </div>

          {/* ── Bottom decorative message ── */}
          <div className="mt-16 text-center opacity-60">
            <p className="text-secondary-400 dark:text-secondary-600 text-sm italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              "Life happens, coffee helps." — Thank you for choosing us ☕
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
