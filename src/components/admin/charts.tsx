/**
 * Briques graphiques du tableau de bord analytique.
 *
 * Toutes consomment les mêmes primitives que le backend produit (`Bucket`,
 * `SeriesPoint`, `Kpi`) : ajouter une dimension au dashboard ne demande donc
 * aucun nouveau composant, seulement un appel de plus.
 */
import { useMemo } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { Bucket, Kpi, SeriesPoint } from "@/services/api/analytics.api";
import { COUNTRIES } from "@/shared/data/countries";
import { cn } from "@/shared/lib/utils";

// ── Drapeaux des pays ──────────────────────────────────────────────────────
//
// Le backend fait déjà converger codes ISO, noms saisis et texte libre vers un
// nom canonique unique — c'est lui qui garantit qu'un pays n'occupe qu'une
// seule barre. Il ne reste ici qu'à préfixer le drapeau, purement décoratif.
//
// La correspondance se fait donc sur le NOM, pas sur le code : c'est ce que le
// backend renvoie désormais.

const COUNTRY_BY_NAME = new Map(
  COUNTRIES.flatMap((c) => [
    [c.nameFr.toLowerCase(), c] as const,
    [c.name.toLowerCase(), c] as const,
  ])
);

export function resolveCountryLabel(label: string): string {
  const match = COUNTRY_BY_NAME.get(label.trim().toLowerCase());
  return match ? `${match.flag} ${match.nameFr}` : label;
}

/** Préfixe le drapeau sur une distribution géographique entière. */
export function withCountryLabels(buckets: Bucket[]): Bucket[] {
  return buckets.map((b) => ({ ...b, label: resolveCountryLabel(b.label) }));
}

// ── Palette ────────────────────────────────────────────────────────────────
//
// Teintes distinctes plutôt qu'un dégradé d'une seule couleur : sur un
// camembert ou un empilement, un dégradé rend deux parts voisines
// indistinguables.
const PALETTE = [
  "#4f46e5", "#0891b2", "#059669", "#d97706", "#dc2626",
  "#7c3aed", "#0284c7", "#65a30d", "#ea580c", "#be123c",
  "#475569",
];

const AXIS = { fontSize: 11, fill: "currentColor" };

function formatNumber(n: number): string {
  return n.toLocaleString("fr-FR");
}

/**
 * Recharts type la valeur d'un tooltip en `string | number | Array<...>`.
 * On la ramène à un nombre au point d'entrée plutôt que de forcer le type
 * de la signature, qui masquerait un vrai changement de contrat en cas de
 * montée de version.
 */
function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

/** Le `pct` calculé côté backend, extrait de la charge utile du point survolé. */
function payloadPct(item: unknown): number {
  const payload = (item as { payload?: Bucket } | undefined)?.payload;
  return payload?.pct ?? 0;
}

// ── Carte KPI ──────────────────────────────────────────────────────────────

export function KpiCard({
  label, kpi, hint, accent = false,
}: {
  label: string;
  kpi: Kpi;
  hint?: string;
  accent?: boolean;
}) {
  const v = kpi.variation_pct;
  const up = v !== null && v > 0;
  const down = v !== null && v < 0;
  const Icon = up ? ArrowUpRight : down ? ArrowDownRight : Minus;

  return (
    <div className={cn(
      "rounded-xl border p-4",
      accent ? "bg-primary/5 border-primary/20" : "bg-card"
    )}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{formatNumber(kpi.total)}</p>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className={cn(
          "inline-flex items-center gap-0.5 font-semibold",
          up && "text-emerald-600",
          down && "text-red-600",
          !up && !down && "text-muted-foreground"
        )}>
          <Icon className="h-3 w-3" />
          {/* Une progression depuis zéro n'a pas de pourcentage : on affiche
              le volume brut plutôt qu'un « +100 % » trompeur. */}
          {v === null ? `+${formatNumber(kpi.current)}` : `${v > 0 ? "+" : ""}${v} %`}
        </span>
        <span className="text-muted-foreground">
          {hint ?? "vs période précédente"}
        </span>
      </div>
    </div>
  );
}

// ── Conteneur de graphique ─────────────────────────────────────────────────

