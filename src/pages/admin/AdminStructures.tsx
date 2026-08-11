import { useState } from "react";
import {
  AlertCircle, BookOpen, Building2, Check, Clock,
  GraduationCap, Inbox, Key, Loader2, Mail, MapPin,
  Phone, RefreshCw, Search, Trash2, Users, UserCheck, X, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { formatRelativeTime, cn } from "@/shared/lib/utils";
import {
  useAdminStructures, useAdminStructure,
  useApproveAdminStructure, useRejectAdminStructure,
  useDeleteAdminStructure,
} from "@/hooks/queries/use-admin";
import type {
  AdminStructureItem, AdminStructureClassroom, AdminStructureInvitation,
} from "@/shared/types";

// ── Constantes ────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning", active: "success", rejected: "destructive",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente", active: "Active", rejected: "Refusée",
};
const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-500", active: "bg-emerald-500", rejected: "bg-red-500",
};

const TYPE_LABELS: Record<string, string> = {
  training_center: "Centre de formation",
  independent_trainer: "Formateur indépendant",
  school: "École",
  university: "Université",
  other: "Autre",
};
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Admin", teacher: "Enseignant",
};

const INV_BADGE: Record<string, "warning" | "success" | "destructive" | "secondary"> = {
  pending: "warning", accepted: "success", pending_review: "warning",
  rejected: "destructive", expired: "secondary",
};
const INV_LABELS: Record<string, string> = {
  pending: "En attente", accepted: "Acceptée", pending_review: "En révision",
  rejected: "Refusée", expired: "Expirée",
};

// ── Composants partagés ───────────────────────────────────────────────────────

function KpiCard({
  label, value, dot, active, onClick,
}: {
  label: string; value: number; dot?: string;
  active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition-all w-full",
        active
          ? "border-primary/40 bg-primary/5"
          : "bg-card hover:bg-muted/30",
        !onClick && "cursor-default",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {dot && <span className={cn("h-2 w-2 rounded-full flex-shrink-0", dot)} />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
    </button>
  );
}

function StatChip({ icon: Icon, label, value, accent }: {
  icon: React.ElementType; label: string; value: number; accent?: boolean;
}) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-center",
      accent ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "bg-muted/40",
    )}>
      <Icon className="h-3.5 w-3.5 text-muted-foreground mb-0.5" />
      <span className="text-base font-bold leading-none">{value}</span>
      <span className="text-[10px] text-muted-foreground leading-none">{label}</span>
    </div>
  );
}

function SectionTitle({ children, badge, badgeAccent }: {
  children: React.ReactNode; badge?: number; badgeAccent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </h3>
      {badge !== undefined && badge > 0 && (
        <span className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
          badgeAccent
            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
            : "bg-muted text-muted-foreground",
        )}>
          {badge}
        </span>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      {text}
    </div>
  );
}

// ── Carte classroom ───────────────────────────────────────────────────────────

function ClassroomCard({ c }: { c: AdminStructureClassroom }) {
  const hasPending = c.pending_members_count > 0;
  return (
    <div className={cn(
      "rounded-lg border bg-muted/20 p-3 space-y-2",
      hasPending && "border-amber-300/60 dark:border-amber-700/40",
    )}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium truncate">{c.name}</p>
        <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shrink-0">
          <Key className="h-2.5 w-2.5" />{c.invite_code}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 text-[11px]">
        {[
          { icon: Users,       label: "Profs",     value: c.teachers_count },
          { icon: UserCheck,   label: "Étudiants", value: c.students_count },
          { icon: BookOpen,    label: "Cours",     value: c.courses_count },
          { icon: AlertCircle, label: "Attente",   value: c.pending_members_count, accent: hasPending },
        ].map(({ icon: Icon, label, value, accent }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center rounded p-1.5 gap-0.5",
              accent ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" : "bg-background/60",
            )}
          >
            <Icon className="h-3 w-3 text-muted-foreground" />
            <span className="font-semibold leading-none">{value}</span>
            <span className="text-muted-foreground leading-none">{label}</span>
          </div>
        ))}
      </div>
      {hasPending && (
        <p className="text-[10px] text-amber-600 font-medium">
          {c.pending_members_count} demande{c.pending_members_count > 1 ? "s" : ""} en attente
        </p>
      )}
    </div>
  );
}

// ── Ligne d'invitation ────────────────────────────────────────────────────────

function InvitationRow({ inv }: { inv: AdminStructureInvitation }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{inv.first_name} {inv.last_name}</p>
        {inv.contact && (
          <p className="text-xs text-muted-foreground truncate">{inv.contact}</p>
        )}
      </div>
      <div className="shrink-0 text-right space-y-0.5">
        <Badge variant={INV_BADGE[inv.status] ?? "secondary"} className="text-[10px] px-1.5 block">
          {INV_LABELS[inv.status] ?? inv.status}
        </Badge>
        <p className="text-[10px] text-muted-foreground">{formatRelativeTime(inv.created_at)}</p>
      </div>
    </div>
  );
}

