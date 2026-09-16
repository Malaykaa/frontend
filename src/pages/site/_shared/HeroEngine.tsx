import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useT, type Translate } from "./lang";

const buildSources = (t: Translate) => [
  t("Offres", "Openings"), t("Formations", "Training"), t("Compétences", "Skills"),
  t("Métiers", "Occupations"), t("Bourses", "Scholarships"), t("Financements", "Funding"),
  t("Missions", "Assignments"), "Telegram",
];

const buildStages = (t: Translate) => [
  { label: t("Structuration", "Structuring"), hint: t("normalisation · déduplication", "normalisation · deduplication") },
  { label: t("Annotation", "Annotation"), hint: t("experts · taxonomie · contexte", "experts · taxonomy · context") },
  { label: "Intelligence", hint: t("matching · tendances · alertes", "matching · trends · alerts") },
];

/**
 * Simulation du moteur Malayka : les signaux arrivent, sont absorbés, puis
 * ressortent structurés. Le compteur et la source active avancent en continu
 * pour donner à voir un traitement qui ne s'arrête jamais.
 */
export function HeroEngine({ className }: { className?: string }) {
  const t = useT();
  const SOURCES = buildSources(t);
  const STAGES = buildStages(t);
  const [activeSource, setActiveSource] = useState(0);
  const [processed, setProcessed] = useState(128_400);
  const [stage, setStage] = useState(0);

  // Les libellés changent avec la langue, pas leur nombre : on ne dépend que
  // de la longueur, sinon les minuteries repartiraient à chaque rendu.
  const nbSources = SOURCES.length;
  const nbStages = STAGES.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = setInterval(() => setActiveSource((i) => (i + 1) % nbSources), 900);
    const c = setInterval(() => setProcessed((n) => n + Math.floor(Math.random() * 7) + 2), 700);
    const g = setInterval(() => setStage((i) => (i + 1) % nbStages), 2400);
    return () => { clearInterval(s); clearInterval(c); clearInterval(g); };
  }, [nbSources, nbStages]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl">
        <span className="scanline pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {t("Flux entrant", "Incoming stream")}
          </span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
              {t("En continu", "Continuous")}
            </span>
          </span>
        </div>

        {/* Les sources s'allument à tour de rôle, comme un balayage */}
        <div className="flex flex-wrap gap-1.5 px-6 pb-5 pt-5">
          {SOURCES.map((source, i) => (
            <span
              key={source}
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-[10px] transition-all duration-500",
                i === activeSource ? "border-white/70 bg-white text-black" : "border-white/12 text-white/45",
              )}
            >
              {source}
            </span>
          ))}
        </div>

        <div className="border-y border-white/10 px-6 py-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            {t("Données structurées aujourd'hui", "Records structured today")}
          </p>
          <p className="font-display mt-2 text-3xl font-semibold tabular-nums text-white">
            {processed.toLocaleString(t.lang === "en" ? "en-GB" : "fr-FR")}
          </p>
          <div className="mt-4 h-px w-full bg-white/10">
            <div
              className="h-px bg-white/60 transition-all duration-700"
              style={{ width: `${38 + ((processed % 60) / 60) * 54}%` }}
            />
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {STAGES.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex items-center justify-between px-6 py-4 transition-colors duration-700",
                i === stage && "bg-white/[0.07]",
              )}
            >
              <div>
                <p
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-700",
                    i === stage ? "text-white" : "text-white/45",
                  )}
                >
                  {s.label}
                </p>
                <p className="mt-1 text-[11px] text-white/35">{s.hint}</p>
              </div>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-700",
                  i === stage ? "scale-125 bg-white" : "bg-white/25",
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scanline { animation: scanline 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes scanline {
          0%   { transform: translateY(0);     opacity: 0; }
          12%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateY(430px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .scanline { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
