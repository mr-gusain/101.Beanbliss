import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData);

            if (response.data.success) {
                toast.success(response.data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error('Contact error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-20 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                    Get in Touch
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    Have questions or need assistance? We're here to help. Reach out to us using the form below or via our contact details.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Information */}
                {/* Contact Information */}
                <div className="bg-white dark:bg-secondary-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-secondary-100 dark:border-secondary-700">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-600/10 dark:bg-primary-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl font-bold mb-8 relative z-10 text-secondary-900 dark:text-white">Contact Information</h2>
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-700/50 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-secondary-900 dark:text-white">Email Us</h3>
                                <p className="text-secondary-600 dark:text-secondary-400">support@beanbliss.com</p>
                                <p className="text-secondary-600 dark:text-secondary-400">beanbliss@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-700/50 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-secondary-900 dark:text-white">Call Us</h3>
                                <p className="text-secondary-600 dark:text-secondary-400">+91 98765-43210</p>
                                <p className="text-secondary-600 dark:text-secondary-400">Mon-Sat, 9am - 10pm</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-secondary-700/50 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-1 text-secondary-900 dark:text-white">Visit Us</h3>
                                <p className="text-secondary-600 dark:text-secondary-400">New Delhi, India</p>
                                <p className="text-secondary-600 dark:text-secondary-400">Delhi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white dark:bg-secondary-800 p-8 md:p-10 rounded-3xl shadow-lg border border-secondary-100 dark:border-secondary-700">
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-secondary-900 dark:text-white dark:[color-scheme:dark]"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-secondary-900 dark:text-white dark:[color-scheme:dark]"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-secondary-900 dark:text-white dark:[color-scheme:dark]"
                                placeholder="How can we help?"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-xl bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-secondary-900 dark:text-white dark:[color-scheme:dark] resize-none"
                                placeholder="Type your message here..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
