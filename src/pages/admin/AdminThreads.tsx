import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminThreads, useDeleteAdminThread } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";
import type { AdminThreadItem } from "@/shared/types";

export default function AdminThreads() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const userId = searchParams.get("user_id") ?? undefined;

  const { data, isLoading } = useAdminThreads({ page, size: 20, q: q || undefined, status: status || undefined, user_id: userId });
  const deleteThread = useDeleteAdminThread();

  const del = (t: AdminThreadItem) => { if (confirm(`Supprimer le thread « ${t.title ?? t.id} » ?`)) deleteThread.mutate(t.id); };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Threads</h1>
          {userId && <p className="text-xs text-muted-foreground mt-0.5">Filtrés · <Link to="/admin/threads" className="text-primary hover:underline">Effacer</Link></p>}
        </div>
        {data && <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} threads</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Recherche titre…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Tous</option><option value="open">Ouverts</option><option value="closed">Fermés</option>
        </select>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Titre</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Messages</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Créé</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b animate-pulse"><td colSpan={6} className="px-4 py-4"><div className="h-4 rounded bg-muted w-2/3" /></td></tr>)
              : data?.items.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 max-w-xs"><p className="text-sm font-medium truncate">{t.title ?? "(sans titre)"}</p></td>
                  <td className="px-4 py-3"><Link to={`/admin/users/${t.user_id}`} className="text-xs hover:text-primary">{t.user_email ?? t.user_id.slice(0, 8) + "…"}</Link></td>
                  <td className="px-4 py-3"><Badge variant={t.status === "open" ? "default" : "secondary"} className="text-[10px]">{t.status === "open" ? "Ouvert" : "Fermé"}</Badge></td>
                  <td className="px-4 py-3 text-xs text-right tabular-nums text-muted-foreground">{t.message_count}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(t.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/threads/${t.id}`}><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button></Link>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => del(t)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && data?.items.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun thread trouvé.</td></tr>}
          </tbody>
        </table>
        {data && <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />}
      </div>
    </div>
  );
}
