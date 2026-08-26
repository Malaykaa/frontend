import { B2BSection } from "../B2BSection";
import { CtaSection } from "../CtaSection";

/**
 * Malayka Educative — ecoles, universites, formateurs, centres de formation.
 *
 * Reutilise la section B2B existante en attendant un contenu propre a cette
 * verticale. Volontairement pas de contenu invente ici : mieux vaut une page
 * courte et vraie qu'une page longue et creuse.
 */
export default function EducativePage() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Solutions
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Malayka Educative
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Pour les ecoles, universites, formateurs et centres de formation. Chaque
          apprenant recoit un accompagnement personnalise ; vous gardez la vue
          d'ensemble sur votre cohorte.
        </p>
      </div>
      <B2BSection />
      <CtaSection />
    </div>
  );
}
