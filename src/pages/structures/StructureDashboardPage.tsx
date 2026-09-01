import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle, ArrowLeft, ArrowRight, BarChart3, BookOpen,
  Building2, Check, Copy, Download, FileSpreadsheet, GraduationCap,
  Loader2, Plus, ShieldCheck, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { InitialsAvatar } from "@/components/structures/InitialsAvatar";
import { StatTile } from "@/components/structures/StatTile";
import { StructureSwitcher } from "@/components/structures/StructureSwitcher";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import {
  useClassrooms,
  useCreateClassroom,
  useCreateInvitation,
  useDownloadImpactReport,
  useImpactReport,
  useInvitations,
  useMyStructures,
  useRejectInvitation,
  useStructureDashboard,
  useValidateInvitation,
} from "@/hooks/queries/use-structure";

type Tab = "overview" | "classrooms" | "team" | "performance" | "report";

interface ClassroomItem {
  id: string;
  name: string;
  invite_code: string;
}

function QuickCard({
  Icon,
  color,
  title,
  description,
  cta,
  badge,
  onClick,
}: {
  Icon: React.ElementType;
  color: string;
  title: string;
  description: string;
  cta: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col gap-3 rounded-xl border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md"
    >
      {badge != null && badge > 0 && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <span className="flex items-center gap-1 text-xs font-medium text-primary">
        {cta}{" "}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

function ClassroomRow({
  structureId,
  classroom,
}: {
  structureId: string;
  classroom: ClassroomItem;
}) {
  return (
    <Link
      to={`/structures/${structureId}/classrooms/${classroom.id}`}
      className="group flex items-center justify-between rounded-lg border px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{classroom.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{classroom.invite_code}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function SectionEmpty({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export default function StructureDashboardPage() {
  const { t } = useTranslation();
  const { structureId = "" } = useParams<{ structureId: string }>();
  const [tab, setTab] = useState<Tab>("overview");
  const [showCreateClassroom, setShowCreateClassroom] = useState(false);
  const [newClassroomName, setNewClassroomName] = useState("");
  const [showInviteTeacher, setShowInviteTeacher] = useState(false);
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteContact, setInviteContact] = useState("");
  const [inviteClassroomIds, setInviteClassroomIds] = useState<string[]>([]);

  const { data: structures, isLoading: structuresLoading } = useMyStructures();
  const structure = structures?.find((s) => s.id === structureId);
  const isSuperAdmin = structure?.role === "super_admin";

  const { data: classrooms, isLoading: classroomsLoading } = useClassrooms(structureId);
  const createClassroom = useCreateClassroom(structureId);

  const { data: invitations } = useInvitations(structureId);
  const createInvitation = useCreateInvitation(structureId);
  const validateInvitation = useValidateInvitation(structureId);
  const rejectInvitation = useRejectInvitation(structureId);

  const { data: structureDashboard, isLoading: dashboardLoading } = useStructureDashboard(
    isSuperAdmin ? structureId : "",
  );
  const { data: impactReport, isLoading: impactLoading } = useImpactReport(
    isSuperAdmin ? structureId : "",
  );
  const downloadReport = useDownloadImpactReport(structureId);

  if (structuresLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!structure) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">{t("structures.dashboard.not_found")}</p>
        <Link to="/app" className="text-sm font-medium text-primary hover:underline">
          {t("structures.dashboard.back_home")}
        </Link>
      </div>
    );
  }

  const pendingReview = (invitations ?? []).filter((i) => i.status === "pending_review");
  const otherInvitations = (invitations ?? []).filter((i) => i.status !== "pending_review");
  const dashboardClassrooms = structureDashboard?.classrooms ?? [];
  const totalStudents = dashboardClassrooms.reduce((s, c) => s + c.students_count, 0);
  const totalCourses = dashboardClassrooms.reduce((s, c) => s + c.courses_count, 0);
  const avgCompletion = dashboardClassrooms.length
    ? Math.round(
        dashboardClassrooms.reduce((s, c) => s + c.completion_pct, 0) / dashboardClassrooms.length,
      )
    : 0;
  const teachersCount = (invitations ?? []).filter((i) => i.status === "accepted").length;

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassroomName.trim()) return;
    await createClassroom.mutateAsync(newClassroomName.trim());
    setNewClassroomName("");
    setShowCreateClassroom(false);
  };

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteFirstName.trim() || !inviteLastName.trim() || inviteClassroomIds.length === 0)
      return;
    await createInvitation.mutateAsync({
      first_name: inviteFirstName.trim(),
      last_name: inviteLastName.trim(),
      classroom_ids: inviteClassroomIds,
      contact: inviteContact.trim() || undefined,
    });
    setInviteFirstName("");
    setInviteLastName("");
    setInviteContact("");
    setInviteClassroomIds([]);
    setShowInviteTeacher(false);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t("structures.link_copied"));
  };

  const toggleClassroom = (id: string) =>
    setInviteClassroomIds((ids) =>
      ids.includes(id) ? ids.filter((c) => c !== id) : [...ids, id],
    );

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: t("structures.dashboard.tab_overview") },
    { key: "classrooms", label: t("structures.dashboard.tab_classrooms") },
    ...(isSuperAdmin
      ? [
          { key: "team" as Tab, label: t("structures.dashboard.tab_team") },
          { key: "performance" as Tab, label: t("structures.dashboard.tab_performance") },
          { key: "report" as Tab, label: t("structures.dashboard.tab_report") },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="border-b bg-card px-6 py-5">
        <Link
          to="/app"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("structures.dashboard.back_home")}
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold">{structure.name}</h1>
              <StructureSwitcher />
              {structure.status === "pending" && (
                <Badge variant="warning">{t("structures.dashboard.pending_badge")}</Badge>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              {isSuperAdmin ? (
                <ShieldCheck className="h-3.5 w-3.5" />
              ) : (
                <GraduationCap className="h-3.5 w-3.5" />
              )}
              {isSuperAdmin ? t("structures.dashboard.role_admin") : t("structures.dashboard.role_teacher")}
            </p>
          </div>
        </div>
      </header>

      {/* ── Pending banner ───────────────────────────────── */}
      {structure.status === "pending" && (
        <div className="mx-6 mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          {t("structures.dashboard.pending_banner")}
        </div>
      )}

      {/* ── Alert: demandes enseignants ──────────────────── */}
      {isSuperAdmin && pendingReview.length > 0 && (
        <button
          type="button"
          onClick={() => setTab("team")}
          className="mx-6 mt-3 flex w-[calc(100%-3rem)] items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-left text-sm text-amber-800 transition-colors hover:bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-300"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1 font-semibold">
            {t("structures.dashboard.pending_teachers", { count: pendingReview.length })}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
        </button>
      )}

      {/* ── Stats strip (super_admin) ────────────────────── */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 gap-3 px-6 pt-5 sm:grid-cols-4">
          <StatTile
            label={t("structures.dashboard.stat_classrooms")}
            value={(classrooms ?? []).length}
            Icon={GraduationCap}
            color="bg-sky-100 text-sky-600"
          />
          <StatTile
            label={t("structures.dashboard.stat_active_teachers")}
            value={teachersCount}
            Icon={Users}
            color="bg-violet-100 text-violet-600"
          />
          <StatTile
            label={t("structures.dashboard.stat_students")}
            value={totalStudents}
            Icon={Users}
            color="bg-blue-100 text-blue-600"
          />
          <StatTile
            label={t("structures.dashboard.stat_avg_completion")}
            value={`${avgCompletion}%`}
            Icon={BarChart3}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>
      )}

      {/* ── Tab bar ──────────────────────────────────────── */}
      <nav className="mt-5 flex gap-0.5 overflow-x-auto border-b bg-card px-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "relative whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
            {key === "team" && pendingReview.length > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pendingReview.length}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Tab content ──────────────────────────────────── */}
      <main className="p-6">

        {/* ━━ Vue d'ensemble ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Quick action cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickCard
                Icon={GraduationCap}
                color="bg-sky-100 text-sky-600"
                title={t("structures.dashboard.quick_classrooms_title")}
                description={t("structures.dashboard.quick_classrooms_desc", { count: (classrooms ?? []).length })}
                cta={t("structures.dashboard.cta_manage")}
                onClick={() => setTab("classrooms")}
              />
              {isSuperAdmin && (
                <QuickCard
                  Icon={Users}
                  color="bg-violet-100 text-violet-600"
                  title={t("structures.dashboard.quick_team_title")}
                  description={t("structures.dashboard.quick_team_desc", { count: teachersCount })}
                  badge={pendingReview.length || undefined}
                  cta={t("structures.dashboard.cta_manage")}
                  onClick={() => setTab("team")}
                />
              )}
              {isSuperAdmin && (
                <QuickCard
                  Icon={BarChart3}
                  color="bg-emerald-100 text-emerald-600"
                  title={t("structures.dashboard.quick_performance_title")}
                  description={t("structures.dashboard.quick_performance_desc", { count: totalStudents, students: totalStudents, courses: totalCourses })}
                  cta={t("structures.dashboard.cta_view")}
                  onClick={() => setTab("performance")}
                />
              )}
              {isSuperAdmin && (
                <QuickCard
                  Icon={FileSpreadsheet}
                  color="bg-orange-100 text-orange-600"
                  title={t("structures.dashboard.quick_report_title")}
                  description={t("structures.dashboard.quick_report_desc")}
                  cta={t("structures.dashboard.cta_view")}
                  onClick={() => setTab("report")}
                />
              )}
            </div>

            {/* Classrooms preview */}
            <section className="rounded-xl border bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">{t("structures.dashboard.classrooms_heading")}</h2>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setTab("classrooms")}
                >
                  {t("structures.dashboard.view_all")}
                </button>
              </div>
              {classroomsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (classrooms ?? []).length === 0 ? (
                <SectionEmpty message={t("structures.dashboard.no_classrooms_hint")} />
              ) : (
                <div className="space-y-2">
                  {(classrooms ?? []).slice(0, 4).map((c) => (
                    <ClassroomRow key={c.id} structureId={structureId} classroom={c} />
                  ))}
                  {(classrooms ?? []).length > 4 && (
                    <button
                      type="button"
                      className="w-full rounded-lg border border-dashed py-2 text-xs text-muted-foreground hover:bg-muted/40"
                      onClick={() => setTab("classrooms")}
                    >
                      {t("structures.dashboard.more_count", { count: (classrooms ?? []).length - 4 })}
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ━━ Classrooms ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "classrooms" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{t("structures.dashboard.classrooms_section_title")}</h2>
                <p className="text-xs text-muted-foreground">
                  {t("structures.dashboard.classrooms_count", { count: (classrooms ?? []).length })}
                </p>
              </div>
              {isSuperAdmin && (
                <Button size="sm" onClick={() => setShowCreateClassroom(true)}>
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> {t("structures.dashboard.create_classroom_cta")}
                </Button>
              )}
            </div>

            {classroomsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (classrooms ?? []).length === 0 ? (
              <SectionEmpty message={t("structures.dashboard.classroom_empty")} />
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("structures.dashboard.col_name")}</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">{t("structures.dashboard.col_invite_code")}</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("structures.dashboard.col_students")}</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(classrooms ?? []).map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/structures/${structureId}/classrooms/${c.id}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 shrink-0 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                              <GraduationCap className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{c.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                            {c.invite_code}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold">
                          {dashboardClassrooms.find(d => d.classroom_id === c.id)?.students_count ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/structures/${structureId}/classrooms/${c.id}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            {t("structures.dashboard.open_link")} <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ━━ Équipe ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "team" && isSuperAdmin && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{t("structures.dashboard.team_title")}</h2>
              <Button size="sm" onClick={() => setShowInviteTeacher(true)}>
                <Plus className="mr-1.5 h-3.5 w-3.5" /> {t("structures.dashboard.invite_teacher_btn")}
              </Button>
            </div>

            {/* Demandes en attente */}
            {pendingReview.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  {t("structures.dashboard.pending_requests_title", { count: pendingReview.length })}
                </p>
                <div className="space-y-2">
                  {pendingReview.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-card"
                    >
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar firstName={inv.first_name} lastName={inv.last_name} />
                        <span className="text-sm font-medium">
                          {inv.first_name} {inv.last_name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-emerald-600"
                          onClick={() => validateInvitation.mutate(inv.id)}
                          title={t("structures.dashboard.validate")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive"
                          onClick={() => rejectInvitation.mutate(inv.id)}
                          title={t("structures.dashboard.reject")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invitations envoyées */}
            <div className="rounded-xl border overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/20">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("structures.dashboard.invitations_sent_title", { count: otherInvitations.length })}
                </p>
              </div>
              {otherInvitations.length === 0 ? (
                <div className="px-5 py-8">
                  <SectionEmpty message={t("structures.dashboard.no_invitations_hint")} />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("structures.dashboard.col_teacher")}</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("structures.dashboard.col_status")}</th>
                      <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("structures.dashboard.col_action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherInvitations.map((inv) => (
                      <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-5 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <InitialsAvatar firstName={inv.first_name} lastName={inv.last_name} />
                            <span className="font-medium">{inv.first_name} {inv.last_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            variant={
                              inv.status === "accepted"
                                ? "success"
                                : inv.status === "rejected" || inv.status === "expired"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {inv.status === "pending" ? t("structures.dashboard.invite_status_pending")
                              : inv.status === "accepted" ? t("structures.dashboard.invite_status_accepted")
                              : inv.status === "rejected" ? t("structures.dashboard.invite_status_rejected")
                              : t("structures.dashboard.invite_status_expired")}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {inv.status === "pending" && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => copyLink(inv.invite_url)}
                            >
                              <Copy className="h-3 w-3" /> {t("structures.dashboard.copy")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ━━ Performance ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "performance" && isSuperAdmin && (
          <div className="space-y-4">
            <h2 className="font-semibold">{t("structures.dashboard.performance_title")}</h2>

            {dashboardLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : dashboardClassrooms.length === 0 ? (
              <SectionEmpty message={t("structures.dashboard.no_performance_data")} />
            ) : (
              <div className="space-y-3">
                {dashboardClassrooms.map((c) => (
                  <Link
                    key={c.classroom_id}
                    to={`/structures/${structureId}/classrooms/${c.classroom_id}`}
                    className="block rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-semibold">{c.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t("structures.dashboard.performance_row", { count: c.students_count, students: c.students_count, courses: c.courses_count })}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-2xl font-bold text-primary">{c.completion_pct}%</p>
                        <p className="text-xs text-muted-foreground">{t("structures.dashboard.completion_label")}</p>
                      </div>
                    </div>
                    <Progress value={c.completion_pct} className="mt-3 h-2" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ━━ Rapport d'impact ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === "report" && isSuperAdmin && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{t("structures.dashboard.report_title")}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t("structures.dashboard.report_hint")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={downloadReport.isPending}
                  onClick={() => downloadReport.mutate("csv")}
                >
                  <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={downloadReport.isPending}
                  onClick={() => downloadReport.mutate("pdf")}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                </Button>
              </div>
            </div>

            {impactLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : impactReport ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <StatTile
                    label={t("structures.dashboard.stat_classrooms")}
                    value={impactReport.classrooms_count}
                    Icon={GraduationCap}
                    color="bg-sky-100 text-sky-600"
                  />
                  <StatTile
                    label={t("structures.dashboard.report_teachers_label")}
                    value={impactReport.teachers_count}
                    Icon={ShieldCheck}
                    color="bg-violet-100 text-violet-600"
                  />
                  <StatTile
                    label={t("structures.dashboard.report_students_touched")}
                    value={impactReport.students_count}
                    Icon={Users}
                    color="bg-blue-100 text-blue-600"
                  />
                  <StatTile
                    label={t("structures.dashboard.report_courses_sent")}
                    value={impactReport.courses_count}
                    Icon={BookOpen}
                    color="bg-orange-100 text-orange-600"
                  />
                  <StatTile
                    label={t("structures.dashboard.report_personalized_plans")}
                    value={impactReport.evolution_plans_count}
                    Icon={BarChart3}
                    color="bg-pink-100 text-pink-600"
                  />
                  <StatTile
                    label={t("structures.dashboard.report_completion_label")}
                    value={`${impactReport.completion_pct}%`}
                    Icon={ShieldCheck}
                    color="bg-emerald-100 text-emerald-600"
                  />
                </div>

                {impactReport.by_classroom.length > 0 && (
                  <div className="rounded-xl border bg-card p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("structures.dashboard.by_classroom_label")}
                    </p>
                    <div className="space-y-4">
                      {impactReport.by_classroom.map((c) => (
                        <div key={c.classroom_id}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">{c.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {t("structures.dashboard.classroom_summary", { count: c.students_count, students: c.students_count, pct: c.completion_pct })}
                            </span>
                          </div>
                          <Progress value={c.completion_pct} className="mt-1.5 h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <SectionEmpty message={t("structures.dashboard.no_report_data")} />
            )}
          </div>
        )}
      </main>

      {/* ── Sheet : Créer une classroom ──────────────────── */}
      {isSuperAdmin && (
        <BottomSheet
          open={showCreateClassroom}
          onClose={() => setShowCreateClassroom(false)}
          title={t("structures.dashboard.create_classroom_title")}
          description={t("structures.dashboard.create_classroom_desc")}
          locked={createClassroom.isPending}
        >
          <form onSubmit={handleCreateClassroom} className="space-y-4 pt-2">
            <Input
              autoFocus
              placeholder={t("structures.dashboard.classroom_name_placeholder")}
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!newClassroomName.trim() || createClassroom.isPending}
            >
              {createClassroom.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("structures.dashboard.create_classroom_submit")}
            </Button>
          </form>
        </BottomSheet>
      )}

      {/* ── Sheet : Inviter un enseignant ────────────────── */}
      {isSuperAdmin && (
        <BottomSheet
          open={showInviteTeacher}
          onClose={() => setShowInviteTeacher(false)}
          title={t("structures.dashboard.invite_teacher_title")}
          description={t("structures.dashboard.invite_teacher_desc")}
          locked={createInvitation.isPending}
        >
          <form onSubmit={handleCreateInvitation} className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Input
                placeholder={t("structures.dashboard.first_name_placeholder")}
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
              />
              <Input
                placeholder={t("structures.dashboard.last_name_placeholder")}
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
              />
            </div>
            <Input
              placeholder={t("structures.dashboard.invite_contact_placeholder")}
              value={inviteContact}
              onChange={(e) => setInviteContact(e.target.value)}
            />
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("structures.dashboard.assign_classrooms_label")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(classrooms ?? []).map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleClassroom(c.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs transition-colors",
                      inviteClassroomIds.includes(c.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !inviteFirstName.trim() ||
                !inviteLastName.trim() ||
                inviteClassroomIds.length === 0 ||
                createInvitation.isPending
              }
            >
              {createInvitation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("structures.dashboard.send_invitation_submit")}
            </Button>
          </form>
        </BottomSheet>
      )}
    </div>
  );
}
