import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <h2>Oops! Something went wrong</h2>
            <p>We encountered an unexpected error. Please try refreshing the page.</p>
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                <FontAwesomeIcon icon={faRefresh} />
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="refresh-button">
                <FontAwesomeIcon icon={faRefresh} />
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
