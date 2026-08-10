import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  color?: string;
}

export function StatTile({ label, value, Icon, color = "bg-primary/10 text-primary" }: Props) {
  return (
    <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-none">{typeof value === "number" ? value.toLocaleString() : value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
