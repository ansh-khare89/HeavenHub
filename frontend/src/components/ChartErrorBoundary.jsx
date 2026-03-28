import { Component } from 'react';

/** Isolates Recharts (or any chart lib) so a render error cannot blank the whole dashboard. */
export class ChartErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <p className="py-12 text-center text-sm text-amber-200/90">
          Chart could not render in this environment. Totals above still reflect your live API data — try another
          browser or update Recharts if this persists.
        </p>
      );
    }
    return this.props.children;
  }
}
