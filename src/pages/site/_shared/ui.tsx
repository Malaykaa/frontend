import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { SiteImage } from "./media";
import { useT } from "./lang";

/* Observateur d'entrée dans le viewport, partagé par toutes les animations. */
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05, ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Titre révélé ligne à ligne, chaque ligne glissant depuis son propre masque. */
export function RevealLines({
  lines,
  className,
  as: Tag = "h2",
  stagger = 100,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3";
  stagger?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cn(inView && "is-visible")}>
      <Tag className={cn("font-display", className)}>
        {lines.map((line, i) => (
          <span key={i} className="line-mask">
            <span style={{ transitionDelay: `${i * stagger}ms` }}>{line}</span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/** Chiffre qui monte de zéro à sa valeur lorsqu'il entre dans le champ. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1800,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [display, setDisplay] = useState(0);
  const t = useT();

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setDisplay(Math.round(value * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {/* Séparateur de milliers : espace fine en français, virgule en anglais. */}
      {display.toLocaleString(t.lang === "en" ? "en-GB" : "fr-FR")}
      {suffix}
    </span>
  );
}

// Typographie et sections
export function Eyebrow({ children }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span className="inline-flex items-center gap-3 font-mono type-label font-semibold text-foreground/45">
      <span className="h-px w-8 bg-foreground/25" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lines,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title?: ReactNode;
  lines?: ReactNode[];
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <div className={cn("mb-7", align === "center" && "flex justify-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      {lines ? (
        <RevealLines lines={lines} className="type-h2 text-foreground" />
      ) : (
        <h2 className="font-display type-h2 text-foreground">{title}</h2>
      )}
      {lead && (
        <p className={cn("type-lead mt-7 max-w-2xl text-muted-foreground", align === "center" && "mx-auto")}>
          {lead}
        </p>
      )}
    </div>
  );
}

export function Section({
  children,
  tone = "default",
  className,
  id,
  size = "default",
  /** `overflow: hidden` sur un ancêtre neutralise `position: sticky` : passer
   *  `clip={false}` dans les sections qui en contiennent un. */
  clip = true,
}: {
  children: ReactNode;
  tone?: "default" | "muted" | "dark";
  className?: string;
  id?: string;
  size?: "default" | "large";
  clip?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={cn(
        "relative",
        clip && "overflow-hidden",
        size === "large" ? "py-28 md:py-44" : "py-24 md:py-32",
        tone === "muted" && "bg-muted",
        dark && "on-dark bg-[#0a0a0a] text-foreground",
        className,
      )}
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** Suite d'étapes « A → B → C », motif récurrent du site. */
export function FlowChain({ steps, className }: { steps: string[]; className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2.5", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-3">
          <span className="rounded-full border border-border bg-transparent px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/70">
            {step}
          </span>
          {i < steps.length - 1 && <span className="text-xs text-foreground/25">→</span>}
        </div>
      ))}
    </div>
  );
}

// Cartes
export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        hover && "hover:-translate-y-1.5 hover:border-foreground/30 hover:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureCard({
  Icon,
  title,
  desc,
  meta,
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  meta?: string;
  tone?: "light" | "dark";
}) {
  return (
    <Card className="group h-full">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border transition-colors duration-500 group-hover:border-foreground group-hover:bg-foreground">
          <Icon className="h-5 w-5 text-foreground transition-colors duration-500 group-hover:text-background" />
        </div>
      )}
      <h3 className="font-display mt-7 text-xl font-semibold">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{desc}</p>
      {meta && (
        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">{meta}</p>
      )}
    </Card>
  );
}

/** Carte illustrée : photo en haut, texte en dessous, léger zoom au survol. */
export function PhotoCard({
  image,
  eyebrow,
  title,
  desc,
  ratio = "4/3",
  className,
}: {
  image: SiteImage;
  eyebrow?: string;
  title: string;
  desc?: string;
  ratio?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("group", inView && "is-visible", className)}>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="img-reveal overflow-hidden" style={{ aspectRatio: ratio }}>
          <SitePhoto image={image} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:grayscale-0" />
        </div>
      </div>
      {eyebrow && (
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground/60">{eyebrow}</p>
      )}
      <h3 className="font-display mt-3 text-xl font-semibold">{title}</h3>
      {desc && <p className="mt-3 leading-relaxed text-muted-foreground">{desc}</p>}
    </div>
  );
}

