import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("HebrewMe runtime error", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">⚠️</div>
          <h1 className="text-xl font-black text-foreground mb-2">Что-то пошло не так</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Приложение не упало полностью. Обновите экран или вернитесь на главную.
          </p>
          {this.state.message && (
            <p className="mb-5 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
          )}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => window.location.assign("/")}>На главную</Button>
            <Button className="flex-1" variant="outline" onClick={() => window.location.reload()}>Обновить</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