export function ChartCard({
  title, subtitle, children, empty,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {empty ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground">Aucune donnée sur cette période</p>
        </div>
      ) : children}
    </div>
  );
}

// ── Série temporelle ───────────────────────────────────────────────────────

export function TrendArea({
  data, name, color = PALETTE[0], height = 220,
}: {
  data: SeriesPoint[];
  name: string;
  color?: string;
  height?: number;
}) {
  const gradientId = useMemo(
    () => `grad-${name.replace(/\W/g, "")}-${color.slice(1)}`,
    [name, color]
  );

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
        <Tooltip
          formatter={(value) => [formatNumber(toNumber(value)), name]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Area
          type="monotone" dataKey="count" name={name}
          stroke={color} strokeWidth={2} fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Deux séries superposées — comparaison de rythmes sur la même échelle. */
export function TrendCompare({
  a, b, nameA, nameB, height = 220,
}: {
  a: SeriesPoint[];
  b: SeriesPoint[];
  nameA: string;
  nameB: string;
  height?: number;
}) {
  const merged = useMemo(() => {
    const byPeriod = new Map(b.map((p) => [p.period, p.count]));
    return a.map((p) => ({ label: p.label, a: p.count, b: byPeriod.get(p.period) ?? 0 }));
  }, [a, b]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={merged} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
        <XAxis dataKey="label" tick={AXIS} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="a" name={nameA} stroke={PALETTE[0]} fill={PALETTE[0]} fillOpacity={0.15} strokeWidth={2} />
        <Area type="monotone" dataKey="b" name={nameB} stroke={PALETTE[2]} fill={PALETTE[2]} fillOpacity={0.15} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ── Distributions ──────────────────────────────────────────────────────────

/**
 * Barres horizontales — le format lisible dès que les libellés sont longs
 * (noms de pays, domaines, mots-clés), là où des barres verticales
 * tronqueraient ou inclineraient le texte.
 */
export function DistributionBars({
  data, color = PALETTE[0], height,
}: {
  data: Bucket[];
  color?: string;
  height?: number;
}) {
  const h = height ?? Math.max(160, data.length * 30 + 20);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
        <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category" dataKey="label" tick={AXIS} tickLine={false} axisLine={false}
          width={116} interval={0}
        />
        <Tooltip
          cursor={{ fillOpacity: 0.06 }}
          formatter={(value, _name, item) => [
            `${formatNumber(toNumber(value))} (${payloadPct(item)} %)`, "Volume",
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((b, i) => (
            <Cell
              key={b.key}
              // « Non renseigné » et « Autres » en gris : ce sont des absences
              // de donnée, pas des catégories à mettre en avant.
              fill={b.key === "unknown" || b.key === "_others" ? "#94a3b8" : color}
              fillOpacity={b.key === "unknown" || b.key === "_others" ? 0.5 : 1 - i * 0.045}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Camembert — réservé aux dimensions à peu de parts (genre, statut, qualité). */
export function DistributionDonut({ data, height = 220 }: { data: Bucket[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data} dataKey="count" nameKey="label"
          innerRadius="52%" outerRadius="80%" paddingAngle={2}
        >
          {data.map((b, i) => (
            <Cell
              key={b.key}
              fill={b.key === "unknown" || b.key === "_others" ? "#94a3b8" : PALETTE[i % PALETTE.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, item) => [
            `${formatNumber(toNumber(value))} (${payloadPct(item)} %)`, name,
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Palmarès textuel — plus dense qu'un graphique quand seul l'ordre compte. */
export function RankedList({ data, unit = "" }: { data: Bucket[]; unit?: string }) {
  const max = data[0]?.count || 1;
  return (
    <div className="space-y-1.5">
      {data.map((b, i) => (
        <div key={b.key} className="flex items-center gap-2.5">
          <span className="w-5 shrink-0 text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
            {i + 1}
          </span>
          <span className="w-28 shrink-0 truncate text-xs font-medium" title={b.label}>
            {b.label}
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(b.count / max) * 100}%` }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
            {formatNumber(b.count)}{unit} · {b.pct} %
          </span>
        </div>
      ))}
    </div>
  );
}

export { PALETTE, formatNumber };
