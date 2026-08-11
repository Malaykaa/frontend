import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CheckCircle2, Circle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

          {(matrix?.recipients ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("structures.no_recipients_yet")}</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">
                      {t("structures.student")}
                    </th>
                    {course.steps.map((s) => (
                      <th key={s.id} className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix?.recipients.map((r) => (
                    <tr key={r.user_id} className="border-b last:border-0">
                      <td className="px-4 py-2.5 text-xs font-medium">
                        {r.user_name ?? "—"}
                      </td>
                      {course.steps.map((s) => {
                        const stepProgress = r.steps.find((sp) => sp.step_id === s.id);
                        const done = stepProgress?.status === "done";
                        return (
                          <td key={s.id} className="px-3 py-2.5 text-center">
                            {done ? (
                              <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                            ) : (
                              <Circle className="mx-auto h-4 w-4 text-muted-foreground/40" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
