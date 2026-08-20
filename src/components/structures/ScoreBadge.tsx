import { cn } from "@/shared/lib/utils";

/** Pastille de score colorée — remplace les scoreColor() dupliqués dans
 * ExerciseResultsPage/ExerciseResultPage. Seuils cohérents avec ScoreBadge
 * partout où un score apparaît (résultats, difficulté). */
export function ScoreBadge({ pct, size = "md" }: { pct: number | null; size?: "sm" | "md" }) {
  if (pct === null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  const tone =
    pct >= 70
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : pct >= 50
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-destructive dark:bg-red-900/30";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold tabular-nums",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        tone,
      )}
    >
      {pct}%
    </span>
  );
}
