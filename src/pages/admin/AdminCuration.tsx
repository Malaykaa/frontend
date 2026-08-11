import { useState } from "react";
import { Check, ExternalLink, Globe, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminOffers, useAdminOffer, useDeleteAdminOffer, useCreateAdminOffer } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";
import { toast } from "sonner";
import type { AdminOfferDetail, AdminOfferItem } from "@/shared/types";

const TYPE_OPTIONS = [
  { value: "job",                   label: "Emploi" },
  { value: "formation",             label: "Formation / Bourse" },
  { value: "grant",                 label: "Financement / Subvention" },
  { value: "scholarship",           label: "Bourse d'études" },
  { value: "call_for_applications", label: "Appel à candidatures" },
  { value: "opportunity",           label: "Opportunité" },
  { value: "resource",              label: "Ressource" },
];

interface OfferDraft {
  title: string;
  company: string;
  location: string;
  url: string;
  offer_type: string;
}

function draftFromPage(page: AdminOfferDetail): OfferDraft {
  return {
    title:      page.title ?? "",
    company:    page.company ?? "",
    location:   page.location ?? "",
    url:        page.url ?? page.external_id ?? "",
    offer_type: page.offer_type ?? "opportunity",
  };
}

// ── Panneau de contenu de la page sélectionnée ───────────────────────────────
function PageContent({ pageId, onDone }: { pageId: string; onDone: () => void }) {
  const { data: page, isLoading } = useAdminOffer(pageId);
  const deletePage  = useDeleteAdminOffer();
  const createOffer = useCreateAdminOffer();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState<OfferDraft | null>(null);

  const busy = deletePage.isPending || createOffer.isPending;

  const openEdit = () => {
    if (!page) return;
    setDraft(draftFromPage(page));
    setEditing(true);
  };

  const set = (k: keyof OfferDraft, v: string) =>
    setDraft((d) => d ? { ...d, [k]: v } : d);

  const handleValidate = async (overrides?: Partial<OfferDraft>) => {
    if (!page) return;
    const base = draftFromPage(page);
    const data = { ...base, ...overrides };
    try {
      await createOffer.mutateAsync({
        title:      data.title.trim() || page.title,
        company:    data.company.trim()  || undefined,
        location:   data.location.trim() || undefined,
        url:        data.url.trim()      || undefined,
        offer_type: data.offer_type      || "opportunity",
        description: page.description   ?? undefined,
        source: "curated",
      });
      deletePage.mutate(pageId, {
        onSuccess: onDone,
        onError: (err: unknown) =>
          toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression."),
      });
    } catch {
      // onError toast géré par le hook createOffer
    }
  };

  const handleReject = () => {
    if (!confirm("Rejeter et supprimer cette page ?")) return;
    deletePage.mutate(pageId, { onSuccess: onDone });
    toast.success("Page rejetée.");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
    </div>
  );
  if (!page) return null;

  const pageUrl = page.url || page.external_id;

  return (
    <div className="space-y-4">
      {/* En-tête */}
      <div className="space-y-1">
        <p className="font-semibold text-base leading-tight">{page.title}</p>
        <p className="text-xs text-muted-foreground">
          {page.source} · {formatRelativeTime(page.scraped_at)}
          {page.offer_type && <> · <span className="capitalize">{page.offer_type}</span></>}
        </p>
      </div>

      {/* Lien */}
      {pageUrl && (
        <a
          href={pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors group"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="text-xs text-primary truncate group-hover:underline">{pageUrl}</span>
        </a>
      )}

      {/* Formulaire d'édition (inline, affiché si editing) */}
      {editing && draft && (
        <div className="rounded-xl border bg-muted/10 p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modifier avant validation</p>

          <div className="space-y-1.5">
            <Label className="text-xs">Titre *</Label>
            <Input value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Entreprise</Label>
              <Input value={draft.company} onChange={(e) => set("company", e.target.value)} placeholder="—" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Localisation</Label>
              <Input value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="—" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <select
                className="w-full h-9 rounded-md border bg-background px-3 text-sm"
                value={draft.offer_type}
                onChange={(e) => set("offer_type", e.target.value)}
              >
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL</Label>
              <Input value={draft.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
            </div>
          </div>
        </div>
      )}

      {/* Contenu brut */}
      {page.description && (
        <div className="rounded-xl border bg-muted/20">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contenu</p>
            <p className="text-xs text-muted-foreground">{page.description.length.toLocaleString()} chars</p>
          </div>
          <div className="px-3 py-3 max-h-72 overflow-y-auto">
            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
              {page.description}
            </pre>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          className="flex-1 gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
          onClick={handleReject}
          disabled={busy}
        >
          {deletePage.isPending && !createOffer.isPending
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <X className="h-4 w-4" />}
          Rejeter
        </Button>

        {editing ? (
          <Button variant="outline" className="flex-1 gap-2" onClick={() => setEditing(false)} disabled={busy}>
            Annuler
          </Button>
        ) : (
          <Button variant="outline" className="flex-1 gap-2" onClick={openEdit} disabled={busy}>
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
        )}

        <Button
          className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
          onClick={() => handleValidate(editing && draft ? draft : undefined)}
          disabled={busy || (editing && !draft?.title.trim())}
        >
          {createOffer.isPending
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Check className="h-4 w-4" />}
          Valider
        </Button>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function AdminCuration() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useAdminOffers({
    source_prefix: "web_",
    page: 1,
    size: 50,
    active: true,
  });

  const pages = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleDone = () => {
    setSelectedId(null);
    refetch();
  };

  return (
    <div className="flex h-full gap-0">
      {/* ── Panel gauche : liste des pages à traiter ─────────── */}
      <div className="w-72 shrink-0 border-r flex flex-col">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold">Curation</h1>
              <p className="text-xs text-muted-foreground">{total} page{total !== 1 ? "s" : ""} à traiter</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-xs h-7 px-2">
              Actualiser
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Chargement…
            </div>
          ) : pages.length === 0 ? (
            <div className="px-4 py-10 text-center space-y-2">
              <Globe className="h-7 w-7 mx-auto text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">Aucune page à traiter.</p>
            </div>
          ) : (
            <div className="divide-y">
              {pages.map((p: AdminOfferItem) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors ${
                    selectedId === p.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <p className="text-xs font-medium leading-tight line-clamp-2">{p.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{p.source}</Badge>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeTime(p.scraped_at)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Panel droit : contenu + actions ────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {selectedId ? (
          <PageContent
            key={selectedId}
            pageId={selectedId}
            onDone={handleDone}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-muted-foreground">
            <Globe className="h-10 w-10 opacity-15" />
            <p className="text-sm font-medium">Sélectionne une page</p>
            <p className="text-xs max-w-xs opacity-70">
              Lis le contenu, ouvre le lien pour vérifier, puis valide ou rejette.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
