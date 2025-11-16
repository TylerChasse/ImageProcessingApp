/**
 * ErrorBoundary Component
 * 
 * Catches React errors and displays fallback UI.
 * Prevents entire app from crashing.
 */

import { Component } from 'react';
import styles from '../styles/ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Catch errors in child components
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error details
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.state = {
      hasError: true,
      error: error,
      errorInfo: errorInfo
    };
  }

  // Reset error state
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload(); // Refresh the app
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1>😕 Something went wrong</h1>
            <p>The application encountered an unexpected error.</p>
            <details className={styles.errorDetails}>
              <summary>Error Details</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
            </details>
            <button className={styles.resetButton} onClick={this.handleReset}>
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;