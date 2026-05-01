import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('dashboard-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle-btn ${theme}`}
      title={`Passer au mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          {theme === 'dark' ? (
            <Moon size={14} className="text-primary" />
          ) : (
            <Sun size={14} className="text-accent" />
          )}
        </div>
      </div>
    </button>
  );
}
