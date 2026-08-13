import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/queries/use-analytics";
import {
  ChartCard, DistributionBars, DistributionDonut, KpiCard, PALETTE,
  RankedList, TrendArea, TrendCompare, formatNumber, withCountryLabels,
} from "@/components/admin/charts";
import { cn } from "@/shared/lib/utils";

type TabKey = "overview" | "users" | "offers" | "intents" | "goals";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "users",    label: "Utilisateurs" },
  { key: "offers",   label: "Offres" },
  { key: "intents",  label: "Intentions" },
  { key: "goals",    label: "Objectifs" },
];

const RANGES = [
  { months: 6,  label: "6 mois" },
  { months: 12, label: "12 mois" },
  { months: 24, label: "24 mois" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [months, setMonths] = useState(12);
  const { data, isLoading, isError, refetch, isFetching } = useAdminAnalytics(months);

  return (
    <div className="space-y-6 p-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Dashboard analytique</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Répartitions, croisements et évolutions sur la plateforme Malayka
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.months}
                onClick={() => setMonths(r.months)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  months === r.months
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => void refetch()}
            className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
            title="Rafraîchir"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">Impossible de charger les analyses.</p>
          <button
            onClick={() => void refetch()}
            className="mt-2 text-xs font-medium underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border bg-card" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl border bg-card" />
            ))}
          </div>
        </div>
      )}

      {data && (
        <>
          {/* KPI transverses — toujours visibles, quel que soit l'onglet */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label="Utilisateurs" kpi={data.users.kpi} accent />
            <KpiCard label="Offres collectées" kpi={data.offers.kpi} />
            <KpiCard label="Intentions extraites" kpi={data.intents.kpi} />
            <KpiCard label="Objectifs créés" kpi={data.goals.kpi} />
          </div>

          {/* Onglets */}
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

          {tab === "overview"  && <OverviewTab data={data} />}
          {tab === "users"     && <UsersTab data={data} />}
          {tab === "offers"    && <OffersTab data={data} />}
          {tab === "intents"   && <IntentsTab data={data} />}
          {tab === "goals"     && <GoalsTab data={data} />}

          <p className="pt-2 text-center text-[11px] text-muted-foreground">
            Généré le {new Date(data.generated_at).toLocaleString("fr-FR")} ·
            fenêtre d'analyse : {data.months} mois
          </p>
        </>
      )}
    </div>
  );
}

type Props = { data: NonNullable<ReturnType<typeof useAdminAnalytics>["data"]> };

// ── Vue d'ensemble ─────────────────────────────────────────────────────────

function OverviewTab({ data }: Props) {
  const { users, offers, intents, goals, engagement } = data;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Croissance des inscriptions"
          subtitle="Nouveaux comptes par mois"
          empty={users.monthly.every((p) => p.count === 0)}
        >
          <TrendArea data={users.monthly} name="Inscriptions" />
        </ChartCard>

        <ChartCard
          title="Objectifs et intentions"
          subtitle="Ce que les utilisateurs déclarent chercher"
          empty={goals.monthly.every((p) => p.count === 0) && intents.monthly.every((p) => p.count === 0)}
        >
          <TrendCompare a={goals.monthly} b={intents.monthly} nameA="Objectifs" nameB="Intentions" />
        </ChartCard>

        <ChartCard
          title="Collecte d'offres"
          subtitle="Volume scrapé par mois"
          empty={offers.monthly.every((p) => p.count === 0)}
        >
          <TrendArea data={offers.monthly} name="Offres" color={PALETTE[2]} />
        </ChartCard>

        <ChartCard
          title="Activité conversationnelle"
          subtitle="Messages échangés et documents produits"
          empty={engagement.messages_monthly.every((p) => p.count === 0)}
        >
          <TrendCompare
            a={engagement.messages_monthly} b={engagement.documents_monthly}
            nameA="Messages" nameB="Documents"
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="Objectifs par utilisateur" value={engagement.avg_goals_per_user.toString()} />
        <MiniStat label="Utilisateurs avec objectif" value={`${engagement.users_with_goal_pct} %`} />
        <MiniStat label="Utilisateurs avec intention" value={`${engagement.users_with_intent_pct} %`} />
        <MiniStat
          label="Offres indexées"
          value={`${offers.indexed_pct} %`}
          hint={`${formatNumber(offers.indexed_count)} vectorisées`}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold tabular-nums">{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ── Utilisateurs ───────────────────────────────────────────────────────────

function UsersTab({ data }: Props) {
  const u = data.users;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Pays de résidence" subtitle="Où vivent les utilisateurs" empty={!u.by_country.length}>
        <DistributionBars data={withCountryLabels(u.by_country)} />
      </ChartCard>

      <ChartCard title="Nationalité" subtitle="Détermine l'éligibilité à de nombreuses bourses" empty={!u.by_nationality.length}>
        <DistributionBars data={withCountryLabels(u.by_nationality)} color={PALETTE[1]} />
      </ChartCard>

      <ChartCard title="Tranches d'âge" subtitle="Dérivées de l'année de naissance" empty={!u.by_age_bracket.length}>
        <DistributionBars data={u.by_age_bracket} color={PALETTE[3]} />
      </ChartCard>

      <ChartCard title="Genre" empty={!u.by_gender.length}>
        <DistributionDonut data={u.by_gender} />
      </ChartCard>

      <ChartCard title="Profil déclaré" subtitle="Rôle choisi à l'inscription" empty={!u.by_role.length}>
        <DistributionDonut data={u.by_role} />
      </ChartCard>

      <ChartCard title="Complétude des profils" subtitle="Un profil incomplet dégrade le matching" empty={!u.profile_completion.length}>
        <DistributionDonut data={u.profile_completion} />
      </ChartCard>

      <ChartCard title="Domaines d'activité" empty={!u.by_domain.length}>
        <DistributionBars data={u.by_domain} color={PALETTE[2]} />
      </ChartCard>

      <ChartCard title="Villes" empty={!u.by_city.length}>
        <DistributionBars data={u.by_city} color={PALETTE[5]} />
      </ChartCard>
    </div>
  );
}

