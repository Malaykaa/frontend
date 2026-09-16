import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useT, type Translate } from "./lang";

/**
 * Terminal d'intelligence du capital humain.
 *
 * Seul endroit du site où la couleur est admise : ici elle porte du sens
 * (vert = progression, rouge = recul, jaune = tension) et sert la lecture
 * des données, pas la décoration.
 */

type Row = { label: string; delta: number; note?: string };

const buildSkills = (t: Translate): Row[] => [
  { label: "Power BI", delta: 24.8 },
  { label: "Python", delta: 19.6 },
  { label: t("IA appliquée", "Applied AI"), delta: 18.2 },
  { label: "SQL", delta: 14.2 },
  { label: t("Excel avancé", "Advanced Excel"), delta: 3.1 },
  { label: t("Saisie de données", "Data entry"), delta: -9.4 },
];

const buildSectors = (t: Translate): Row[] => [
  { label: t("Santé", "Healthcare"), delta: 21.3, note: "tension" },
  { label: t("BTP", "Construction"), delta: 16.8, note: "tension" },
  { label: "Agritech", delta: 12.4 },
  { label: t("Logistique", "Logistics"), delta: 8.9 },
  { label: t("Commerce", "Retail"), delta: -4.2 },
];

function deltaColor(d: number, note?: string) {
  if (note === "tension") return "text-amber-400";
  return d >= 0 ? "text-emerald-400" : "text-red-400";
}

function DeltaBar({ delta, note }: { delta: number; note?: string }) {
  const width = Math.min(Math.abs(delta) * 3.2, 100);
  const bg = note === "tension" ? "bg-amber-400" : delta >= 0 ? "bg-emerald-400" : "bg-red-400";
  return (
    <div className="hidden h-1 w-14 shrink-0 overflow-hidden rounded-full bg-white/10 sm:block">
      <div
        className={cn("h-full transition-all duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)]", bg)}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function SkillsTerminal({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setLive(true), { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!live || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setTick((n) => n + 1), 2600);
    return () => clearInterval(id);
  }, [live]);

  const updatedAt = new Date(Date.now() - (tick % 4) * 60_000);

  return (
    <div ref={ref} className={cn("on-dark w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0a0a0a]", className)}>
      {/* Barre de titre */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {t("Human Capital Intelligence · Côte d'Ivoire", "Human Capital Intelligence · Côte d'Ivoire")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-emerald-400">
            {updatedAt.toLocaleTimeString(t.lang === "en" ? "en-GB" : "fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </span>
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-2">
        {[
          { title: t("Compétences · variation 12 mois", "Skills · 12-month change"), rows: buildSkills(t) },
          { title: t("Secteurs · dynamique de recrutement", "Sectors · hiring momentum"), rows: buildSectors(t) },
        ].map((block) => (
          <div key={block.title} className="bg-[#0a0a0a] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{block.title}</p>
            <div className="mt-4 space-y-3">
              {block.rows.map((r, i) => (
                <div
                  key={r.label}
                  className="flex items-center gap-3 transition-opacity duration-700"
                  style={{ opacity: live ? 1 : 0.15, transitionDelay: `${i * 90}ms` }}
                >
                  <span className="min-w-0 flex-1 text-[13px] text-white/80">{r.label}</span>
                  {live && <DeltaBar delta={r.delta} note={r.note} />}
                  <span className={cn("w-[52px] shrink-0 text-right font-mono text-[12.5px] font-semibold tabular-nums", deltaColor(r.delta, r.note))}>
                    {r.delta > 0 ? "+" : ""}{r.delta.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Légende : la couleur a un sens */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 px-5 py-3">
        {[
          ["bg-emerald-400", t("progression", "growing")],
          ["bg-amber-400", t("tension", "under strain")],
          ["bg-red-400", t("recul", "declining")],
        ].map(([bg, label]) => (
          <span key={label} className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white/40">
            <span className={cn("h-1.5 w-1.5 rounded-full", bg)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
