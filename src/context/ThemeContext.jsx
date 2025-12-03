import React, { createContext, useState, useContext } from 'react';

// 1. Create the Context
export const ThemeContext = createContext();

// 2. Create the Provider Component
export const ThemeProvider = ({ children }) => {
  // Use useState to manage the global theme state
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    console.log('Theme toggled to:', theme === 'light' ? 'dark' : 'light');
  };

  // The value object holds the state and the setter/toggle function
  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a Custom Hook for easy consumption
export const useTheme = () => {
  return useContext(ThemeContext);
};
