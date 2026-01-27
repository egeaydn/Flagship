'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const html = document.documentElement;
    console.log('HTML element classes before:', html.className);
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    console.log('HTML element classes after:', html.className);
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="relative p-3 rounded-xl bg-gray-200 dark:bg-gray-700 w-12 h-12 overflow-hidden border-2 border-gray-300 dark:border-gray-600">
        <span className="sr-only">Loading theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border-2 border-gray-300 dark:border-gray-600 w-12 h-12"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-yellow-100/30 dark:bg-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icons container with rotation animation */}
      <div className="relative">
        {/* Moon Icon */}
        <svg
          className={`w-6 h-6 absolute top-0 left-0 transition-all duration-500 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          } text-gray-700 group-hover:text-gray-900`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>

        {/* Sun Icon */}
        <svg
          className={`w-6 h-6 transition-all duration-500 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-0'
          } text-yellow-400 group-hover:text-yellow-300 group-hover:rotate-180`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-xl bg-white/30 dark:bg-white/10 scale-0 group-active:scale-100 transition-transform duration-300"></span>
    </button>
  );
}
