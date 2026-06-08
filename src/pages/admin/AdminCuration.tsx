import { useState } from "react";
import { CheckCircle2, ExternalLink, Globe, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAdminOffers, useAdminOffer, useDeleteAdminOffer, useCreateAdminOffer } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";
import { toast } from "sonner";
import type { AdminOfferItem } from "@/shared/types";
import type { AdminOfferCreate } from "@/services/api/admin.api";

const TYPE_OPTIONS = [
  { value: "job",                   label: "Emploi" },
  { value: "formation",             label: "Formation / Bourse" },
  { value: "grant",                 label: "Financement / Subvention" },
  { value: "scholarship",           label: "Bourse d'études" },
  { value: "call_for_applications", label: "Appel à candidatures" },
  { value: "opportunity",           label: "Opportunité" },
  { value: "resource",              label: "Ressource" },
];

const EMPTY_FORM: Partial<AdminOfferCreate> = {
  title: "", company: "", location: "", url: "",
  offer_type: "job", description: "",
};

// ── Panel de saisie d'offre individuelle ──────────────────────────────────────
function OfferForm({
  onAdded,
}: {
  onAdded: () => void;
}) {
  const [form, setForm] = useState<Partial<AdminOfferCreate>>(EMPTY_FORM);
  const create = useCreateAdminOffer();
  const set = (k: keyof AdminOfferCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { toast.error("Le titre est requis."); return; }
    create.mutate(
      {
        title: form.title!.trim(),
        company: form.company?.trim() || undefined,
        location: form.location?.trim() || undefined,
        url: form.url?.trim() || undefined,
        offer_type: form.offer_type || "job",
        description: form.description?.trim() || undefined,
        source: "admin",
      },
      {
        onSuccess: () => {
          toast.success("Offre ajoutée ✓");
          setForm(EMPTY_FORM);
          onAdded();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs">Titre de l'offre *</Label>
        <Input value={form.title ?? ""} onChange={e => set("title", e.target.value)} placeholder="Ex : Ingénieur Logiciel Senior" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Entreprise</Label>
          <Input value={form.company ?? ""} onChange={e => set("company", e.target.value)} placeholder="Ex : MTN Côte d'Ivoire" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Localisation</Label>
          <Input value={form.location ?? ""} onChange={e => set("location", e.target.value)} placeholder="Ex : Abidjan, CI" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Type</Label>
          <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={form.offer_type ?? "job"} onChange={e => set("offer_type", e.target.value)}>
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">URL de l'offre</Label>
          <Input value={form.url ?? ""} onChange={e => set("url", e.target.value)} placeholder="https://..." />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Description (optionnel)</Label>
        <textarea
          className="w-full h-20 rounded-md border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={form.description ?? ""}
          onChange={e => set("description", e.target.value)}
          placeholder="Copiez le texte de l'annonce…"
        />
      </div>
      <Button type="submit" className="w-full gap-2" disabled={create.isPending}>
        {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {create.isPending ? "Ajout en cours…" : "Ajouter cette offre"}
      </Button>
    </form>
  );
}

// ── Panneau de contenu de la page sélectionnée ───────────────────────────────
function PageContent({ pageId, onDelete }: { pageId: string; onDelete: () => void }) {
  const { data: page, isLoading } = useAdminOffer(pageId);
  const deletePage = useDeleteAdminOffer();
  const [addedCount, setAddedCount] = useState(0);

  const handleDelete = () => {
    if (!confirm("Supprimer cette page ? Les offres déjà extraites sont conservées.")) return;
    deletePage.mutate(pageId, { onSuccess: onDelete });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin mr-2" /> Chargement…
    </div>
  );
  if (!page) return null;

  return (
    <div className="space-y-4">
      {/* En-tête page */}
      <div className="rounded-xl border bg-amber-50 dark:bg-amber-900/10 p-4 space-y-2.5">
        <div className="space-y-1">
          <p className="font-semibold text-sm leading-tight">{page.title}</p>
          <p className="text-xs text-muted-foreground">{page.source} · {formatRelativeTime(page.scraped_at)}</p>
        </div>

        {/* Lien de la page scrapée — toujours visible */}
        {(page.url || page.external_id) && (
          <a
            href={page.url || page.external_id}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-white dark:bg-background border px-3 py-2 hover:bg-primary/5 transition-colors group"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-xs text-primary truncate group-hover:underline">
              {page.url || page.external_id}
            </span>
          </a>
        )}

        {addedCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {addedCount} offre{addedCount > 1 ? "s" : ""} ajoutée{addedCount > 1 ? "s" : ""} depuis cette page
          </div>
        )}
      </div>

      {/* Contenu brut de la page */}
      {page.description && (
        <div className="rounded-xl border bg-muted/20">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contenu de la page</p>
            <p className="text-xs text-muted-foreground">{page.description.length.toLocaleString()} chars</p>
          </div>
          <div className="px-3 py-3 max-h-64 overflow-y-auto">
            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed">
              {page.description}
            </pre>
          </div>
        </div>
      )}

      {/* Formulaire de saisie */}
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-sm font-semibold">Extraire une offre de cette page</p>
        <OfferForm onAdded={() => setAddedCount(c => c + 1)} />
      </div>

      {/* Bouton supprimer la page */}
      <Button
        variant="destructive"
        className="w-full gap-2"
        onClick={handleDelete}
        disabled={deletePage.isPending}
      >
        {deletePage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        Page traitée — Supprimer
      </Button>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function AdminCuration() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const page = 1;

  const { data, isLoading, refetch } = useAdminOffers({
    source_prefix: "web_",
    page,
    size: 50,
    active: true,
  });

  const pages = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex h-full gap-0">
      {/* ── Panel gauche : liste des pages à traiter ─────────── */}
      <div className="w-80 shrink-0 border-r flex flex-col">
        <div className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold">Curation manuelle</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {total} page{total > 1 ? "s" : ""} à traiter
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 text-xs">
              Actualiser
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-20 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Chargement…
            </div>
          ) : pages.length === 0 ? (
            <div className="px-4 py-8 text-center space-y-2">
              <Globe className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucune page à traiter.</p>
              <p className="text-xs text-muted-foreground">Lance un run Apify heavy depuis la page Scraping pour alimenter cette liste.</p>
            </div>
          ) : (
            pages.map((p: AdminOfferItem) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left px-4 py-3 border-b hover:bg-muted/30 transition-colors ${selectedId === p.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
              >
                <p className="text-sm font-medium leading-tight line-clamp-2">{p.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{p.source}</Badge>
                  <span className="text-[10px] text-muted-foreground">{formatRelativeTime(p.scraped_at)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Panel droit : contenu + formulaire ─────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {selectedId ? (
          <PageContent
            key={selectedId}
            pageId={selectedId}
            onDelete={() => {
              setSelectedId(null);
              refetch();
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-muted-foreground">
            <Globe className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">Sélectionne une page à traiter</p>
            <p className="text-xs max-w-xs">
              Lis le contenu, saisis les offres une par une, puis supprime la page quand c'est terminé.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
