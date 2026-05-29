import { ArrowUpRight, ArrowDownRight, Minus, Lightbulb, Zap, ExternalLink, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { WeekAfrica } from "@/services/api/trends.api";
import { interpretWeekTendance } from "./interpretations";
import { cn } from "@/shared/lib/utils";

const TYPE_COLORS: Record<string, { badge: string; dot: string }> = {
  job:                   { badge: "bg-blue-100 text-blue-700",       dot: "bg-blue-500" },
  opportunity:           { badge: "bg-sky-100 text-sky-700",         dot: "bg-sky-500" },
  scholarship:           { badge: "bg-violet-100 text-violet-700",   dot: "bg-violet-500" },
  grant:                 { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  partnership:           { badge: "bg-teal-100 text-teal-700",       dot: "bg-teal-500" },
  call_for_applications: { badge: "bg-orange-100 text-orange-700",   dot: "bg-orange-500" },
  formation:             { badge: "bg-amber-100 text-amber-700",     dot: "bg-amber-500" },
  resource:              { badge: "bg-pink-100 text-pink-700",       dot: "bg-pink-500" },
};

const TYPE_LABELS_SHORT: Record<string, string> = {
  job:                   "Emploi",
  opportunity:           "Opportunité",
  scholarship:           "Bourse",
  grant:                 "Financement",
  call_for_applications: "Appel à cand.",
  formation:             "Formation",
  partnership:           "Partenariat",
  resource:              "Ressource",
};

function VariationBadge({ pct }: { pct: number }) {
  if (pct > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
        <ArrowUpRight className="h-3 w-3" />+{pct}%
      </span>
    );
  if (pct < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-500">
        <ArrowDownRight className="h-3 w-3" />{pct}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
      <Minus className="h-3 w-3" />stable
    </span>
  );
}

interface Props {
  data: WeekAfrica;
}

export function SemaineAfriqueSection({ data }: Props) {
  const { t } = useTranslation();
  const tendances = data.tendances.slice(0, 3);
  const hasPersonalized = data.offres_pour_toi !== undefined;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold">{t("trends.section_semaine_title")}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{data.periode}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {data.total_offres} {t("trends.offres")}
          </span>
          {hasPersonalized && (
            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {data.offres_pour_toi} pour toi
            </span>
          )}
        </div>
      </div>

      {/* Top pays chips */}
      {data.top_pays.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.top_pays.slice(0, 5).map((p) => (
            <span
              key={p.pays}
              className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium"
            >
              {p.pays}{" "}
              <span className="text-muted-foreground">· {p.count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Tendances */}
      {tendances.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("trends.no_data")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tendances.map((tendance) => {
            const interp = tendance.interpretation ?? interpretWeekTendance(tendance, data.top_pays);
            const colors =
              TYPE_COLORS[tendance.type] ?? {
                badge: "bg-muted text-muted-foreground",
                dot:   "bg-muted-foreground",
              };

            return (
              <div key={tendance.type} className="rounded-xl border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide", colors.badge)}>
                      {tendance.label}
                    </span>
                    <span className="text-sm font-bold shrink-0">{tendance.count} offres</span>
                  </div>
                  <VariationBadge pct={tendance.variation_pct} />
                </div>

                <div className="px-4 py-3 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {t("trends.ce_qui_se_passe")}
                    </p>
                    <p className="text-sm leading-relaxed">{interp.ce_qui_se_passe}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/10 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                          {t("trends.signification")}
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/80">{interp.signification}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3 py-2.5">
                    <div className="flex items-start gap-2">
                      <Zap className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
                          {t("trends.action")}
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/80">{interp.action}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offres matchées — top 3 liens directs */}
      {data.top_matched && data.top_matched.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Offres pour ton profil
          </p>
          {data.top_matched.map((offer) => {
            const colors = TYPE_COLORS[offer.type] ?? { badge: "bg-muted text-muted-foreground", dot: "" };
            return (
              <a
                key={offer.id}
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-snug">{offer.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn("rounded-full px-1.5 py-0 text-[10px] font-semibold", colors.badge)}>
                      {TYPE_LABELS_SHORT[offer.type] ?? offer.type}
                    </span>
                    {offer.location && (
                      <span className="text-[11px] text-muted-foreground truncate">{offer.location}</span>
                    )}
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            );
          })}
        </div>
      )}

      {/* CTA principal */}
      {hasPersonalized && (data.offres_pour_toi ?? 0) > 0 && (
        <Link
          to={
            data.pour_toi_types?.length
              ? `/app/pour-moi?offer_types=${encodeURIComponent(data.pour_toi_types.join(","))}&max_age=${data.pour_toi_max_age ?? 7}`
              : "/app/pour-moi"
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          Voir toutes les {data.offres_pour_toi} offres pour toi
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
