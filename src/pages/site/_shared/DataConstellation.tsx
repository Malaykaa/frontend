import {
  Briefcase, Laptop, Handshake, GraduationCap, Target, Award, Coins,
  FileText, Lightbulb, Compass, Building2, Layers, Banknote, TrendingUp, Radar,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { RevealLines, Reveal, Eyebrow } from "./ui";
import { useScrollProgress } from "./scenes";
import { useT, type Translate } from "./lang";

/**
 * Constellation des données Malayka.
 *
 * Un réseau de nœuds disposés librement autour d'un message central. Au
 * défilement, les nœuds se posent un par un, les liaisons se dessinent vers
 * le centre, puis un flux lumineux les parcourt : le réseau se câble sous
 * les yeux du visiteur au lieu d'être affiché d'un bloc.
 *
 * La profondeur est simulée par trois plans (échelle, opacité, décalage au
 * défilement). Pas de WebGL, uniquement `transform` et `opacity`.
 */

type Node = {
  label: string;
  hint: string;
  Icon: React.ComponentType<{ className?: string }>;
  /** Position en % du cadre, centre à 50/50 */
  x: number;
  y: number;
  /** Plan de profondeur : 1 au premier plan, 3 au fond */
  depth: 1 | 2 | 3;
};

// Disposition volontairement irrégulière : aucune grille, des distances
// inégales au centre, et des tailles qui varient selon le plan.
const buildNodes = (t: Translate): Node[] => [
  { label: t("Offres d'emploi", "Job openings"), hint: t("CDI · CDD · alternance", "permanent · fixed-term · apprenticeship"), Icon: Briefcase, x: 14, y: 17, depth: 1 },
  { label: "Freelance", hint: t("missions · contrats", "assignments · contracts"), Icon: Laptop, x: 33, y: 7, depth: 2 },
  { label: t("Prestations", "Services"), hint: t("demandes clients", "client requests"), Icon: Handshake, x: 52, y: 13, depth: 3 },
  { label: t("Formations", "Training"), hint: t("certifiantes · diplômantes", "certifying · degree-awarding"), Icon: GraduationCap, x: 72, y: 8, depth: 2 },
  { label: t("Compétences", "Skills"), hint: t("niveaux · technologies", "levels · technologies"), Icon: Target, x: 88, y: 21, depth: 1 },
  { label: t("Bourses", "Scholarships"), hint: t("études · recherche", "study · research"), Icon: Award, x: 91, y: 44, depth: 3 },
  { label: t("Financements", "Funding"), hint: t("amorçage · subventions", "seed · grants"), Icon: Coins, x: 84, y: 66, depth: 2 },
  { label: t("Appels d'offres", "Tenders"), hint: t("publics · privés", "public · private"), Icon: FileText, x: 67, y: 83, depth: 3 },
  { label: t("Appels à projets", "Calls for projects"), hint: t("programmes · incubation", "programmes · incubation"), Icon: Lightbulb, x: 48, y: 91, depth: 2 },
  { label: t("Stages", "Internships"), hint: t("première expérience", "first experience"), Icon: Compass, x: 30, y: 84, depth: 3 },
  { label: t("Métiers", "Occupations"), hint: t("référentiel · évolution", "taxonomy · evolution"), Icon: Layers, x: 13, y: 68, depth: 1 },
  { label: t("Entreprises", "Companies"), hint: t("recruteurs · donneurs d'ordre", "recruiters · clients"), Icon: Building2, x: 10, y: 43, depth: 2 },
  { label: t("Secteurs", "Sectors"), hint: t("dynamiques · tensions", "momentum · shortages"), Icon: Radar, x: 25, y: 33, depth: 3 },
  { label: t("Salaires", "Pay"), hint: t("fourchettes observées", "observed ranges"), Icon: Banknote, x: 77, y: 32, depth: 3 },
  { label: t("Tendances", "Trends"), hint: t("signaux émergents", "emerging signals"), Icon: TrendingUp, x: 62, y: 69, depth: 3 },
];

const DEPTH = {
  1: { scale: 1, opacity: 1, drift: 26 },
  2: { scale: 0.93, opacity: 0.82, drift: 16 },
  3: { scale: 0.86, opacity: 0.62, drift: 8 },
} as const;

/** Le repère SVG suit le cadre : les % des nœuds s'y transposent tels quels. */
const VB = { w: 1000, h: 640 };
const toVB = (x: number, y: number) => [(x / 100) * VB.w, (y / 100) * VB.h] as const;

export function DataConstellation() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = useT();
  const NODES = buildNodes(t);
  const MESSAGE = t.lang === "en"
    ? ["Connect the data.", "Understand the present.", "Anticipate what comes."]
    : ["Connecter les données.", "Comprendre le présent.", "Anticiper l'avenir."];
  const ETAPES = t.lang === "en"
    ? ["Data", "Intelligence", "Anticipation", "Action"]
    : ["Données", "Intelligence", "Anticipation", "Action"];

  // Trois temps : les nœuds se posent, les liaisons se dessinent, le flux circule.
  const pose = Math.min(1, Math.max(0, (progress - 0.08) / 0.34));
  const cable = Math.min(1, Math.max(0, (progress - 0.26) / 0.38));
  const flux = Math.min(1, Math.max(0, (progress - 0.4) / 0.26));

  const [cx, cy] = toVB(50, 50);

  return (
    <section className="on-dark relative overflow-hidden bg-[#0a0a0a] py-28 text-foreground md:py-44">
      {/* Halo discret, qui se renforce à mesure que le réseau se câble */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.07), transparent 68%)",
          opacity: 0.35 + cable * 0.65,
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>{t("Le réseau de données", "The data network")}</Eyebrow>
            </div>
          </Reveal>
        </div>

        {/* ── Constellation (à partir de md) ── */}
        <div className="relative mt-16 hidden md:block" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
          {/* Liaisons */}
          <svg
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {NODES.map((n, i) => {
              const [nx, ny] = toVB(n.x, n.y);
              // courbure légère : la liaison n'est jamais une droite parfaite
              const mx = (nx + cx) / 2 + (i % 2 ? 26 : -26);
              const my = (ny + cy) / 2 + (i % 3 ? -18 : 18);
              const d = `M ${nx} ${ny} Q ${mx} ${my} ${cx} ${cy}`;
              // chaque liaison se dessine à son tour
              const seuil = i / NODES.length;
              const trace = Math.min(1, Math.max(0, (cable - seuil * 0.55) / 0.45));
              return (
                <g key={n.label}>
                  <path
                    d={d}
                    fill="none"
                    stroke="rgba(255,255,255,0.24)"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1 - trace}
                  />
                  {/* impulsion qui remonte vers le centre */}
                  {flux > 0 && (
                    <path
                      className="constellation-pulse"
                      d={d}
                      fill="none"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      pathLength={1}
                      strokeDasharray="0.06 0.94"
                      style={{ animationDelay: `${i * 0.36}s`, opacity: flux }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nœuds */}
          {NODES.map((n, i) => {
            const d = DEPTH[n.depth];
            const seuil = 0.06 + (i / NODES.length) * 0.75;
            const pose_i = pose > seuil;
            return (
              <article
                key={n.label}
                className="absolute w-[clamp(120px,13vw,168px)] rounded-xl border border-white/12 bg-white/[0.045] p-3.5 backdrop-blur-sm transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  // les plans lointains dérivent moins : c'est ce décalage qui fait la profondeur
                  transform: `translate(-50%, calc(-50% + ${(1 - progress) * d.drift}px)) scale(${pose_i ? d.scale : d.scale * 0.82})`,
                  opacity: pose_i ? d.opacity : 0,
                  zIndex: 4 - n.depth,
                }}
              >
                <n.Icon className="h-4 w-4 text-foreground" />
                <p className="mt-2.5 text-[12.5px] font-semibold leading-tight text-foreground">{n.label}</p>
                <p className="mt-1 font-mono text-[9.5px] uppercase leading-tight tracking-[0.08em] text-muted-foreground">
                  {n.hint}
                </p>
              </article>
            );
          })}

          {/* Message central */}
          <div
            className="absolute left-1/2 top-1/2 z-10 w-[min(440px,42%)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-[#0a0a0a]/92 p-7 text-center backdrop-blur-md transition-all duration-700"
            style={{ transform: `translate(-50%, -50%) scale(${0.94 + cable * 0.06})` }}
          >
            <RevealLines
              lines={MESSAGE}
              className="text-[clamp(17px,2vw,26px)] font-semibold leading-[1.18] tracking-[-0.02em] text-foreground"
              stagger={130}
            />
            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 transition-opacity duration-700"
              style={{ opacity: flux }}
            >
              {ETAPES.map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">{s}</span>
                  {i < 3 && <span className="text-[9px] text-white/25">→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Version mobile : le réseau devient une liste lisible ── */}
        <div className="mt-14 md:hidden">
          <RevealLines
            lines={MESSAGE}
            className="type-h3 text-center text-foreground"
            stagger={130}
          />
          <div className="mt-10 grid grid-cols-2 gap-2.5">
            {NODES.map((n, i) => (
              <div
                key={n.label}
                className="rounded-xl border border-white/12 bg-white/[0.045] p-3 transition-all duration-700"
                style={{
                  opacity: pose > i / NODES.length ? 1 : 0.15,
                  transform: pose > i / NODES.length ? "none" : "translateY(10px)",
                }}
              >
                <n.Icon className="h-3.5 w-3.5 text-foreground" />
                <p className="mt-2 text-[12px] font-semibold leading-tight text-foreground">{n.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
            {ETAPES.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">{s}</span>
                {i < 3 && <span className="text-[9px] text-white/25">→</span>}
              </span>
            ))}
          </div>
        </div>

        <Reveal delay={200}>
          <p className={cn("type-lead mx-auto mt-16 max-w-2xl text-center text-muted-foreground")}>
            Des millions de signaux dispersés sur les compétences, les formations, les opportunités et le marché du
            travail : reliés, structurés et transformés en intelligence exploitable.
          </p>
        </Reveal>
      </div>

      <style>{`
        .constellation-pulse {
          animation: constellation-pulse 3.4s linear infinite;
        }
        @keyframes constellation-pulse {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .constellation-pulse { animation: none; opacity: 0 !important; }
        }
      `}</style>
    </section>
  );
}
