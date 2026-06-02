import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Bell, ExternalLink, CheckCheck, TrendingUp } from "lucide-react";
import { AiAvatar } from "@/components/chat/AiAvatar";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/utils";
import { useChatThreads } from "@/hooks/queries/use-chat-threads";
import { useOfferNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from "@/hooks/queries/use-notifications";
import type { ChatThread } from "@/shared/types";
import type { OfferNotification } from "@/services/api/notifications.api";

// ── Labels types d'offres ─────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  job:                   "Emploi",
  scholarship:           "Bourse",
  grant:                 "Financement",
  call_for_applications: "Appel à cand.",
  opportunity:           "Opportunité",
  formation:             "Formation",
  partnership:           "Partenariat",
};

const TYPE_COLORS: Record<string, string> = {
  job:                   "bg-blue-100 text-blue-700",
  scholarship:           "bg-violet-100 text-violet-700",
  grant:                 "bg-emerald-100 text-emerald-700",
  call_for_applications: "bg-orange-100 text-orange-700",
  opportunity:           "bg-sky-100 text-sky-700",
  formation:             "bg-amber-100 text-amber-700",
  partnership:           "bg-teal-100 text-teal-700",
};

// ── Item tendances delta ──────────────────────────────────────────────────────

function TendancesDeltaItem({
  notif,
  onRead,
}: {
  notif: OfferNotification;
  onRead: (id: string) => void;
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (!notif.seen) onRead(notif.id);
    navigate("/app/tendances");
  };

  return (
    <button
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors border-b last:border-b-0",
        notif.seen ? "hover:bg-muted/20" : "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100/50"
      )}
      onClick={handleClick}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
        <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          {!notif.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          )}
          <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0 text-[10px] font-semibold shrink-0">
            Tendances
          </span>
        </div>
        <p className="text-sm font-medium leading-snug">
          {notif.offer_title ?? "Mise à jour de tes tendances"}
        </p>
        {notif.created_at && (
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(notif.created_at)}
          </span>
        )}
      </div>
    </button>
  );
}

// ── Item offre haute-pertinence ───────────────────────────────────────────────

function OfferNotificationItem({
  notif,
  onRead,
}: {
  notif: OfferNotification;
  onRead: (id: string) => void;
}) {
  const handleClick = () => {
    if (!notif.seen) onRead(notif.id);
    if (notif.offer_url) window.open(notif.offer_url, "_blank", "noopener,noreferrer");
  };

  const typeColor = TYPE_COLORS[notif.offer_type ?? ""] ?? "bg-muted text-muted-foreground";
  const typeLabel = TYPE_LABELS[notif.offer_type ?? ""] ?? notif.offer_type;

  return (
    <button
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors border-b last:border-b-0",
        notif.seen ? "hover:bg-muted/20" : "bg-primary/3 hover:bg-primary/5"
      )}
      onClick={handleClick}
    >
      {/* Icône score */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          (notif.score_pct ?? 0) >= 90
            ? "bg-emerald-100 text-emerald-700"
            : "bg-primary/10 text-primary"
        )}
      >
        {notif.score_pct ?? "?"}%
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          {!notif.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          )}
          {typeLabel && (
            <span className={cn("rounded-full px-1.5 py-0 text-[10px] font-semibold shrink-0", typeColor)}>
              {typeLabel}
            </span>
          )}
        </div>
        <p className="text-sm font-medium leading-snug truncate">
          {notif.offer_title ?? "Nouvelle offre"}
        </p>
        <div className="flex items-center justify-between mt-1">
          {notif.created_at && (
            <span className="text-[10px] text-muted-foreground">
              {formatRelativeTime(notif.created_at)}
            </span>
          )}
          {notif.offer_url && (
            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
        </div>
      </div>
    </button>
  );
}

// ── Item conversation (existant) ──────────────────────────────────────────────

function NotificationItem({
  thread,
  onClose,
}: {
  thread: ChatThread;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    onClose();
    navigate(`/app/chat/${thread.id}`);
  };

  return (
    <button
      className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors border-b last:border-b-0"
      onClick={handleClick}
    >
      <AiAvatar className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold">{thread.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {thread.message_count > 0
            ? `${thread.message_count} message${thread.message_count > 1 ? "s" : ""}`
            : t("app.new_conversation")}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {thread.updated_at && (
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(thread.updated_at)}
          </span>
        )}
        {thread.message_count > 0 && (
          <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {thread.message_count > 99 ? "99+" : thread.message_count}
          </div>
        )}
      </div>
    </button>
  );
}

// ── Panel principal ────────────────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { t } = useTranslation();
  const { data: threads } = useChatThreads();
  const { data: notifData } = useOfferNotifications();
  const markAll = useMarkAllNotificationsRead();
  const markOne = useMarkNotificationRead();

  // ── Fusionner toutes les notifications en une liste chronologique ──────────
  type UnifiedItem =
    | { kind: "offer";   data: OfferNotification; date: string }
    | { kind: "thread";  data: ChatThread;         date: string };

  const offerItems: UnifiedItem[] = (notifData?.notifications ?? []).map((n) => ({
    kind: "offer" as const,
    data: n,
    date: n.created_at ?? "",
  }));

  const threadItems: UnifiedItem[] = (threads ?? [])
    .filter((th) => th.message_count > 0)
    .map((th) => ({
      kind: "thread" as const,
      data: th,
      date: th.updated_at ?? th.created_at ?? "",
    }));

  const allItems = [...offerItems, ...threadItems]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const unreadOffers = notifData?.unread_count ?? 0;
  const totalCount = allItems.length;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl",
          "max-w-sm animate-slide-in-right"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t("settings.notifications")}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <span className="flex-1 font-bold">{t("settings.notifications")}</span>
          <div className="flex items-center gap-2">
            {unreadOffers > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Tout lire
              </button>
            )}
            {totalCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Liste unifiée chronologique */}
        <div className="flex-1 overflow-y-auto">
          {totalCount === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t("app.no_notifications")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("app.no_notifications_hint")}
                </p>
              </div>
            </div>
          ) : (
            allItems.map((item) =>
              item.kind === "offer" ? (
                item.data.offer_type === "tendances_delta" ? (
                  <TendancesDeltaItem
                    key={item.data.id}
                    notif={item.data}
                    onRead={(id) => markOne.mutate(id)}
                  />
                ) : (
                  <OfferNotificationItem
                    key={item.data.id}
                    notif={item.data}
                    onRead={(id) => markOne.mutate(id)}
                  />
                )
              ) : (
                <NotificationItem
                  key={item.data.id}
                  thread={item.data}
                  onClose={onClose}
                />
              )
            )
          )}
        </div>
      </div>
    </>
  );
}

// ── Hook badge global (threads + offres non-lues) ─────────────────────────────

export function useNotificationCount(): number {
  const { data: threads } = useChatThreads();
  const { data: notifData } = useOfferNotifications();
  const threadCount = (threads ?? []).filter((t: ChatThread) => t.message_count > 0).length;
  const offerCount = notifData?.unread_count ?? 0;
  return threadCount + offerCount;
}