// ── Panneau détail ────────────────────────────────────────────────────────────

function StructureDetail({ structureId, onClose }: {
  structureId: string;
  onClose: () => void;
}) {
  const { data: s, isLoading } = useAdminStructure(structureId);
  const approve = useApproveAdminStructure();
  const reject  = useRejectAdminStructure();
  const del     = useDeleteAdminStructure();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!s) return null;

  const isPending  = s.status === "pending";
  const isActive   = s.status === "active";
  const isRejected = s.status === "rejected";
  const isBusy = approve.isPending || reject.isPending || del.isPending;
  const totalPendingMembers = s.classrooms.reduce((acc, c) => acc + c.pending_members_count, 0);

  const handleDelete = () => {
    if (!confirm(`Supprimer définitivement "${s.name}" ? Action irréversible.`)) return;
    del.mutate(s.id, { onSuccess: onClose });
  };

  const infoRows = [
    { label: "Pays",      value: s.country,            Icon: MapPin },
    { label: "Adresse",   value: s.address,            Icon: MapPin },
    { label: "Email",     value: s.email,              Icon: Mail   },
    { label: "Demandeur", value: s.requested_by_email, Icon: Mail   },
    { label: "Soumis",    value: formatRelativeTime(s.created_at), Icon: Clock },
  ].filter(r => r.value);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3 px-5 py-4 border-b shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold leading-tight">{s.name}</h2>
              {s.structure_type && (
                <p className="text-[11px] text-muted-foreground">
                  {TYPE_LABELS[s.structure_type] ?? s.structure_type}
                  {s.structure_type === "other" && s.structure_type_other && ` — ${s.structure_type_other}`}
                </p>
              )}
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant={STATUS_BADGE[s.status] ?? "secondary"} className="text-[10px]">
              {STATUS_LABELS[s.status] ?? s.status}
            </Badge>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-1.5 px-4 py-3 border-b shrink-0 bg-muted/10">
        <StatChip icon={GraduationCap} label="Salles"    value={s.classrooms_count} />
        <StatChip icon={Users}         label="Équipe"    value={s.members_count} />
        <StatChip icon={UserCheck}     label="Étudiants" value={s.students_total} />
        <StatChip icon={AlertCircle}   label="Attente"   value={totalPendingMembers} accent={totalPendingMembers > 0} />
      </div>

      {/* Corps scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {isPending && (
            <>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" disabled={isBusy}
                onClick={() => approve.mutate(s.id)}>
                <Check className="mr-1.5 h-3.5 w-3.5" /> Valider
              </Button>
              <Button size="sm" variant="outline"
                className="border-destructive/30 text-destructive hover:bg-destructive/5"
                disabled={isBusy} onClick={() => reject.mutate(s.id)}>
                <XCircle className="mr-1.5 h-3.5 w-3.5" /> Refuser
              </Button>
            </>
          )}
          {isActive && (
            <Button size="sm" variant="outline"
              className="border-amber-400/40 text-amber-600 hover:bg-amber-50"
              disabled={isBusy} onClick={() => reject.mutate(s.id)}>
              <XCircle className="mr-1.5 h-3.5 w-3.5" /> Suspendre
            </Button>
          )}
          {isRejected && (
            <Button size="sm" variant="outline"
              className="border-blue-400/40 text-blue-600 hover:bg-blue-50"
              disabled={isBusy} onClick={() => approve.mutate(s.id)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Réactiver
            </Button>
          )}
          <Button size="sm" variant="outline"
            className="border-destructive/30 text-destructive hover:bg-destructive/5 ml-auto"
            disabled={isBusy} onClick={handleDelete}>
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Supprimer
          </Button>
        </div>

        {/* Identité */}
        {infoRows.length > 0 && (
          <section>
            <SectionTitle>Identité</SectionTitle>
            <div className="rounded-lg border bg-muted/20 divide-y text-sm">
              {infoRows.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-2">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground w-24 shrink-0">{label}</span>
                  <span className="truncate font-medium">{value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Classrooms */}
        <section>
          <SectionTitle badge={s.classrooms_count}>Salles de classe</SectionTitle>
          {s.classrooms.length === 0 ? (
            <EmptyState icon={GraduationCap} text="Aucune salle créée pour l'instant." />
          ) : (
            <div className="space-y-2">
              {s.classrooms.map(c => <ClassroomCard key={c.id} c={c} />)}
            </div>
          )}
        </section>

        {/* Invitations enseignants */}
        {s.invitations.length > 0 && (
          <section>
            <SectionTitle badge={s.pending_invitations_count || undefined} badgeAccent>
              Invitations enseignants
            </SectionTitle>
            <div className="rounded-lg border bg-muted/20 divide-y text-sm">
              {s.invitations.map(inv => (
                <InvitationRow key={inv.id} inv={inv} />
              ))}
            </div>
          </section>
        )}

        {/* Équipe */}
        <section>
          <SectionTitle badge={s.members.length}>Équipe (admins & enseignants)</SectionTitle>
          {s.members.length === 0 ? (
            <EmptyState icon={Users} text="Aucun membre enregistré." />
          ) : (
            <div className="rounded-lg border bg-muted/20 divide-y text-sm">
              {s.members.map(m => {
                const fullName = [m.first_name, m.last_name].filter(Boolean).join(" ");
                return (
                  <div key={m.user_id} className="flex items-center gap-3 px-3 py-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                      {(m.first_name?.[0] ?? m.email?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fullName || m.email || "—"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        {m.email && (
                          <span className="flex items-center gap-0.5">
                            <Mail className="h-2.5 w-2.5" />{m.email}
                          </span>
                        )}
                        {m.phone && (
                          <span className="flex items-center gap-0.5">
                            <Phone className="h-2.5 w-2.5" />{m.phone}
                          </span>
                        )}
                      </p>
                    </div>
                    <Badge
                      variant={m.role === "super_admin" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 shrink-0"
                    >
                      {ROLE_LABELS[m.role] ?? m.role}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function AdminStructures() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useAdminStructures({
    page, size: 25,
    status: statusFilter || undefined,
  });

  // Stats strip — 3 parallel size-1 queries
  const { data: dPending }  = useAdminStructures({ page: 1, size: 1, status: "pending" });
  const { data: dActive }   = useAdminStructures({ page: 1, size: 1, status: "active" });
  const { data: dRejected } = useAdminStructures({ page: 1, size: 1, status: "rejected" });

  const stats = {
    pending:  dPending?.total  ?? 0,
    active:   dActive?.total   ?? 0,
    rejected: dRejected?.total ?? 0,
    total: (dPending?.total ?? 0) + (dActive?.total ?? 0) + (dRejected?.total ?? 0),
  };

  const handleFilter = (value: string) => {
    setStatusFilter(value === statusFilter ? "" : value);
    setPage(1);
    setSelectedId(null);
  };

  // Client-side search on current page
  const items = (data?.items ?? []).filter((s: AdminStructureItem) =>
    !q.trim() ||
    s.name.toLowerCase().includes(q.trim().toLowerCase()) ||
    (s.requested_by_email ?? "").toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Zone table ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <div className="border-b bg-background px-6 pt-5 pb-4 shrink-0 space-y-4">
          <div>
            <h1 className="text-lg font-bold">Structures</h1>
            <p className="text-xs text-muted-foreground">Organisations partenaires de Malayka</p>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard label="Total" value={stats.total} />
            <KpiCard
              label="En attente"
              value={stats.pending}
              dot="bg-amber-500"
              active={statusFilter === "pending"}
              onClick={() => handleFilter("pending")}
            />
            <KpiCard
              label="Actives"
              value={stats.active}
              dot="bg-emerald-500"
              active={statusFilter === "active"}
              onClick={() => handleFilter("active")}
            />
            <KpiCard
              label="Refusées"
              value={stats.rejected}
              dot="bg-red-500"
              active={statusFilter === "rejected"}
              onClick={() => handleFilter("rejected")}
            />
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                className="h-9 w-full rounded-md border bg-muted/30 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Nom ou email demandeur…"
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
              />
            </div>
            {data && (
              <span className="text-xs text-muted-foreground">
                {data.total} résultat{data.total !== 1 ? "s" : ""}
                {statusFilter && (
                  <> · <button className="text-primary hover:underline" onClick={() => handleFilter("")}>Tout voir</button></>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Aucune structure trouvée.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b bg-muted/50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Nom / Type
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Pays
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Membres
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                    Demandeur
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Créée
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((s: AdminStructureItem) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                    className={cn(
                      "border-b cursor-pointer transition-colors hover:bg-muted/30",
                      selectedId === s.id && "bg-primary/5 border-l-2 border-l-primary",
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 shrink-0 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium leading-tight">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.structure_type
                              ? (TYPE_LABELS[s.structure_type] ?? s.structure_type)
                              : "Type non renseigné"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {s.country
                        ? <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.country}</span>
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[s.status])} />
                        <Badge variant={STATUS_BADGE[s.status] ?? "secondary"} className="text-[10px]">
                          {STATUS_LABELS[s.status] ?? s.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">{s.members_count}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell max-w-[160px] truncate">
                      {s.requested_by_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 shrink-0" />
                        {formatRelativeTime(s.created_at)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {data && data.pages > 1 && (
            <AdminPagination
              page={data.page} pages={data.pages}
              total={data.total} size={data.size}
              onPage={setPage}
            />
          )}
        </div>
      </div>

      {/* ── Panneau détail ── */}
      {selectedId && (
        <div className="w-[440px] shrink-0 border-l bg-background overflow-hidden">
          <StructureDetail
            structureId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}

    </div>
  );
}
