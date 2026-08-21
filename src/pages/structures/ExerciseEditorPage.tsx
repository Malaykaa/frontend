/**
 * ExerciseEditorPage — création d'un exercice ou d'une évaluation QCM.
 *
 * Flow :
 *   compose  →  (clic "Générer avec l'IA")  →  generating  →  review (édition libre)  →  envoyé
 *
 * Contrairement à CourseEditorPage, les questions générées restent éditables
 * (texte, choix, bonne réponse, notion) tant que l'exercice n'a pas été envoyé —
 * corrige un vrai trou du flux cours (accepter tel quel ou tout recommencer).
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Loader2, Plus, Send, Sparkles, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { PhasedGenerationProgress, useSimulatedPhases } from "@/components/structures/PhasedGenerationProgress";
import {
  useClassrooms,
  useCreateExercise,
  useSendExercise,
  useUpdateExerciseQuestions,
} from "@/hooks/queries/use-structure";
import type { ExerciseKind, ExerciseResponse, QuestionEditInput } from "@/services/api/structure.api";

type Phase = "compose" | "generating" | "review";

function toEditInput(q: ExerciseResponse["questions"][number]): QuestionEditInput {
  return {
    prompt: q.prompt, choices: q.choices, correct_choice_index: q.correct_choice_index,
    explanation: q.explanation, topic_tag: q.topic_tag, points: q.points,
  };
}

export default function ExerciseEditorPage() {
  const { structureId = "", classroomId = "" } = useParams<{
    structureId: string;
    classroomId: string;
  }>();
  const navigate = useNavigate();

  const { data: classrooms } = useClassrooms(structureId);
  const classroom = classrooms?.find((c) => c.id === classroomId);

  const [phase, setPhase] = useState<Phase>("compose");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [topicHint, setTopicHint] = useState("");
  const [kind, setKind] = useState<ExerciseKind>("exercise");
  const [questionCount, setQuestionCount] = useState(8);
  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionEditInput[]>([]);
  const [sendLoading, setSendLoading] = useState(false);

  const createExercise = useCreateExercise(structureId, classroomId);
  const updateQuestions = useUpdateExerciseQuestions(structureId, classroomId, exercise?.id ?? "");
  const sendExercise = useSendExercise(structureId, classroomId, exercise?.id ?? "");
  const generationPhases = useSimulatedPhases(
    ["Analyse de la consigne…", "Génération des questions…", "Vérification des réponses…"],
    phase === "generating", 6_000,
  );

  const canGenerate = title.trim().length > 0 && topicHint.trim().length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setPhase("generating");
    try {
      const result = await createExercise.mutateAsync({
        title: title.trim(), topic_hint: topicHint.trim(),
        subject: subject.trim() || undefined, kind, question_count: questionCount,
      });
      setExercise(result);
      setQuestions(result.questions.map(toEditInput));
      setPhase("review");
    } catch {
      setPhase("compose");
      toast.error("La génération a échoué. Vérifie ta connexion et réessaie.");
    }
  };

  const updateQuestion = (index: number, patch: Partial<QuestionEditInput>) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));

  const updateChoice = (qIndex: number, cIndex: number, value: string) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, choices: q.choices.map((c, j) => (j === cIndex ? value : c)) } : q)),
    );

  const removeQuestion = (index: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== index));

  const addQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { prompt: "", choices: ["", "", "", ""], correct_choice_index: 0, explanation: null, topic_tag: null, points: 1 },
    ]);

  const questionsValid = questions.length > 0 && questions.every(
    (q) => q.prompt.trim() && q.choices.filter((c) => c.trim()).length >= 2,
  );

  const handleSaveQuestions = async () => {
    if (!exercise || !questionsValid) return;
    try {
      const updated = await updateQuestions.mutateAsync(questions);
      setExercise(updated);
      setQuestions(updated.questions.map(toEditInput));
    } catch {
      // toast déjà géré par le hook
    }
  };

  const handleSend = async () => {
    if (!exercise) return;
    setSendLoading(true);
    try {
      if (questionsValid) await handleSaveQuestions();
      await sendExercise.mutateAsync({ target: "classroom" });
      toast.success(kind === "evaluation" ? "Évaluation envoyée à toute la salle !" : "Exercice envoyé à toute la salle !");
      navigate(`/structures/${structureId}/classrooms/${classroomId}?tab=exercises`);
    } catch {
      setSendLoading(false);
    }
  };

  const handleSaveOnly = async () => {
    if (questionsValid) await handleSaveQuestions();
    toast.success("Enregistré. Tu pourras l'envoyer depuis l'onglet Exercices.");
    navigate(`/structures/${structureId}/classrooms/${classroomId}?tab=exercises`);
  };

  if (phase === "generating") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Génération du QCM en cours…</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette opération prend généralement 20 à 40 secondes — ne quittez pas la page.
          </p>
        </div>
        <PhasedGenerationProgress phases={generationPhases} />
      </div>
    );
  }

  if (phase === "review" && exercise) {
    return (
      <div className="min-h-screen bg-muted/20 pb-32">
        <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setPhase("compose")}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Recommencer
            </button>
            <h1 className="flex-1 truncate text-center text-sm font-semibold">{exercise.title}</h1>
            <div className="w-24" />
          </div>
        </header>

        <main className="mx-auto max-w-2xl space-y-4 p-6">
          <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-sky-800 dark:border-sky-900/30 dark:bg-sky-900/10 dark:text-sky-300">
            <Sparkles className="h-4 w-4 shrink-0" />
            Vérifie et corrige les questions ci-dessous avant d'envoyer — rien n'est figé tant que
            ce n'est pas envoyé.
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="mt-2 text-[11px] font-bold text-muted-foreground/60">Q{qIndex + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="shrink-0 text-muted-foreground/50 hover:text-destructive"
                  title="Supprimer cette question"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <textarea
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm"
                rows={2}
                placeholder="Énoncé de la question"
                value={q.prompt}
                onChange={(e) => updateQuestion(qIndex, { prompt: e.target.value })}
              />
              <div className="mt-2 space-y-1.5">
                {q.choices.map((choice, cIndex) => (
                  <label key={cIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correct_choice_index === cIndex}
                      onChange={() => updateQuestion(qIndex, { correct_choice_index: cIndex })}
                      className="shrink-0 accent-emerald-600"
                    />
                    <input
                      className={cn(
                        "flex-1 rounded-md border bg-background px-2.5 py-1.5 text-sm",
                        q.correct_choice_index === cIndex && "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10",
                      )}
                      placeholder={`Choix ${cIndex + 1}`}
                      value={choice}
                      onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Input
                  className="h-7 w-40 text-xs"
                  placeholder="Notion (ex : dérivées)"
                  value={q.topic_tag ?? ""}
                  onChange={(e) => updateQuestion(qIndex, { topic_tag: e.target.value || null })}
                />
                <Input
                  className="h-7 flex-1 text-xs"
                  placeholder="Explication de la bonne réponse (optionnel)"
                  value={q.explanation ?? ""}
                  onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value || null })}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Plus className="h-4 w-4" /> Ajouter une question
          </button>

          {!questionsValid && (
            <p className="text-xs text-destructive">
              Chaque question doit avoir un énoncé et au moins 2 choix remplis.
            </p>
          )}
        </main>

        <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-card px-6 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveOnly} disabled={sendLoading || !questionsValid}>
                Sauvegarder sans envoyer
              </Button>
              <Button size="sm" onClick={handleSend} disabled={sendLoading || !questionsValid}>
                {sendLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1.5 h-4 w-4" />
                )}
                Envoyer à la salle
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase : compose
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/structures/${structureId}/classrooms/${classroomId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {classroom?.name ?? "Classroom"}
          </Link>
          <h1 className="flex-1 text-center text-sm font-semibold">
            {title.trim() || "Nouvel exercice"}
          </h1>
          <div className="w-32" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 p-6">
        {/* Type : exercice ou évaluation */}
        <div className="flex gap-2 rounded-xl border bg-card p-1.5">
          {(["exercise", "evaluation"] as ExerciseKind[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              className={cn(
                "flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors",
                kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              {k === "exercise" ? "Exercice (entraînement)" : "Évaluation (notée)"}
            </button>
          ))}
        </div>
        <p className="px-1 text-xs text-muted-foreground">
          {kind === "exercise"
            ? "Les élèves peuvent recommencer autant de fois qu'ils veulent."
            : "Une seule tentative comptée par élève — comme un vrai contrôle."}
        </p>

        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Informations
            </p>
          </div>
          <div className="space-y-3 p-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Titre <span className="text-destructive">*</span>
              </label>
              <Input
                autoFocus
                placeholder="Ex : QCM dérivées et primitives"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base font-medium"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Matière (optionnel)
              </label>
              <Input
                placeholder="Ex : Mathématiques"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Consigne pour l'IA <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm"
                rows={4}
                placeholder="Ex : dérivées de fonctions composées, niveau terminale, avec un focus sur les erreurs classiques"
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Nombre de questions
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                className="w-24"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-2 pb-8">
          <Link to={`/structures/${structureId}/classrooms/${classroomId}`}>
            <Button variant="outline" size="sm">Annuler</Button>
          </Link>
          <Button size="sm" disabled={!canGenerate} onClick={handleGenerate}>
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Générer avec l'IA
          </Button>
        </div>
      </main>
    </div>
  );
}
