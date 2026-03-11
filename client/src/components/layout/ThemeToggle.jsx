import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { themeMode, setTheme, isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themes = [
        { id: 'light', label: 'Light', icon: Sun, description: 'Always light' },
        { id: 'dark', label: 'Dark', icon: Moon, description: 'Always dark' },
        { id: 'system', label: 'System', icon: Monitor, description: 'Match device' },
    ];

    const currentTheme = themes.find(t => t.id === themeMode);
    const CurrentIcon = currentTheme?.icon || Sun;

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all duration-300 hover:bg-secondary-100 dark:hover:bg-secondary-800 group`}
                aria-label={`Theme: ${currentTheme?.label}. Click to change.`}
                title={`Current theme: ${currentTheme?.label}`}
            >
                <div className="relative w-5 h-5">
                    {/* Sun icon - visible in light mode */}
                    <Sun
                        size={20}
                        className={`absolute inset-0 transition-all duration-500 stroke-[2.5px] ${isDark
                            ? 'opacity-0 rotate-90 scale-0'
                            : 'opacity-100 rotate-0 scale-100 text-amber-500'
                            }`}
                    />
                    {/* Moon icon - visible in dark mode */}
                    <Moon
                        size={20}
                        className={`absolute inset-0 transition-all duration-500 stroke-[2.5px] ${isDark
                            ? 'opacity-100 rotate-0 scale-100 text-blue-400'
                            : 'opacity-0 -rotate-90 scale-0'
                            }`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            <div
                className={`absolute right-0 mt-3 w-48 bg-white dark:bg-secondary-800 rounded-2xl shadow-xl border border-secondary-100 dark:border-secondary-700 overflow-hidden transition-all duration-300 origin-top-right transform z-50 ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0 visible'
                    : 'opacity-0 scale-95 -translate-y-2 invisible'
                    }`}
            >
                <div className="p-2 space-y-1">
                    {themes.map(({ id, label, icon: Icon, description }) => (
                        <button
                            key={id}
                            onClick={() => {
                                setTheme(id);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${themeMode === id
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold'
                                : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 hover:text-secondary-900 dark:hover:text-secondary-200'
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${themeMode === id
                                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400'
                                    }`}
                            >
                                <Icon size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-[10px] text-secondary-400 dark:text-secondary-500">{description}</p>
                            </div>
                            {themeMode === id && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-primary-500" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThemeToggle;
