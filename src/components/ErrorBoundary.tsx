import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

void React;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Arcadia ErrorBoundary caught:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="
            flex flex-col items-center justify-center bg-bg p-8 text-center
            text-text min-block-screen
          "
        >
          <div
            className="
              flex flex-col items-center gap-4 rounded-panel border border-line
              bg-panel p-6 shadow-lg max-inline-md
            "
          >
            <div
              className="
                flex items-center justify-center rounded-full bg-rec/20 text-rec
                block-12 inline-12
              "
            >
              <AlertTriangle className="block-6 inline-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold tracking-tight">Audio Workstation Exception</h2>
              <p className="text-xs text-muted">
                {this.state.error?.message ?? 'An unexpected engine error occurred.'}
              </p>
            </div>
            <button
              type="button"
              onClick={this.handleReset}
              className="
                inline-flex items-center gap-2 rounded-field border border-line
                bg-field px-4 py-2 text-xs font-semibold text-text
                transition-colors
                hover:bg-field-hover
              "
            >
              <RotateCcw className="block-4 inline-4" />
              <span>Reload Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
