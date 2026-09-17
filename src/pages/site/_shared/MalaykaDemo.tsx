import { useEffect, useRef, useState } from "react";
import { Check, Search, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useT, type Translate } from "./lang";

/**
 * Démonstration de Malayka IA en trois temps : la demande de l'utilisateur,
 * l'analyse du profil, puis le résultat du matching. La séquence se déclenche
 * à l'entrée dans le viewport et boucle, pour donner à voir un produit qui
 * travaille au lieu de le décrire.
 */

const buildAnalysis = (t: Translate) => [
  { label: t("Profil", "Profile"), value: t("Data · 2 ans d'expérience", "Data · 2 years' experience") },
  { label: t("Compétences", "Skills"), value: "Python · SQL · Excel" },
  { label: t("Localisation", "Location"), value: t("Abidjan, Côte d'Ivoire", "Abidjan, Côte d'Ivoire") },
  { label: t("Objectif", "Goal"), value: t("Premier poste en data", "First role in data") },
];

const buildMatches = (t: Translate) => [
  { role: "Data Analyst", org: t("Abidjan · CDI", "Abidjan · permanent"), score: 92 },
  { role: t("Analyste BI junior", "Junior BI analyst"), org: t("Abidjan · CDD", "Abidjan · fixed-term"), score: 84 },
  { role: t("Stage Data", "Data internship"), org: "Grand-Bassam", score: 78 },
];

const STEP_COUNT = 9;

export function MalaykaDemo({ className }: { className?: string }) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  const ANALYSIS = buildAnalysis(t);
  const MATCHES = buildMatches(t);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(STEP_COUNT);
      return;
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) {
        timer = setInterval(() => setStep((s) => (s >= STEP_COUNT ? 0 : s + 1)), 950);
      } else if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => { obs.disconnect(); if (timer) clearInterval(timer); };
  }, []);

  const shown = (n: number) => step >= n;

  return (
    <div ref={ref} className={cn("w-full max-w-lg", className)}>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_70px_-40px_rgba(0,0,0,0.45)]">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Malayka IA
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">Session</span>
          </span>
        </div>

        <div className="space-y-4 p-5">
          {/* 1. la demande */}
          <div
            className={cn(
              "flex justify-end transition-all duration-700",
              shown(1) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-foreground px-4 py-2.5 text-[13.5px] leading-snug text-background">
              {t(
                "Je cherche un emploi en data en Côte d'Ivoire.",
                "I'm looking for a data job in Côte d'Ivoire.",
              )}
            </p>
          </div>

          {/* 2. analyse */}
          <div
            className={cn(
              "transition-all duration-700",
              shown(2) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Search className="h-3 w-3" />
              {t("Analyse du profil", "Profile analysis")}
            </p>
            <div className="mt-3 space-y-px overflow-hidden rounded-xl border border-border">
              {ANALYSIS.map((a, i) => (
                <div
                  key={a.label}
                  className={cn(
                    "flex items-center justify-between bg-muted/60 px-3.5 py-2.5 transition-all duration-500",
                    shown(3 + i) ? "opacity-100" : "opacity-25",
                  )}
                >
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
                    {a.label}
                  </span>
                  <span className="flex items-center gap-2 text-[12.5px] font-medium">
                    {a.value}
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 transition-opacity duration-500",
                        shown(3 + i) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. matching */}
          <div
            className={cn(
              "transition-all duration-700",
              shown(7) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {t("3 opportunités retenues · score de matching", "3 opportunities shortlisted · match score")}
            </p>
            <div className="mt-3 space-y-2">
              {MATCHES.map((m, i) => (
                <div
                  key={m.role}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border border-border px-4 py-3 transition-all duration-700",
                    shown(7 + Math.min(i, 2)) ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold">{m.role}</p>
                    <p className="truncate text-[11.5px] text-muted-foreground">{m.org}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[15px] font-semibold tabular-nums">{m.score}%</p>
                    <div className="mt-1 h-0.5 w-14 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-foreground transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: shown(8) ? `${m.score}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. recommandation */}
          <div
            className={cn(
              "rounded-xl bg-muted px-4 py-3.5 transition-all duration-700",
              shown(9) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            <p className="text-[12.5px] leading-relaxed">
              <span className="font-semibold">
                {t("Écart identifié : Power BI.", "Gap identified: Power BI.")}
              </span>{" "}
              <span className="text-muted-foreground">
                {t(
                  "Deux formations certifiantes recommandées, puis envoi des offres sur WhatsApp.",
                  "Two certifying courses recommended, then the openings are sent over WhatsApp.",
                )}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
