import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useExerciseToTake, useMyExerciseAttempts, useMyExerciseResult } from "@/hooks/queries/use-structure";

function scoreColor(pct: number): string {
  if (pct >= 70) return "text-emerald-600";
  if (pct >= 50) return "text-amber-600";
  return "text-destructive";
}

export default function ExerciseResultPage() {
  const { exerciseId = "" } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading } = useMyExerciseResult(exerciseId);
  const { data: exercise } = useExerciseToTake(exerciseId);
  const { data: attempts } = useMyExerciseAttempts(exerciseId);

  if (isLoading || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const canRetry = exercise?.kind === "exercise";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ton résultat</p>
        <p className={cn("mt-1 text-4xl font-bold tabular-nums", scoreColor(result.score_pct ?? 0))}>
          {result.score_pct}%
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.score_points}/{result.max_points} bonnes réponses
        </p>
        {(attempts ?? []).length > 1 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tentatives : {(attempts ?? []).map((a) => `${a.score_pct}%`).join(" → ")}
          </p>
        )}
      </header>

      <main className="mx-auto max-w-2xl space-y-3 p-6">
        {result.answers.map((a, i) => (
          <div key={a.question_id} className="rounded-xl border bg-card p-4">
            <p className="mb-2 flex items-start gap-2 text-sm font-medium">
              <span className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                a.is_correct ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-destructive",
              )}>
                {a.is_correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
              </span>
              <span>{i + 1}. {a.prompt}</span>
            </p>
            <div className="ml-7 space-y-1">
              {a.choices.map((choice, cIndex) => (
                <p
                  key={cIndex}
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm",
                    cIndex === a.correct_choice_index && "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
                    cIndex === a.selected_choice_index && !a.is_correct && "bg-red-50 text-destructive dark:bg-red-900/20",
                  )}
                >
                  {choice}
                  {cIndex === a.correct_choice_index && " ✓"}
                  {cIndex === a.selected_choice_index && cIndex !== a.correct_choice_index && " (ta réponse)"}
                </p>
              ))}
            </div>
            {a.explanation && (
              <p className="ml-7 mt-2 text-xs text-muted-foreground">{a.explanation}</p>
            )}
          </div>
        ))}

        <div className="flex gap-2 pb-8 pt-2">
          {canRetry && (
            <Button className="flex-1" onClick={() => navigate(`/classrooms/exercises/${exerciseId}`)}>
              Retenter
            </Button>
          )}
          <Link to="/app" className="flex-1">
            <Button variant="outline" className="w-full">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
