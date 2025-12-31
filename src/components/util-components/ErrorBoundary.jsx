import React from 'react';
import { Result, Button } from 'antd';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px'
        }}>
          <Result
            status="error"
            title="Qualcosa è andato storto"
            subTitle="Si è verificato un errore imprevisto. Prova a ricaricare la pagina."
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReset}>
                Ricarica Pagina
              </Button>,
              <Button key="home" onClick={() => window.location.href = '/'}>
                Torna alla Home
              </Button>
            ]}
          >
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{
                marginTop: 24,
                padding: 16,
                background: '#f5f5f5',
                borderRadius: 4,
                textAlign: 'left',
                maxWidth: 600
              }}>
                <details style={{ cursor: 'pointer' }}>
                  <summary style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    Error Details (Development Only)
                  </summary>
                  <pre style={{
                    fontSize: 12,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
