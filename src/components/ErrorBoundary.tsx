import { Component, type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  eventId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, eventId: null };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    const eventId = Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    });
    this.setState({ eventId });
  }

  handleReset = () => {
    this.setState({ hasError: false, eventId: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-xl font-semibold">Quelque chose s'est mal passé</h1>
          <p className="max-w-sm text-sm text-muted-foreground">
            Une erreur inattendue s'est produite. L'équipe a été notifiée.
          </p>
          {this.state.eventId && (
            <p className="text-xs text-muted-foreground">
              Référence : {this.state.eventId}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.handleReset}>
              Réessayer
            </Button>
            <Button onClick={() => window.location.replace("/")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
