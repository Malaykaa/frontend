import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarkNotificationRead, useNotification } from "@/hooks/queries/use-notifications";
import { TYPE_COLORS, TYPE_LABELS } from "@/components/app/NotificationPanel";
import { formatRelativeTime, cn } from "@/shared/lib/utils";

/**
 * Détail d'une notification — pour les types qui n'ont pas de destination
 * interne directe (offres d'emploi, bourses…).
 *
 * Le tiroir de notifications n'affiche qu'un aperçu compact, sur deux lignes
 * maximum : cette page montre le titre en entier, sans troncature, avant de
 * proposer d'ouvrir le lien externe. Les notifications qui ont une
 * destination interne (chat, services, tendances) ne passent jamais par
 * ici — elles naviguent directement, cf. `NotificationPanel`.
 */
export default function NotificationDetailPage() {
  const { notificationId = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNotification(notificationId);
  const markRead = useMarkNotificationRead();

  useEffect(() => {
    if (data && !data.seen) markRead.mutate(data.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id, data?.seen]);

  const typeColor = TYPE_COLORS[data?.offer_type ?? ""] ?? "bg-muted text-muted-foreground";
  const typeLabel = TYPE_LABELS[data?.offer_type ?? ""] ?? data?.offer_type;

  return (
    <div className="flex flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold">Notification</h1>
      </div>

      {isLoading && (
        <div className="h-32 animate-pulse rounded-xl border bg-card" />
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
          Impossible de charger cette notification.
        </div>
      )}

      {data && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {typeLabel && (
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", typeColor)}>
                    {typeLabel}
                  </span>
                )}
                {data.score_pct !== null && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                    {data.score_pct} % de correspondance
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-base font-semibold leading-snug">
              {data.offer_title ?? "Notification"}
            </p>

            {data.created_at && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatRelativeTime(data.created_at)}
              </p>
            )}
          </div>

          {data.offer_url && (
            <Button
              className="w-full gap-2"
              onClick={() => window.open(data.offer_url as string, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="h-4 w-4" />
              Voir
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
