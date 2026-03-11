import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';

const FAQsPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
                {
                    "question": "What are your coffee options?",
                    "answer": "We offer classic espresso drinks (3-5 minutes), pour-over brews (slow and peaceful), and seasonal specialties. Free refills on drip coffee available during quiet hours."
                },
                {
                    "question": "How can I find my perfect cozy corner?",
                    "answer": "Once you arrive, our barista will help you find the best available spot. We have window seats, quiet back tables, and comfy armchairs. You can also check our website for current seating availability."
                },
                {
                    "question": "What is your pastry return policy?",
                    "answer": "We don't accept returns on food, but if something isn't fresh or perfect, just let us know within your visit and we'll gladly replace it or refund you. Your happiness matters to us."
                },
                {
                    "question": "Do you offer outdoor seating?",
                    "answer": "Yes, we have a small peaceful patio available during nice weather. Seating is limited and first-come, first-served—perfect for enjoying your coffee in the fresh air."
                },
                {
                    "question": "What payment methods do you accept?",
                    "answer": "We accept major credit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and good old-fashioned cash."
                },
                {
                    "question": "How do I contact the café?",
                    "answer": "You can reach our friendly team via the Contact Us page, email at beanbliss@gmail.com, or call us at ( 91+ ) 98765-43210 . For quick questions, just ask us in person during your next visit!"
                }
    ];

    return (
        <div className="container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-20 animate-fade-in-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    Find answers to common questions about our coffee, pastries, cozy corners, and more.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-lg border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4">
                        <Truck size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-secondary-900 dark:text-secondary-100 mb-2">Fast & Fresh</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Your coffee, served warm to your table in minutes.</p>
                </div>
                <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-lg border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-secondary-900 dark:text-secondary-100 mb-2">Secure Payments</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Your transactions are safe with us.</p>
                </div>
                <div className="bg-white dark:bg-secondary-800 p-6 rounded-2xl shadow-lg border border-secondary-100 dark:border-secondary-700 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw size={24} />
                    </div>
                    <h3 className="font-bold text-lg text-secondary-900 dark:text-secondary-100 mb-2">Easy Exchange</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">Not happy with your drink? </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-secondary-200 dark:border-secondary-700 rounded-2xl overflow-hidden bg-white dark:bg-secondary-800 transition-all duration-300 hover:shadow-md"
                    >
                        <button
                            className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="font-bold text-secondary-900 dark:text-secondary-100 text-lg">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="text-primary-600 transition-transform duration-300" />
                            ) : (
                                <ChevronDown className="text-secondary-400 transition-transform duration-300" />
                            )}
                        </button>
                        <div
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQsPage;
