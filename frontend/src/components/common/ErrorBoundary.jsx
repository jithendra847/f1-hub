import React from 'react';
import ErrorState from '../ui/ErrorState';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <ErrorState
            title="Component Error"
            message={this.state.error?.message || 'Something went wrong rendering this component.'}
            onRetry={this.handleReset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
