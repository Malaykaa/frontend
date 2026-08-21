import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { RecipientMatrix, type MatrixColumn } from "@/components/structures/RecipientMatrix";
import { SingleRecipientView } from "@/components/structures/SingleRecipientView";
import { useCourse, useCourseProgress } from "@/hooks/queries/use-structure";

export default function CourseProgressPage() {
  const { t } = useTranslation();
  const { structureId = "", classroomId = "", courseId = "" } =
    useParams<{ structureId: string; classroomId: string; courseId: string }>();

  const { data: course, isLoading: courseLoading } = useCourse(structureId, classroomId, courseId);
  const { data: matrix, isLoading: matrixLoading } = useCourseProgress(structureId, classroomId, courseId);

  if (courseLoading || matrixLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const columns: MatrixColumn[] = course.steps.map((s) => ({ id: s.id, label: s.label }));
  const recipients = matrix?.recipients ?? [];

  const stepIcon = (done: boolean) =>
    done ? (
      <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
    ) : (
      <Circle className="mx-auto h-4 w-4 text-muted-foreground/40" />
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <Link
          to={`/structures/${structureId}/classrooms/${classroomId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("structures.back_to_classroom")}
        </Link>
        <h1 className="text-xl font-bold">{course.title}</h1>
      </header>

      <main className="space-y-6 p-6">
        <section className="prose prose-sm dark:prose-invert max-w-none rounded-xl border bg-card p-5">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{course.explanation}</ReactMarkdown>
        </section>

        <section className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("structures.progress_matrix")}
          </h2>

          {recipients.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("structures.no_recipients_yet")}</p>
          ) : recipients.length === 1 ? (
            // Plan d'évolution (toujours 1 destinataire) ou cours envoyé à un seul
            // étudiant — une liste verticale se lit mieux qu'une table à une ligne.
            <SingleRecipientView
              recipientName={recipients[0].user_name ?? "—"}
              columns={columns}
              cells={Object.fromEntries(
                columns.map((c) => {
                  const stepProgress = recipients[0].steps.find((sp) => sp.step_id === c.id);
                  return [c.id, stepIcon(stepProgress?.status === "done")];
                }),
              )}
            />
          ) : (
            <RecipientMatrix
              studentLabel={t("structures.student")}
              columns={columns}
              recipients={recipients.map((r) => ({
                id: r.user_id,
                name: r.user_name ?? "—",
                cells: Object.fromEntries(
                  columns.map((c) => {
                    const stepProgress = r.steps.find((sp) => sp.step_id === c.id);
                    return [c.id, stepIcon(stepProgress?.status === "done")];
                  }),
                ),
              }))}
            />
          )}
        </section>
      </main>
    </div>
  );
}
