import React from 'react';

type Props = {
  children: React.ReactNode;
  fallbackTitle?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto my-16 px-4 text-center space-y-3">
          <h2 className="text-xl font-extrabold text-gray-900">
            {this.props.fallbackTitle || 'Something went wrong'}
          </h2>
          <p className="text-sm text-gray-500">{this.state.error.message}</p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[#1D1D1F] text-white text-sm font-semibold"
            onClick={() => {
              try {
                localStorage.removeItem('dji_catalog_v1');
                localStorage.removeItem('dji_orders_v8');
                localStorage.removeItem('dji_orders_v9');
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
          >
            Clear cache & reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
