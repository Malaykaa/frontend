import { Briefcase, Banknote, Laptop, FileText, GraduationCap, Globe, ArrowRight, MapPin, BarChart2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { MonPays } from "@/services/api/trends.api";
import { interpretMonPays } from "./interpretations";
import { cn } from "@/shared/lib/utils";

/** URL browse stricte par type de dimension + pays. */
function dimensionBrowseUrl(country: string, offerTypes: string, maxAge: number): string {
  const params = new URLSearchParams();
  params.set("country", country);
  params.set("offer_types", offerTypes);
  params.set("max_age", String(maxAge));
  return `/app/pour-moi?${params.toString()}`;
}

/** URL browse globale pour un pays (tous types de l'utilisateur). */
function countryBrowseUrl(country: string, data: MonPays): string {
  const params = new URLSearchParams();
  params.set("country", country);
  if (data.pour_toi_types?.length) params.set("offer_types", data.pour_toi_types.join(","));
  params.set("max_age", String(data.match_local_max_age ?? 30));
  return `/app/pour-moi?${params.toString()}`;
}

const DIMENSIONS = [
  {
    key: "emplois" as const,
    icon: Briefcase,
    labelKey: "trends.emplois",
    color: "text-blue-600",
    bg: "bg-blue-100",
    offerTypes: "job",
  },
  {
    key: "financements" as const,
    icon: Banknote,
    labelKey: "trends.financements",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    offerTypes: "grant",
  },
  {
    key: "missions" as const,
    icon: Laptop,
    labelKey: "trends.missions",
    color: "text-pink-600",
    bg: "bg-pink-100",
    offerTypes: "opportunity",
  },
  {
    key: "appels_offre" as const,
    icon: FileText,
    labelKey: "trends.appels_offre",
    color: "text-orange-600",
    bg: "bg-orange-100",
    offerTypes: "call_for_applications",
  },
  {
    key: "bourses" as const,
    icon: GraduationCap,
    labelKey: "trends.bourses",
    color: "text-violet-600",
    bg: "bg-violet-100",
    offerTypes: "scholarship,formation",
  },
] as const;

function verdictStyle(matchLocal?: number) {
  if (matchLocal === undefined) return null;
  if (matchLocal === 0)
    return {
      className: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40",
      icon: "✗",
    };
  if (matchLocal < 3)
    return {
      className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40",
      icon: "⚠",
    };
  if (matchLocal < 10)
    return {
      className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40",
      icon: "~",
    };
  return {
    className: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40",
    icon: "✓",
  };
}

interface Props {
  data: MonPays;
}

export function MonPaysSection({ data }: Props) {
  const { t } = useTranslation();

  if (!data.has_data) {
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold">{t("trends.section_mon_pays_title")}</h2>
        <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
          <Globe className="h-8 w-8 text-muted-foreground mx-auto" />
          <div>
            <p className="text-sm font-medium">{t("trends.no_data")}</p>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
              {t("trends.no_data_hint")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const interp = data.interpretation ?? interpretMonPays(data);
  const vStyle = verdictStyle(data.match_local);
  const hasAlternatives =
    data.top_alternative_countries && data.top_alternative_countries.length > 0;
  const isWeak = data.match_local !== undefined && data.match_local < 3;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-bold">{t("trends.section_mon_pays_title")}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data.pays} · {data.periode}
          </p>
        </div>
        {/* Badge verdict personnalisé */}
        {vStyle && data.verdict && (
          <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", vStyle.className)}>
            {vStyle.icon} {data.verdict}
          </span>
        )}
      </div>

      {/* Dimension cards */}
      <div className="space-y-2.5">
        {DIMENSIONS.map(({ key, icon: Icon, labelKey, color, bg, offerTypes }) => {
          const count = data[key];
          const text = interp[key];
          const maxAge = data.match_local_max_age ?? 30;

          return (
            <div key={key} className="rounded-xl border bg-card p-4">
              <div className="flex items-start gap-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", bg)}>
                  <Icon className={cn("h-[18px] w-[18px]", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {t(labelKey)}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold shrink-0 ml-2",
                        count > 0 ? `${bg} ${color}` : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{text}</p>
                  {count > 0 && (
                    <Link
                      to={dimensionBrowseUrl(data.pays, offerTypes, maxAge)}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      Voir les offres
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section pays alternatifs — si marché local faible */}
      {isWeak && hasAlternatives && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Marchés alternatifs
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Ces pays ont plus d'offres adaptées à ton profil en ce moment.
          </p>
          <div className="flex flex-col gap-2">
            {data.top_alternative_countries!.map((alt) => (
              <Link
                key={alt.pays}
                to={countryBrowseUrl(alt.pays, data)}
                className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 hover:bg-muted/60 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{alt.pays}</span>
                  <span className="rounded-full bg-primary/10 px-1.5 py-0 text-[10px] font-semibold text-primary">
                    {alt.count} offres
                  </span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  Voir <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comparaison top 5 pays — tableau interactif */}
      {data.country_comparison && data.country_comparison.length > 0 && (
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Comparaison africaine — ton profil
            </p>
          </div>
          <div className="space-y-2">
            {data.country_comparison.map((item) => {
              const maxCount = data.country_comparison![0]?.count || 1;
              const barPct = Math.round((item.count / maxCount) * 100);
              return (
                <Link
                  key={item.pays}
                  to={countryBrowseUrl(item.pays, data)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors group",
                    item.is_user_country
                      ? "bg-primary/5 border border-primary/20 hover:bg-primary/10"
                      : "hover:bg-muted/40"
                  )}
                >
                  <span
                    className={cn(
                      "text-[11px] font-medium w-20 shrink-0 truncate",
                      item.is_user_country ? "text-primary font-bold" : "text-foreground"
                    )}
                  >
                    {item.pays}
                    {item.is_user_country && (
                      <span className="ml-1 text-[9px] font-bold text-primary opacity-70">toi</span>
                    )}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.is_user_country ? "bg-primary" : "bg-primary/40"
                      )}
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0 w-12 text-right group-hover:text-primary transition-colors">
                    {item.count} offres
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bouton CTA — voir les offres dans le pays */}
      <Link
        to={countryBrowseUrl(data.pays, data)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
      >
        Voir toutes les offres — {data.pays}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
