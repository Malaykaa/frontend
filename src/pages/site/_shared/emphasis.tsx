import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { useInView } from "./ui";

/**
 * Typologie de mise en avant.
 *
 * Cinq façons de faire ressortir un mot dans une phrase. Elles ne jouent
 * jamais sur la couleur — uniquement sur la forme — pour tenir la palette
 * noir et blanc du site : un accent coloré suffirait à faire basculer une
 * page monochrome dans le décoratif.
 *
 * Toutes prennent `currentColor`, donc chacune fonctionne telle quelle sur
 * fond clair comme dans un bandeau `.on-dark`.
 *
 * Règle de lecture : le texte est lisible à tout instant, y compris avant
 * que l'animation ne se déclenche. Une mise en avant qui masque son propre
 * mot tant qu'on n'a pas scrollé est un défaut, pas un effet.
 *
 * ⚠ Où les employer. `RevealLines` enveloppe chaque ligne dans `.line-mask`,
 * qui est en `overflow: hidden` pour faire glisser la ligne depuis son
 * masque. Tout tracé qui déborde du texte y serait rogné :
 *
 *   — dans un titre `lines={...}` (RevealLines) : `Mark` et `Hatched` seuls,
 *     ils restent à l'intérieur de la boîte ;
 *   — dans un titre `title={...}`, un paragraphe ou `StatementBand` : les
 *     cinq, `Underline`, `Boxed` et `Circled` ayant besoin de déborder.
 *
 * `Mark`, `Hatched` et `Underline` sont peints en fond avec
 * `box-decoration-break: clone` : ils suivent donc le texte quand la phrase
 * passe à la ligne, et conviennent à une phrase entière. `Boxed` et
 * `Circled` gardent un tracé SVG, qui ne peut envelopper qu'une boîte d'un
 * seul tenant — ils sont donc `nowrap`, à réserver à un ou deux mots.
 */

/** Durée commune, pour que deux marques voisines ne se désynchronisent pas. */
const DUREE = 820;

/** Aplat de la couleur courante, base des blocs et des soulignements. */
const FOND = "linear-gradient(currentColor, currentColor)";

type Commun = { children: ReactNode; className?: string; delay?: number };

/* ── 1. Le bloc plein ──────────────────────────────────────────────────── */

/**
 * Texte inversé sur bloc plein — la marque la plus forte, à réserver au mot
 * qui porte la phrase.
 *
 * Le bloc est un fond que le balayage élargit ; la couleur du texte ne
 * bascule qu'à mi-parcours, lorsque le noir couvre déjà l'essentiel du mot.
 * Le mot reste donc lisible du début à la fin — jamais de blanc sur blanc.
 */
