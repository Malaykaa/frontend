import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, Circle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProgressBar } from "@/components/structures/ProgressBar";
import { useCompleteCourseStep, useMyCourseProgress } from "@/hooks/queries/use-structure";

export default function MyCoursePage() {
  const { t } = useTranslation();
  const { courseId = "" } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useMyCourseProgress(courseId);
  const completeStep = useCompleteCourseStep(courseId);

  if (isLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const doneCount = course.steps.filter((s) => s.status === "done").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Link to="/classrooms/mine" className="mb-2 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← {t("structures.back_to_my_courses")}
        </Link>
        <h1 className="text-xl font-bold">{course.title}</h1>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <ProgressBar done={doneCount} total={course.steps.length} />

        <div className="prose prose-sm dark:prose-invert max-w-none rounded-xl border bg-card p-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{course.explanation}</ReactMarkdown>
        </div>

        <div className="space-y-2">
          {course.steps.map((step) => {
            const done = step.status === "done";
            return (
              <div key={step.step_id} className="flex items-start gap-3 rounded-lg border p-3">
                <button
                  onClick={() => !done && completeStep.mutate(step.step_id)}
                  disabled={done || completeStep.isPending}
                  className="mt-0.5 shrink-0"
                  title={done ? t("structures.step_done") : t("structures.mark_step_done")}
                >
                  {done ? (
                    <Check className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground/50" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
