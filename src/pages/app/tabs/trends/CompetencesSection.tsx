import { useState } from "react";
import { ChevronDown, ChevronRight, TrendingUp, CheckCircle2, XCircle, BookOpen, ExternalLink, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Competence } from "@/services/api/trends.api";
import { interpretCompetence } from "./interpretations";
import { cn } from "@/shared/lib/utils";

// ── Barre de progression readiness ───────────────────────────────────────────

function ReadinessBar({ data }: { data: Competence[] }) {
  const personalized = data.filter((c) => c.user_has !== undefined);
  if (personalized.length === 0) return null;

  const acquired = personalized.filter((c) => c.user_has).length;
  const total = personalized.length;
  const pct = Math.round((acquired / total) * 100);

  const barColor =
    pct >= 70 ? "bg-emerald-500" :
    pct >= 40 ? "bg-yellow-500" :
                "bg-amber-500";

  const label =
    pct >= 70 ? "Bonne maîtrise" :
    pct >= 40 ? "En progression" :
                "Compétences à renforcer";

  return (
    <div className="rounded-xl border bg-card p-4 space-y-2.5">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Score de préparation
        </p>
        <span className={cn(
          "ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold",
          pct >= 70 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" :
          pct >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        )}>
          {label}
        </span>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">
            Tu maîtrises <strong>{acquired}</strong> compétence{acquired > 1 ? "s" : ""} sur <strong>{total}</strong> détectées
          </span>
          <span className="font-bold">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Card compétence ───────────────────────────────────────────────────────────

function CompetenceCard({ c }: { c: Competence }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const interp = c.interpretation ?? interpretCompetence(c);
  const barWidth = Math.min(100, c.pct_offres);
  const isHot = c.variation_pts > 5;
  const hasPersonalized = c.user_has !== undefined;

  // Formation URL — préfère la source scrapée, sinon fallback curé, sinon Coursera search
  const formationUrl =
    c.formation_url ??
    `https://www.coursera.org/search?query=${encodeURIComponent(c.competence)}`;
  const formationLabel = c.formation_title
    ? `${c.formation_title}${c.formation_platform ? ` — ${c.formation_platform}` : ""}`
    : `Se former sur Coursera`;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          {/* Nom + badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold text-sm truncate">{c.competence}</span>
            {isHot && (
              <span className="flex items-center gap-0.5 rounded-full bg-orange-100 text-orange-600 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                <TrendingUp className="h-2.5 w-2.5" />
                +{c.variation_pts}pts
              </span>
            )}
            {hasPersonalized && c.user_has && (
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Tu l'as
              </span>
            )}
            {hasPersonalized && !c.user_has && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                <XCircle className="h-2.5 w-2.5" />
                À acquérir
              </span>
            )}
          </div>
          {/* Barre de fréquence */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground shrink-0">
              {c.pct_offres}% des offres
            </span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full shrink-0 transition-colors",
            open ? "bg-primary/10" : "bg-muted"
          )}
        >
          {open ? (
            <ChevronDown className="h-3 w-3 text-primary" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t px-4 py-3 space-y-3 bg-muted/10">
          {/* Pourquoi */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {t("trends.pourquoi")}
            </p>
            <p className="text-xs leading-relaxed">{interp.pourquoi}</p>
          </div>

          {/* Si tu as / si tu n'as pas */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2.5">
              <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                ✓ {t("trends.si_tu_as")}
              </p>
              <p className="text-[11px] leading-snug">{interp.si_tu_as}</p>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-2.5">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mb-1">
                → {t("trends.si_tu_nas_pas")}
              </p>
              <p className="text-[11px] leading-snug">{interp.si_tu_nas_pas}</p>
            </div>
          </div>

          {/* Boutons d'action personnalisés */}
          {hasPersonalized && (
            <div className="flex flex-col gap-2 pt-1">
              {c.user_has ? (
                /* Compétence acquise — offres disponibles */
                (c.offres_debloquees ?? 0) > 0 && (
                  <Link
                    to={`/app/pour-moi?skill=${encodeURIComponent(c.skill_keyword ?? c.competence)}&max_age=${c.unlock_max_age ?? 30}`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Voir les {c.offres_debloquees} offres disponibles
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )
              ) : (
                /* Compétence manquante — se former + débloquer */
                <>
                  <a
                    href={formationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/10 transition-colors"
                    title={formationLabel}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {c.formation_title
                        ? `${c.formation_title.slice(0, 40)}${c.formation_title.length > 40 ? "…" : ""}`
                        : "Se former sur Coursera"}
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-60 shrink-0" />
                  </a>
                  {(c.offres_debloquees ?? 0) > 0 && (
                    <Link
                      to={`/app/pour-moi?skill=${encodeURIComponent(c.skill_keyword ?? c.competence)}&max_age=${c.unlock_max_age ?? 30}`}
                      className="flex items-center justify-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Voir ce que ça débloque ({c.offres_debloquees} offres)
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section principale ────────────────────────────────────────────────────────

interface Props {
  data: Competence[];
}

export function CompetencesSection({ data }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold">{t("trends.section_competences_title")}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("trends.section_competences_subtitle")}
        </p>
      </div>

      {/* Score de préparation — visible si profil renseigné */}
      <ReadinessBar data={data} />

      {data.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("trends.no_data")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((c) => (
            <CompetenceCard key={c.competence} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
