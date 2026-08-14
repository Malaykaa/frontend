import { useState } from "react";
import {
  AlertTriangle, ArrowLeft, Ban, CheckCircle2, RefreshCw, Search, Store, Zap,
} from "lucide-react";
import {
  useAdminProvider, useAdminProviders, useAdminServiceRequest,
  useAdminServiceRequests, useModerateProvider, useServiceStats,
} from "@/hooks/queries/use-admin-services";
import { ChartCard, DistributionBars, PALETTE, TrendCompare, formatNumber, withCountryLabels }
  from "@/components/admin/charts";
import type { AdminMatchItem } from "@/services/api/admin-services.api";
import { cn } from "@/shared/lib/utils";

type Tab = "overview" | "providers" | "requests";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview",  label: "Vue d'ensemble" },
  { key: "providers", label: "Prestataires" },
  { key: "requests",  label: "Demandes" },
];

export default function AdminServices() {
  const [tab, setTab] = useState<Tab>("overview");
  const [providerId, setProviderId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  if (providerId) return <ProviderDetail id={providerId} onBack={() => setProviderId(null)} />;
  if (requestId)  return <RequestDetail  id={requestId}  onBack={() => setRequestId(null)} />;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold">Services</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Supervision de la mise en relation prestataires ↔ clients
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview"  && <Overview />}
      {tab === "providers" && <Providers onOpen={setProviderId} />}
      {tab === "requests"  && <Requests onOpen={setRequestId} />}
    </div>
  );
}

// ── Vue d'ensemble ─────────────────────────────────────────────────────────

function Overview() {
  const { data, isLoading, isError, refetch } = useServiceStats();

  if (isError) return <ErrorBox onRetry={() => void refetch()} />;
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border bg-card" />
        ))}
      </div>
    );
  }

  const f = data.funnel;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Prestataires" value={data.providers_total}
              hint={`${data.providers_published} publiés`} />
        <Stat label="Demandes" value={data.requests_total}
              hint={`${data.requests_open} ouvertes`} />
        <Stat label="Mises en relation" value={f.connected} accent />
        <Stat label="Score moyen"
              value={data.avg_match_score ?? 0}
              hint={data.avg_match_score === null ? "aucun rapprochement" : "sur 100"} />
      </div>

      {/* L'alerte la plus importante : une demande sans destinataire est un
          client perdu, et le symptôme d'un vivier trop mince ou d'un matching
          trop strict. */}
      {data.unmatched_requests > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              {data.unmatched_requests} demande{data.unmatched_requests > 1 ? "s" : ""} sans
              aucun prestataire sollicité
            </p>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-500">
              Ces clients n'ont rien reçu. Vivier trop mince dans leur domaine, ou
              seuil de pertinence trop strict.
            </p>
          </div>
        </div>
      )}

      {/* Entonnoir — dit précisément où la chaîne se casse */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-bold">Entonnoir de conversion</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          À quelle étape les demandes se perdent
        </p>
        <div className="mt-4 space-y-2.5">
          <FunnelStep label="Demandes publiées" value={f.requests_total} max={f.requests_total} />
          <FunnelStep label="Ont trouvé des prestataires" value={f.requests_with_matches} max={f.requests_total} />
          <FunnelStep label="Sollicitations envoyées" value={f.matches_total} max={f.matches_total} />
          <FunnelStep label="Acceptées par le prestataire" value={f.provider_accepted} max={f.matches_total} />
          <FunnelStep label="Mises en relation" value={f.connected} max={f.matches_total} tone="emerald" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-3">
          <Rate label="Taux de réponse" value={f.provider_response_rate}
                hint="prestataires ayant répondu" />
          <Rate label="Taux d'acceptation" value={f.acceptance_rate}
                hint="sollicitations acceptées" />
          <Rate label="Taux de conclusion" value={f.connection_rate}
                hint="acceptations converties" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Activité mensuelle" subtitle="Demandes et nouvelles vitrines"
                   empty={data.monthly_requests.every((p) => p.count === 0)
                          && data.monthly_providers.every((p) => p.count === 0)}>
          <TrendCompare a={data.monthly_requests} b={data.monthly_providers}
                        nameA="Demandes" nameB="Prestataires" />
        </ChartCard>

        <ChartCard title="Types de demandes" empty={!data.requests_by_type.length}>
          <DistributionBars data={data.requests_by_type} color={PALETTE[5]} />
        </ChartCard>

        <ChartCard title="Prestataires par pays" empty={!data.providers_by_country.length}>
          <DistributionBars data={withCountryLabels(data.providers_by_country)} color={PALETTE[2]} />
        </ChartCard>

        <ChartCard title="Demandes par pays" empty={!data.requests_by_country.length}>
          <DistributionBars data={withCountryLabels(data.requests_by_country)} color={PALETTE[1]} />
        </ChartCard>
      </div>
    </div>
  );
}