// ── Offres ─────────────────────────────────────────────────────────────────

function OffersTab({ data }: Props) {
  const o = data.offers;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Pays des offres" subtitle="Localisation normalisée depuis le texte brut" empty={!o.by_country.length}>
        <DistributionBars data={o.by_country} color={PALETTE[2]} />
      </ChartCard>

      <ChartCard title="Types d'opportunités" empty={!o.by_type.length}>
        <DistributionBars data={o.by_type} color={PALETTE[1]} />
      </ChartCard>

      <ChartCard title="Sources de collecte" subtitle="Plateformes et acteurs de scraping" empty={!o.by_source.length}>
        <DistributionBars data={o.by_source} color={PALETTE[4]} />
      </ChartCard>

      <ChartCard title="Qualité des offres" subtitle="Score de complétude calculé à l'ingestion" empty={!o.by_quality.length}>
        <DistributionDonut data={o.by_quality} />
      </ChartCard>

      <div className="grid grid-cols-3 gap-3 lg:col-span-2">
        <MiniStat label="Offres actives" value={formatNumber(o.active_count)} />
        <MiniStat label="Indexées sémantiquement" value={`${o.indexed_pct} %`} hint={`${formatNumber(o.indexed_count)} offres`} />
        <MiniStat label="Collectées sur la période" value={formatNumber(o.kpi.current)} />
      </div>
    </div>
  );
}

// ── Intentions ─────────────────────────────────────────────────────────────

function IntentsTab({ data }: Props) {
  const i = data.intents;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="Mots-clés les plus recherchés"
        subtitle="Extraits des conversations, dédupliqués par intention"
        empty={!i.top_keywords.length}
      >
        <RankedList data={i.top_keywords} />
      </ChartCard>

      <ChartCard title="Types d'intentions" empty={!i.by_type.length}>
        <DistributionBars data={i.by_type} color={PALETTE[5]} />
      </ChartCard>

      <ChartCard title="Domaines recherchés" empty={!i.by_domain.length}>
        <DistributionBars data={i.by_domain} color={PALETTE[1]} />
      </ChartCard>

      <ChartCard title="Zones géographiques visées" empty={!i.by_location.length}>
        <DistributionBars data={i.by_location} color={PALETTE[2]} />
      </ChartCard>

      <ChartCard title="Niveaux visés" empty={!i.by_level.length}>
        <DistributionBars data={i.by_level} color={PALETTE[3]} />
      </ChartCard>

      <ChartCard
        title="Qui exprime ces intentions — genre"
        subtitle="Croisement intention × profil"
        empty={!i.by_user_gender.length}
      >
        <DistributionDonut data={i.by_user_gender} />
      </ChartCard>

      <ChartCard title="Qui exprime ces intentions — pays" empty={!i.by_user_country.length}>
        <DistributionBars data={withCountryLabels(i.by_user_country)} />
      </ChartCard>

      <ChartCard title="Qui exprime ces intentions — nationalité" empty={!i.by_user_nationality.length}>
        <DistributionBars data={withCountryLabels(i.by_user_nationality)} color={PALETTE[1]} />
      </ChartCard>
    </div>
  );
}

// ── Objectifs ──────────────────────────────────────────────────────────────

function GoalsTab({ data }: Props) {
  const g = data.goals;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Types d'objectifs" empty={!g.by_type.length}>
        <DistributionBars data={g.by_type} color={PALETTE[5]} />
      </ChartCard>

      <ChartCard title="Statuts" empty={!g.by_status.length}>
        <DistributionDonut data={g.by_status} />
      </ChartCard>

      <ChartCard title="Thématiques choisies" subtitle="Preset sélectionné à la création" empty={!g.by_preset.length}>
        <DistributionBars data={g.by_preset} color={PALETTE[3]} />
      </ChartCard>

      <ChartCard title="Genre des porteurs d'objectifs" empty={!g.by_user_gender.length}>
        <DistributionDonut data={g.by_user_gender} />
      </ChartCard>

      <ChartCard title="Pays des porteurs d'objectifs" empty={!g.by_user_country.length}>
        <DistributionBars data={withCountryLabels(g.by_user_country)} />
      </ChartCard>

      <ChartCard title="Villes des porteurs d'objectifs" empty={!g.by_user_city.length}>
        <DistributionBars data={g.by_user_city} color={PALETTE[2]} />
      </ChartCard>
    </div>
  );
}
