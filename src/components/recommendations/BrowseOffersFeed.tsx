import { useState } from "react";
import { ChevronDown, RefreshCw, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecommendationCard } from "./RecommendationCard";
import { useBrowseOffers } from "@/hooks/queries/use-browse-offers";
import type { BrowseOffersParams } from "@/services/api/recommendations.api";

const TYPE_LABELS: Record<string, string> = {
  job:                   "Emploi",
  scholarship:           "Bourse",
  grant:                 "Financement",
  call_for_applications: "Appel à cand.",
  opportunity:           "Opportunité",
  formation:             "Formation",
  partnership:           "Partenariat",
  resource:              "Ressource",
};

const PAGE_SIZE = 10;

interface Props {
  params: BrowseOffersParams;
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
      {label}
    </span>
  );
}

export function BrowseOffersFeed({ params }: Props) {
  const { data, isLoading, isError, refetch } = useBrowseOffers(params);
  const [page, setPage] = useState(1);

  const visible = data?.slice(0, page * PAGE_SIZE) ?? [];
  const hasMore = (data?.length ?? 0) > page * PAGE_SIZE;

  // Build filter chips labels
  const chips: string[] = [];
  if (params.offer_types) {
    params.offer_types.split(",").forEach((t) => {
      chips.push(TYPE_LABELS[t.trim()] ?? t.trim());
    });
  }
  if (params.skill) chips.push(params.skill);
  if (params.country) chips.push(params.country);

  return (
    <div className="space-y-4">
      {/* Header filtre actif */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filtre actif :
        </div>
        {chips.map((chip) => (
          <FilterChip key={chip} label={chip} />
        ))}
        {!isLoading && data && (
          <span className="ml-auto text-xs text-muted-foreground">
            {data.length} offre{data.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-4 animate-pulse">
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="h-5 w-12 rounded-full bg-muted" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-4/5 rounded bg-muted" />
                <div className="h-3 w-3/5 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
          <p className="text-sm text-destructive font-medium">Impossible de charger les offres</p>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void refetch()}>
            <RefreshCw className="h-3.5 w-3.5" />
            Réessayer
          </Button>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-muted py-10 text-center px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-semibold">Aucune offre pour ces filtres</p>
          <p className="text-xs text-muted-foreground max-w-xs">
            Essaie d'élargir ta recherche ou reviens plus tard quand de nouvelles offres sont scrapées.
          </p>
        </div>
      )}

      {!isLoading && !isError && visible.length > 0 && (
        <>
          <div className="space-y-3">
            {visible.map((offer) => (
              <RecommendationCard key={offer.offer_ref} offer={offer} />
            ))}
          </div>

          {hasMore && (
            <Button
              variant="ghost"
              className="w-full gap-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronDown className="h-4 w-4" />
              Voir plus ({(data?.length ?? 0) - page * PAGE_SIZE} restantes)
            </Button>
          )}
        </>
      )}
    </div>
  );
}
