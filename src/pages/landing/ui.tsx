import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

/**
 * Socle commun des pages publiques.
 *
 * Chaque page définissait auparavant ses propres tailles de titre, ses propres
 * marges et ses propres en-têtes : d'une page à l'autre, un même niveau de
 * lecture n'avait pas la même apparence. Ces quelques composants imposent une
 * échelle unique — c'est ce qui fait qu'un site paraît tenu plutôt qu'assemblé.
 *
 * Une seule échelle typographique, appliquée partout :
 *   Hero    → text-4xl / sm:text-5xl / lg:text-[3.25rem]
 *   Section → text-3xl / sm:text-4xl
 *   Bloc    → text-lg
 *   Corps   → text-base (intro) · text-sm (courant)
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </p>
  );
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Visuel optionnel : sans lui le hero est centré, avec lui il passe en deux colonnes. */
  visual?: ReactNode;
  actions?: ReactNode;
  footnote?: ReactNode;
}

export function PageHero({ eyebrow, title, intro, visual, actions, footnote }: PageHeroProps) {
  const centre = !visual;

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
      {/* Trame dans l'encre de la marque — jamais de halo coloré. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div
          className={cn(
            centre ? "mx-auto max-w-3xl text-center" : "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
          )}
        >
          <div className={cn("space-y-6", !centre && "text-center lg:text-left")}>
            <Eyebrow>{eyebrow}</Eyebrow>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>

            {intro && (
              <p
                className={cn(
                  "text-lg leading-relaxed text-muted-foreground",
                  centre ? "mx-auto max-w-2xl" : "mx-auto max-w-lg lg:mx-0",
                )}
              >
                {intro}
              </p>
            )}

            {actions && (
              <div
                className={cn(
                  "flex flex-col gap-3 sm:flex-row",
                  centre ? "sm:justify-center" : "sm:justify-center lg:justify-start",
                )}
              >
                {actions}
              </div>
            )}

            {footnote && (
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {footnote}
              </p>
            )}
          </div>

          {visual && <div className="lg:pl-4">{visual}</div>}
        </div>
      </div>
    </section>
  );
}

interface SectionProps {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  /** Alterne le fond pour séparer deux sections sans ajouter de bordure. */
  muted?: boolean;
  className?: string;
}

export function Section({ eyebrow, title, intro, children, muted, className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", muted && "bg-muted/30", className)}>
      <div className="mx-auto max-w-5xl px-5">
        {(eyebrow || title || intro) && (
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && (
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
            )}
          </div>
        )}
        {children && <div className={cn(eyebrow || title || intro ? "mt-12" : "")}>{children}</div>}
      </div>
    </section>
  );
}

/**
 * Étape numérotée. La numérotation n'est pas décorative : ces listes décrivent
 * des séquences réelles où l'ordre porte l'information.
 */
export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="space-y-8">
      {items.map((s, i) => (
        <li key={s.title} className="flex gap-5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs">
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Liste de capacités — sans numérotation, l'ordre n'y porte rien. */
export function FeatureGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {items.map((f) => (
        <div key={f.title} className="border-l-2 pl-5">
          <h3 className="font-semibold">{f.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
