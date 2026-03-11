import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
                    <div className="glass-card p-8 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Something went wrong</h2>
                        <p className="text-text-secondary text-sm mb-8 leading-relaxed">
                            The portal encountered an unexpected error. We've been notified and are working on it.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-telangana-green text-white py-3 rounded-xl font-bold hover:bg-telangana-green-light transition-all active:scale-95"
                        >
                            Reload Portal
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
