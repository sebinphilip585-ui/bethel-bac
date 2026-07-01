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
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', width: '100%' }}>
          <div className="saas-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', marginBottom: '24px' }}>
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
              We encountered an unexpected error while rendering this module. Please try reloading the page.
            </p>
            {this.state.error && (
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'left', marginBottom: '24px', overflowX: 'auto', fontFamily: 'monospace' }}>
                {this.state.error.toString()}
              </div>
            )}
            <button onClick={this.handleRetry} className="saas-btn">
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
