import { Testimonials } from "../Testimonials";
import { StatsSection } from "../StatsSection";
import { PageHero } from "../ui";

/** Temoignages — ce que les utilisateurs disent, et les chiffres qui vont avec. */
export default function TemoignagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Temoignages"
        title="Ils ont decroche ce qu'ils cherchaient"
        intro="Etudiants, chercheurs d'emploi, entrepreneurs et etablissements : voici ce que Malayka a change dans leur parcours."
      />
      <Testimonials />
      <StatsSection />
    </>
  );
}
