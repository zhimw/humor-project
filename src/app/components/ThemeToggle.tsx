'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const label = isDark ? 'Light Mode' : 'Dark Mode';

  return (
    <button
      onClick={toggle}
      aria-label={label}
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
    >
      <span className="text-xl leading-none">{isDark ? '🌞' : '🌚'}</span>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
