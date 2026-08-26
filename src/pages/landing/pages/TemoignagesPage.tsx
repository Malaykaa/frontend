import { Testimonials } from "../Testimonials";
import { StatsSection } from "../StatsSection";
import { CtaSection }   from "../CtaSection";

/** Temoignages — ce que les utilisateurs disent, et les chiffres qui vont avec. */
export default function TemoignagesPage() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Temoignages
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Ils avancent avec Malayka
        </h1>
      </div>
      <Testimonials />
      <StatsSection />
      <CtaSection />
    </div>
  );
}
