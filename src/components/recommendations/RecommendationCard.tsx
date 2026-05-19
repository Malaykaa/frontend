import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Star, X, CheckCircle2, ExternalLink,
  MapPin, Building2, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { normalizeScore, getOfferTypeMeta } from "@/services/api/recommendations.api";
import { useSendFeedback } from "@/hooks/queries/use-recommendations";
import type { ScrapedOffer, FeedbackAction } from "@/shared/types";

interface RecommendationCardProps {
  offer: ScrapedOffer;
  /** Callback après "dismissed" (pour supprimer visuellement) */
  onDismissed?: (offerRef: string) => void;
}

export function RecommendationCard({ offer, onDismissed }: RecommendationCardProps) {
  const { t } = useTranslation();
  const [saved, setSaved]       = useState(false);
  const [applied, setApplied]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { mutate: sendFeedback } = useSendFeedback();

  const score = normalizeScore(offer.score);
  const meta  = getOfferTypeMeta(offer.offer_type);

  const handleFeedback = (action: FeedbackAction, e?: React.MouseEvent) => {
    e?.stopPropagation();
    sendFeedback(
      { offerRef: offer.offer_ref, action },
      {
        onError: () => toast.error(t("recommendations.feedback_error")),
      }
    );
  };

  const handleCardClick = () => {
    handleFeedback("clicked");
    if (offer.url) window.open(offer.url, "_blank", "noopener,noreferrer");
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    handleFeedback(next ? "saved" : "ignored");
    if (next) toast.success(t("recommendations.offer_saved"));
  };

  const handleApplied = (e: React.MouseEvent) => {
    e.stopPropagation();
    setApplied(true);
    handleFeedback("applied");
    toast.success(t("recommendations.marked_applied"));
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    handleFeedback("dismissed");
    onDismissed?.(offer.offer_ref);
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm",
        "cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]",
        applied && "border-emerald-200 bg-emerald-50/30"
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      {/* En-tête : badge type + score + dismiss */}
      <div className="flex items-center gap-2">
        {/* Badge type */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            meta.bg, meta.color
          )}
        >
          <span>{meta.emoji}</span>
          {meta.label}
        </span>

        {/* Score de correspondance */}
        {score > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {score}% match
          </span>
        )}

        {/* Applied badge */}
        {applied && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            {t("recommendations.applied")}
          </span>
        )}

        {/* Bouton dismiss */}
        {!applied && (
          <button
            onClick={handleDismiss}
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
            title={t("recommendations.dismiss_title")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Titre */}
      <div>
        <p className="font-semibold text-sm leading-snug line-clamp-2">
          {offer.title}
        </p>
        {/* Entreprise + lieu */}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {offer.company && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {offer.company}
            </span>
          )}
          {offer.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {offer.location}
            </span>
          )}
          {offer.source && (
            <span className="text-xs text-muted-foreground">
              via {offer.source}
            </span>
          )}
        </div>
      </div>

      {/* Description (aperçu) */}
      {offer.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {offer.description}
        </p>
      )}

      {/* Footer : freshness + actions */}
      <div className="flex items-center gap-2 pt-0.5">
        {/* Date */}
        {offer.freshness && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {offer.freshness}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sauvegarder */}
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
            saved
              ? "border-amber-300 bg-amber-50 text-amber-700"
              : "border-input text-muted-foreground hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
          )}
          title={saved ? t("recommendations.unsave_title") : t("recommendations.save_title")}
        >
          <Star className={cn("h-3.5 w-3.5", saved && "fill-amber-500")} />
          {saved ? t("recommendations.saved") : t("recommendations.save")}
        </button>

        {!applied && (
          <button
            onClick={handleApplied}
            className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("recommendations.apply")}
          </button>
        )}

        {offer.url && (
          <button
            onClick={(e) => { e.stopPropagation(); window.open(offer.url!, "_blank", "noopener,noreferrer"); handleFeedback("clicked"); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-input text-muted-foreground hover:bg-muted transition-colors"
            title={t("recommendations.view_offer")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
