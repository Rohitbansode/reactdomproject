import React, { useState, useEffect, useRef, createContext, useContext, useLayoutEffect } from 'react';

// --- 1. CONTEXT SETUP (useState & useContext Demonstration) ---

// 1.1. Create the Context
const ThemeContext = createContext();

// 1.2. Create the Custom Hook for Consumption
const useTheme = () => useContext(ThemeContext);

// 1.3. Create the Provider (Uses useState internally)
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // useState for global state

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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

// --- 2. THEME CONSUMING COMPONENT (useContext & useRef Demonstration) ---

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // useContext to consume state
  const buttonRef = useRef(null); // useRef for direct DOM interaction

  const currentThemeStyle = theme === 'dark' ? 
    'bg-gray-800 text-white hover:bg-gray-700 border-gray-600' :
    'bg-white text-gray-900 hover:bg-gray-100 border-gray-300';

  const handleFocus = () => {
    // useRef action: Focus the button programmatically
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };

  return (
    <div className={`p-6 rounded-xl shadow-lg transition-colors duration-300 ${currentThemeStyle} mt-8`}>
      <h2 className="text-2xl font-semibold mb-4">
        Hook 1: useState & Hook 2: useContext in Action
      </h2>
      <p className="mb-4">
        Current Global Theme: <span className="font-bold uppercase text-indigo-400">{theme}</span>
      </p>
      
      <div className="flex space-x-4">
        <button 
          ref={buttonRef} // Attach useRef to the button
          onClick={toggleTheme} 
          className="px-4 py-2 font-medium rounded-lg border transition-all duration-300 transform active:scale-95"
          style={{ 
            backgroundColor: theme === 'dark' ? '#4f46e5' : '#4f46e5', 
            color: 'white' 
          }}
        >
          Toggle Theme (via useContext)
        </button>

        <button 
          onClick={handleFocus} 
          className="px-4 py-2 font-medium rounded-lg border border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-white transition-all duration-300 transform active:scale-95"
        >
          Focus Button (via useRef)
        </button>
      </div>
      <p className="mt-4 text-sm opacity-80">
        <span className="font-semibold">useRef Demo:</span> Clicking "Focus Button" immediately puts focus on the "Toggle Theme" button without causing a re-render.
      </p>
    </div>
  );
};


// --- 3. EFFECT DEMONSTRATION COMPONENT (useEffect Demonstration) ---

const DocumentTitleUpdater = ({ theme }) => {
  const [count, setCount] = useState(0);
  const [customWidth, setCustomWidth] = useState('w-full');

  // useEffect Hook: Runs after render, demonstrating side effects.
  useEffect(() => {
    document.title = `Count: ${count} | Theme: ${theme}`;
    console.log(`[EFFECT]: Document title updated for count ${count}`);
  }, [count, theme]); // Re-run when count or theme changes

  // useEffect Hook: Cleanup demonstration. Runs only once on mount ([]).
  useEffect(() => {
    console.log("[EFFECT]: Component Mounted. Setting up interval...");
    const intervalId = setInterval(() => {
      // Simulate external activity
      console.log("Interval running...");
    }, 5000);

    // Cleanup function: runs on unmount or before the next effect run
    return () => {
      console.log("[CLEANUP]: Clearing interval.");
      clearInterval(intervalId);
    };
  }, []);
  
  const toggleWidth = () => {
    setCustomWidth(prevWidth => prevWidth === 'w-full' ? 'w-1/2' : 'w-full');
  };

  return (
    <div className={`transition-all duration-500 ${customWidth}`}>
      <div className="p-6 rounded-xl shadow-lg bg-yellow-50 border border-yellow-200 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Hook 3: useEffect Demonstration
        </h2>
        <p className="mb-4 text-gray-700">
          Local Count: <span className="font-bold text-red-500">{count}</span>
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 font-medium rounded-lg border bg-red-500 text-white hover:bg-red-600 transition-all duration-300 transform active:scale-95"
          >
            Increment Count
          </button>
          <button 
            onClick={toggleWidth}
            className="px-4 py-2 font-medium rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform active:scale-95"
          >
            Toggle Width ({customWidth === 'w-full' ? 'Half' : 'Full'})
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">useEffect Demo:</span> Check your browser tab title. It updates every time the count increases or the global theme changes.
        </p>
      </div>
      <DomChangeTracker />
    </div>
  );
};


// --- 4. NEW HOOK: useLayoutEffect DEMONSTRATION ---

const DomChangeTracker = () => {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);

  // useLayoutEffect Hook: Fires synchronously after all DOM mutations.
  // This is used to read the layout (width) right after the DocumentTitleUpdater's width is toggled.
  useLayoutEffect(() => {
    if (boxRef.current) {
      // Read DOM property (offsetWidth) right after render
      const currentWidth = boxRef.current.offsetWidth;
      // Update state with the measured width
      setWidth(currentWidth);
      console.log(`[LAYOUT EFFECT]: Measured new width: ${currentWidth}px`);
    }
  }, [boxRef.current?.offsetWidth]); // Re-run when the measured width changes

  return (
    <div className="p-6 rounded-xl shadow-lg bg-indigo-50 border border-indigo-200 mt-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Hook 5: useLayoutEffect & Detailed DOM Changes
      </h2>
      <div 
        ref={boxRef} 
        className="h-10 bg-indigo-400 rounded-lg flex items-center justify-center transition-all duration-500"
        // Style to inherit the width of its parent (DocumentTitleUpdater wrapper div)
        style={{ width: '100%' }}
      >
        <p className="font-bold text-white">
          Current Element Width (Measured with useLayoutEffect):
        </p>
      </div>
      <p className="mt-4 text-center text-xl font-extrabold text-indigo-700">
        {width.toFixed(2)} px
      </p>
      <p className="mt-2 text-sm text-gray-600">
        <span className="font-semibold">useLayoutEffect Demo:</span> This hook measures the size of the box above *immediately* after the width changes (triggered by the "Toggle Width" button) and updates the measurement display.
      </p>
    </div>
  );
};


// --- 5. MAIN APPLICATION COMPONENT (App.jsx) ---

export default function App() {
  const [isTailwindLoaded, setIsTailwindLoaded] = useState(false);

  // Load Tailwind CSS script for styling
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    
    // Set state to true when the script successfully loads
    script.onload = () => {
      setIsTailwindLoaded(true);
      console.log("Tailwind CSS script loaded successfully.");
    };

    // Append the script to the head
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <ThemeProvider>
      {/* Conditional rendering: Show loading indicator until Tailwind is confirmed loaded */}
      {!isTailwindLoaded ? (
        <div className="flex justify-center items-center min-h-screen text-gray-500 bg-gray-50">
          <p className="text-lg font-medium">Loading styles...</p>
        </div>
      ) : (
        <ThemeContext.Consumer>
          {({ theme }) => (
            <div className={`min-h-screen p-8 transition-colors duration-500 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="max-w-3xl mx-auto font-sans">
                <h1 className={`text-4xl font-extrabold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  React Hooks Master Demo
                </h1>
                
                <ThemeToggle />
                
                <DocumentTitleUpdater theme={theme} />
                
                <footer className={`mt-12 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  All five core hooks (useState, useEffect, useRef, useContext, useLayoutEffect) are demonstrated above.
                </footer>
              </div>
            </div>
          )}
        </ThemeContext.Consumer>
      )}
    </ThemeProvider>
  );
}
