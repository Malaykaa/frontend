import type { SiteImage } from "./media";
import { light } from "./media";
import { Eyebrow, Reveal, RevealLines, Section, SitePhoto } from "./ui";
import { useScrollProgress } from "./scenes";

/**
 * Les deux énoncés de tête du site.
 *
 * Ce ne sont pas des sections de contenu mais des prises de position : elles
 * disent ce que fait Malayka avant d'expliquer comment. Elles ont donc droit
 * à la plus grande typographie du site et à une mise en scène propre, mais
 * restent sur fond clair, le noir étant réservé aux bannières.
 *
 * Chacune porte son propre scénario, pour qu'on ne lise pas deux fois la
 * même page : l'une écarte la matière, l'autre la dresse.
 */

/** Interpolation linéaire, bornée par la progression du défilement. */
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/* ── A. Façonner : trois visuels serrés au centre qui s'écartent ───────── */

/**
 * Les trois photos démarrent superposées et légèrement pivotées, puis
 * s'écartent en diagonale à mesure qu'on descend : la matière brute se sépare
 * et se met en ordre. C'est le geste que décrit la phrase : façonner.
 */
export function ShapingManifesto({
  eyebrow,
  lines,
  lead,
  items,
}: {
  eyebrow: string;
  lines: string[];
  lead: string;
  /** Trois visuels, chacun avec sa légende courte. */
  items: { image: SiteImage; label: string; caption: string }[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  // L'écartement ne commence qu'une fois le titre lu.
  const t = Math.min(1, Math.max(0, (progress - 0.18) / 0.44));

  /**
   * Chaque visuel part serré vers le centre et rejoint sa colonne. Le décalage
   * de départ est exprimé en pourcentage de la largeur du visuel lui-même :
   * la composition tient donc à toutes les largeurs d'écran.
   *
   * Les colonnes sont une vraie grille, pas un positionnement absolu dans un
   * cadre à ratio fixe : c'est ce qui garantit qu'aucune légende ne passe sous
   * le visuel voisin, quelle que soit la longueur du texte.
   */
  const depart = [
    { dx: 86, dy: 54, rot: -7, decalage: "" },
    { dx: 0, dy: -18, rot: 4, decalage: "mt-24" },
    { dx: -88, dy: -62, rot: 7, decalage: "mt-48" },
  ];

  return (
    <Section size="large">
      <div ref={ref}>
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines
            lines={lines}
            className="type-display mt-8 text-foreground"
            stagger={140}
          />
          <Reveal delay={260}>
            <p className="type-lead mt-9 max-w-2xl text-muted-foreground">{lead}</p>
          </Reveal>
        </div>

        {/* ── Composition (à partir de md) ── */}
        <div className="mt-24 hidden grid-cols-3 items-start gap-8 md:grid">
          {items.slice(0, 3).map((item, i) => {
            const d = depart[i];
            const reste = 1 - t;
            return (
              <figure
                key={item.image.src}
                className={d.decalage}
                style={{
                  transform: `translate(${d.dx * reste}%, ${d.dy * reste}px) rotate(${d.rot * reste}deg) scale(${lerp(0.84, 1, t)})`,
                  // en partant, les visuels se chevauchent : celui de gauche devant
                  zIndex: 3 - i,
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)]">
                  <SitePhoto
                    image={light(item.image)}
                    className="aspect-[4/5] w-full object-cover grayscale"
                  />
                </div>
                <figcaption
                  className="mt-4 transition-opacity duration-700"
                  style={{ opacity: Math.max(0, (t - 0.5) / 0.4) }}
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                    {item.label}
                  </span>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{item.caption}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* ── Mobile : la diagonale devient une colonne décalée ── */}
        <div className="mt-16 space-y-10 md:hidden">
          {items.slice(0, 3).map((item, i) => (
            <Reveal key={item.image.src} delay={i * 110}>
              <figure className={i === 1 ? "ml-8" : i === 2 ? "ml-16" : ""}>
                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  <SitePhoto
                    image={light(item.image)}
                    className="aspect-[4/5] w-full object-cover grayscale"
                  />
                </div>
                <figcaption className="mt-3.5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                    {item.label}
                  </span>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{item.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ── B. Construire : trois colonnes qui se dressent sur une ligne ──────── */

/**
 * Les trois visuels montent depuis une ligne de sol à des hauteurs inégales,
 * comme une infrastructure qu'on érige travée par travée. La ligne se trace
 * d'abord, les colonnes se lèvent ensuite.
 */
export function InfrastructureStatement({
  eyebrow,
  lines,
  lead,
  pillars,
}: {
  eyebrow: string;
  lines: string[];
  lead: string;
  /** Trois piliers, du plus amont au plus aval. */
  pillars: { image: SiteImage; label: string; caption: string }[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const sol = Math.min(1, Math.max(0, (progress - 0.14) / 0.22));
  const levee = Math.min(1, Math.max(0, (progress - 0.24) / 0.46));

  // Travées de hauteurs inégales : une skyline, pas un histogramme.
  const hauteurs = ["h-[15rem] lg:h-[19rem]", "h-[21rem] lg:h-[27rem]", "h-[17rem] lg:h-[22rem]"];

  return (
    <Section tone="muted" size="large">
      <div ref={ref}>
        <div className="max-w-4xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines
            lines={lines}
            className="type-display mt-8 text-foreground"
            stagger={140}
          />
          <Reveal delay={260}>
            <p className="type-lead mt-9 max-w-2xl text-muted-foreground">{lead}</p>
          </Reveal>
        </div>

        <div className="mt-24">
          <div className="grid grid-cols-1 items-end gap-8 sm:grid-cols-3 sm:gap-6">
            {pillars.slice(0, 3).map((pillar, i) => {
              // Chaque travée se lève à son tour, de la gauche vers la droite.
              const t = Math.min(1, Math.max(0, (levee - i * 0.16) / 0.6));
              return (
                <figure key={pillar.image.src}>
                  <div
                    className={`overflow-hidden rounded-t-2xl border border-b-0 border-border bg-muted ${hauteurs[i]}`}
                  >
                    <SitePhoto
                      image={light(pillar.image)}
                      className="h-full w-full object-cover grayscale transition-transform duration-300 ease-out"
                      style={{ transform: `translateY(${(1 - t) * 100}%)` }}
                    />
                  </div>
                </figure>
              );
            })}
          </div>

          {/* Ligne de sol : elle se trace avant que les travées ne montent. */}
          <div
            className="h-px origin-left bg-foreground/25"
            style={{ transform: `scaleX(${sol})` }}
          />

          <div className="mt-7 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
            {pillars.slice(0, 3).map((pillar, i) => (
              <div
                key={pillar.label}
                className="transition-opacity duration-700"
                style={{ opacity: Math.max(0, (levee - i * 0.16 - 0.25) / 0.4) }}
              >
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/45">
                  {String(i + 1).padStart(2, "0")} · {pillar.label}
                </span>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{pillar.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
