import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, Steps, FeatureGrid } from "../ui";

/**
 * Structures d'emploi — recruteurs, agences, cabinets de recrutement, et la
 * mise en relation entre demandeurs et prestataires.
 *
 * La page Services autonome a été supprimée : la marketplace est décrite ici,
 * là où se trouve son audience. Un recruteur n'a pas à naviguer entre deux
 * pages pour comprendre une seule proposition.
 *
 * Le déroulé décrit le mécanisme réellement implémenté : double consentement,
 * deux viviers successifs, coordonnées révélées seulement à la fin.
 */

const DEROULE = [
  {
    title: "Le client décrit son besoin",
    text: "En quelques phrases, dans son langage. Malayka structure la demande : nature de la prestation, compétences attendues, mode d'intervention — à distance, sur site ou hybride — et zone géographique.",
  },
  {
    title: "Malayka identifie les prestataires pertinents",
    text: "Le rapprochement s'appuie sur les compétences déclarées, l'expérience et la localisation. La géographie agit comme un filtre strict, jamais comme un simple bonus : un prestataire hors zone n'apparaît pas, même s'il correspond parfaitement par ailleurs.",
  },
  {
    title: "Les prestataires reçoivent la demande",
    text: "Chacun est notifié et décide librement : il accepte s'il est disponible et compétent, il refuse sinon. Aucune obligation de répondre, aucune pénalité — un prestataire indisponible ne pollue pas la sélection du client.",
  },
  {
    title: "Le client reçoit les profils qui ont accepté",
    text: "Il ne voit que des prestataires ayant explicitement manifesté leur intérêt. Pas de liste morte à relancer, pas de profil qui ne répondra jamais.",
  },
  {
    title: "Le client retient un prestataire",
    text: "Il examine les vitrines — présentation, réalisations, tarifs indicatifs, zone d'intervention — et sélectionne celui qui lui convient.",
  },
  {
    title: "Les coordonnées sont échangées",
    text: "C'est seulement à cet instant précis, après accord des deux parties, que les numéros de téléphone circulent. Ni avant, ni unilatéralement.",
  },
];

const RECRUTEURS = [
  {
    title: "Des candidats aux compétences démontrées",
    text: "Les profils issus de nos parcours de formation portent des acquis validés par évaluation, pas seulement déclarés sur un CV. Vous recrutez sur des faits.",
  },
  {
    title: "Un vivier alimenté en continu",
    text: "Notre veille collecte et structure les profils en permanence. Vous ne repartez pas de zéro à chaque recrutement.",
  },
  {
    title: "Publication et diffusion de vos offres",
    text: "Vos annonces atteignent directement les candidats dont le profil correspond, y compris par notification WhatsApp — pas seulement ceux qui pensent à consulter votre site.",
  },
  {
    title: "Dossiers de candidature exploitables",
    text: "CV et lettres générés au format attendu, adaptés au poste visé. Vous recevez des dossiers lisibles, pas des pièces jointes hétéroclites.",
  },
];

const CONFIANCE = [
  {
    title: "Double consentement systématique",
    text: "Aucune coordonnée ne circule sans que les deux parties aient dit oui. C'est une contrainte technique, pas une intention affichée.",
  },
  {
    title: "Deux viviers, dans l'ordre",
    text: "D'abord les prestataires inscrits et publiés. Ensuite seulement, si le client le demande explicitement, l'ensemble de la communauté — dont les profils restent masqués jusqu'à leur propre acceptation.",
  },
  {
    title: "Une vitrine distincte du profil privé",
    text: "Se rendre visible comme prestataire est une décision séparée, avec son propre consentement. Votre profil personnel n'est jamais exposé par défaut.",
  },
  {
    title: "Modération effective",
    text: "Les vitrines sont contrôlables et suspendables. Une place de marché sans modération devient rapidement inutilisable pour tout le monde.",
  },
];

export default function EmploiPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        eyebrow="Solutions · Structures d'emploi"
        title="Le bon profil, qui a déjà dit oui."
        intro="Pour les recruteurs, agences d'emploi et cabinets de recrutement. Décrivez votre besoin : Malayka identifie les profils pertinents, les sollicite, et ne vous présente que ceux qui ont accepté. Vous ne relancez plus personne."
        actions={
          <>
            <Button size="lg" className="gap-2 font-semibold" onClick={() => navigate("/onboarding")}>
              Publier un besoin
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/a-propos")}>
              En savoir plus
            </Button>
          </>
        }
        footnote="Coordonnées échangées uniquement après accord des deux parties"
      />

      <Section
        eyebrow="La mise en relation"
        title="Six étapes, aucun contact imposé"
        intro="Le principe tient en une phrase : personne ne reçoit les coordonnées de personne sans l'avoir accepté."
        muted
      >
        <Steps items={DEROULE} />
      </Section>

      <Section
        eyebrow="Pour les recruteurs"
        title="Recruter sur des compétences, pas sur des déclarations"
      >
        <FeatureGrid items={RECRUTEURS} />
      </Section>

      <Section
        eyebrow="Nos garanties"
        title="Ce que la plateforme rend impossible"
        intro="Ces règles ne relèvent pas de la politique d'usage : elles sont inscrites dans le fonctionnement même du produit."
        muted
      >
        <FeatureGrid items={CONFIANCE} />
      </Section>

      <Section eyebrow="Devenir prestataire" title="L'autre côté de la place de marché">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            La mise en relation fonctionne dans les deux sens. Un professionnel, un
            freelance ou une petite structure peut créer sa vitrine : présentation,
            compétences, réalisations, zone d'intervention et tarifs indicatifs.
          </p>
          <p>
            Les demandes correspondantes lui parviennent ensuite automatiquement. Il
            accepte celles qui l'intéressent, ignore les autres. Aucune prospection, aucun
            abonnement pour être visible.
          </p>
          <p>
            Publier sa vitrine demande un consentement distinct de celui de l'inscription :
            se rendre visible auprès d'inconnus est une décision qui doit être prise
            sciemment, jamais par défaut.
          </p>
        </div>
      </Section>
    </>
  );
}
