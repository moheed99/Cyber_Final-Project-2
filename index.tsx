import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

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
        <div style={{
          padding: '2rem',
          color: '#ef4444',
          backgroundColor: '#0f172a',
          height: '100vh',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          position: 'relative'
        }}>
          <h1 style={{fontSize: '2rem', marginBottom: '1rem'}}>⚠️ KERNEL PANIC</h1>
          <p style={{color: '#94a3b8', marginBottom: '2rem'}}>The dashboard encountered a runtime error.</p>
          <pre style={{
            backgroundColor: '#1e293b',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            maxWidth: '800px',
            overflow: 'auto',
            color: '#f87171'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            RESTART SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(rootElement);

// Add a marker to the DOM so the global error handler knows we mounted successfully
const marker = document.createElement('div');
marker.id = 'app-mounted-marker';
marker.style.display = 'none';
document.body.appendChild(marker);

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);