import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteImage } from "./media";
import { light } from "./media";
import { RevealLines, Reveal, Eyebrow, Section, SitePhoto, CountUp } from "./ui";
import { useT } from "./lang";

/**
 * Scénarios de défilement.
 *
 * Chaque composant met en scène une idée différente : des blocs qui se
 * superposent, une bande qui défile latéralement pendant qu'un titre reste
 * fixe, des photos qui se rapprochent, une interface qui se construit.
 * Tous reposent sur `transform` et `opacity` uniquement, et s'effacent
 * sous `prefers-reduced-motion`.
 */

/** Progression de 0 à 1 pendant la traversée de l'élément par le viewport. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const total = r.height + window.innerHeight;
        setP(Math.max(0, Math.min(1, (window.innerHeight - r.top) / total)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress: p };
}

/* ── Scénario : trois photos qui se rapprochent puis s'alignent ───────── */

export function ConvergingPhotos({
  images,
  eyebrow,
  lines,
  lead,
}: {
  images: [SiteImage, SiteImage, SiteImage];
  eyebrow: string;
  lines: ReactNode[];
  lead?: string;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  // les photos partent écartées et en biais, puis se resserrent
  const t = Math.min(1, Math.max(0, (progress - 0.15) / 0.5));
  const spread = (1 - t) * 90;
  const tilt = (1 - t) * 7;

  return (
    <Section size="large">
      <div ref={ref}>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-8" />
          {lead && (
            <Reveal delay={200}>
              <p className="type-lead mx-auto mt-8 max-w-xl text-muted-foreground">{lead}</p>
            </Reveal>
          )}
        </div>

        <div className="mt-24 flex items-center justify-center gap-4 sm:gap-6">
          {images.map((img, i) => {
            const dir = i === 0 ? -1 : i === 2 ? 1 : 0;
            return (
              <div
                key={img.src}
                className="w-1/3 max-w-[300px] overflow-hidden rounded-2xl border border-border"
                style={{
                  transform: `translateX(${dir * spread}px) translateY(${i === 1 ? -t * 24 : 0}px) rotate(${dir * tilt}deg) scale(${0.9 + t * 0.1})`,
                  opacity: 0.25 + t * 0.75,
                  transition: "opacity 0.4s linear",
                  zIndex: i === 1 ? 2 : 1,
                }}
              >
                <div style={{ aspectRatio: i === 1 ? "3/4" : "4/5" }}>
                  <SitePhoto image={light(img)} className="h-full w-full object-cover grayscale" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : titre fixe, bande de cartes qui défile latéralement ───── */

export function PinnedGallery({
  eyebrow,
  lines,
  items,
}: {
  eyebrow: string;
  lines: ReactNode[];
  items: { image: SiteImage; label: string; note?: string }[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  // la bande traverse l'écran pendant que la section reste épinglée
  const shift = -(progress * 0.9 - 0.1) * (items.length * 150);

  return (
    <div ref={ref} className="relative" style={{ height: `${Math.max(2, items.length * 0.5)}00vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Eyebrow>{eyebrow}</Eyebrow>
          <RevealLines lines={lines} className="type-h2 mt-7 max-w-2xl" />
        </div>

        <div className="mt-14 w-full overflow-hidden">
          <div
            className="flex gap-6 px-5 sm:px-8"
            style={{ transform: `translateX(${Math.min(0, shift)}px)`, willChange: "transform" }}
          >
            {items.map((it) => (
              <figure key={it.image.src} className="w-[76vw] shrink-0 sm:w-[42vw] lg:w-[27vw]">
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div style={{ aspectRatio: "4/3" }}>
                    <SitePhoto image={light(it.image)} className="h-full w-full object-cover grayscale" />
                  </div>
                </div>
                <figcaption className="mt-5">
                  <p className="font-display text-lg font-semibold">{it.label}</p>
                  {it.note && <p className="mt-1.5 text-sm text-muted-foreground">{it.note}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Scénario : deux blocs qui se rejoignent, l'un du bas, l'autre du haut ── */

export function JoiningBlocks({
  eyebrow,
  lines,
  top,
  bottom,
  image,
}: {
  eyebrow: string;
  lines: ReactNode[];
  top: { title: string; desc: string };
  bottom: { title: string; desc: string };
  image: SiteImage;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (progress - 0.2) / 0.45));
  const gap = (1 - t) * 120;

  return (
    <Section size="large">
      <div ref={ref} className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-7" />

          <div className="mt-14 space-y-4">
            <div
              className="rounded-2xl border border-border bg-card p-7"
              style={{ transform: `translateY(${-gap}px)`, opacity: 0.3 + t * 0.7 }}
            >
              <p className="font-display text-lg font-semibold">{top.title}</p>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">{top.desc}</p>
            </div>
            <div
              className="rounded-2xl border border-border bg-card p-7"
              style={{ transform: `translateY(${gap}px)`, opacity: 0.3 + t * 0.7 }}
            >
              <p className="font-display text-lg font-semibold">{bottom.title}</p>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">{bottom.desc}</p>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-border"
          style={{ transform: `scale(${0.92 + t * 0.08})` }}
        >
          <div style={{ aspectRatio: "4/5" }}>
            <SitePhoto image={light(image)} className="h-full w-full object-cover grayscale" />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : grande photo qui se réduit, informations autour ───────── */

export function ShrinkingPhoto({
  image,
  eyebrow,
  lines,
  facts,
}: {
  image: SiteImage;
  eyebrow: string;
  lines: ReactNode[];
  facts: { label: string; value: string }[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (progress - 0.1) / 0.55));

  return (
    <Section size="large">
      <div ref={ref}>
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-8" />
        </div>

        <div className="relative mt-20">
          <div
            className="mx-auto overflow-hidden rounded-2xl border border-border"
            style={{ width: `${100 - t * 32}%`, maxWidth: 1100 }}
          >
            <div style={{ aspectRatio: "16/9" }}>
              <SitePhoto image={image} className="h-full w-full object-cover grayscale" />
            </div>
          </div>

          <div
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            style={{ opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}
          >
            {facts.map((f) => (
              <div key={f.label} className="border-t border-border pt-5">
                <p className="font-display text-2xl font-semibold tabular-nums">{f.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : interface noire qui se construit ligne après ligne ────── */

export function BuildingInterface({
  eyebrow,
  lines,
  rows,
  footer,
}: {
  eyebrow: string;
  lines: ReactNode[];
  rows: { label: string; value: string }[];
  footer?: string;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const shown = Math.floor(Math.max(0, (progress - 0.2) / 0.5) * (rows.length + 1));
  const t = useT();

  return (
    <Section tone="dark" size="large">
      <div ref={ref} className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-7 text-foreground" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-black/40">
          <div className="border-b border-border px-5 py-3.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("Construction du jeu de données", "Building the dataset")}
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-4 px-5 py-3.5 transition-all duration-500"
                style={{
                  opacity: i < shown ? 1 : 0.12,
                  transform: i < shown ? "none" : "translateX(-12px)",
                }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {r.label}
                </span>
                <span className="font-mono text-[12.5px] tabular-nums text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
          {footer && (
            <div
              className="border-t border-border px-5 py-4 transition-opacity duration-700"
              style={{ opacity: shown > rows.length ? 1 : 0.15 }}
            >
              <p className="text-[13px] text-muted-foreground">{footer}</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : composition circulaire autour d'un centre ─────────────── */

export function CircularFlow({
  eyebrow,
  steps,
  image,
}: {
  eyebrow: string;
  steps: string[];
  image?: SiteImage;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (progress - 0.2) / 0.5));

  return (
    <Section size="large">
      <div ref={ref} className="mx-auto max-w-3xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        </Reveal>

        <div className="relative mx-auto mt-20 aspect-square w-full max-w-lg">
          {/* Centre : la photo se suffit, aucun voile ni texte par-dessus */}
          <div className="absolute inset-[26%] overflow-hidden rounded-full border border-border">
            {image ? (
              <SitePhoto image={light(image)} className="h-full w-full object-cover grayscale" />
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>

          {/* Étapes en orbite */}
          {steps.map((s, i) => {
            const angle = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
            const r = 46;
            return (
              <span
                key={s}
                className="absolute whitespace-nowrap rounded-full border border-border bg-background px-3.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.1em]"
                style={{
                  left: `${50 + Math.cos(angle) * r}%`,
                  top: `${50 + Math.sin(angle) * r}%`,
                  transform: `translate(-50%, -50%) scale(${0.7 + t * 0.3})`,
                  opacity: t > i / steps.length ? 1 : 0.2,
                  transition: "opacity 0.5s linear",
                }}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : tableau de bord de performance, chiffres qui se posent ── */

/**
 * Grille de chiffres clés sur fond noir. Chaque cellule se pose à son propre
 * rythme, ce qui évite l'effet « mur de statistiques » et laisse le regard
 * parcourir la grille.
 */
export function MetricsBoard({
  eyebrow,
  lines,
  lead,
  metrics,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead?: string;
  metrics: { value: string; label: string; count?: { to: number; prefix?: string; suffix?: string } }[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  return (
    <Section tone="dark" size="large">
      <div ref={ref}>
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-7 text-foreground" />
          {lead && (
            <Reveal delay={200}>
              <p className="type-lead mt-7 text-muted-foreground">{lead}</p>
            </Reveal>
          )}
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => {
            // chaque cellule se pose quand la progression atteint son rang
            const seuil = 0.12 + (i / metrics.length) * 0.4;
            const posee = progress > seuil;
            return (
              <div
                key={m.label}
                className="bg-[#0a0a0a] p-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-8"
                style={{
                  opacity: posee ? 1 : 0.18,
                  transform: posee ? "none" : "translateY(18px)",
                }}
              >
                {/* CountUp porte son propre déclencheur d'entrée dans le champ :
                    le conditionner à `posee` désynchronise les deux et laisse
                    apparaître un « 0 » transitoire. */}
                <p className="font-display text-3xl font-semibold tabular-nums text-foreground sm:text-4xl">
                  {m.count ? (
                    <CountUp value={m.count.to} prefix={m.count.prefix} suffix={m.count.suffix} />
                  ) : (
                    m.value
                  )}
                </p>
                <p className="mt-4 text-sm leading-snug text-muted-foreground">{m.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : l'écart de précision entre donnée brute et donnée annotée ── */

type Colonne = {
  label: string;
  /** Valeur en pourcentage, sert aussi à la longueur de la jauge. */
  valeur: number;
  /** Affichage du chiffre, quand il diffère de la valeur brute (« > 90 % »). */
  affichage?: string;
  legende: string;
  points: string[];
};

/**
 * Deux jauges face à face : le même modèle, entraîné sur de la donnée brute
 * puis sur de la donnée annotée.
 *
 * L'argument est chiffré, donc la démonstration doit l'être aussi : les
 * jauges sont à l'échelle l'une de l'autre, et l'écart est annoncé en points
 * plutôt qu'en pourcentage relatif, qui gonflerait artificiellement le
 * résultat.
 *
 * Monochrome, comme le reste du corps de page : la donnée brute est hachurée
 * et grise, la donnée annotée est un aplat noir. C'est le contraste de
 * matière qui porte la comparaison, pas une couleur.
 */
export function AccuracyGap({
  eyebrow,
  lines,
  lead,
  brut,
  annote,
  ecart,
  note,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead: string;
  brut: Colonne;
  annote: Colonne;
  /** Texte de l'écart, déjà formulé en points par l'appelant. */
  ecart: string;
  /** Provenance du chiffre. Une mesure publiée sans son origine n'engage rien. */
  note: string;
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  // Les jauges ne se remplissent qu'une fois le titre passé.
  const t = Math.min(1, Math.max(0, (progress - 0.22) / 0.4));

  const colonnes: { c: Colonne; fort: boolean }[] = [
    { c: brut, fort: false },
    { c: annote, fort: true },
  ];

  return (
    <Section tone="muted" size="large">
      <div ref={ref}>
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-7 text-foreground" />
          <Reveal delay={200}>
            <p className="type-lead mt-8 text-muted-foreground">{lead}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {colonnes.map(({ c, fort }) => (
            <div
              key={c.label}
              className={`rounded-2xl border p-8 ${
                fort ? "border-foreground/25 bg-background" : "border-border bg-background/40"
              }`}
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {c.label}
              </p>

              <p
                className={`font-display mt-5 text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tabular-nums ${
                  fort ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {c.affichage ?? <CountUp value={c.valeur} suffix=" %" />}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{c.legende}</p>

              {/* Jauge : les deux partagent la même échelle, sinon la
                  comparaison ne voudrait rien dire. */}
              <div className="mt-7 h-3 w-full overflow-hidden rounded-full bg-foreground/[0.07]">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${c.valeur * t}%`,
                    backgroundColor: fort ? "hsl(var(--foreground))" : "transparent",
                    backgroundImage: fort
                      ? undefined
                      : "repeating-linear-gradient(-52deg, hsl(var(--foreground) / 0.45) 0 2px, transparent 2px 7px)",
                  }}
                />
              </div>

              <ul className="mt-8 space-y-3">
                {c.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed">
                    <span
                      className={`mt-[0.45em] h-1 w-1 shrink-0 rounded-full ${
                        fort ? "bg-foreground" : "bg-muted-foreground/50"
                      }`}
                    />
                    <span className={fort ? "text-foreground/80" : "text-muted-foreground"}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Reveal delay={260}>
          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-display text-xl font-semibold text-foreground sm:text-2xl">{ecart}</p>
            <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">{note}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Scénario : le parcours d'une donnée, de brute à exploitée ────────── */

type Etape = {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
};

/**
 * Chaîne de sept étapes qui se câble au défilement : la ligne se trace
 * segment par segment, chaque nœud s'allume à son tour. C'est la même
 * mécanique que la frise historique de Malayka Data, étendue à sept points
 * et animée plutôt que statique. Le repère visuel qui permet de comprendre
 * l'offre de services sans connaître l'IA.
 *
 * Empilée verticalement sous `md`, avec la ligne qui descend au lieu de
 * traverser : sept nœuds de front sur un écran de téléphone deviendraient
 * illisibles.
 */
export function DataJourney({
  eyebrow,
  lines,
  lead,
  steps,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead?: string;
  steps: Etape[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (progress - 0.15) / 0.6));
  const n = steps.length;

  return (
    <Section size="large">
      <div ref={ref}>
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex justify-center md:justify-start">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <RevealLines
            lines={lines}
            className="type-h2 mt-7 text-center text-foreground md:text-left"
          />
          {lead && (
            <Reveal delay={200}>
              <p className="type-lead mx-auto mt-7 text-center text-muted-foreground md:mx-0 md:text-left">
                {lead}
              </p>
            </Reveal>
          )}
        </div>

        {/* ── Desktop : chaîne horizontale ── */}
        <div className="relative mt-20 hidden md:grid md:grid-cols-7 md:gap-2">
          <div className="pointer-events-none absolute left-0 right-0 top-[22px] h-px bg-border" />
          <div
            className="pointer-events-none absolute left-0 top-[22px] h-px bg-foreground transition-[width] duration-300 ease-out"
            style={{ width: `${t * 100}%` }}
          />
          {steps.map((s, i) => {
            const seuil = i / (n - 1);
            const pose = t >= seuil - 0.02;
            return (
              <div key={s.label} className="relative flex flex-col items-center text-center">
                <div
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${
                    pose
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  <s.Icon className="h-4.5 w-4.5" />
                </div>
                <p
                  className={`mt-4 text-[12.5px] font-semibold leading-tight transition-colors duration-500 ${
                    pose ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </p>
                <p className="mt-1 px-1 font-mono text-[10px] uppercase leading-tight tracking-[0.06em] text-muted-foreground/60">
                  {s.hint}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Mobile : chaîne verticale ── */}
        <div className="relative mt-16 md:hidden">
          <div className="pointer-events-none absolute bottom-0 left-[21px] top-0 w-px bg-border" />
          <div
            className="pointer-events-none absolute left-[21px] top-0 w-px bg-foreground transition-[height] duration-300 ease-out"
            style={{ height: `${t * 100}%` }}
          />
          <div className="space-y-8">
            {steps.map((s, i) => {
              const seuil = i / (n - 1);
              const pose = t >= seuil - 0.02;
              return (
                <div key={s.label} className="relative flex items-start gap-4">
                  <div
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                      pose
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <s.Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="pt-2">
                    <p
                      className={`text-[13.5px] font-semibold transition-colors duration-500 ${
                        pose ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground/60">
                      {s.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ── Scénario : une liste de profils qui se pose ligne après ligne ────── */

type Profil = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
};

/**
 * Remplace une grille de cartes par une liste de lignes qui se posent l'une
 * après l'autre au défilement, chacune soulignée d'un filet. Convient à une
 * courte liste de profils qu'on veut lire dans l'ordre plutôt que survoler
 * d'un coup d'œil. Une grille tasse tout au même niveau, une liste établit
 * une hiérarchie de lecture.
 */
export function ProfileRows({
  eyebrow,
  lines,
  lead,
  items,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead?: string;
  items: Profil[];
}) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const t = Math.min(1, Math.max(0, (progress - 0.16) / 0.6));
  const n = items.length;

  return (
    <Section tone="default" size="large">
      <div ref={ref}>
        <div className="max-w-3xl">
          <Reveal>
            <div className="flex justify-center md:justify-start">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          </Reveal>
          <RevealLines
            lines={lines}
            className="type-h2 mt-7 text-center text-foreground md:text-left"
          />
          {lead && (
            <Reveal delay={200}>
              <p className="type-lead mx-auto mt-7 text-center text-muted-foreground md:mx-0 md:text-left">
                {lead}
              </p>
            </Reveal>
          )}
        </div>

        <div className="mt-16">
          {items.map((it, i) => {
            const seuil = i / n;
            const pose = t >= seuil;
            return (
              <div
                key={it.title}
                className="group border-b border-border py-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] first:border-t md:py-10"
                style={{
                  opacity: pose ? 1 : 0.25,
                  transform: pose ? "translateY(0)" : "translateY(14px)",
                }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
                  <div className="flex items-center gap-4 md:w-[19rem] md:shrink-0">
                    <span className="font-mono text-xs font-semibold text-muted-foreground/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border transition-colors duration-500 group-hover:border-foreground group-hover:bg-foreground">
                      <it.Icon className="h-4.5 w-4.5 text-foreground transition-colors duration-500 group-hover:text-background" />
                    </div>
                    <p className="font-display text-lg font-semibold text-foreground">{it.title}</p>
                  </div>
                  <p className="leading-relaxed text-muted-foreground md:flex-1">{it.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
