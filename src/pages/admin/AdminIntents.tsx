import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminIntents } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";

const INTENT_LABELS: Record<string, string> = { stage:"Stage", emploi:"Emploi", bourse:"Bourse", financement:"Financement", appel_offre:"Appel d'offre", formation:"Formation", reconversion:"Reconversion", entrepreneuriat:"Entrepreneuriat", partenariat:"Partenariat", autre:"Autre" };

export default function AdminIntents() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [intentType, setIntentType] = useState("");
  const userId = searchParams.get("user_id") ?? undefined;

  const { data, isLoading } = useAdminIntents({ page, size: 20, intent_type: intentType || undefined, user_id: userId });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Intentions utilisateurs</h1>
          {userId && <p className="text-xs text-muted-foreground mt-0.5">Filtrées · <Link to="/admin/intents" className="text-primary hover:underline">Effacer</Link></p>}
        </div>
        {data && <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} intentions</span>}
      </div>
      <div className="flex gap-2">
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={intentType} onChange={(e) => { setIntentType(e.target.value); setPage(1); }}>
          <option value="">Tous les types</option>{Object.entries(INTENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Résumé</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Domaine</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Mots-clés</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">v</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Extrait</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b animate-pulse"><td colSpan={7} className="px-4 py-4"><div className="h-4 rounded bg-muted w-3/4" /></td></tr>)
              : data?.items.map((intent) => (
                <tr key={intent.id} className="border-b last:border-0 hover:bg-muted/30 align-top">
                  <td className="px-4 py-3 max-w-xs"><p className="text-xs leading-relaxed line-clamp-2 text-muted-foreground">{intent.intent_summary}</p></td>
                  <td className="px-4 py-3">{intent.intent_type && <Badge variant="secondary" className="text-[10px]">{INTENT_LABELS[intent.intent_type] ?? intent.intent_type}</Badge>}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{intent.domain ?? "—"}{intent.location && <span className="block text-muted-foreground/60">{intent.location}</span>}</td>
                  <td className="px-4 py-3 max-w-[180px]">
                    {intent.keywords?.length ? (
                      <div className="flex flex-wrap gap-1">{intent.keywords.slice(0, 3).map(kw => <span key={kw} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{kw}</span>)}{intent.keywords.length > 3 && <span className="text-[10px] text-muted-foreground">+{intent.keywords.length - 3}</span>}</div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3"><Link to={`/admin/users/${intent.user_id}`} className="text-xs hover:text-primary">{intent.user_email ?? intent.user_id.slice(0, 8) + "…"}</Link></td>
                  <td className="px-4 py-3 text-xs text-right tabular-nums text-muted-foreground">{intent.version}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(intent.extracted_at)}</td>
                </tr>
              ))}
            {!isLoading && data?.items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">Aucune intention trouvée.</td></tr>}
          </tbody>
        </table>
        {data && <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />}
      </div>
    </div>
  );
}
