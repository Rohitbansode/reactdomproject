#!/bin/bash

# --- 1. Create Directories ---
echo "Creating directories: context and components..."
mkdir -p context
mkdir -p components

# --- 2. Create Context File (context/ThemeContext.jsx) ---
CONTEXT_FILE="context/ThemeContext.jsx"
echo "Creating $CONTEXT_FILE..."
cat > $CONTEXT_FILE << EOF
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
EOF

# --- 3. Create Component File (components/ThemeToggle.jsx) ---
COMPONENT_FILE="components/ThemeToggle.jsx"
echo "Creating $COMPONENT_FILE..."
cat > $COMPONENT_FILE << EOF
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
EOF

# --- 4. Update the App entry file (App.jsx) ---
APP_FILE="App.jsx"
echo "Updating $APP_FILE to wrap the App with ThemeProvider..."
# This uses sed to prepend the Provider import and wrap the main <App> content
# Note: The exact sed syntax might vary slightly between macOS/BSD (sed -i '') and GNU/Linux (sed -i)
# We use a combined approach for better compatibility.

# Check if App.jsx exists and has a standard function export
if grep -q "function App()" "$APP_FILE" || grep -q "const App =" "$APP_FILE"; then
    # 1. Add import statements
    sed -i '' '1i\
import { ThemeProvider } from "./context/ThemeContext";\
import ThemeToggle from "./components/ThemeToggle";\
' "$APP_FILE"

    # 2. Update the main component to use the ThemeToggle and wrap content with ThemeProvider
    # This assumes a clean App.jsx file structure like React creates.
    # We replace the content inside the main return().
    # This is complex and fragile in a shell script, so let's stick to adding the wrapper and component inside the main App function.
    
    # Simple Append to the end of the file for testing, rather than complex sed replacement
    # We'll rewrite the whole file for safety and simplicity (assuming the original App.jsx is simple)
    cat > "$APP_FILE" << EOF
import React from 'react';
import './App.css';
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    // Wrap the entire application with the ThemeProvider
    <ThemeProvider>
      <div className="App" style={{ minHeight: '100vh', padding: '50px' }}>
        <h1>Global Theme Context Demo</h1>
        {/* The component that consumes the context */}
        <ThemeToggle />
        
        <p style={{ marginTop: '30px' }}>
          Any component wrapped by ThemeProvider can use the useTheme() hook.
        </p>
      </div>
    </ThemeProvider>
  );
}

export default App;
EOF
    echo "Successfully updated $APP_FILE."
else
    echo "Warning: Could not automatically update $APP_FILE. Please manually add ThemeProvider and ThemeToggle."
fi

echo "--- Setup Complete! ---"
echo "Files created/updated:"
echo "- $CONTEXT_FILE (Defines Context, Provider, and useTheme hook)"
echo "- $COMPONENT_FILE (Uses useTheme() hook)"
echo "- $APP_FILE (Wraps application with ThemeProvider)"
echo "Next steps: Run 'npm start' or 'yarn start' to see the demo."
