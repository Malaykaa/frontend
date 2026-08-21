import { Progress } from "@/components/ui/progress";

/** Barre de progression labellisée (X/Y — Z%). Utilisée sur MyCoursePage (qui
 * n'affichait aucune progression globale malgré la donnée disponible) et sur
 * la page d'index élève. */
export function ProgressBar({ done, total }: { done: number; total: number }) {
  if (total === 0) return null;
  const pct = Math.round((done / total) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{done}/{total} étapes</span>
        <span className="font-semibold text-primary">{pct}%</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
