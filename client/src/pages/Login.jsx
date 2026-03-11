import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { gsap } from 'gsap';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const cardRef = useRef(null);

    const from = location.state?.from || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        if (cardRef.current) {
            gsap.fromTo(cardRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 pt-20 pb-12 px-4 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-800/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-200/20 dark:bg-accent-800/10 rounded-full blur-3xl"></div>
            </div>

            <div ref={cardRef} className="w-full max-w-md relative z-10">
                <div className="bg-white dark:bg-secondary-800 rounded-3xl shadow-xl p-8 md:p-10 border border-secondary-100 dark:border-secondary-700">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-white">
                                Bean<span className="text-primary-600 dark:text-primary-400">Bliss</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">Welcome back</h1>
                        <p className="text-secondary-500 dark:text-secondary-400">Log in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 text-error-700 dark:text-error-400 px-4 py-3 rounded-xl text-sm mb-6 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter Your E-mail"
                                    className="w-full pl-12 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-white dark:[color-scheme:dark] placeholder-secondary-400 dark:placeholder-secondary-500 font-medium"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Log In
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-secondary-500 dark:text-secondary-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;