export function Mark({ children, className, delay = 0 }: Commun) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn("inline", className)}
      style={{
        backgroundImage: FOND,
        backgroundSize: `${inView ? 100 : 0}% 100%`,
        backgroundRepeat: "no-repeat",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        padding: "0.04em 0.26em",
        transition: `background-size ${DUREE}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {/* La couleur du texte est portée par un enfant, jamais par le parent :
          `currentColor` sert ici à peindre le bloc, et inverser la couleur du
          parent peindrait le bloc en blanc — le mot disparaîtrait sur le fond
          clair. Elle bascule à mi-balayage, quand le noir couvre déjà
          l'essentiel du mot, pour qu'il reste lisible du début à la fin. */}
      <span
        style={{
          color: inView ? "hsl(var(--background))" : undefined,
          transition: `color 180ms linear ${delay + DUREE * 0.5}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ── 2. Les soulignements ──────────────────────────────────────────────── */

/**
 * Soulignement qui se tire de gauche à droite.
 *
 * Il est dessiné en fond (`background-image`) et non en SVG positionné :
 * c'est ce qui lui permet de suivre le texte quand la phrase passe à la
 * ligne. Avec un calque absolu, une phrase qui se coupe en trois laissait
 * trois fragments de trait flottant au milieu du titre.
 *
 * `box-decoration-break: clone` donne son propre trait à chaque fragment
 * de ligne, au lieu d'un seul trait étiré sur toute la boîte.
 *
 * `trait` souligne d'un filet, `double` de deux — comme une relecture —,
 * `epais` d'une barre large, façon marqueur.
 */
export function Underline({
  children,
  className,
  delay = 0,
  variante = "trait",
}: Commun & { variante?: "trait" | "double" | "epais" }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const tire = inView ? 100 : 0;

  // Le remplissage d'un élément en ligne déborde sur la ligne suivante au
  // lieu d'écarter les lignes. Dans un titre à interlignage serré, un trait
  // épais posé sous le texte vient donc barrer la ligne d'en dessous : les
  // valeurs restent volontairement basses.
  const fonds: Record<string, React.CSSProperties> = {
    trait: {
      backgroundImage: FOND,
      backgroundSize: `${tire}% 0.07em`,
      backgroundPosition: "0 100%",
    },
    double: {
      backgroundImage: `${FOND}, ${FOND}`,
      backgroundSize: `${tire}% 0.05em, ${tire}% 0.05em`,
      backgroundPosition: "0 100%, 0 calc(100% - 0.13em)",
    },
    epais: {
      backgroundImage: FOND,
      backgroundSize: `${tire}% 0.14em`,
      backgroundPosition: "0 100%",
    },
  };

  return (
    <span
      ref={ref}
      className={cn("inline", className)}
      style={{
        ...fonds[variante],
        backgroundRepeat: "no-repeat",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        paddingBottom: "0.05em",
        transition: `background-size ${DUREE}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}

/* ── 3. L'encadré ──────────────────────────────────────────────────────── */

/**
 * Cadre tracé autour du mot, très légèrement de travers — l'inclinaison
 * suffit à le faire lire comme une annotation à la main plutôt que comme
 * une bordure CSS.
 */
export function Boxed({ children, className, delay = 0 }: Commun) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn("relative inline-block whitespace-nowrap", className)}
      style={{ transform: "rotate(-0.7deg)" }}
    >
      <span className="relative px-[0.34em] py-[0.06em]">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          d="M2 4 C 26 1.5, 72 1.5, 98 4 C 99 14, 99 27, 98 36 C 72 38.5, 26 38.5, 2 36 C 1 27, 1 14, 2 4 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={inView ? 0 : 1}
          style={{
            transition: `stroke-dashoffset ${DUREE + 260}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
}

/* ── 4. Les hachures ───────────────────────────────────────────────────── */

/**
 * Trame diagonale derrière le mot. Plus discrète que le bloc plein : elle
 * signale sans couper la ligne de lecture.
 */
export function Hatched({ children, className, delay = 0 }: Commun) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn("inline", className)}
      style={{
        // La trame est teintée dans le dégradé lui-même (`color-mix`) et non
        // par une opacité sur l'élément : une opacité globale ferait pâlir
        // le mot en même temps que ses hachures.
        backgroundImage:
          "repeating-linear-gradient(-52deg, color-mix(in srgb, currentColor 24%, transparent) 0 1.5px, transparent 1.5px 6px)",
        backgroundSize: `${inView ? 100 : 0}% 100%`,
        backgroundRepeat: "no-repeat",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        padding: "0.02em 0.18em",
        transition: `background-size ${DUREE}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}

/* ── 5. L'entourage ────────────────────────────────────────────────────── */

/**
 * Ellipse tracée autour du mot, façon cercle au stylo. Le tracé déborde
 * volontairement et ne se referme pas tout à fait : c'est ce défaut qui
 * donne le geste manuel.
 */
export function Circled({ children, className, delay = 0 }: Commun) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap", className)}>
      <span className="relative px-[0.3em]">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 44"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-[-0.24em] h-[1.52em] w-full overflow-visible"
      >
        <path
          d="M78 5 C 52 0.5, 18 1.5, 6 11 C -3 19, 8 33, 34 38 C 62 43, 95 39, 98 26 C 100 16, 88 8, 66 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={inView ? 0 : 1}
          style={{
            transition: `stroke-dashoffset ${DUREE + 380}ms cubic-bezier(0.33,1,0.5,1) ${delay}ms`,
          }}
        />
      </svg>
    </span>
  );
}

/* ── Le bandeau d'énoncé ───────────────────────────────────────────────── */

/**
 * Bloc noir pleine largeur portant une phrase courte en très grand. Sert
 * les rares affirmations qu'on veut voir avant de lire le reste — pas un
 * conteneur de contenu, une ponctuation dans la page.
 */
export function StatementBand({
  eyebrow,
  children,
  footer,
}: {
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section className="on-dark relative overflow-hidden bg-[#0a0a0a] py-24 text-foreground md:py-32">
      {/* Trame très faible : donne une matière au noir sans le colorer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-52deg, #fff 0 1px, transparent 1px 9px)",
        }}
      />
      <div ref={ref} className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {eyebrow && (
          <p
            className="font-mono type-label font-semibold text-foreground/45 transition-opacity duration-700"
            style={{ opacity: inView ? 1 : 0 }}
          >
            {eyebrow}
          </p>
        )}
        <p
          className={cn(
            "font-display max-w-4xl text-[clamp(2rem,4.6vw,4.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]",
            eyebrow && "mt-8",
          )}
        >
          {children}
        </p>
        {footer && (
          <div
            className="mt-10 max-w-2xl text-[15px] leading-relaxed text-muted-foreground transition-opacity duration-700"
            style={{ opacity: inView ? 1 : 0, transitionDelay: "420ms" }}
          >
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
