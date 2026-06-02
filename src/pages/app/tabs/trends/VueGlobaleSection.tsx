import { Globe2, BarChart3, Zap, Target, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { VueGlobale } from "@/services/api/trends.api";
import { interpretVueGlobale } from "./interpretations";
import { cn } from "@/shared/lib/utils";

const TYPE_LABELS: Record<string, string> = {
  job:                   "Emplois",
  scholarship:           "Bourses",
  grant:                 "Financements",
  call_for_applications: "Appels à cand.",
  opportunity:           "Opportunités",
  formation:             "Formations",
  partnership:           "Partenariats",
};

interface Props {
  data: VueGlobale;
}

export function VueGlobaleSection({ data }: Props) {
  const { t } = useTranslation();
  const interp = data.interpretation ?? interpretVueGlobale(data);

  // Répartition — préfère career_orientations (triées par pertinence) si disponibles
  const hasOrientations = data.career_orientations && data.career_orientations.length > 0;
  const typesEntries = Object.entries(data.par_type).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = typesEntries[0]?.[1] ?? 1;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold">{t("trends.section_globale_title")}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{data.periode}</p>
      </div>

      {/* Géographie */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("trends.geographie")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{interp.geographie}</p>

        {data.top_pays.length > 0 && (
          <div className="space-y-2 pt-1">
            {data.top_pays.slice(0, 5).map((p, i) => {
              const maxP = data.top_pays[0].count;
              const pct = Math.round((p.count / maxP) * 100);
              return (
                <div key={p.pays} className="flex items-center gap-2">
                  <span className="text-[11px] font-medium w-20 shrink-0 truncate">{p.pays}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", i === 0 ? "bg-primary" : "bg-primary/50")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 w-8 text-right">
                    {p.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Répartition / Career orientations */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {t("trends.repartition")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{interp.repartition}</p>

        {hasOrientations ? (
          /* Vue personnalisée — orientations triées par pertinence */
          <div className="space-y-2 pt-1">
            {data.career_orientations!.map((orientation) => {
              const isRelevant = orientation.relevance >= 2;
              const barPct = data.total_offres > 0
                ? Math.round((orientation.count / data.total_offres) * 100)
                : 0;
              const barMax = data.career_orientations![0].count || 1;
              const barWidth = Math.round((orientation.count / barMax) * 100);
              const label = TYPE_LABELS[orientation.type] ?? orientation.label;

              return (
                <div key={orientation.type}>
                  <div className={cn("flex items-center gap-2", !isRelevant && "opacity-50")}>
                    <span
                      className={cn(
                        "text-[11px] font-medium w-24 shrink-0 truncate",
                        isRelevant ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {label}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isRelevant ? "bg-primary" : "bg-muted-foreground/40"
                        )}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 w-8 text-right">
                      {barPct}%
                    </span>
                    {isRelevant && (
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0 text-[9px] font-bold shrink-0">
                        Pour toi
                      </span>
                    )}
                  </div>
                  {/* Lien vers les offres pour les orientations pertinentes */}
                  {isRelevant && orientation.count > 0 && (
                    <div className="mt-1.5 ml-[6.5rem]">
                      <Link
                        to={`/app/pour-moi?offer_types=${encodeURIComponent(orientation.type)}&max_age=30`}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                      >
                        Voir les offres
                        <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Vue générique — par_type sans personnalisation */
          typesEntries.length > 0 && (
            <div className="space-y-2 pt-1">
              {typesEntries.slice(0, 6).map(([type, count], i) => {
                const barPct = Math.round((count / maxTypeCount) * 100);
                const totalPct = data.total_offres > 0
                  ? Math.round((count / data.total_offres) * 100)
                  : 0;
                const label = TYPE_LABELS[type] ?? type;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className="text-[11px] font-medium w-24 shrink-0 truncate">{label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", i === 0 ? "bg-primary" : "bg-primary/40")}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0 w-8 text-right">
                      {totalPct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Signal de la semaine */}
      {interp.signal && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-800/40 bg-orange-50 dark:bg-orange-950/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700 dark:text-orange-400">
              {t("trends.signal_semaine")}
            </p>
          </div>
          <p className="text-sm leading-relaxed">{interp.signal}</p>
        </div>
      )}

      {/* Action globale */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {t("trends.action_globale")}
          </p>
        </div>
        <p className="text-sm leading-relaxed">{interp.action_globale}</p>
      </div>
    </div>
  );
}
