import { useState } from "react";
import { ExternalLink, Pencil, Plus, Search, ToggleLeft, ToggleRight, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminOffers, useCreateAdminOffer, useDeleteAdminOffer, useUpdateAdminOffer } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";
import type { AdminOfferItem, AdminOfferUpdate } from "@/shared/types";
import type { AdminOfferCreate } from "@/services/api/admin.api";

const TYPE_OPTIONS = [
  { value: "job",                   label: "Emploi" },
  { value: "formation",             label: "Formation" },
  { value: "grant",                 label: "Subvention" },
  { value: "scholarship",           label: "Bourse" },
  { value: "partnership",           label: "Partenariat" },
  { value: "call_for_applications", label: "Appel a candidatures" },
  { value: "opportunity",           label: "Opportunite" },
  { value: "resource",              label: "Ressource" },
];

const SOURCE_OPTIONS = [
  { value: "admin",    label: "Backoffice" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "email",    label: "Email" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "website",  label: "Site web" },
];

const EMPTY_CREATE: AdminOfferCreate = {
  title: "", offer_type: "opportunity", description: "", url: "",
  company: "", location: "", salary: "", source: "admin", posted_at: "", expires_at: "",
};

// ── Formulaire partagé (création + édition) ────────────────────────────────

interface OfferFormProps {
  initial: AdminOfferCreate;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (data: AdminOfferCreate) => void;
  onClose: () => void;
}

