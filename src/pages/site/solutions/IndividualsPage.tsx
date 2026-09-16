import { GraduationCap, Briefcase, Search, Zap, UserCog, Rocket } from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, FeatureCard, CtaGroup, FlowChain,
} from "../_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "../_shared/media";
import { ShrinkingPhoto } from "../_shared/scenes";
import { Mark, Underline } from "../_shared/emphasis";
import { useT, type Translate } from "../_shared/lang";

const buildProfiles = (t: Translate) => [
  {
    Icon: GraduationCap,
    title: t("Étudiants", "Students"),
    desc: t(
      "Trouver des bourses, des stages et comprendre quelles compétences préparer avant la sortie.",
      "Find scholarships and internships, and work out which skills to build before graduating.",
    ),
    meta: t("bourses · stages · orientation", "scholarships · internships · guidance"),
  },
  {
    Icon: Rocket,
    title: t("Jeunes diplômés", "Recent graduates"),
    desc: t(
      "Passer du diplôme au premier poste avec un plan d'action clair et des candidatures prêtes.",
      "Go from degree to first job with a clear action plan and applications ready to send.",
    ),
    meta: t("premier emploi · dossiers", "first job · applications"),
  },
  {
    Icon: Search,
    title: t("Chercheurs d'emploi", "Job seekers"),
    desc: t(
      "Recevoir les offres qui correspondent vraiment, sans parcourir dix plateformes chaque jour.",
      "Get the openings that genuinely fit, without trawling ten platforms every day.",
    ),
    meta: t("matching · alertes WhatsApp", "matching · WhatsApp alerts"),
  },
  {
    Icon: Zap,
    title: t("Freelances", "Freelancers"),
    desc: t(
      "Capter les missions et demandes de prestation, y compris celles qui circulent hors plateformes.",
      "Catch assignments and client requests, including the ones that never reach a platform.",
    ),
    meta: t("missions · prestations", "assignments · services"),
  },
  {
    Icon: UserCog,
    title: t("Professionnels", "Professionals"),
    desc: t(
      "Suivre l'évolution de son métier, identifier ses écarts de compétences et se repositionner à temps.",
      "Track how your occupation is changing, spot your skill gaps, and reposition in time.",
    ),
    meta: t("évolution · reconversion", "change · career shift"),
  },
  {
    Icon: Briefcase,
    title: t("Entrepreneurs", "Entrepreneurs"),
    desc: t(
      "Repérer les appels à projets, financements et programmes d'accompagnement pertinents.",
      "Spot the calls for projects, funding and support programmes that are actually relevant.",
    ),
    meta: t("financements · appels à projets", "funding · calls for projects"),
  },
];

export default function IndividualsPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("Pour les particuliers", "For individuals")}
        image={MEDIA_ALIASES.individuals}
        lines={
          t.lang === "en"
            ? [
                "Find your",
                "next opportunity.",
                <span key="a" className="text-muted-foreground">Build what comes after.</span>,
              ]
            : [
                "Trouvez votre",
                "prochaine opportunité.",
                <span key="a" className="text-muted-foreground">Construisez la suite.</span>,
              ]
        }
        lead={t(
          "Malayka IA observe le marché à votre place : emplois, stages, missions, formations, bourses et financements. Elle analyse votre profil, détecte vos écarts de compétences et vous accompagne jusqu'à l'action.",
          "Malayka IA watches the market for you: jobs, internships, assignments, training, scholarships and funding. It analyses your profile, spots your skill gaps, and stays with you through to action.",
        )}
        chain={
          t.lang === "en"
            ? ["Profile", "Goals", "Matching", "Action"]
            : ["Profil", "Objectifs", "Matching", "Action"]
        }
        primary={{ label: t("Commencer gratuitement", "Start for free"), to: "/onboarding" }}
        secondary={{ label: t("Découvrir Malayka IA", "Discover Malayka IA"), to: "/produits/malayka-ia" }}
      />

      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour qui", "Who it is for")}
            title={
              t.lang === "en" ? (
                <>
                  Whatever your path, the starting point is the same:{" "}
                  <Underline variante="trait">knowing where you stand</Underline>.
                </>
              ) : (
                <>
                  Quel que soit votre parcours, le point de départ est le même :{" "}
                  <Underline variante="trait">savoir où vous en êtes</Underline>.
                </>
              )
            }
            lead={t(
              "Malayka s'adapte à votre situation et à votre objectif, puis surveille en continu ce qui peut vous faire avancer.",
              "Malayka adapts to your situation and your goal, then watches continuously for whatever can move you forward.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildProfiles(t).map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <FeatureCard {...p} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ShrinkingPhoto
        image={MEDIA.horizon}
        eyebrow={t("Votre trajectoire", "Your trajectory")}
        lines={
          t.lang === "en"
            ? ["Know where you are.", "See where it leads."]
            : ["Savoir où vous êtes.", "Voir où ça mène."]
        }
        facts={[
          {
            label: t("de correspondance sur les offres retenues", "match on shortlisted openings"),
            value: t("92 %", "92%"),
          },
          {
            label: t("délai moyen pour décrocher une opportunité", "average time to land an opportunity"),
            value: t("12 jours", "12 days"),
          },
          {
            label: t("pour générer un dossier complet", "to generate a complete application"),
            value: t("8 sec", "8 sec"),
          },
          { label: t("pays visés", "countries targeted"), value: "25" },
        ]}
      />

      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={
                t.lang === "en" ? (
                  <>Opportunities come <Mark>to you</Mark>.</>
                ) : (
                  <>Les opportunités viennent <Mark>à vous</Mark>.</>
                )
              }
              lead={t(
                "Créez votre profil, définissez votre objectif, et laissez Malayka observer le marché — les opportunités pertinentes arrivent jusque sur WhatsApp.",
                "Create your profile, set your goal, and let Malayka watch the market — the relevant opportunities arrive right on WhatsApp.",
              )}
            />
            <FlowChain
              className="mt-10 justify-center"
              steps={
                t.lang === "en"
                  ? ["Continuous monitoring", "Matching", "Opportunity", "WhatsApp"]
                  : ["Surveillance continue", "Matching", "Opportunité", "WhatsApp"]
              }
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Commencer gratuitement", "Start for free"), to: "/onboarding" }}
                secondary={{ label: t("Se connecter", "Log in"), to: "/login" }}
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
