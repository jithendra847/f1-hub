import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add('dark');
    if (body) body.classList.add('dark');
    root.style.colorScheme = 'dark';
    localStorage.setItem('f1_theme', 'dark');
  }, []);

  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
