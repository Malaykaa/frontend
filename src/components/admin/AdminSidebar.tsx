import { NavLink } from "react-router-dom";
import { BarChart3, Brain, Briefcase, FileText, LogOut, MessageSquare, RefreshCw, Settings, Target, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const NAV = [
  { to: "/admin",           label: "Dashboard",    Icon: BarChart3,     exact: true  },
  { to: "/admin/users",     label: "Utilisateurs", Icon: Users,         exact: false },
  { to: "/admin/offers",    label: "Offres",       Icon: Briefcase,     exact: false },
  { to: "/admin/goals",     label: "Objectifs",    Icon: Target,        exact: false },
  { to: "/admin/threads",   label: "Threads",      Icon: MessageSquare, exact: false },
  { to: "/admin/documents", label: "Documents",    Icon: FileText,      exact: false },
  { to: "/admin/intents",   label: "Intentions",   Icon: Brain,         exact: false },
  { to: "/admin/scraping",  label: "Scraping",     Icon: RefreshCw,     exact: false },
] as const;

export function AdminSidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-background shrink-0">
      <div className="flex items-center gap-2 px-4 py-4 border-b">
        <img src="/logo.png" alt="Malayka" className="h-7 w-auto dark:invert" />
        <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV.map(({ to, label, Icon, exact }) => (
          <NavLink key={to} to={to} end={exact}>
            {({ isActive }) => (
              <div className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}>
                <Icon className="h-4 w-4 shrink-0" />{label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-3 py-3 space-y-1">
        <NavLink to="/app">{() => (
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer">
            <Settings className="h-4 w-4 shrink-0" />Retour à l'app
          </div>
        )}</NavLink>
        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">{(user?.email?.[0] ?? "A").toUpperCase()}</div>
          <div className="flex-1 min-w-0"><p className="truncate text-xs font-medium">{user?.email ?? "Admin"}</p><p className="text-[10px] text-muted-foreground">Administrateur</p></div>
          <button onClick={logout} className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"><LogOut className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </aside>
  );
}
