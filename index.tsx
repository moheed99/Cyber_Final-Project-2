import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Error Boundary for Runtime Crashes
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-500 bg-slate-900 h-screen flex flex-col items-center justify-center font-mono">
          <h1 className="text-2xl mb-4">⚠️ RUNTIME ERROR</h1>
          <pre className="bg-black p-4 rounded border border-red-900 max-w-2xl overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            RESTART SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mount Logic
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element missing");

// Add marker for fail-safe script
const marker = document.createElement('div');
marker.id = 'app-root';
document.body.appendChild(marker);

// Clear loader immediately
const loader = document.getElementById('loader');
if(loader) loader.style.display = 'none';

const root = ReactDOM.createRoot(rootElement);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);