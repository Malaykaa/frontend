import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/structures/ScoreBadge";
import { useExercise, useExerciseResults } from "@/hooks/queries/use-structure";

export default function ExerciseResultsPage() {
  const { t } = useTranslation();
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
          <ArrowLeft className="h-3.5 w-3.5" /> {t("structures.exercise_results.back_to_classroom")}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold">{exercise.title}</h1>
          <Badge variant={results?.kind === "evaluation" ? "destructive" : "secondary"} className="text-[10px]">
            {results?.kind === "evaluation" ? t("structures.exercise_results.type_evaluation") : t("structures.exercise_results.type_exercise")}
          </Badge>
        </div>
        {avgScore !== null && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            {t("structures.exercise_results.class_average_prefix")} <ScoreBadge pct={avgScore} size="sm" />
            {t("structures.exercise_results.class_average_suffix", { count: attempted.length })}
          </p>
        )}
      </header>

      <main className="p-6">
        {(results?.recipients ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("structures.exercise_results.not_sent_yet")}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">{t("structures.exercise_results.col_student")}</th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold text-muted-foreground">{t("structures.exercise_results.col_status")}</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">{t("structures.exercise_results.col_score")}</th>
                </tr>
              </thead>
              <tbody>
                {results?.recipients.map((r) => (
                  <tr key={r.user_id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-xs font-medium">{r.user_name ?? r.user_email ?? "—"}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant={r.attempted ? "success" : "secondary"} className="text-[10px]">
                        {r.attempted ? t("structures.exercise_results.status_done") : t("structures.exercise_results.status_not_done")}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <ScoreBadge pct={r.score_pct} size="sm" />
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