function FunnelStep({
  label, value, max, tone,
}: { label: string; value: number; max: number; tone?: "emerald" }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-52 shrink-0 truncate text-xs">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all",
                        tone === "emerald" ? "bg-emerald-500" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums">
        {formatNumber(value)}
      </span>
    </div>
  );
}

function Rate({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <p className="text-lg font-bold tabular-nums">{value} %</p>
      <p className="text-[11px] font-medium">{label}</p>
      <p className="text-[10px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function Stat({ label, value, hint, accent }: {
  label: string; value: number; hint?: string; accent?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border p-4", accent ? "border-primary/20 bg-primary/5" : "bg-card")}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{formatNumber(value)}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ── Prestataires ───────────────────────────────────────────────────────────

const PROVIDER_STATUS: Record<string, { label: string; cls: string }> = {
  published: { label: "Publiée",   cls: "bg-emerald-100 text-emerald-700" },
  draft:     { label: "Brouillon", cls: "bg-muted text-muted-foreground" },
  paused:    { label: "En pause",  cls: "bg-amber-100 text-amber-700" },
  suspended: { label: "Suspendue", cls: "bg-red-100 text-red-700" },
};

function Providers({ onOpen }: { onOpen: (id: string) => void }) {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading, isError, refetch } = useAdminProviders({ status, q });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un intitulé…"
            className="w-full rounded-lg border bg-background py-1.5 pl-8 pr-3 text-sm"
          />
        </div>
        <select
          value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border bg-background px-2.5 py-1.5 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publiées</option>
          <option value="draft">Brouillons</option>
          <option value="paused">En pause</option>
          <option value="suspended">Suspendues</option>
        </select>
      </div>

      {isError && <ErrorBox onRetry={() => void refetch()} />}
      {isLoading && <Skeletons />}

      {data && !data.items.length && <EmptyBox label="Aucun prestataire" />}

      <div className="space-y-2">
        {data?.items.map((p) => (
          <button
            key={p.id} onClick={() => onOpen(p.id)}
            className="flex w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors hover:bg-muted/40"
          >
            <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <Badge {...(PROVIDER_STATUS[p.status] ?? { label: p.status, cls: "bg-muted" })} />
                {!p.has_embedding && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                    non indexée
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {p.display_name ?? "—"} · {[p.city, p.country].filter(Boolean).join(", ") || "lieu non renseigné"}
              </p>
            </div>
            <div className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              <p>{p.received_count} reçues</p>
              <p className="text-emerald-600">{p.connected_count} conclues</p>
            </div>
          </button>
        ))}
      </div>

      {data && data.pages > 1 && (
        <p className="text-center text-xs text-muted-foreground">
          {data.total} prestataires · page {data.page} / {data.pages}
        </p>
      )}
    </div>
  );
}

function ProviderDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { data, isLoading } = useAdminProvider(id);
  const moderate = useModerateProvider();

  return (
    <div className="space-y-4 p-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      {isLoading && <Skeletons />}

      {data && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{data.title}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {data.display_name ?? "—"} · {data.user_phone ?? data.user_email ?? "contact inconnu"}
              </p>
            </div>
            <div className="flex gap-2">
              {data.status === "suspended" ? (
                <button
                  onClick={() => moderate.mutate({ id, status: "published" })}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Réactiver
                </button>
              ) : (
                <button
                  onClick={() => moderate.mutate({ id, status: "suspended" })}
                  className="flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700"
                >
                  <Ban className="h-3.5 w-3.5" /> Suspendre
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Sollicitations" value={data.received_count} />
            <Stat label="Acceptées" value={data.accepted_count} />
            <Stat label="Conclues" value={data.connected_count} accent />
          </div>

          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-bold">Vitrine</h3>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{data.description}</p>
            {data.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {data.keywords.map((k) => (
                  <span key={k} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{k}</span>
                ))}
              </div>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-xs">
              <Row label="Statut" value={PROVIDER_STATUS[data.status]?.label ?? data.status} />
              <Row label="Indexée sémantiquement" value={data.has_embedding ? "oui" : "non"} />
              <Row label="Lieu" value={[data.city, data.country].filter(Boolean).join(", ") || "—"} />
              <Row label="Tarif" value={data.rate_text ?? "—"} />
              <Row label="Disponibilité" value={data.availability_text ?? "—"} />
              <Row label="Expérience" value={data.years_experience ? `${data.years_experience} ans` : "—"} />
              <Row label="Téléphone de contact" value={data.contact_phone ?? "—"} />
              <Row label="Consentement publication"
                   value={data.consent_public_at ? new Date(data.consent_public_at).toLocaleString("fr-FR") : "—"} />
            </dl>
          </div>
        </>
      )}
    </div>
  );
}

// ── Demandes ───────────────────────────────────────────────────────────────

const REQUEST_STATUS: Record<string, { label: string; cls: string }> = {
  open:      { label: "Ouverte",     cls: "bg-amber-100 text-amber-700" },
  public:    { label: "Grand public",cls: "bg-violet-100 text-violet-700" },
  fulfilled: { label: "Conclue",     cls: "bg-emerald-100 text-emerald-700" },
  closed:    { label: "Clôturée",    cls: "bg-muted text-muted-foreground" },
  expired:   { label: "Expirée",     cls: "bg-muted text-muted-foreground" },
};

const DECISION_LABELS: Record<string, { label: string; cls: string }> = {
  pending:           { label: "Sans réponse",       cls: "bg-muted text-muted-foreground" },
  provider_accepted: { label: "Prestataire accepte",cls: "bg-sky-100 text-sky-700" },
  provider_declined: { label: "Prestataire décline",cls: "bg-muted text-muted-foreground" },
  client_accepted:   { label: "Mise en relation",   cls: "bg-emerald-100 text-emerald-700" },
  client_declined:   { label: "Client écarte",      cls: "bg-muted text-muted-foreground" },
  expired:           { label: "Expirée",            cls: "bg-muted text-muted-foreground" },
};

function Requests({ onOpen }: { onOpen: (id: string) => void }) {
  const [status, setStatus] = useState("");
  const [unmatched, setUnmatched] = useState(false);
  const { data, isLoading, isError, refetch } = useAdminServiceRequests({ status, unmatched });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status} onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border bg-background px-2.5 py-1.5 text-sm"
        >
          <option value="">Tous les statuts</option>
          <option value="open">Ouvertes</option>
          <option value="public">Grand public</option>
          <option value="fulfilled">Conclues</option>
          <option value="closed">Clôturées</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs">
          <input type="checkbox" checked={unmatched}
                 onChange={(e) => setUnmatched(e.target.checked)} />
          Sans aucun prestataire sollicité
        </label>
      </div>

      {isError && <ErrorBox onRetry={() => void refetch()} />}
      {isLoading && <Skeletons />}
      {data && !data.items.length && <EmptyBox label="Aucune demande" />}

      <div className="space-y-2">
        {data?.items.map((r) => (
          <button
            key={r.id} onClick={() => onOpen(r.id)}
            className="flex w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors hover:bg-muted/40"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate text-sm font-semibold">{r.title}</p>
                <Badge {...(REQUEST_STATUS[r.status] ?? { label: r.status, cls: "bg-muted" })} />
                {r.matches_count === 0 && (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">
                    0 sollicité
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {r.requester_name ?? "—"} · {r.request_type} ·{" "}
                {[r.city, r.country].filter(Boolean).join(", ") || "lieu non renseigné"}
              </p>
            </div>
            <div className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
              <p>{r.matches_count} sollicités</p>
              <p className="text-emerald-600">{r.connected_count} conclus</p>
            </div>
          </button>
        ))}
      </div>

      {data && data.pages > 1 && (
        <p className="text-center text-xs text-muted-foreground">
          {data.total} demandes · page {data.page} / {data.pages}
        </p>
      )}
    </div>
  );
}

function RequestDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { data, isLoading } = useAdminServiceRequest(id);

  return (
    <div className="space-y-4 p-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      {isLoading && <Skeletons />}

      {data && (
        <>
          <div>
            <h1 className="text-xl font-bold">{data.title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {data.requester_name ?? "—"} · {data.request_type} ·{" "}
              {new Date(data.created_at).toLocaleString("fr-FR")}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="whitespace-pre-wrap text-sm">{data.description}</p>
            {data.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {data.keywords.map((k) => (
                  <span key={k} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">{k}</span>
                ))}
              </div>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-3 text-xs">
              <Row label="Statut" value={REQUEST_STATUS[data.status]?.label ?? data.status} />
              <Row label="Indexée sémantiquement" value={data.has_embedding ? "oui" : "non"} />
              <Row label="Lieu" value={[data.city, data.country].filter(Boolean).join(", ") || "—"} />
              <Row label="Budget" value={data.budget_hint ?? "—"} />
            </dl>
          </div>

          {/* Le cœur du diagnostic : qui a été sollicité, avec quel score et
              par quelle voie. C'est ce qui répond à « pourquoi cette personne ? ». */}
          <div>
            <h3 className="mb-2 text-sm font-bold">
              Sollicitations · {data.matches.length}
            </h3>
            {!data.matches.length && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20">
                Aucun prestataire sollicité. Le client n'a rien reçu.
              </div>
            )}
            <div className="space-y-2">
              {data.matches.map((m) => <MatchRow key={m.id} match={m} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MatchRow({ match }: { match: AdminMatchItem }) {
  const d = DECISION_LABELS[match.decision] ?? { label: match.decision, cls: "bg-muted" };
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="truncate text-sm font-medium">
            {match.provider_title ?? match.display_name ?? "Utilisateur"}
          </p>
          <Badge label={d.label} cls={d.cls} />
          <span className={cn(
            "rounded px-1.5 py-0.5 text-[10px]",
            match.source === "provider" ? "bg-violet-100 text-violet-700" : "bg-sky-100 text-sky-700"
          )}>
            {match.source === "provider" ? "vitrine" : "grand public"}
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {match.display_name ?? "—"} · notifié le{" "}
          {new Date(match.notified_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {match.match_score !== null && (
          <p className="text-sm font-bold tabular-nums">{Math.round(match.match_score)} %</p>
        )}
        {match.match_mode && (
          <p className="flex items-center justify-end gap-0.5 text-[10px] text-muted-foreground">
            <Zap className="h-2.5 w-2.5" />{match.match_mode}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Éléments partagés ──────────────────────────────────────────────────────

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", cls)}>{label}</span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}

function Skeletons() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl border bg-card" />)}
    </div>
  );
}

function EmptyBox({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed py-10 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
      <p className="text-sm text-destructive">Impossible de charger ces données.</p>
      <button onClick={onRetry} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline">
        <RefreshCw className="h-3 w-3" /> Réessayer
      </button>
    </div>
  );
}
