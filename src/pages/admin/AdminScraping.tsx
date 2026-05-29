import { useState } from "react";
import { Briefcase, Database, Globe, RefreshCw, Zap, Plus, Trash2, ToggleLeft, ToggleRight, Link, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/lib/utils";
import {
  useScrapingStats, useRunApify, useRunPerplexity,
  useScrapingSources, useCreateScrapingSource,
  useUpdateScrapingSource, useDeleteScrapingSource,
  useScrapingActors, useCreateScrapingActor,
  useUpdateScrapingActor, useDeleteScrapingActor,
} from "@/hooks/queries/use-admin";
import type { ScrapingCategory, NormalizerType, RunMode } from "@/services/api/admin.api";

// ── Catégories disponibles ─────────────────────────────────────────────────

const CATEGORIES: { value: ScrapingCategory; label: string; color: string }[] = [
  { value: "job_boards",           label: "Emploi",           color: "bg-blue-100 text-blue-700"    },
  { value: "opportunities",        label: "Opportunités",     color: "bg-violet-100 text-violet-700" },
  { value: "scholarships",         label: "Bourses",          color: "bg-amber-100 text-amber-700"  },
  { value: "grants",               label: "Subventions",      color: "bg-emerald-100 text-emerald-700"},
  { value: "call_for_applications",label: "Appels candidature",color: "bg-rose-100 text-rose-700"  },
];

function CategoryBadge({ category }: { category: string }) {
  const cat = CATEGORIES.find(c => c.value === category);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold", cat?.color ?? "bg-muted text-muted-foreground")}>
      {cat?.label ?? category}
    </span>
  );
}

// ── Formulaire d'ajout ─────────────────────────────────────────────────────

function AddSourceForm({ onClose }: { onClose: () => void }) {
  const create = useCreateScrapingSource();
  const [form, setForm] = useState({ url: "", label: "", category: "job_boards" as ScrapingCategory, notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) return;
    await create.mutateAsync({
      url: form.url.trim(),
      label: form.label.trim() || undefined,
      category: form.category,
      notes: form.notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-semibold">Ajouter une source</p>

      <div className="space-y-1.5">
        <Label className="text-xs">URL *</Label>
        <Input
          placeholder="https://exemple.com/offres-emploi"
          value={form.url}
          onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Nom affiché (optionnel)</Label>
          <Input
            placeholder="Ex: Emploi CI"
            value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Catégorie</Label>
          <select
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as ScrapingCategory }))}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Notes (optionnel)</Label>
        <Input
          placeholder="Ex: Job board CI — mis à jour quotidiennement"
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" size="sm" disabled={create.isPending || !form.url.trim()}>
          {create.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Ajouter
        </Button>
      </div>
    </form>
  );
}

// ── Formulaire ajout actor ─────────────────────────────────────────────────

const NORMALIZERS: { value: NormalizerType; label: string }[] = [
  { value: "indeed",        label: "Indeed"              },
  { value: "linkedin_job",  label: "LinkedIn Jobs"       },
  { value: "linkedin_post", label: "LinkedIn Posts"      },
  { value: "google_jobs",   label: "Google Jobs"         },
  { value: "facebook",      label: "Facebook"            },
  { value: "web",           label: "Web (crawl général)" },
];

const OFFER_TYPES = [
  { value: "job",                   label: "Emploi"             },
  { value: "formation",             label: "Formation"          },
  { value: "grant",                 label: "Subvention"         },
  { value: "scholarship",           label: "Bourse"             },
  { value: "opportunity",           label: "Opportunité"        },
  { value: "call_for_applications", label: "Appel à candidature"},
];

const RUN_MODES: { value: RunMode; label: string }[] = [
  { value: "light", label: "Run léger (4x/jour)"      },
  { value: "heavy", label: "Run lourd (dimanche)"     },
  { value: "both",  label: "Les deux"                 },
];

const DEFAULT_INPUTS: Record<NormalizerType, string> = {
  indeed:        '{"country": "ng", "maxItems": 25}',
  linkedin_job:  '{"urls": ["https://www.linkedin.com/jobs/search/?keywords=emploi&location=Africa"], "maxCount": 20}',
  linkedin_post: '{"searchQueries": ["#emploiAfrique"], "maxPosts": 25, "scrapeComments": false}',
  google_jobs:   '{"query": "emploi", "location": "Abidjan, Côte d\'Ivoire"}',
  facebook:      '{"startUrls": [{"url": "https://www.facebook.com/myjobmag"}], "resultsLimit": 20}',
  web:           '{"startUrls": [{"url": "https://exemple.com"}], "maxCrawlPages": 8, "saveMarkdown": true, "blockMedia": true}',
};

