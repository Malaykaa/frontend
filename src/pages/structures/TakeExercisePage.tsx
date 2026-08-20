import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  useExerciseToTake, useMyExerciseAttempts, useStartExerciseSubmission, useSubmitExercise,
} from "@/hooks/queries/use-structure";

export default function TakeExercisePage() {
  const { exerciseId = "" } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();

  const { data: exercise, isLoading } = useExerciseToTake(exerciseId);
  const { data: attempts } = useMyExerciseAttempts(exerciseId);
  const startSubmission = useStartExerciseSubmission();
  const submitExercise = useSubmitExercise(exerciseId);

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (isLoading || !exercise) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isEvaluation = exercise.kind === "evaluation";
  const previousAttempts = attempts ?? [];
  const hasPreviousAttempt = previousAttempts.length > 0;

  const handleStart = async () => {
    await startSubmission.mutateAsync(exerciseId);
    setStarted(true);
  };

  const allAnswered = exercise.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    const payload = exercise.questions.map((q) => ({
      question_id: q.id, selected_choice_index: answers[q.id] ?? null,
    }));
    await submitExercise.mutateAsync(payload);
    navigate(`/classrooms/exercises/${exerciseId}/result`);
  };

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
        <div>
          <h1 className="text-xl font-bold">{exercise.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {exercise.instructions || `${exercise.questions.length} question${exercise.questions.length > 1 ? "s" : ""} à choix multiples.`}
          </p>
        </div>

        {isEvaluation && (
          <p className="max-w-sm rounded-lg border border-rose-200 bg-rose-50/60 px-4 py-3 text-xs text-rose-800 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
            C'est une évaluation notée — une seule tentative sera comptée.
          </p>
        )}

        {!isEvaluation && hasPreviousAttempt && (
          <p className="max-w-sm rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-sky-800 dark:border-sky-900/30 dark:bg-sky-900/10 dark:text-sky-300">
            Tentative précédente : {previousAttempts[previousAttempts.length - 1].score_pct}% — tu peux retenter.
          </p>
        )}

        <Button onClick={handleStart} disabled={startSubmission.isPending}>
          {startSubmission.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {hasPreviousAttempt ? "Retenter" : "Commencer"}
        </Button>

        <Link to="/app" className="text-xs text-muted-foreground hover:text-foreground">
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-28">
      <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
        <h1 className="text-sm font-semibold">{exercise.title}</h1>
        <p className="text-xs text-muted-foreground">
          {Object.keys(answers).length}/{exercise.questions.length} répondues
        </p>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 p-6">
        {exercise.questions.map((q, qIndex) => (
          <div key={q.id} className="rounded-xl border bg-card p-4">
            <p className="mb-3 text-sm font-medium">
              <span className="mr-1.5 text-muted-foreground">{qIndex + 1}.</span>
              {q.prompt}
            </p>
            <div className="space-y-1.5">
              {q.choices.map((choice, cIndex) => (
                <label
                  key={cIndex}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    answers[q.id] === cIndex ? "border-primary bg-primary/5" : "hover:bg-muted/40",
                  )}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === cIndex}
                    onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: cIndex }))}
                  />
                  {choice}
                </label>
              ))}
            </div>
          </div>
        ))}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-card px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <Button className="w-full" disabled={!allAnswered || submitExercise.isPending} onClick={handleSubmit}>
            {submitExercise.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Envoyer mes réponses
          </Button>
        </div>
      </div>
    </div>
  );
}