/** Photo encadrée, utilisée en appui d'un bloc de texte. */
export function InlinePhoto({
  image,
  caption,
  ratio = "3/4",
  className,
}: {
  image: SiteImage;
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <figure ref={ref} className={cn("group", inView && "is-visible", className)}>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="img-reveal overflow-hidden" style={{ aspectRatio: ratio }}>
          <SitePhoto image={image} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:grayscale-0" />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 flex items-start gap-3 text-[13px] text-muted-foreground">
          <span className="mt-2 h-px w-6 shrink-0 bg-foreground/25" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Statistiques
export function Stat({
  value,
  label,
  count,
  size = "default",
}: {
  value: string;
  label: string;
  tone?: "light" | "dark";
  count?: { to: number; prefix?: string; suffix?: string };
  size?: "default" | "huge";
}) {
  return (
    <div>
      <p
        className={cn(
          "font-display font-semibold tabular-nums text-foreground",
          size === "huge" ? "type-h2" : "text-4xl sm:text-5xl",
        )}
      >
        {count ? <CountUp value={count.to} prefix={count.prefix} suffix={count.suffix} /> : value}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Appels à l'action
export const CONTACT_EMAIL = "contact@malayka.co";

export function mailto(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export function CtaGroup({
  primary,
  secondary,
  className,
}: {
  primary: { label: string; to?: string; href?: string };
  secondary?: { label: string; to?: string; href?: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  const navigate = useNavigate();
  const go = (t: { to?: string; href?: string }) => {
    if (t.href) window.location.href = t.href;
    else if (t.to) navigate(t.to);
  };

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Button
        size="lg"
        className="group h-auto gap-2 rounded-full px-8 py-4 text-[15px] font-semibold"
        onClick={() => go(primary)}
      >
        {primary.label}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
      {secondary && (
        <Button
          size="lg"
          variant="outline"
          // `!` requis : le variant outline de shadcn impose ses propres fonds et bordures
          className="h-auto rounded-full border-foreground/25 !bg-transparent px-8 py-4 text-[15px] font-semibold !text-foreground hover:!bg-foreground hover:!text-background"
          onClick={() => go(secondary)}
        >
          {secondary.label}
        </Button>
      )}
    </div>
  );
}

// Bannières
export function PageHero({
  eyebrow,
  lines,
  lead,
  image,
  chain,
  primary,
  secondary,
  children,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead: ReactNode;
  image?: SiteImage;
  chain?: string[];
  primary?: { label: string; to?: string; href?: string };
  secondary?: { label: string; to?: string; href?: string };
  children?: ReactNode;
}) {
  return (
    <section className="on-dark relative flex min-h-[84vh] items-end overflow-hidden bg-[#0a0a0a] pb-24 pt-44 text-foreground md:pb-32">
      {image && (
        <>
          <SitePhoto image={image} loading="eager" className="kenburns pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80" />
          {/* Voile latéral : la photo reste lisible à droite, le texte protégé à gauche */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/78 to-[#0a0a0a]/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/55" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal>
          <span className="inline-flex items-center gap-3 font-mono type-label font-semibold text-muted-foreground">
            <span className="h-px w-8 bg-card" />
            {eyebrow}
          </span>
        </Reveal>
        <RevealLines as="h1" lines={lines} className="type-display mt-9 max-w-5xl text-foreground" stagger={110} />
        <Reveal delay={260}>
          <p className="type-lead mt-9 max-w-2xl text-muted-foreground">{lead}</p>
          {chain && (
            <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2.5">
              {chain.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-full border border-border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {step}
                  </span>
                  {i < chain.length - 1 && <span className="text-xs text-foreground/25">→</span>}
                </div>
              ))}
            </div>
          )}
          {primary && <CtaGroup primary={primary} secondary={secondary} className="mt-10" />}
        </Reveal>
        {children && <Reveal delay={340}>{children}</Reveal>}
      </div>
    </section>
  );
}

/**
 * Mot qui change au fil du temps dans une phrase. Un seul mot est rendu à la
 * fois : la largeur suit le mot courant plutôt que de se caler sur le plus
 * long du lot. Réserver la largeur maximale laissait un vide disproportionné
 * derrière les mots courts (« RH » suivi d'un blanc de la taille de
 * « Informatique » avant le reste de la phrase). Le texte qui suit se décale
 * donc légèrement à chaque changement, ce qui reste discret sur un seul mot
 * au fil d'une phrase.
 */
export function RotatingWord({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setI((n) => (n + 1) % words.length);
        setVisible(true);
      }, 260);
      return () => clearTimeout(swap);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className={cn("inline-block transition-all duration-300 ease-out", className)}
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(0.15em)" }}
      aria-live="polite"
    >
      {words[i]}
    </span>
  );
}

export function ScrollCue({ label }: { label?: string }) {
  const t = useT();
  const texte = label ?? t("Explorer", "Explore");
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{texte}</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </span>
    </div>
  );
}

/** Bandeau photo pleine largeur : rupture de rythme entre deux sections claires. */
export function ImageBand({
  image,
  lines,
  lead,
  cta,
}: {
  image: SiteImage;
  lines: ReactNode[];
  lead?: string;
  cta?: { label: string; to?: string; href?: string };
}) {
  const navigate = useNavigate();
  return (
    <section className="on-dark relative flex min-h-[68vh] items-center overflow-hidden bg-[#0a0a0a] py-32 text-foreground">
      <SitePhoto image={image} loading="lazy" className="kenburns pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/72 to-transparent" />
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <RevealLines lines={lines} className="type-h2 max-w-3xl text-foreground" />
        {lead && (
          <Reveal delay={220}>
            <p className="type-lead mt-8 max-w-xl text-muted-foreground">{lead}</p>
          </Reveal>
        )}
        {cta && (
          <Reveal delay={320}>
            <Button
              size="lg"
              className="group mt-10 h-auto gap-2 rounded-full px-8 py-4 text-[15px] font-semibold"
              onClick={() => (cta.href ? (window.location.href = cta.href) : navigate(cta.to!))}
            >
              {cta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// Récit au défilement
/** Titre épinglé à gauche, étapes qui s'allument à droite au fil du scroll. */
export function StickySteps({
  eyebrow,
  lines,
  lead,
  steps,
  image,
}: {
  eyebrow: string;
  lines: ReactNode[];
  lead?: string;
  steps: { n: string; title: string; desc: string }[];
  image?: SiteImage;
  tone?: "dark" | "light";
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = refs.current.indexOf(e.target as HTMLDivElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <Section clip={false}>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <RevealLines lines={lines} className="type-h2 mt-7 text-foreground" />
          {lead && (
            <Reveal delay={200}>
              <p className="type-lead mt-7 text-muted-foreground">{lead}</p>
            </Reveal>
          )}

          {image && (
            <Reveal delay={300}>
              <InlinePhoto image={image} ratio="16/10" className="mt-10 hidden lg:block" />
            </Reveal>
          )}

          <div className="mt-10 flex gap-2">
            {steps.map((s, i) => (
              <span
                key={s.n}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-colors duration-500",
                  i <= active ? "bg-foreground" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              ref={(el) => { refs.current[i] = el; }}
              className={cn(
                "rounded-2xl border p-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:p-10",
                i === active
                  ? "border-foreground/30 bg-card shadow-[0_18px_50px_-28px_rgba(0,0,0,0.4)]"
                  : "border-border bg-card/40 opacity-45",
              )}
            >
              <span className="font-mono text-sm font-semibold text-foreground/50">{s.n}</span>
              <h3 className="type-h3 font-display mt-4 text-foreground">{s.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// Défilement continu
/** Ruban horizontal en boucle : sources surveillées, partenaires, mots-clés. */
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border py-6">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 px-10 font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground/70"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

// Chorégraphie de défilement

/** Photo qui se décale plus lentement que la page, pour un effet de profondeur. */
export function ParallaxPhoto({
  image,
  ratio = "3/4",
  amount = 60,
  className,
}: {
  image: SiteImage;
  ratio?: string;
  /** Amplitude du décalage en pixels. */
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const progress = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        setOffset(Math.max(-1, Math.min(1, progress)) * amount);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, [amount]);

  return (
    <div ref={ref} className={cn("overflow-hidden rounded-2xl border border-border", className)}>
      <div style={{ aspectRatio: ratio }} className="overflow-hidden">
        <SitePhoto
          image={image}
          className="h-[118%] w-full object-cover grayscale"
          style={{ transform: `translateY(${offset}px)` }}
        />
      </div>
    </div>
  );
}

/** Bloc qui entre depuis la gauche ou la droite. */
export function SlideIn({
  children,
  from = "left",
  delay = 0,
  className,
}: {
  children: ReactNode;
  from?: "left" | "right";
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)]", className)}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translateX(${from === "left" ? -80 : 80}px)`,
      }}
    >
      {children}
    </div>
  );
}

/** Trois photos décalées en diagonale, chacune à sa propre vitesse. */
export function DiagonalPhotos({ images }: { images: SiteImage[] }) {
  const offsets = ["lg:mt-0", "lg:mt-20", "lg:mt-40"];
  const amounts = [70, 45, 90];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.slice(0, 3).map((img, i) => (
        <SlideIn key={img.src + i} from={i % 2 === 0 ? "left" : "right"} delay={i * 140} className={offsets[i]}>
          <ParallaxPhoto image={img} ratio={i === 1 ? "4/5" : "3/4"} amount={amounts[i]} />
        </SlideIn>
      ))}
    </div>
  );
}

/**
 * Image du site. Centralise le cadrage (`position`) et le texte alternatif
 * portés par le manifeste, pour qu'un changement de photo ne demande aucune
 * retouche dans les pages. L'alternative textuelle suit la langue active :
 * une page traduite dont les images restent décrites en français serait
 * illisible au lecteur d'écran anglophone.
 */
export function SitePhoto({
  image,
  className,
  loading = "lazy",
  style,
}: {
  image: SiteImage;
  className?: string;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
}) {
  const t = useT();
  return (
    <img
      src={image.src}
      alt={t(image.alt, image.altEn)}
      loading={loading}
      decoding="async"
      className={className}
      style={{ objectPosition: image.position ?? "center", ...style }}
    />
  );
}
