import { PageHero, Section, FeatureGrid } from "../ui";

/**
 * À propos — ce qu'est Malayka, puis mission, vision, valeurs et raisons de
 * faire confiance.
 *
 * L'ordre est délibéré : un visiteur ne peut adhérer à une mission avant
 * d'avoir compris ce qu'est le produit. On explique donc d'abord, on engage
 * ensuite.
 *
 * Les valeurs et les motifs de confiance ne sont pas des déclarations : chacun
 * renvoie à un mécanisme réellement en place dans le produit. C'est ce qui les
 * rend vérifiables — et ce qui distingue une page « à propos » d'une page de
 * promesses.
 */

const VALEURS = [
  {
    title: "Honnêteté radicale",
    text: "Nous préférons une vérité inconfortable à une promesse flatteuse. Quand une information n'est pas fiable, Malayka le dit plutôt que de combler le vide.",
  },
  {
    title: "Excellence sans arrogance",
    text: "Le meilleur accompagnement possible, sans jamais laisser croire à un résultat garanti. Annoncer une limite vaut mieux que la masquer.",
  },
  {
    title: "Respect profond",
    text: "Chaque utilisateur mérite la même attention, quels que soient son niveau, son pays ou sa façon d'écrire. Nous ne corrigeons personne.",
  },
  {
    title: "Autonomisation",
    text: "Notre objectif n'est pas de créer une dépendance mais de rendre chacun capable d'avancer seul. Un utilisateur qui n'a plus besoin de nous est une réussite.",
  },
  {
    title: "Pragmatisme africain",
    text: "Nos recommandations tiennent compte des réalités du terrain : contraintes administratives, accès inégal aux ressources, spécificités locales.",
  },
  {
    title: "Rigueur des données",
    text: "Une offre affichée est une offre qui existe. Les informations factuelles proviennent de sources collectées et vérifiées, jamais d'une génération automatique.",
  },
];

const CONFIANCE = [
  {
    title: "Aucune offre inventée",
    text: "Le titre, l'entreprise et l'échéance d'une opportunité proviennent toujours de notre base de données. L'intelligence artificielle choisit quoi vous montrer — elle n'en rédige jamais le contenu factuel.",
  },
  {
    title: "Des évaluations qui gardent leur valeur",
    text: "La correction des exercices repose sur une comparaison directe à la réponse attendue, sans intervention d'un modèle de langage. Une note obtenue ici signifie quelque chose.",
  },
  {
    title: "Vos données restent les vôtres",
    text: "Consentement explicite recueilli à l'inscription, conformément à la loi ivoirienne n° 2013-450. Vos coordonnées ne circulent jamais sans votre accord préalable.",
  },
  {
    title: "Des limites assumées",
    text: "Nos fiches métiers indiquent ouvertement lorsqu'elles n'ont pas encore été validées par un expert. Nous préférons signaler une incertitude que la dissimuler.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHero
        eyebrow="À propos"
        title="Les opportunités existent. L'accès, non."
        intro="Chaque année, des bourses, des stages et des financements restent sans candidat pendant que des jeunes qualifiés les cherchent en vain. Ce n'est pas un problème de talent — c'est un problème d'accès à l'information."
      />

      <Section
        eyebrow="Ce qu'est Malayka"
        title="Un mentor qui travaille pour vous, même quand vous ne le sollicitez pas"
      >
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Malayka est une plateforme d'accompagnement propulsée par l'intelligence
            artificielle, conçue pour les jeunes, les étudiants et les chercheurs d'emploi
            en Afrique. Elle réunit trois fonctions que l'on trouve habituellement
            séparées.
          </p>
          <p>
            <span className="font-medium text-foreground">Un conseiller</span> qui connaît
            votre parcours, vos compétences et vos contraintes, et construit avec vous un
            plan d'action concret plutôt qu'une liste de recommandations générales.
          </p>
          <p>
            <span className="font-medium text-foreground">Une veille permanente</span> qui
            parcourt le web en continu pour détecter bourses, emplois, financements et
            appels à candidatures, et vous alerte dès qu'une opportunité correspond à votre
            profil — y compris sur WhatsApp, sans que vous ayez à ouvrir l'application.
          </p>
          <p>
            <span className="font-medium text-foreground">Un atelier de production</span> qui
            génère vos documents professionnels — CV, lettre de motivation, business plan,
            dossier de candidature — adaptés à l'opportunité que vous visez.
          </p>
          <p>
            Malayka s'adresse également aux établissements de formation et aux structures
            d'emploi, avec des outils dédiés à l'accompagnement des cohortes et au
            recrutement.
          </p>
        </div>
      </Section>

      <Section eyebrow="Notre mission" title="Rendre l'opportunité accessible à qui la mérite" muted>
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Nous voulons mettre entre les mains de chaque jeune africain un accompagnement
            qui le connaît réellement : qui cherche pour lui pendant qu'il dort, qui lui
            indique précisément ce qui lui manque pour atteindre son objectif, et qui lui
            fournit les documents nécessaires pour y parvenir.
          </p>
          <p>
            Pas une liste de liens à trier seul. Un chemin, étape par étape, jusqu'au
            résultat.
          </p>
        </div>
      </Section>

      <Section eyebrow="Notre vision" title="Un continent où l'origine ne décide plus de l'avenir">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Nous travaillons à un continent où le réseau, le lieu de naissance ou le hasard
            ne déterminent plus qui accède à une bourse, un stage ou un financement.
          </p>
          <p>
            Où un étudiant de Bouaké voit passer les mêmes opportunités qu'un étudiant
            d'Abidjan — et sait exactement quoi faire pour les décrocher. Où un centre de
            formation mesure ses résultats sur des acquis réels plutôt que sur des taux de
            présence. Où une entreprise recrute sur des compétences démontrées plutôt que
            sur une recommandation.
          </p>
        </div>
      </Section>

      <Section
        eyebrow="Nos valeurs"
        title="Six principes, inscrits dans le produit"
        intro="Ces principes ne sont pas affichés : ils sont encodés dans le système lui-même et gouvernent chaque réponse produite par Malayka."
        muted
      >
        <FeatureGrid items={VALEURS} />
      </Section>

      <Section
        eyebrow="Pourquoi nous faire confiance"
        title="Ce que nous nous interdisons"
        intro="La confiance ne se déclare pas, elle se vérifie. Voici quatre engagements que notre architecture technique rend contraignants."
      >
        <FeatureGrid items={CONFIANCE} />
      </Section>
    </>
  );
}
