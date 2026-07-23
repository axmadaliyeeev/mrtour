import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Without this, any uncaught render exception anywhere in the tree (a bad
// data field, a null-check miss, a third-party library throwing) unmounts
// the whole app to a blank white/dark screen with zero feedback — the
// worst possible failure mode. This catches it and shows something the
// user can actually act on instead.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-20">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-base font-bold text-[var(--foreground)]">
            Nimadir noto'g'ri ketdi
          </p>
          <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
            Bu sahifani yuklashda xatolik yuz berdi. Qayta urinib ko'ring.
          </p>
          <button
            onClick={() => this.setState({ error: null })}
            className="flex items-center gap-1.5 mt-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors active:scale-[0.97]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta urinish
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
