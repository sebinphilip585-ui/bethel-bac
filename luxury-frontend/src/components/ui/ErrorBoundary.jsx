import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
    
    // Automatically reload once for chunk load errors (Vite dynamic import failures)
    if (error.message && error.message.includes('Failed to fetch dynamically imported module')) {
      const reloaded = sessionStorage.getItem('chunk_reload');
      if (!reloaded) {
        sessionStorage.setItem('chunk_reload', 'true');
        window.location.reload();
      }
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    sessionStorage.removeItem('chunk_reload');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', width: '100%' }}>
          <div className="pms-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '32px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--pms-danger-bg)', color: 'var(--pms-danger)', borderRadius: '50%', marginBottom: '24px' }}>
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--pms-text-main)', marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ color: 'var(--pms-text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              We encountered an unexpected error while rendering this module. Please try reloading the page.
            </p>
            {this.state.error && (
              <div style={{ background: 'var(--pms-surface-hover)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--pms-text-secondary)', textAlign: 'left', marginBottom: '24px', overflowX: 'auto', fontFamily: 'monospace' }}>
                {this.state.error.toString()}
              </div>
            )}
            <button onClick={this.handleRetry} className="pms-btn pms-btn-primary">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
