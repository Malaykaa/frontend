import { NavLink, useLocation } from "react-router-dom";
import { Compass, FolderOpen, TrendingUp, HelpCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const TABS = [
  { to: "/app/pour-moi",  label: "Pour Moi",  Icon: Compass     },
  { to: "/app/actions",   label: "Livrables", Icon: FolderOpen  },
  { to: "/app/tendances", label: "Tendances", Icon: TrendingUp  },
  { to: "/app/aide",      label: "Aide",      Icon: HelpCircle  },
] as const;

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm safe-bottom">
      <div className="flex items-stretch">
        {TABS.map(({ to, label, Icon }) => {
          const active = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors"
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
                  active ? "bg-primary/10 scale-110" : "scale-100"
                )}
              >
                <Icon
                  className={cn(
                    "transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                  size={18}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
