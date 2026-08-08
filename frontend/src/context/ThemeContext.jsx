import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('f1_theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('dark', 'light');
    if (body) body.classList.remove('dark', 'light');
    
    root.classList.add(theme);
    if (body) body.classList.add(theme);
    
    root.style.colorScheme = theme;
    localStorage.setItem('f1_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext) || { theme: 'light', toggleTheme: () => {} };
}
