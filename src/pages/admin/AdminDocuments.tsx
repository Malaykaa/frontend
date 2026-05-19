import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminDocuments, useAdminDeliverables } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";

const DOC_LABELS: Record<string, string> = {
  cv: "CV", cover_letter: "Lettre de motivation", business_plan: "Business plan",
  pitch_deck: "Pitch deck", email_pro: "Email pro", report: "Rapport",
  study_sheet: "Fiche", contract: "Contrat", marketing_plan: "Plan marketing",
  market_study: "Etude de marche", thesis: "Memoire", commercial_proposal: "Proposition commerciale",
};

const AGENT_LABELS: Record<string, string> = {
  career_agent: "Carriere", scholarship_agent: "Bourse", funding_agent: "Financement",
  exam_agent: "Concours/Exam", tender_agent: "Appel d'offres",
  freelance_agent: "Freelance", document_agent: "Document", study_grant_agent: "Recherche",
};

export default function AdminDocuments() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [docType, setDocType] = useState("");
  const [tab, setTab] = useState<"ai" | "exports">("ai");
  const userId = searchParams.get("user_id") ?? undefined;

  const { data: docs, isLoading: docsLoading } = useAdminDocuments({
    page, size: 20, doc_type: docType || undefined, user_id: userId,
  });
  const { data: deliverables, isLoading: delivLoading } = useAdminDeliverables({
    page, size: 20, user_id: userId,
  });

  const switchTab = (t: "ai" | "exports") => { setTab(t); setPage(1); };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Documents</h1>
          {userId && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Filtres actifs <Link to="/admin/documents" className="text-primary hover:underline ml-1">Effacer</Link>
            </p>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-1 rounded-lg bg-muted/40 p-1 w-fit">
        {[
          { key: "ai" as const,      label: "Generes par l'IA",  count: deliverables?.total },
          { key: "exports" as const, label: "Exports formels",   count: docs?.total },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === key
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
            {count !== undefined && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${tab === key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* === DOCUMENTS GENERES PAR L'IA === */}
      {tab === "ai" && (
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/40">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Apercu</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type / Agent</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Thread</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Date</th>
            </tr></thead>
            <tbody>
              {delivLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b animate-pulse">
                      <td colSpan={5} className="px-4 py-4"><div className="h-4 rounded bg-muted w-3/4" /></td>
                    </tr>
                  ))
                : deliverables?.items.map((d) => (
                    <tr key={d.message_id} className="border-b last:border-0 hover:bg-muted/30 align-top">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {d.content_preview || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-[10px]">
                          {d.agent_id ? (AGENT_LABELS[d.agent_id] ?? d.agent_id) : "IA"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/threads/${d.thread_id}`} className="text-xs hover:text-primary line-clamp-1">
                          {d.thread_title ?? "(sans titre)"}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/users/${d.user_id}`} className="text-xs hover:text-primary">
                          {d.user_email ?? d.user_id.slice(0, 8) + "..."}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(d.created_at)}
                      </td>
                    </tr>
                  ))}
              {!delivLoading && deliverables?.items.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Aucun document genere pour l'instant.
                </td></tr>
              )}
            </tbody>
          </table>
          {deliverables && (
            <AdminPagination page={deliverables.page} pages={deliverables.pages} total={deliverables.total} size={deliverables.size} onPage={setPage} />
          )}
        </div>
      )}

      {/* === EXPORTS FORMELS === */}
      {tab === "exports" && (
        <>
          <div className="flex gap-2">
            <select className="h-9 rounded-md border bg-background px-3 text-sm" value={docType}
              onChange={(e) => { setDocType(e.target.value); setPage(1); }}>
              <option value="">Tous les types</option>
              {Object.entries(DOC_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Apercu</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Version</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {docsLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b animate-pulse">
                        <td colSpan={5} className="px-4 py-4"><div className="h-4 rounded bg-muted w-3/4" /></td>
                      </tr>
                    ))
                  : docs?.items.map((d) => (
                      <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-muted-foreground line-clamp-2">{d.content_preview || "—"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-[10px]">{DOC_LABELS[d.type] ?? d.type}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/admin/users/${d.user_id}`} className="text-xs hover:text-primary">
                            {d.user_email ?? d.user_id.slice(0, 8) + "..."}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-right tabular-nums text-muted-foreground">v{d.version}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(d.created_at)}</td>
                      </tr>
                    ))}
                {!docsLoading && docs?.items.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucun export formel.
                  </td></tr>
                )}
              </tbody>
            </table>
            {docs && (
              <AdminPagination page={docs.page} pages={docs.pages} total={docs.total} size={docs.size} onPage={setPage} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
