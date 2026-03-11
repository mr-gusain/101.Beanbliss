import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, ShoppingBag, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';

// Sound effect for cancelled order
const playCancelSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const now = ctx.currentTime;

        const playTone = (freq, time, type = 'sawtooth', duration = 0.6) => {
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

        // Play a descending/sad sequence
        playTone(440.00, 0, 'sine', 0.5);   // A4
        playTone(415.30, 0.15, 'sine', 0.5); // G#4
        playTone(392.00, 0.30, 'sine', 0.6); // G4
        playTone(369.99, 0.45, 'triangle', 0.8);// F#4 (Discordant finish) or maybe lower

        // A low thud
        playTone(100, 0.45, 'square', 0.4);

    } catch (err) {
        console.error('Failed to play cancel sound', err);
    }
};

const OrderCancelledPage = () => {
    const contentRef = useRef(null);
    const hasPlayedSound = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasPlayedSound.current) {
            playCancelSound();
            hasPlayedSound.current = true;
        }

        if (contentRef.current) {
            const timeline = gsap.timeline();

            timeline
                .fromTo(
                    contentRef.current.querySelector('.icon-container'),
                    { scale: 0.5, opacity: 0, rotate: -45 },
                    { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
                )
                .fromTo(
                    contentRef.current.querySelector('h1'),
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
                    '-=0.3'
                )
                .fromTo(
                    contentRef.current.querySelectorAll('.fade-in'),
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
                    '-=0.3'
                );
        }
    }, [navigate]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-secondary-50 dark:bg-secondary-950">
            <div className="container mx-auto px-4 md:px-6">
                <div ref={contentRef} className="max-w-3xl mx-auto text-center">

                    <div className="icon-container w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-500">
                        <XCircle size={48} strokeWidth={2.5} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6 tracking-tight">
                        Order Cancelled
                    </h1>

                    <p className="text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto fade-in leading-relaxed mb-10">
                        Your order process has been cancelled. No charges were made to your account.
                        If you experienced verify or payment issues, please try again or contact support.
                    </p>

                    <div className="bg-white dark:bg-secondary-800 rounded-3xl shadow-soft p-8 md:p-10 mb-10 fade-in border border-secondary-100 dark:border-secondary-700 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600"></div>

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-full">
                                <AlertTriangle size={32} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Did you change your mind?</h3>
                            <p className="text-secondary-500 dark:text-secondary-400 max-w-md">
                                You can always return to your cart to review your items and proceed with checkout when you're ready.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                        <Link
                            to="/cart"
                            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Return to Cart <ShoppingBag size={20} />
                        </Link>
                        <Link
                            to="/"
                            className="px-8 py-4 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 font-bold rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-white hover:border-secondary-300 dark:hover:border-secondary-600 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCancelledPage;
