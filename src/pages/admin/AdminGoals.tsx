import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminGoals } from "@/hooks/queries/use-admin";
import { formatRelativeTime, cn } from "@/shared/lib/utils";

const GOAL_TYPE_LABELS: Record<string, string> = {
  career: "Carrière", scholarship: "Bourse", funding: "Financement",
  exam: "Concours", tender: "Appel d'offres", study_grant: "Recherche", freelance: "Freelance",
};

const STATUS_COLOR: Record<string, string> = {
  active: "bg-emerald-500", completed: "bg-blue-500", paused: "bg-amber-500",
};
const STATUS_BADGE: Record<string, "default" | "secondary" | "warning"> = {
  active: "default", completed: "secondary", paused: "warning",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Actif", completed: "Terminé", paused: "En pause",
};

const TYPE_ICON_COLOR: Record<string, string> = {
  career: "bg-blue-100 text-blue-600",
  scholarship: "bg-violet-100 text-violet-600",
  funding: "bg-emerald-100 text-emerald-600",
  exam: "bg-amber-100 text-amber-600",
  tender: "bg-orange-100 text-orange-600",
  study_grant: "bg-sky-100 text-sky-600",
  freelance: "bg-pink-100 text-pink-600",
};

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
        active ? "border-primary/40 bg-primary/5" : "bg-card hover:bg-muted/30",
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

export default function AdminGoals() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [goalType, setGoalType] = useState("");
  const [status, setStatus] = useState("");
  const userId = searchParams.get("user_id") ?? undefined;

  const { data, isLoading } = useAdminGoals({
    page, size: 25,
    goal_type: goalType || undefined,
    status: status || undefined,
    user_id: userId,
  });

  // Stats queries
  const { data: dActive }    = useAdminGoals({ page: 1, size: 1, status: "active",    user_id: userId });
  const { data: dCompleted } = useAdminGoals({ page: 1, size: 1, status: "completed", user_id: userId });
  const { data: dPaused }    = useAdminGoals({ page: 1, size: 1, status: "paused",    user_id: userId });

  const stats = {
    active:    dActive?.total    ?? 0,
    completed: dCompleted?.total ?? 0,
    paused:    dPaused?.total    ?? 0,
    total:     (dActive?.total ?? 0) + (dCompleted?.total ?? 0) + (dPaused?.total ?? 0),
  };

  const handleStatus = (v: string) => {
    setStatus(status === v ? "" : v);
    setPage(1);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="border-b bg-background px-6 pt-5 pb-4 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Objectifs</h1>
            {userId ? (
              <p className="text-xs text-muted-foreground mt-0.5">
                Filtrés par utilisateur ·{" "}
                <Link to="/admin/goals" className="text-primary hover:underline">Effacer</Link>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Objectifs définis par les utilisateurs</p>
            )}
          </div>
          {data && (
            <span className="text-sm text-muted-foreground">
              {data.total.toLocaleString()} objectif{data.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Total" value={stats.total} />
          <KpiCard
            label="Actifs"
            value={stats.active}
            dot="bg-emerald-500"
            active={status === "active"}
            onClick={() => handleStatus("active")}
          />
          <KpiCard
            label="Terminés"
            value={stats.completed}
            dot="bg-blue-500"
            active={status === "completed"}
            onClick={() => handleStatus("completed")}
          />
          <KpiCard
            label="En pause"
            value={stats.paused}
            dot="bg-amber-500"
            active={status === "paused"}
            onClick={() => handleStatus("paused")}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={goalType}
            onChange={e => { setGoalType(e.target.value); setPage(1); }}
          >
            <option value="">Tous les types</option>
            {Object.entries(GOAL_TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="completed">Terminé</option>
            <option value="paused">En pause</option>
          </select>
          {(goalType || status) && (
            <button
              className="text-xs text-primary hover:underline self-center"
              onClick={() => { setGoalType(""); setStatus(""); setPage(1); }}
            >
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b bg-muted/50">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Utilisateur</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Preset</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Threads</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Créé</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 rounded bg-muted w-40" /></td>
                  <td className="px-4 py-4"><div className="h-5 rounded bg-muted w-20" /></td>
                  <td className="px-4 py-4"><div className="h-3 rounded bg-muted w-24" /></td>
                  <td className="px-4 py-4"><div className="h-5 rounded bg-muted w-14" /></td>
                  <td className="px-4 py-4 text-right"><div className="h-3 rounded bg-muted w-6 ml-auto" /></td>
                  <td className="px-4 py-4"><div className="h-3 rounded bg-muted w-16" /></td>
                </tr>
              ))
              : data?.items.map(g => (
                <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/users/${g.user_id}`}
                      className="flex items-center gap-2.5 hover:text-primary"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                        {(g.user_email?.[0] ?? "?").toUpperCase()}
                      </div>
                      <span className="text-sm truncate">{g.user_email ?? g.user_id.slice(0, 8) + "…"}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium",
                      TYPE_ICON_COLOR[g.type] ?? "bg-muted text-muted-foreground",
                    )}>
                      {GOAL_TYPE_LABELS[g.type] ?? g.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[120px] truncate">
                    {g.preset_key ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_COLOR[g.status] ?? "bg-muted-foreground")} />
                      <Badge variant={STATUS_BADGE[g.status] ?? "secondary"} className="text-[10px]">
                        {STATUS_LABEL[g.status] ?? g.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-semibold">{g.threads_count}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(g.created_at)}</td>
                </tr>
              ))}
            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">
                  Aucun objectif trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data && (
          <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />
        )}
      </div>
    </div>
  );
}
