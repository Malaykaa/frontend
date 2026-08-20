import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle, ArrowLeft, ArrowRight, BarChart3, BookOpen,
  Check, Clock, Copy, FileUp, GraduationCap, ListChecks, Loader2,
  Plus, Send, Sparkles, TrendingDown, TrendingUp, Users, X, ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/shared/lib/utils";
import { Progress } from "@/components/ui/progress";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { InitialsAvatar } from "@/components/structures/InitialsAvatar";
import { SendConfirmDialog } from "@/components/structures/SendConfirmDialog";
import { StatTile } from "@/components/structures/StatTile";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import {
  useClassroomDashboard,
  useClassroomDifficulty,
  useClassrooms,
  useCourses,
  useExercises,
  useGenerateEvolutionPlans,
  useJoinRequests,
  useImportRoster,
  useMembers,
  useMyStructures,
  useRejectJoinRequest,
  useRoster,
  useSendCourse,
  useSendExercise,
  useValidateJoinRequest,
} from "@/hooks/queries/use-structure";

type Tab = "overview" | "students" | "courses" | "exercises" | "plans" | "difficulty";

const TAB_LABELS: Record<Tab, string> = {
  overview: "Vue d'ensemble",
  students: "Étudiants",
  courses: "Cours",
  exercises: "Exercices",
  plans: "Plans IA",
  difficulty: "Difficultés",
};

function parseRosterText(text: string): { first_name: string; last_name: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(/[,;\t]/).map((p) => p.trim()).filter(Boolean))
    .map((parts) => (parts.length === 1 ? parts[0].split(/\s+/) : parts))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
    .map((parts) => ({ first_name: parts[0], last_name: parts.slice(1).join(" ") }));
}

