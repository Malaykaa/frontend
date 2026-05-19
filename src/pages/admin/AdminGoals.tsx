import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminGoals } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";

const GOAL_TYPE_LABELS: Record<string, string> = { career:"Carrière", scholarship:"Bourse", funding:"Financement", exam:"Concours", tender:"Appel d'offres", study_grant:"Recherche", freelance:"Freelance" };

export default function AdminGoals() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [goalType, setGoalType] = useState("");
  const [status, setStatus] = useState("");
  const userId = searchParams.get("user_id") ?? undefined;

  const { data, isLoading } = useAdminGoals({ page, size: 20, goal_type: goalType || undefined, status: status || undefined, user_id: userId });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Objectifs</h1>
          {userId && <p className="text-xs text-muted-foreground mt-0.5">Filtrés · <Link to="/admin/goals" className="text-primary hover:underline">Effacer</Link></p>}
        </div>
        {data && <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} objectifs</span>}
      </div>
      <div className="flex gap-2">
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={goalType} onChange={(e) => { setGoalType(e.target.value); setPage(1); }}>
          <option value="">Tous les types</option>{Object.entries(GOAL_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Tous les statuts</option><option value="active">Actif</option><option value="completed">Terminé</option><option value="paused">En pause</option>
        </select>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Preset</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Threads</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Créé</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b animate-pulse"><td colSpan={6} className="px-4 py-4"><div className="h-4 rounded bg-muted w-2/3" /></td></tr>)
              : data?.items.map((g) => (
                <tr key={g.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3"><Link to={`/admin/users/${g.user_id}`} className="text-sm hover:text-primary">{g.user_email ?? g.user_id.slice(0, 8) + "…"}</Link></td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{GOAL_TYPE_LABELS[g.type] ?? g.type}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{g.preset_key ?? "—"}</td>
                  <td className="px-4 py-3"><Badge variant={g.status === "active" ? "default" : "secondary"} className="text-[10px]">{g.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-right tabular-nums text-muted-foreground">{g.threads_count}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(g.created_at)}</td>
                </tr>
              ))}
            {!isLoading && data?.items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun objectif trouvé.</td></tr>}
          </tbody>
        </table>
        {data && <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />}
      </div>
    </div>
  );
}
