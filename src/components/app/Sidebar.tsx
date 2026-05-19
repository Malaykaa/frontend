import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Compass, FolderOpen, TrendingUp, HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TABS = [
  { to: "/app/pour-moi",  labelKey: "app.tab_pour_moi",  descKey: "app.desc_pour_moi",  Icon: Compass    },
  { to: "/app/actions",   labelKey: "app.tab_livrables",  descKey: "app.desc_livrables", Icon: FolderOpen },
  { to: "/app/tendances", labelKey: "app.tab_trends",     descKey: "app.desc_trends",    Icon: TrendingUp },
  { to: "/app/aide",      labelKey: "app.tab_aide",       descKey: "app.desc_aide",      Icon: HelpCircle },
] as const;

function SidebarAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
      {initials}
    </div>
  );
}

export function Sidebar() {
  const { profile, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    t("settings.my_account");

  const role =
    profile?.primary_role === "student"      ? t("onboarding.role_student")
    : profile?.primary_role === "professional" ? t("onboarding.role_professional")
    : profile?.primary_role === "jobseeker"    ? t("onboarding.role_jobseeker")
    : null;

  const handleLogout = async () => {
    await logout();
    toast.success(t("app.see_you_soon"));
    navigate("/", { replace: true });
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex items-center px-5 py-4 border-b">
        <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {TABS.map(({ to, labelKey, descKey, Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive ? "bg-primary/15" : "bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none">{t(labelKey)}</p>
                  <p className="mt-0.5 truncate text-[11px] opacity-70">{t(descKey)}</p>
                </div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t px-3 py-4 space-y-1">
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
          <span className="text-xs text-primary/70">{t("app.credits")}</span>
          <span className="ml-auto text-sm font-bold text-primary">0 cr.</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2">
          <SidebarAvatar name={fullName} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{fullName}</p>
            {role && <p className="text-xs text-muted-foreground">{role}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title={t("settings.logout")}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
