import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Bell, Settings } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useNotificationCount } from "@/components/app/NotificationPanel";

interface AppHeaderProps {
  hideLogo?: boolean;
  onOpenSettings?: () => void;
  onOpenNotifications?: () => void;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary select-none">
      {initials || "?"}
    </div>
  );
}

export function AppHeader({ hideLogo = false, onOpenSettings, onOpenNotifications }: AppHeaderProps) {
  const { profile, user } = useAuth();
  const { t } = useTranslation();
  const notifCount = useNotificationCount();

  const firstName = profile?.first_name ?? null;
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    t("settings.my_account");

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t("app_header.greeting_morning");
    if (h < 18) return t("app_header.greeting_afternoon");
    return t("app_header.greeting_evening");
  })();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo (mobile uniquement) */}
        {!hideLogo && (
          <img src="/logo.png" alt="Malayka" className="h-7 w-auto shrink-0 dark:invert" />
        )}

        {/* Avatar + salutation (cliquable → paramètres) */}
        <button
          className="flex flex-1 items-center gap-2.5 min-w-0 rounded-xl p-1 -m-1 hover:bg-muted/40 transition-colors text-left"
          onClick={onOpenSettings}
          title={t("settings.open_settings")}
        >
          <Avatar name={fullName} />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{greeting}</p>
            <p className="truncate text-sm font-semibold leading-tight">
              {firstName ?? fullName}
            </p>
          </div>
        </button>

        {/* Badge crédits */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1",
            "cursor-default select-none"
          )}
          title={t("settings.credits_title")}
        >
          <span className="text-xs font-semibold text-primary">0</span>
          <span className="text-xs text-primary/70">cr.</span>
        </div>

        {/* Paramètres (icône explicite sur desktop) */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
          aria-label={t("settings.title")}
          onClick={onOpenSettings}
        >
          <Settings className="h-4.5 w-4.5 text-muted-foreground" size={18} />
        </button>

        {/* Cloche avec badge */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/60 transition-colors"
          aria-label={t("settings.notifications")}
          onClick={onOpenNotifications}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notifCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