function AddActorForm({ onClose }: { onClose: () => void }) {
  const create = useCreateScrapingActor();
  const [form, setForm] = useState({
    actor_id: "", label: "", offer_type: "job",
    source_name: "", normalizer_type: "web" as NormalizerType,
    run_mode: "both" as RunMode, notes: "",
    input_raw: DEFAULT_INPUTS["web"],
  });
  const [jsonError, setJsonError] = useState("");

  const handleNormalizerChange = (v: NormalizerType) => {
    setForm(f => ({ ...f, normalizer_type: v, input_raw: DEFAULT_INPUTS[v] }));
    setJsonError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let input_json: Record<string, unknown> = {};
    try {
      input_json = JSON.parse(form.input_raw || "{}");
      setJsonError("");
    } catch {
      setJsonError("JSON invalide — vérifie la syntaxe.");
      return;
    }
    await create.mutateAsync({
      actor_id: form.actor_id.trim(),
      label: form.label.trim(),
      offer_type: form.offer_type,
      source_name: form.source_name.trim() || form.actor_id.replace("/", "_"),
      normalizer_type: form.normalizer_type,
      input_json,
      run_mode: form.run_mode,
      notes: form.notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/30 p-4 space-y-3">
      <p className="text-sm font-semibold">Ajouter un actor Apify</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Actor ID Apify *</Label>
          <Input placeholder="auteur/nom-actor" value={form.actor_id}
            onChange={e => setForm(f => ({ ...f, actor_id: e.target.value }))} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nom affiché *</Label>
          <Input placeholder="Ex: LinkedIn Jobs Kenya" value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Normalizer</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.normalizer_type}
            onChange={e => handleNormalizerChange(e.target.value as NormalizerType)}>
            {NORMALIZERS.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Type d'offre</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.offer_type}
            onChange={e => setForm(f => ({ ...f, offer_type: e.target.value }))}>
            {OFFER_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode d'exécution</Label>
          <select className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={form.run_mode}
            onChange={e => setForm(f => ({ ...f, run_mode: e.target.value as RunMode }))}>
            {RUN_MODES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">
          Input JSON — paramètres envoyés à l'actor
          <span className="ml-1 text-muted-foreground">(pré-rempli selon le normalizer choisi)</span>
        </Label>
        <textarea
          value={form.input_raw}
          onChange={e => { setForm(f => ({ ...f, input_raw: e.target.value })); setJsonError(""); }}
          rows={5}
          className={cn(
            "w-full resize-y rounded-lg border bg-background px-3 py-2 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring",
            jsonError && "border-destructive"
          )}
          spellCheck={false}
        />
        {jsonError && <p className="text-xs text-destructive">{jsonError}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Source name (clé DB)</Label>
          <Input placeholder={form.actor_id.replace("/", "_") || "source_key"}
            value={form.source_name}
            onChange={e => setForm(f => ({ ...f, source_name: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Notes</Label>
          <Input placeholder="Optionnel" value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>Annuler</Button>
        <Button type="submit" size="sm" disabled={create.isPending || !form.actor_id || !form.label}>
          {create.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Ajouter
        </Button>
      </div>
    </form>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function AdminScraping() {
  const { data: stats, isLoading: statsLoading, refetch } = useScrapingStats();
  const { data: sources, isLoading: sourcesLoading } = useScrapingSources();
  const { data: actors, isLoading: actorsLoading } = useScrapingActors();
  const runPerplexity  = useRunPerplexity();
  const runApify       = useRunApify();
  const updateSource   = useUpdateScrapingSource();
  const deleteSource   = useDeleteScrapingSource();
  const updateActor    = useUpdateScrapingActor();
  const deleteActor    = useDeleteScrapingActor();
  const [showForm, setShowForm]   = useState(false);
  const [showActorForm, setShowActorForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const isRunning = runPerplexity.isPending || runApify.isPending;
  const lastResult = runPerplexity.data ?? runApify.data;

  const toggleActive = (id: string, current: boolean) =>
    updateSource.mutate({ id, payload: { is_active: !current } });

  const toggleActor = (id: string, current: boolean) =>
    updateActor.mutate({ id, payload: { is_active: !current } });

  const confirmDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteSource.mutate(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Scraping</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Déclenchement manuel des pipelines et gestion des sources web
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={statsLoading} className="gap-1.5">
          <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} /> Actualiser
        </Button>
      </div>

      {/* Résultat dernier run */}
      {lastResult && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Dernier run terminé</p>
          <pre className="text-xs text-emerald-600 dark:text-emerald-500 overflow-auto whitespace-pre-wrap max-h-40">
            {JSON.stringify(lastResult, null, 2)}
          </pre>
        </div>
      )}

      {/* Boutons de run */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Perplexity</h2>
              <p className="text-xs text-muted-foreground">Recherche large via l'API Perplexity AI</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Bourses, emplois, subventions — requêtes Afrique + mondiales avec extraction LLM.
          </p>
          <Button className="w-full gap-2" onClick={() => runPerplexity.mutate()} disabled={isRunning}>
            {runPerplexity.isPending
              ? <><RefreshCw className="h-4 w-4 animate-spin" />En cours…</>
              : <><Zap className="h-4 w-4" />Lancer Perplexity</>}
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Apify (léger)</h2>
              <p className="text-xs text-muted-foreground">Indeed, LinkedIn, Google Jobs, Facebook</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Run léger — 21 pays africains, posts LinkedIn/Facebook, offres structurées.
          </p>
          <Button variant="outline" className="w-full gap-2" onClick={() => runApify.mutate()} disabled={isRunning}>
            {runApify.isPending
              ? <><RefreshCw className="h-4 w-4 animate-spin" />En cours…</>
              : <><Database className="h-4 w-4" />Lancer Apify</>}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
      ) : stats && Object.keys(stats).length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h2 className="text-sm font-semibold">Statistiques</h2>
          </div>
          <div className="p-4">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="space-y-0.5">
                  <dt className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
                  <dd className="text-base font-bold">
                    {typeof value === "number" ? value.toLocaleString() : String(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* ── Sources dynamiques ─────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-sm font-semibold">Sources web dynamiques</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sites ajoutés ici sont crawlés lors du run Apify heavy (dimanche).
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(v => !v)}>
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {showForm && <AddSourceForm onClose={() => setShowForm(false)} />}

          {sourcesLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !sources?.length && !showForm ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Link className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucune source ajoutée.</p>
              <p className="text-xs text-muted-foreground">
                Clique sur "Ajouter" pour élargir la couverture du scraper web.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sources?.map(source => (
                <div
                  key={source.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-opacity",
                    !source.is_active && "opacity-50"
                  )}
                >
                  {/* Toggle actif/inactif */}
                  <button
                    onClick={() => toggleActive(source.id, source.is_active)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                    title={source.is_active ? "Désactiver" : "Activer"}
                  >
                    {source.is_active
                      ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>

                  {/* Infos */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">
                        {source.label || new URL(source.url).hostname}
                      </span>
                      <CategoryBadge category={source.category} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{source.url}</p>
                    {source.notes && (
                      <p className="text-xs text-muted-foreground/70 italic">{source.notes}</p>
                    )}
                  </div>

                  {/* Supprimer */}
                  <button
                    onClick={() => confirmDelete(source.id)}
                    className={cn(
                      "shrink-0 transition-colors",
                      deleteConfirm === source.id
                        ? "text-destructive animate-pulse"
                        : "text-muted-foreground hover:text-destructive"
                    )}
                    title={deleteConfirm === source.id ? "Cliquer pour confirmer" : "Supprimer"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Actors Apify dynamiques ────────────────────────────────────── */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="text-sm font-semibold">Actors Apify dynamiques</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Actors ajoutés ici s'exécutent automatiquement selon leur mode (light / heavy / les deux).
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setShowActorForm(v => !v)}>
            <Plus className="h-3.5 w-3.5" />
            Ajouter
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {showActorForm && <AddActorForm onClose={() => setShowActorForm(false)} />}

          {actorsLoading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />)}
            </div>
          ) : !actors?.length && !showActorForm ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Bot className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucun actor dynamique ajouté.</p>
              <p className="text-xs text-muted-foreground">
                Les actors codés en dur (Indeed, LinkedIn, Google Jobs…) restent actifs.
                Ajoute ici tout nouvel actor depuis ton compte Apify sans toucher au code.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {actors?.map(actor => (
                <div
                  key={actor.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-opacity",
                    !actor.is_active && "opacity-50"
                  )}
                >
                  <button
                    onClick={() => toggleActor(actor.id, actor.is_active)}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    {actor.is_active
                      ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                      : <ToggleLeft className="h-5 w-5" />}
                  </button>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{actor.label}</span>
                      <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-0.5 text-[10px] font-semibold">
                        {actor.run_mode === "both" ? "light + heavy" : actor.run_mode}
                      </span>
                      <span className="rounded-full bg-sky-100 text-sky-700 px-2 py-0.5 text-[10px] font-semibold">
                        {actor.normalizer_type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{actor.actor_id}</p>
                    {actor.notes && (
                      <p className="text-xs text-muted-foreground/70 italic">{actor.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (deleteConfirm === actor.id) {
                        deleteActor.mutate(actor.id);
                        setDeleteConfirm(null);
                      } else {
                        setDeleteConfirm(actor.id);
                        setTimeout(() => setDeleteConfirm(null), 3000);
                      }
                    }}
                    className={cn(
                      "shrink-0 transition-colors",
                      deleteConfirm === actor.id
                        ? "text-destructive animate-pulse"
                        : "text-muted-foreground hover:text-destructive"
                    )}
                    title={deleteConfirm === actor.id ? "Confirmer la suppression" : "Supprimer"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
