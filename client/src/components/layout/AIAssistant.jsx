import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { aiAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! 👋 I\'m your 1NonlyStore shopping assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { role: 'user', content: userMessage }];

        setInput('');
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await aiAPI.chat(newMessages);
            // Handle both object (OpenAI style) and string responses
            const assistantContent = response.message?.content || response.message || response.reply;
            setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I\'m having trouble connecting right now. Please try again later or browse our products directly!'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 left-8 z-[999] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen
                    ? 'bg-secondary-700 dark:bg-secondary-600 text-white rotate-0'
                    : 'bg-primary-600 text-white shadow-primary-500/30 hover:shadow-primary-500/50'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 left-8 z-[1000] w-[350px] max-w-[calc(100vw-4rem)] bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 translate-y-4 invisible'
                }`}>
                {/* Header */}
                <div className="bg-primary-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Bot size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Shopping Assistant</h3>
                            <p className="text-primary-100 text-xs">Ask me anything!</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-secondary-50 dark:bg-secondary-900/50">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary-600 text-white rounded-br-md'
                                : 'bg-white dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 shadow-sm border border-secondary-100 dark:border-secondary-700 rounded-bl-md'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-secondary-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-secondary-100 dark:border-secondary-700">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-secondary-300 dark:bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-secondary-300 dark:bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-secondary-300 dark:bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-3 border-t border-secondary-100 dark:border-secondary-700 bg-white dark:bg-secondary-800">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 px-4 py-2.5 bg-secondary-50 dark:bg-secondary-700/50 border border-secondary-200 dark:border-secondary-600 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 dark:placeholder-secondary-500 font-medium"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AIAssistant;
