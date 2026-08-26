import { ParticulierHero }   from "../ParticulierHero";
import { StatsSection }      from "../StatsSection";
import { FeaturesSection }   from "../FeaturesSection";
import { HowItWorks }        from "../HowItWorks";
import { TechSimulation }    from "../TechSimulation";
import { CtaSection }        from "../CtaSection";
import { FaqSection }        from "../FaqSection";

/**
 * Accueil — Malayka Particulier.
 *
 * Page d'entree du site : c'est l'audience principale, et c'est ici que se
 * trouve la promesse « Atteins tes objectifs rapidement et surement ».
 *
 * Les sections reprennent celles de l'ancienne page unique, moins celles qui
 * s'adressaient a d'autres publics (B2B, temoignages) : elles ont desormais
 * leur propre page. Un visiteur particulier ne defile plus dans un discours
 * ecrit pour un recruteur.
 */
export default function ParticulierPage() {
  return (
    <>
      <ParticulierHero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <TechSimulation />
      <FaqSection />
      <CtaSection />
    </>
  );
}
