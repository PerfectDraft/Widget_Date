import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="material-symbols-outlined text-[40px]">heart_broken</span>
          </div>
          <h1 className="text-headline-md font-bold text-on-surface mb-2">Oops! Có lỗi xảy ra</h1>
          <p className="text-body-md text-on-surface-variant max-w-xs mb-8">
            Ứng dụng gặp sự cố bất ngờ. Đừng lo lắng, chúng tôi đang khắc phục!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold shadow-md hover:scale-105 transition-transform"
          >
            Tải lại trang
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-surface-container-high rounded-xl text-left text-[10px] overflow-auto max-w-full text-error">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
