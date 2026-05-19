import { Briefcase, Database, Globe, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrapingStats, useRunApify, useRunPerplexity } from "@/hooks/queries/use-admin";

export default function AdminScraping() {
  const { data: stats, isLoading: statsLoading, refetch } = useScrapingStats();
  const runPerplexity = useRunPerplexity();
  const runApify = useRunApify();
  const isRunning = runPerplexity.isPending || runApify.isPending;
  const lastResult = runPerplexity.data ?? runApify.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Scraping</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Déclenchement manuel des pipelines de collecte d'offres</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={statsLoading} className="gap-1.5">
          <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} /> Actualiser
        </Button>
      </div>

      {lastResult && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Dernier run terminé</p>
          <pre className="text-xs text-emerald-600 dark:text-emerald-500 overflow-auto whitespace-pre-wrap">{JSON.stringify(lastResult, null, 2)}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600"><Globe className="h-5 w-5" /></div>
            <div><h2 className="text-sm font-semibold">Perplexity</h2><p className="text-xs text-muted-foreground">Recherche large d'offres via l'API Perplexity AI</p></div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Déclenche une recherche sur les requêtes configurées (bourses, emplois, subventions…) et stocke les résultats avec embeddings.</p>
          <Button className="w-full gap-2" onClick={() => runPerplexity.mutate()} disabled={isRunning}>
            {runPerplexity.isPending ? <><RefreshCw className="h-4 w-4 animate-spin" />En cours…</> : <><Zap className="h-4 w-4" />Lancer Perplexity</>}
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600"><Briefcase className="h-5 w-5" /></div>
            <div><h2 className="text-sm font-semibold">Apify (léger)</h2><p className="text-xs text-muted-foreground">Scraping d'offres d'emploi et de stages</p></div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Lance un run Apify en mode léger pour collecter des offres LinkedIn et d'autres plateformes ciblées Afrique.</p>
          <Button variant="outline" className="w-full gap-2" onClick={() => runApify.mutate()} disabled={isRunning}>
            {runApify.isPending ? <><RefreshCw className="h-4 w-4 animate-spin" />En cours…</> : <><Database className="h-4 w-4" />Lancer Apify</>}
          </Button>
        </div>
      </div>

      {statsLoading ? <div className="h-24 rounded-xl bg-muted animate-pulse" /> : stats && Object.keys(stats).length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b"><h2 className="text-sm font-semibold">Statistiques de scraping</h2></div>
          <div className="p-4">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="space-y-0.5">
                  <dt className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
                  <dd className="text-base font-bold">{typeof value === "number" ? value.toLocaleString() : String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
