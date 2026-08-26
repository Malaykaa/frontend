import { ParticulierHero }   from "../ParticulierHero";
import { StatsSection }      from "../StatsSection";
import { FeaturesSection }   from "../FeaturesSection";
import { HowItWorks }        from "../HowItWorks";
import { TechSimulation }    from "../TechSimulation";

/**
 * Accueil — Malayka Particulier.
 *
 * Page d'entree du site : c'est l'audience principale, et c'est ici que se
 * trouve la promesse « Atteins tes objectifs rapidement et surement ».
 *
 * Ne contient que ce qui parle a un particulier. Les sections destinees a
 * d'autres publics ont leur propre page, la FAQ a ete retiree, et le bloc
 * d'appel a l'action final egalement : la promesse d'inscription est deja
 * portee par le hero et par la navigation, la repeter en bas de page
 * n'apportait rien.
 */
export default function ParticulierPage() {
  return (
    <>
      <ParticulierHero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <TechSimulation />
    </>
  );
}
