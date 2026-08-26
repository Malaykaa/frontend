import { B2BSection } from "../B2BSection";
import { CtaSection } from "../CtaSection";

/**
 * Structures d'emploi — recruteurs, agences, cabinets de recrutement.
 *
 * Meme remarque que pour EducativePage : le contenu propre a cette verticale
 * reste a ecrire, on ne le remplit pas de texte generique en attendant.
 */
export default function EmploiPage() {
  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Solutions
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Pour les structures d'emploi
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Pour les recruteurs, agences d'emploi et cabinets de recrutement. Un
          vivier de candidats qualifies, et un matching qui repose sur des
          competences reellement demontrees.
        </p>
      </div>
      <B2BSection />
      <CtaSection />
    </div>
  );
}
