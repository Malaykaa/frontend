import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useExercise, useExerciseResults } from "@/hooks/queries/use-structure";

function scoreColor(pct: number | null): string {
  if (pct === null) return "text-muted-foreground";
  if (pct >= 70) return "text-emerald-600";
  if (pct >= 50) return "text-amber-600";
  return "text-destructive";
}

export default function ExerciseResultsPage() {
  const { structureId = "", classroomId = "", exerciseId = "" } =
    useParams<{ structureId: string; classroomId: string; exerciseId: string }>();

  const { data: exercise, isLoading: exerciseLoading } = useExercise(structureId, classroomId, exerciseId);
  const { data: results, isLoading: resultsLoading } = useExerciseResults(structureId, classroomId, exerciseId);

  if (exerciseLoading || resultsLoading || !exercise) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const attempted = (results?.recipients ?? []).filter((r) => r.attempted);
  const avgScore = attempted.length > 0
    ? Math.round(attempted.reduce((s, r) => s + (r.score_pct ?? 0), 0) / attempted.length)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Link
          to={`/structures/${structureId}/classrooms/${classroomId}?tab=exercises`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Retour à la classroom
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold">{exercise.title}</h1>
          <Badge variant={results?.kind === "evaluation" ? "destructive" : "secondary"} className="text-[10px]">
            {results?.kind === "evaluation" ? "Évaluation" : "Exercice"}
          </Badge>
        </div>
        {avgScore !== null && (
          <p className="mt-1 text-sm text-muted-foreground">
            Moyenne de la classe : <span className={cn("font-bold", scoreColor(avgScore))}>{avgScore}%</span>
            {" "}sur {attempted.length} tentative{attempted.length > 1 ? "s" : ""}
          </p>
        )}
      </header>

      <main className="p-6">
        {(results?.recipients ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Pas encore envoyé à d'étudiants.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Étudiant</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">Statut</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Score</th>
                </tr>
              </thead>
              <tbody>
                {results?.recipients.map((r) => (
                  <tr key={r.user_id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-xs font-medium">{r.user_name ?? r.user_email ?? "—"}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant={r.attempted ? "success" : "secondary"} className="text-[10px]">
                        {r.attempted ? "Terminé" : "Pas encore fait"}
                      </Badge>
                    </td>
                    <td className={cn("px-4 py-2.5 text-right font-bold tabular-nums", scoreColor(r.score_pct))}>
                      {r.score_pct !== null ? `${r.score_pct}%` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
