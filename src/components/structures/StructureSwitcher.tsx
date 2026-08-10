import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Check, ChevronDown, User } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useMyStructures } from "@/hooks/queries/use-structure";
import { cn } from "@/shared/lib/utils";

interface StructureSwitcherProps {
  className?: string;
}

export function StructureSwitcher({ className }: StructureSwitcherProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: structures } = useMyStructures();
  const [open, setOpen] = useState(false);

  if (!structures || structures.length === 0) return null;

  const activeStructureId = location.pathname.match(/^\/structures\/([^/]+)/)?.[1];

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={cn(
          "inline-flex items-center text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
        aria-label={t("structures.switch_workspace")}
        title={t("structures.switch_workspace")}
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={t("structures.switch_workspace")}>
        <div className="divide-y">
          <button
            type="button"
            onClick={() => go("/app")}
            className="flex w-full items-center gap-3 py-3 px-1 text-left transition-colors hover:bg-muted/30"
          >
            <User className={cn("h-3.5 w-3.5 shrink-0", !activeStructureId ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("flex-1 text-sm font-medium", !activeStructureId ? "text-primary" : "")}>
              {t("structures.personal_account")}
            </span>
            {!activeStructureId && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
          </button>

          {structures.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(`/structures/${s.id}`)}
              className="flex w-full items-center gap-3 py-3 px-1 text-left transition-colors hover:bg-muted/30"
            >
              <Building2 className={cn("h-3.5 w-3.5 shrink-0", activeStructureId === s.id ? "text-primary" : "text-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", activeStructureId === s.id ? "text-primary" : "")}>{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.role === "super_admin" ? t("settings.structure_role_super_admin") : t("settings.structure_role_teacher")}
                </p>
              </div>
              {activeStructureId === s.id && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
