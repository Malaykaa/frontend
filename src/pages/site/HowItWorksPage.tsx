import { Link } from "react-router-dom";
import { Search, Layers, Brain, UserCheck, Zap, ArrowRight } from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FlowChain, CtaGroup, mailto, StickySteps,
} from "./_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "./_shared/media";
import { CircularFlow } from "./_shared/scenes";
import { Mark } from "./_shared/emphasis";
import { useT, type Translate } from "./_shared/lang";

/** Les cinq verbes de la chaîne, réutilisés au hero et dans la boucle. */
const CHAIN = (t: Translate) =>
  t.lang === "en"
    ? ["Collect", "Structure", "Understand", "Personalise", "Act"]
    : ["Collecter", "Structurer", "Comprendre", "Personnaliser", "Agir"];

const buildSteps = (t: Translate) => [
  {
    n: "01",
    Icon: Search,
    title: t("Collecter", "Collect"),
    desc: t(
      "Malayka agrège en continu les signaux provenant de centaines de sources : sites d'emploi, plateformes professionnelles et freelance, réseaux sociaux, institutions, Telegram, communautés, API partenaires et recherches terrain.",
      "Malayka continuously aggregates signals from hundreds of sources: job boards, professional and freelance platforms, social media, institutions, Telegram, communities, partner APIs and field research.",
    ),
    meta: t("sources formelles et informelles", "formal and informal sources"),
  },
  {
    n: "02",
    Icon: Layers,
    title: t("Structurer", "Structure"),
    desc: t(
      "Les données sont nettoyées, dédupliquées, normalisées et annotées par des experts africains selon notre taxonomie : métiers, compétences, secteurs, niveaux, localisation, rémunération.",
      "Data is cleaned, deduplicated, normalised and annotated by African experts against our taxonomy: occupations, skills, sectors, levels, location, pay.",
    ),
    meta: t("IA + annotation humaine", "AI + human annotation"),
  },
  {
    n: "03",
    Icon: Brain,
    title: t("Comprendre", "Understand"),
    desc: t(
      "Nos systèmes analysent les métiers, compétences, formations et opportunités, et les relient entre eux. L'historisation permet d'observer les évolutions plutôt qu'un instantané.",
      "Our systems analyse occupations, skills, training and opportunities, and link them to one another. Historisation lets us observe movement rather than a snapshot.",
    ),
    meta: t("graphe + profondeur historique", "graph + historical depth"),
  },
  {
    n: "04",
    Icon: UserCheck,
    title: t("Personnaliser", "Personalise"),
    desc: t(
      "L'intelligence est croisée avec le profil, les objectifs et les compétences de chaque utilisateur — ou avec le périmètre d'une institution : territoire, secteur, programme.",
      "The intelligence is matched against each user's profile, goals and skills — or against an institution's scope: territory, sector, programme.",
    ),
    meta: t("individus et institutions", "individuals and institutions"),
  },
  {
    n: "05",
    Icon: Zap,
    title: t("Agir", "Act"),
    desc: t(
      "Malayka recommande, alerte et accompagne : opportunités envoyées sur WhatsApp, plans d'action, tableaux de bord temps réel, datasets et API pour les organisations.",
      "Malayka recommends, alerts and supports: opportunities sent over WhatsApp, action plans, real-time dashboards, datasets and APIs for organisations.",
    ),
    meta: t("recommandation · alerte · décision", "recommendation · alert · decision"),
  },
];

export default function HowItWorksPage() {
  const t = useT();
  const STEPS = buildSteps(t);
  return (
    <>
      <PageHero
        eyebrow={t("Comment ça marche", "How it works")}
        image={MEDIA_ALIASES.howItWorks}
        lines={
          t.lang === "en"
            ? ["From data", <span key="a" className="text-muted-foreground">to action.</span>]
            : ["De la donnée", <span key="a" className="text-muted-foreground">à l'action.</span>]
        }
        lead={t(
          "Malayka n'est pas un scraper, ni une job board, ni seulement un chatbot. C'est une chaîne complète, de la collecte des signaux jusqu'à la décision concrète — pour une personne comme pour une institution.",
          "Malayka is not a scraper, nor a job board, nor merely a chatbot. It is a complete chain, from gathering signals to the concrete decision — for a person as much as for an institution.",
        )}
        chain={CHAIN(t)}
        primary={{ label: t("Commencer avec Malayka", "Get started with Malayka"), to: "/onboarding" }}
        secondary={{ label: t("Explorer Malayka Data", "Explore Malayka Data"), to: "/produits/malayka-data" }}
      />

      <StickySteps
        tone="light"
        eyebrow={t("Les cinq étapes", "The five steps")}
        lines={
          t.lang === "en"
            ? ["Collect.", "Structure.", "Understand.", "Personalise.", "Act."]
            : ["Collecter.", "Structurer.", "Comprendre.", "Personnaliser.", "Agir."]
        }
        lead={t(
          "Chaque étape produit la matière de la suivante. C'est cette chaîne — et pas un modèle isolé — qui rend l'intelligence exploitable.",
          "Each step produces the raw material for the next. It is that chain — not any single model — that makes the intelligence usable.",
        )}
        steps={STEPS}
      />

      <CircularFlow
        eyebrow={t("Une chaîne, pas une étape", "A chain, not a step")}
        steps={CHAIN(t)}
        image={MEDIA.vision}
      />

      <Section>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("La chaîne complète", "The full chain")}
            title={
              t.lang === "en" ? (
                <>Sources → Intelligence → <Mark>Results</Mark></>
              ) : (
                <>Sources → Intelligence → <Mark>Résultats</Mark></>
              )
            }
          />
        </Reveal>
        <Reveal delay={120}>
          <FlowChain
            className="mt-12 justify-center"
            steps={
              t.lang === "en"
                ? ["Sources", "Collection", "Structuring", "Human annotation", "Validation", "Historisation", "Intelligence", "Datasets / API", "Applications", "Results"]
                : ["Sources", "Collecte", "Structuration", "Annotation humaine", "Validation", "Historisation", "Intelligence", "Datasets / API", "Applications", "Résultats"]
            }
          />
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              { title: t("Pour les particuliers", "For individuals"), desc: t("Opportunités, formations et plan d'action personnalisés.", "Personalised opportunities, training and action plan."), to: "/solutions/particuliers" },
              { title: t("Pour les institutions", "For institutions"), desc: t("Observatoires temps réel, suivi d'impact et aide à la décision.", "Real-time observatories, impact tracking and decision support."), to: "/solutions/gouvernements" },
              { title: t("Pour les entreprises d'IA", "For AI companies"), desc: t("Datasets annotés, benchmarks et API pour vos modèles.", "Annotated datasets, benchmarks and APIs for your models."), to: "/solutions/entreprises-ia" },
            ].map((c) => (
              <Link key={c.title} to={c.to}>
                <Card className="h-full">
                  <h3 className="font-display text-base font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {t("En savoir plus", "Learn more")}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section tone="default">
        <Reveal>
          <div className="flex justify-center">
            <CtaGroup
              primary={{ label: t("Commencer avec Malayka", "Get started with Malayka"), to: "/onboarding" }}
              secondary={{ label: t("Parler à notre équipe", "Talk to our team"), href: mailto("Comment ça marche — question") }}
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
