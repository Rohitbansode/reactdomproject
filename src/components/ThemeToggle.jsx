import React from 'react';
// Import the custom hook from the context file
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  // Use the custom hook to access context values
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px', backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0', color: theme === 'dark' ? 'white' : 'black' }}>
      <h2>Theme Consumer Component</h2>
      <p>Current Theme: <strong>{theme}</strong></p>
      
      {/* Button calls the function provided by the context */}
      <button onClick={toggleTheme} style={{ padding: '10px', backgroundColor: theme === 'dark' ? '#fff' : '#333', color: theme === 'dark' ? '#333' : '#fff', cursor: 'pointer' }}>
        Toggle to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <p style={{ marginTop: '15px', fontSize: 'small' }}>
        **Context Demonstration:** This component automatically re-renders whenever the global 'theme' value changes in the Provider.
      </p>
    </div>
  );
}

export default ThemeToggle;
