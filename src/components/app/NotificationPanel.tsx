import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Bell } from "lucide-react";
import { AiAvatar } from "@/components/chat/AiAvatar";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/utils";
import { useChatThreads } from "@/hooks/queries/use-chat-threads";
import type { ChatThread } from "@/shared/types";

// ── Item de notification ───────────────────────────────────────────────────

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

      {/* Badge + temps */}
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

// ── Panel principal ────────────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { data: threads } = useChatThreads();
  const { t } = useTranslation();

  // Threads avec activité récente (message_count > 0 ou récemment créés)
  const activeThreads = (threads ?? [])
    .filter((t) => t.message_count > 0)
    .sort((a, b) => {
      const ta = a.updated_at ?? a.created_at;
      const tb = b.updated_at ?? b.created_at;
      return tb.localeCompare(ta);
    })
    .slice(0, 20);

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
          {activeThreads.length > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
              {activeThreads.length}
            </span>
          )}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto">
          {activeThreads.length === 0 ? (
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
            <div>
              <p className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b">
                {t("app.active_threads")}
              </p>
              {activeThreads.map((thread) => (
                <NotificationItem
                  key={thread.id}
                  thread={thread}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Hook pour le badge ─────────────────────────────────────────────────────

export function useNotificationCount(): number {
  const { data: threads } = useChatThreads();
  return (threads ?? []).filter((t: ChatThread) => t.message_count > 0).length;
}