function OfferForm({ initial, submitLabel, isPending, onSubmit, onClose }: OfferFormProps) {
  const [form, setForm] = useState<AdminOfferCreate>(initial);
  const set = (k: keyof AdminOfferCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      ...form,
      description: form.description || undefined,
      url: form.url || undefined,
      company: form.company || undefined,
      location: form.location || undefined,
      salary: form.salary || undefined,
      posted_at: form.posted_at || undefined,
      expires_at: form.expires_at || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Titre <span className="text-destructive">*</span></label>
        <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Ex: Bourse de master en France 2026" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Type d'offre</label>
          <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={form.offer_type} onChange={e => set("offer_type", e.target.value)}>
            {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Source</label>
          <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={form.source ?? "admin"} onChange={e => set("source", e.target.value)}>
            {SOURCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Organisation</label>
          <Input value={form.company ?? ""} onChange={e => set("company", e.target.value)} placeholder="Ex: ENS Paris" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Localisation</label>
          <Input value={form.location ?? ""} onChange={e => set("location", e.target.value)} placeholder="Ex: Paris, France" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Lien (URL)</label>
        <Input type="url" value={form.url ?? ""} onChange={e => set("url", e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full min-h-[100px] rounded-md border bg-background px-3 py-2 text-sm resize-y"
          value={form.description ?? ""}
          onChange={e => set("description", e.target.value)}
          placeholder="Description complete de l'offre..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Salaire / Montant / Dotation</label>
        <Input value={form.salary ?? ""} onChange={e => set("salary", e.target.value)} placeholder="Ex: 1 200 EUR/mois ou 5 000 EUR bourse" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date de publication</label>
          <Input type="date" value={form.posted_at ?? ""} onChange={e => set("posted_at", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Date limite</label>
          <Input type="date" value={form.expires_at ?? ""} onChange={e => set("expires_at", e.target.value)} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
        Si le titre ou la description est modifie, l'embedding semantique sera regenere automatiquement lors du prochain run (matching mis a jour).
      </p>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
        <Button type="submit" disabled={!form.title.trim() || isPending}>
          {isPending ? "Enregistrement..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

// ── Modals ──────────────────────────────────────────────────────────────────

function OfferCreateModal({ onClose }: { onClose: () => void }) {
  const create = useCreateAdminOffer();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-background rounded-2xl border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">Nouvelle offre</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <OfferForm
          initial={EMPTY_CREATE}
          submitLabel="Ajouter l'offre"
          isPending={create.isPending}
          onSubmit={(data) => create.mutate(data, { onSuccess: onClose })}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

function OfferEditModal({ offer, onClose }: { offer: AdminOfferItem; onClose: () => void }) {
  const update = useUpdateAdminOffer();

  const initialForm: AdminOfferCreate = {
    title: offer.title,
    offer_type: offer.offer_type ?? "opportunity",
    description: "",
    url: offer.url ?? "",
    company: offer.company ?? "",
    location: offer.location ?? "",
    salary: "",
    source: offer.source,
    posted_at: offer.posted_at ? offer.posted_at.slice(0, 10) : "",
    expires_at: offer.expires_at ? offer.expires_at.slice(0, 10) : "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-background rounded-2xl border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-semibold">Modifier l'offre</h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-sm">{offer.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <OfferForm
          initial={initialForm}
          submitLabel="Enregistrer les modifications"
          isPending={update.isPending}
          onSubmit={(data) => {
            const payload: AdminOfferUpdate = {
              title: data.title,
              offer_type: data.offer_type,
              description: data.description,
              url: data.url,
              company: data.company,
              location: data.location,
              salary: data.salary,
              posted_at: data.posted_at,
              expires_at: data.expires_at,
            };
            update.mutate({ offerId: offer.id, payload }, { onSuccess: onClose });
          }}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

// ── Page principale ─────────────────────────────────────────────────────────

export default function AdminOffers() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [offerType, setOfferType] = useState("");
  const [source, setSource] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [showCreate, setShowCreate] = useState(false);
  const [editOffer, setEditOffer] = useState<AdminOfferItem | null>(null);

  const { data, isLoading } = useAdminOffers({
    page, size: 20, q: q || undefined,
    offer_type: offerType || undefined, source: source || undefined, active: activeFilter,
  });
  const updateOffer = useUpdateAdminOffer();
  const deleteOffer = useDeleteAdminOffer();

  const toggle = (o: AdminOfferItem) =>
    updateOffer.mutate({ offerId: o.id, payload: { is_active: !o.is_active } });
  const del = (o: AdminOfferItem) => {
    if (confirm(`Supprimer "${o.title}" ?`)) deleteOffer.mutate(o.id);
  };

  const typeLabel = (v: string | null) =>
    TYPE_OPTIONS.find(t => t.value === v)?.label ?? v ?? "—";

  return (
    <div className="p-6 space-y-4">
      {showCreate && <OfferCreateModal onClose={() => setShowCreate(false)} />}
      {editOffer && <OfferEditModal offer={editOffer} onClose={() => setEditOffer(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Offres</h1>
        <div className="flex items-center gap-2">
          {data && <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} offres</span>}
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Nouvelle offre
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Titre, organisation..." value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={offerType}
          onChange={(e) => { setOfferType(e.target.value); setPage(1); }}>
          <option value="">Tous les types</option>
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); }}>
          <option value="">Toutes les sources</option>
          {SOURCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select className="h-9 rounded-md border bg-background px-3 text-sm"
          value={activeFilter === undefined ? "" : String(activeFilter)}
          onChange={(e) => {
            setActiveFilter(e.target.value === "" ? undefined : e.target.value === "true");
            setPage(1);
          }}>
          <option value="">Toutes</option>
          <option value="true">Actives</option>
          <option value="false">Inactives</option>
        </select>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Offre</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Source</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Score</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Scrapee</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b animate-pulse">
                    <td colSpan={7} className="px-4 py-4"><div className="h-4 rounded bg-muted w-3/4" /></td>
                  </tr>
                ))
              : data?.items.map((o) => (
                  <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-sm font-medium line-clamp-1">{o.title}</p>
                      <p className="text-xs text-muted-foreground">{o.company ?? "—"} · {o.location ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]">{typeLabel(o.offer_type)}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{o.source}</td>
                    <td className="px-4 py-3 text-xs text-right tabular-nums">
                      {o.quality_score != null ? o.quality_score.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={o.is_active ? "default" : "destructive"} className="text-[10px]">
                          {o.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {!o.has_embedding && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 rounded px-1">sans embed</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(o.scraped_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {o.url && (
                          <a href={o.url} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Ouvrir le lien">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOffer(o)} title="Modifier">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggle(o)} title={o.is_active ? "Desactiver" : "Activer"}>
                          {o.is_active
                            ? <ToggleRight className="h-4 w-4 text-primary" />
                            : <ToggleLeft className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => del(o)} title="Supprimer">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            {!isLoading && data?.items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                Aucune offre trouvee.
              </td></tr>
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
