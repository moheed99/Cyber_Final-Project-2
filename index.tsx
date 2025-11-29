import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

const root = ReactDOM.createRoot(rootElement);

// Render App
root.render(<App />);

// Note: Loader removal is now handled inside App.tsx useEffect for better timing,
// but we keep a fallback here just in case.
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
  }
}, 1000);
