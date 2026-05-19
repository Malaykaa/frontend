import { useState } from "react";
import { Sparkles, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "./RecommendationCard";
import { useRecommendations } from "@/hooks/queries/use-recommendations";

const PAGE_SIZE = 5;

// ── Skeleton ──────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 animate-pulse">
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-muted" />
        <div className="h-5 w-12 rounded-full bg-muted" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-3 w-3/5 rounded bg-muted" />
      </div>
      <div className="h-3 w-full rounded bg-muted" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-20 rounded-lg bg-muted" />
        <div className="h-6 w-24 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-muted py-10 text-center px-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-semibold text-sm">Aucune recommandation pour l'instant</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Continue à discuter avec l'IA pour affiner ton profil et recevoir des opportunités personnalisées.
        </p>
      </div>
      <Button variant="outline" size="sm" className="gap-2" onClick={onRefresh}>
        <RefreshCw className="h-3.5 w-3.5" />
        Actualiser
      </Button>
    </div>
  );
}

// ── État erreur ────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
      <p className="text-sm text-destructive font-medium">
        Impossible de charger les recommandations
      </p>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onRetry}>
        <RefreshCw className="h-3.5 w-3.5" />
        Réessayer
      </Button>
    </div>
  );
}

// ── Feed principal ─────────────────────────────────────────────────────────

export function RecommendationFeed() {
  const { data, isLoading, isError, refetch } = useRecommendations();
  const [page, setPage] = useState(1);

  const visible  = data?.slice(0, page * PAGE_SIZE) ?? [];
  const hasMore  = (data?.length ?? 0) > page * PAGE_SIZE;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState onRefresh={() => void refetch()} />;
  }

  return (
    <div className="space-y-3">
      {visible.map((offer) => (
        <RecommendationCard
          key={offer.offer_ref}
          offer={offer}
        />
      ))}

      {hasMore && (
        <Button
          variant="ghost"
          className="w-full gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => setPage((p) => p + 1)}
        >
          <ChevronDown className="h-4 w-4" />
          Voir plus ({(data.length ?? 0) - page * PAGE_SIZE} restantes)
        </Button>
      )}

      {/* Actualisé depuis */}
      <p className="text-center text-xs text-muted-foreground py-1">
        {data.length} opportunité{data.length > 1 ? "s" : ""} matchée{data.length > 1 ? "s" : ""} à ton profil
      </p>
    </div>
  );
}
