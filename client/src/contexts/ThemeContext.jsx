import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Get initial theme preference from localStorage or default to 'system'
    const [themeMode, setThemeMode] = useState(() => {
        const saved = localStorage.getItem('theme-preference');
        return saved || 'system';
    });

    // Track the actual resolved theme (light or dark)
    const [resolvedTheme, setResolvedTheme] = useState('light');

    // Resolve the actual theme based on mode
    const resolveTheme = useCallback((mode) => {
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return mode;
    }, []);

    // Apply theme to document
    const applyTheme = useCallback((theme) => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        setResolvedTheme(theme);
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f8fafc');
        }
    }, []);

    // Set theme mode and persist
    const setTheme = useCallback((mode) => {
        setThemeMode(mode);
        localStorage.setItem('theme-preference', mode);
        const resolved = resolveTheme(mode);
        applyTheme(resolved);
    }, [resolveTheme, applyTheme]);

    // Apply on mount and when themeMode changes
    useEffect(() => {
        const resolved = resolveTheme(themeMode);
        applyTheme(resolved);
    }, [themeMode, resolveTheme, applyTheme]);

    // Listen for system theme changes when in 'system' mode
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e) => {
            if (themeMode === 'system') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [themeMode, applyTheme]);

    // Cycle through themes: light -> dark -> system -> light...
    const cycleTheme = useCallback(() => {
        const order = ['light', 'dark', 'system'];
        const currentIndex = order.indexOf(themeMode);
        const nextIndex = (currentIndex + 1) % order.length;
        setTheme(order[nextIndex]);
    }, [themeMode, setTheme]);

    const isDark = resolvedTheme === 'dark';

    const value = {
        themeMode,     // 'light' | 'dark' | 'system'
        resolvedTheme, // 'light' | 'dark'
        isDark,
        setTheme,
        cycleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
