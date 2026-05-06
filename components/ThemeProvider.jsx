/**
 * ThemeProvider & useTheme hook  —  components/ThemeProvider.jsx
 * ===============================================================
 * Provides a React context for dark / light theme switching across the app.
 *
 * On mount, reads the user's saved preference from localStorage, or falls back
 * to the OS prefers-color-scheme media query. The chosen value is applied to
 * <html data-theme="..."> immediately so the UI matches without a flash
 * (a complementary inline script in layout.js handles the very first paint).
 *
 * Every toggle persists the new value to localStorage so the choice survives
 * page refreshes and future visits.
 *
 * Usage anywhere in the tree:
 *   const { theme, toggleTheme } = useTheme();
 */
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // 1. Initial Load: Check localStorage then System Preference
    const saved = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const initialTheme = saved || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // 2. Listen for System Theme Changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e) => {
      // Only auto-switch if the user hasn't set a manual preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