function SectionEmpty({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function CourseSendControls({
  structureId,
  classroomId,
  courseId,
}: {
  structureId: string;
  classroomId: string;
  courseId: string;
}) {
  const { data: members } = useMembers(structureId, classroomId);
  const sendCourse = useSendCourse(structureId, classroomId, courseId);
  const [studentId, setStudentId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedMember = (members ?? []).find((m) => m.user_id === studentId);

  return (
    <div className="flex items-center gap-1.5">
      <select
        className="h-8 rounded-md border bg-background px-2 text-xs"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      >
        <option value="">Toute la salle</option>
        {(members ?? []).map((m) => (
          <option key={m.user_id} value={m.user_id}>
            {m.requested_first_name} {m.requested_last_name}
          </option>
        ))}
      </select>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        disabled={sendCourse.isPending}
        onClick={() =>
          studentId
            ? sendCourse.mutate({ target: "student", student_user_id: studentId })
            : setConfirmOpen(true)
        }
        title="Envoyer"
      >
        {sendCourse.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
      </Button>
      <SendConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        loading={sendCourse.isPending}
        targetLabel={selectedMember ? `${selectedMember.requested_first_name} ${selectedMember.requested_last_name}` : "toute la salle"}
        onConfirm={() => {
          sendCourse.mutate({ target: "classroom" }, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </div>
  );
}

function ExerciseSendControls({
  structureId,
  classroomId,
  exerciseId,
}: {
  structureId: string;
  classroomId: string;
  exerciseId: string;
}) {
  const { data: members } = useMembers(structureId, classroomId);
  const sendExercise = useSendExercise(structureId, classroomId, exerciseId);
  const [studentId, setStudentId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <select
        className="h-8 rounded-md border bg-background px-2 text-xs"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      >
        <option value="">Toute la salle</option>
        {(members ?? []).map((m) => (
          <option key={m.user_id} value={m.user_id}>
            {m.requested_first_name} {m.requested_last_name}
          </option>
        ))}
      </select>
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8"
        disabled={sendExercise.isPending}
        onClick={() =>
          studentId
            ? sendExercise.mutate({ target: "student", student_user_id: studentId })
            : setConfirmOpen(true)
        }
        title="Envoyer"
      >
        {sendExercise.isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Send className="h-3.5 w-3.5" />
        )}
      </Button>
      <SendConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        loading={sendExercise.isPending}
        targetLabel="toute la salle"
        onConfirm={() => {
          sendExercise.mutate({ target: "classroom" }, { onSuccess: () => setConfirmOpen(false) });
        }}
      />
    </div>
  );
}

export default function ClassroomDetailPage() {
  const { structureId = "", classroomId = "" } = useParams<{
    structureId: string;
    classroomId: string;
  }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");

  const [showImportRoster, setShowImportRoster] = useState(false);
  const [rosterText, setRosterText] = useState("");

  const { data: structures } = useMyStructures();
  const structure = structures?.find((s) => s.id === structureId);
  const { data: classrooms } = useClassrooms(structureId);
  const classroom = classrooms?.find((c) => c.id === classroomId);

  const { data: roster, isLoading: rosterLoading } = useRoster(structureId, classroomId);
  const importRoster = useImportRoster(structureId, classroomId);
  const { data: members, isLoading: membersLoading } = useMembers(structureId, classroomId);
  const { data: joinRequests } = useJoinRequests(structureId, classroomId);
  const validateRequest = useValidateJoinRequest(structureId, classroomId);
  const rejectRequest = useRejectJoinRequest(structureId, classroomId);

  const { data: courses, isLoading: coursesLoading } = useCourses(structureId, classroomId);
  const { data: dashboard, isLoading: dashboardLoading } = useClassroomDashboard(
    structureId,
    classroomId,
  );
  const generateEvolutionPlans = useGenerateEvolutionPlans(structureId, classroomId);
  const { data: exercises, isLoading: exercisesLoading } = useExercises(structureId, classroomId);
  const { data: difficulty, isLoading: difficultyLoading } = useClassroomDifficulty(structureId, classroomId);

  if (!structure || !classroom) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const courseList = (courses ?? []).filter((c) => c.kind === "course");
  const evolutionPlans = (courses ?? []).filter((c) => c.kind === "evolution_plan");
  const pendingRequests = joinRequests ?? [];
  const membersCount = (members ?? []).length;
  const avgCompletion =
    (dashboard?.courses ?? []).length > 0
      ? Math.round(
          (dashboard?.courses ?? []).reduce((s, c) => s + c.completion_pct, 0) /
            (dashboard?.courses ?? []).length,
        )
      : 0;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/classrooms/join/${classroom.invite_code}`,
    );
    toast.success("Lien copié.");
  };

  const handleImportRoster = async (e: React.FormEvent) => {
    e.preventDefault();
    const entries = parseRosterText(rosterText);
    if (entries.length === 0) return;
    await importRoster.mutateAsync(entries);
    setRosterText("");
    setShowImportRoster(false);
  };

  const handleRosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const text = await file.text();
    if (parseRosterText(text).length === 0) {
      toast.error("Aucun nom valide trouvé dans ce fichier.");
      return;
    }
    setRosterText((prev) => (prev.trim() ? `${prev.trim()}\n${text.trim()}` : text.trim()));
  };

  const parsedCount = parseRosterText(rosterText).length;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="border-b bg-card px-6 py-5">
        <Link
          to={`/structures/${structureId}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {structure.name}
        </Link>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{classroom.name}</h1>
              <p className="font-mono text-xs text-muted-foreground">{classroom.invite_code}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={copyInviteLink}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Lien étudiant
          </Button>
        </div>
      </header>

      {/* ── Alert: demandes étudiants ────────────────────── */}
      {pendingRequests.length > 0 && (
        <button
          type="button"
          onClick={() => setTab("students")}
          className="mx-6 mt-4 flex w-[calc(100%-3rem)] items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-left text-sm text-amber-800 transition-colors hover:bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            <span className="font-semibold">
              {pendingRequests.length} demande{pendingRequests.length > 1 ? "s" : ""}
            </span>{" "}
            d'étudiant en attente de validation
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
        </button>
      )}

      {/* ── Stats strip ──────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 px-6 pt-5">
        <StatTile
          label="Étudiants"
          value={membersCount}
          Icon={Users}
          color="bg-sky-100 text-sky-600"
        />
        <StatTile
          label="Cours"
          value={courseList.length}
          Icon={BookOpen}
          color="bg-orange-100 text-orange-600"
        />
        <StatTile
          label="Complétion"
          value={`${avgCompletion}%`}
          Icon={BarChart3}
          color="bg-emerald-100 text-emerald-600"
        />
      </div>

      {/* ── Tab bar ──────────────────────────────────────── */}
      <nav className="mt-5 flex gap-0.5 overflow-x-auto border-b bg-card px-6">
        {(["overview", "students", "courses", "exercises", "plans", "difficulty"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {TAB_LABELS[t]}
            {t === "students" && pendingRequests.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pendingRequests.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Tab content ──────────────────────────────────── */}
      <main className="p-6">

        {/* ━━ Vue d'ensemble ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "overview" && (
          <div className="space-y-4">
            <h2 className="font-semibold">Tableau de bord</h2>

            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Progression par cours */}
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <ListChecks className="h-3.5 w-3.5" /> Par cours
                  </p>
                  {(dashboard?.courses ?? []).length === 0 ? (
                    <SectionEmpty message="Aucun cours envoyé." />
                  ) : (
                    <div className="space-y-4">
                      {(dashboard?.courses ?? []).map((c) => (
                        <div key={c.course_id}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-sm font-medium">
                              {c.title}
                              {c.subject ? ` · ${c.subject}` : ""}
                            </span>
                            <span className="shrink-0 text-sm font-bold text-primary">
                              {c.recipients_count > 0 ? `${c.completion_pct}%` : "—"}
                            </span>
                          </div>
                          {c.recipients_count > 0 && (
                            <Progress value={c.completion_pct} className="mt-1.5 h-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progression par étudiant */}
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> Par étudiant
                  </p>
                  {(dashboard?.students ?? []).length === 0 ? (
                    <SectionEmpty message="Aucun étudiant inscrit." />
                  ) : (
                    <div className="space-y-4">
                      {(dashboard?.students ?? []).map((s) => (
                        <div key={s.user_id}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-sm">
                              {s.user_email ?? "—"}
                            </span>
                            <span className="shrink-0 text-xs font-bold text-primary">
                              {s.steps_total > 0
                                ? `${s.steps_done}/${s.steps_total}`
                                : "—"}
                            </span>
                          </div>
                          {s.steps_total > 0 && (
                            <Progress value={s.completion_pct} className="mt-1.5 h-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ━━ Étudiants ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "students" && (
          <div className="space-y-5">
            {/* Demandes en attente */}
            {pendingRequests.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  Demandes en attente ({pendingRequests.length})
                </p>
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-card"
                    >
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar
                          firstName={req.requested_first_name}
                          lastName={req.requested_last_name}
                        />
                        <div>
                          <p className="text-sm font-medium">
                            {req.requested_first_name} {req.requested_last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{req.user_email}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-emerald-600"
                          onClick={() => validateRequest.mutate(req.id)}
                          title="Valider"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => rejectRequest.mutate(req.id)}
                          title="Refuser"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Liste d'appel (roster) */}
            <div className="rounded-xl border overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/20">
                <div>
                  <h2 className="font-semibold text-sm">Liste d'appel</h2>
                  <p className="text-xs text-muted-foreground">{(roster ?? []).length} élève{(roster ?? []).length !== 1 ? "s" : ""}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowImportRoster(true)}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Importer
                </Button>
              </div>
              {rosterLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (roster ?? []).length === 0 ? (
                <SectionEmpty message="Aucune entrée. Importe ta liste d'élèves pour commencer." />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Nom</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(roster ?? []).map((r) => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <InitialsAvatar firstName={r.first_name} lastName={r.last_name} />
                            <span className="font-medium">{r.first_name} {r.last_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${r.claimed ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                            <Badge variant={r.claimed ? "success" : "secondary"} className="text-[10px]">
                              {r.claimed ? "rattaché" : "libre"}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Membres inscrits */}
            <div className="rounded-xl border overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/20">
                <h2 className="font-semibold text-sm">Membres inscrits</h2>
                <p className="text-xs text-muted-foreground">{(members ?? []).length} membre{(members ?? []).length !== 1 ? "s" : ""} enregistré{(members ?? []).length !== 1 ? "s" : ""}</p>
              </div>
              {membersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (members ?? []).length === 0 ? (
                <SectionEmpty message="Aucun membre pour l'instant." />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Étudiant</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Statut</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cours</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Progression</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Inscrit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(members ?? []).map((m) => {
                      const prog = (dashboard?.students ?? []).find((s) => s.user_id === m.user_id);
                      return (
                        <tr key={m.id} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-5 py-2.5">
                            <span className="text-sm font-medium">{m.requested_first_name} {m.requested_last_name}</span>
                          </td>
                          <td className="px-4 py-2.5 hidden md:table-cell">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("h-1.5 w-1.5 rounded-full", m.status === "accepted" ? "bg-emerald-500" : "bg-amber-400")} />
                              <span className="text-xs text-muted-foreground">
                                {m.status === "accepted" ? "Accepté" : m.status === "pending_review" ? "En attente" : "Refusé"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-sm">
                            {prog ? prog.courses_count : "—"}
                          </td>
                          <td className="px-4 py-2.5 hidden sm:table-cell">
                            {prog && prog.steps_total > 0 ? (
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <Progress value={prog.completion_pct} className="h-1.5 flex-1" />
                                <span className="text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                                  {prog.steps_done}/{prog.steps_total}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                            {formatRelativeTime(m.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ━━ Cours ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "courses" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Cours</h2>
                <p className="text-xs text-muted-foreground">
                  {courseList.length} cours · {evolutionPlans.length} plans IA
                </p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/structures/${structureId}/classrooms/${classroomId}/courses/new`)
                }
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Créer un cours
              </Button>
            </div>

            {coursesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : courseList.length === 0 ? (
              <SectionEmpty message="Aucun cours. Crée un premier cours pour le décomposer en étapes !" />
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Titre / Matière</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Étapes</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Destinataires</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Créé</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Envoyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseList.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            to={`/structures/${structureId}/classrooms/${classroomId}/courses/${c.id}`}
                            className="flex items-center gap-2.5 hover:text-primary"
                          >
                            <div className="h-8 w-8 shrink-0 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium leading-tight">{c.title}</p>
                              {c.subject && (
                                <Badge variant="secondary" className="text-[10px] mt-0.5">{c.subject}</Badge>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">{c.steps_count}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{c.recipients_count}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            {formatRelativeTime(c.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <CourseSendControls
                            structureId={structureId}
                            classroomId={classroomId}
                            courseId={c.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ━━ Exercices / évaluations (QCM) ━━━━━━━━━━━━━━━━ */}
        {tab === "exercises" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Exercices &amp; évaluations</h2>
                <p className="text-xs text-muted-foreground">
                  {(exercises ?? []).filter((e) => e.kind === "exercise").length} exercice(s) ·{" "}
                  {(exercises ?? []).filter((e) => e.kind === "evaluation").length} évaluation(s)
                </p>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/structures/${structureId}/classrooms/${classroomId}/exercises/new`)
                }
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Créer un exercice
              </Button>
            </div>

            {exercisesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (exercises ?? []).length === 0 ? (
              <SectionEmpty message="Aucun exercice. Crée un premier QCM à partir d'une consigne !" />
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Titre / Matière</th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Questions</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Destinataires</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Créé</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Envoyer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(exercises ?? []).map((ex) => (
                      <tr key={ex.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            to={`/structures/${structureId}/classrooms/${classroomId}/exercises/${ex.id}/results`}
                            className="flex items-center gap-2.5 hover:text-primary"
                          >
                            <div className={cn(
                              "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center",
                              ex.kind === "evaluation" ? "bg-rose-100 text-rose-600" : "bg-sky-100 text-sky-600",
                            )}>
                              <ClipboardList className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium leading-tight">{ex.title}</p>
                              {ex.subject && (
                                <Badge variant="secondary" className="text-[10px] mt-0.5">{ex.subject}</Badge>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={ex.kind === "evaluation" ? "destructive" : "secondary"} className="text-[10px]">
                            {ex.kind === "evaluation" ? "Évaluation" : "Exercice"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">{ex.questions_count}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{ex.recipients_count}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            {formatRelativeTime(ex.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ExerciseSendControls
                            structureId={structureId}
                            classroomId={classroomId}
                            exerciseId={ex.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ━━ Plans IA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "plans" && (
          <div className="space-y-5">
            {/* Header + action */}
            <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-5">
              <div>
                <h2 className="font-semibold">Plans d'évolution personnalisés</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  L'IA analyse la progression de chaque étudiant et génère un plan sur mesure
                  adapté à son niveau et ses lacunes.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={generateEvolutionPlans.isPending}
                onClick={() => generateEvolutionPlans.mutate()}
              >
                {generateEvolutionPlans.isPending ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                )}
                {generateEvolutionPlans.isPending ? "Génération…" : "Générer les plans"}
              </Button>
            </div>

            {/* Plans list */}
            {evolutionPlans.length === 0 ? (
              <SectionEmpty message="Aucun plan généré. Lance la génération ci-dessus pour créer des plans personnalisés." />
            ) : (
              <div className="space-y-3">
                {evolutionPlans.map((p) => (
                  <Link
                    key={p.id}
                    to={`/structures/${structureId}/classrooms/${classroomId}/courses/${p.id}`}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.steps_count} étape{p.steps_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ━━ Difficultés ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "difficulty" && (
          <div className="space-y-5">
            {difficultyLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : !difficulty || difficulty.insufficient_data ? (
              <SectionEmpty message="Pas encore assez de données — les élèves doivent avoir soumis au moins un exercice pour que la détection de difficulté fonctionne." />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {/* Notions les plus difficiles pour la classe */}
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Notions les plus difficiles
                  </p>
                  {difficulty.topics.length === 0 ? (
                    <SectionEmpty message="Aucune notion identifiée." />
                  ) : (
                    <div className="space-y-3">
                      {difficulty.topics.slice(0, 8).map((t) => (
                        <div key={t.topic_tag}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-sm font-medium">{t.topic_tag}</span>
                            <span className={cn(
                              "shrink-0 text-sm font-bold",
                              t.class_success_rate < 50 ? "text-destructive" : "text-primary",
                            )}>
                              {t.class_success_rate}% réussite
                            </span>
                          </div>
                          <Progress value={t.class_success_rate} className="mt-1.5 h-1.5" />
                          {t.students_flagged_count > 0 && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {t.students_flagged_count} élève{t.students_flagged_count > 1 ? "s" : ""} en difficulté sur cette notion
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Élèves flagués */}
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Élèves à surveiller
                  </p>
                  {difficulty.students.filter((s) => s.flagged_topics.length > 0).length === 0 ? (
                    <SectionEmpty message="Aucun élève en difficulté identifié pour l'instant." />
                  ) : (
                    <div className="space-y-3">
                      {difficulty.students
                        .filter((s) => s.flagged_topics.length > 0)
                        .sort((a, b) => a.avg_score_pct - b.avg_score_pct)
                        .map((s) => (
                          <div key={s.user_id} className="rounded-lg border p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">{s.user_name ?? "—"}</span>
                              <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                {s.trend === "improving" && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />}
                                {s.trend === "declining" && <TrendingDown className="h-3.5 w-3.5 text-destructive" />}
                                {s.avg_score_pct}% en moyenne
                              </span>
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {s.flagged_topics.map((f) => (
                                <Badge key={f.topic_tag} variant="warning" className="text-[10px]">
                                  {f.topic_tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Sheet : Importer la liste d'élèves ───────────── */}
      <BottomSheet
        open={showImportRoster}
        onClose={() => setShowImportRoster(false)}
        title="Importer la liste d'élèves"
        description="Une ligne par étudiant : Prénom, Nom"
        locked={importRoster.isPending}
        maxHeight="max-h-[80vh]"
      >
        <form onSubmit={handleImportRoster} className="space-y-3 pt-2">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs text-primary hover:underline">
            <FileUp className="h-3.5 w-3.5" /> Importer un fichier (.csv, .txt)
            <input
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={handleRosterFile}
            />
          </label>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            rows={7}
            placeholder={"Prénom,Nom\nPrénom,Nom\n…"}
            value={rosterText}
            onChange={(e) => setRosterText(e.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            Virgule, point-virgule, tabulation ou espace acceptés.
          </p>
          <Button
            type="submit"
            className="w-full"
            disabled={importRoster.isPending || parsedCount === 0}
          >
            {importRoster.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importer{parsedCount > 0 ? ` ${parsedCount} étudiant${parsedCount > 1 ? "s" : ""}` : ""}
          </Button>
        </form>
      </BottomSheet>

    </div>
  );
}
