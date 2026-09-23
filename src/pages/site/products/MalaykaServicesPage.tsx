import {
  ClipboardCheck, Bot, Server, RefreshCw, Building2, HeartHandshake,
  Briefcase, Landmark, GraduationCap, Database, UserCheck, Layers,
  Cpu, Rocket, Users, Check,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, FeatureCard, FlowChain,
  CtaGroup, mailto, StickySteps,
} from "../_shared/ui";
import { MEDIA } from "../_shared/media";
import { DataJourney } from "../_shared/scenes";
import { Mark, Underline } from "../_shared/emphasis";
import { useT, type Translate } from "../_shared/lang";

const buildServices = (t: Translate) => [
  {
    Icon: ClipboardCheck,
    title: t("Annotation & préparation des données", "Data annotation & preparation"),
    desc: t(
      "Nous nettoyons, structurons, classifions et annotons vos données pour les rendre exploitables par vos systèmes d'IA.",
      "We clean, structure, classify and annotate your data to make it usable by your AI systems.",
    ),
    meta: t(
      "Données documentaires, RH, clients, métiers, pédagogiques, opérationnelles, conversations, bases internes",
      "Documents, HR, customer, domain, education, operational, conversation and internal-database data",
    ),
  },
  {
    Icon: Bot,
    title: t("IA sur vos données", "AI on your data"),
    desc: t(
      "Nous adaptons des modèles open source à vos besoins et à vos données.",
      "We adapt open-source models to your needs and to your data.",
    ),
    meta: t(
      "RAG · fine-tuning · agents IA · assistants spécialisés · classification et extraction",
      "RAG · fine-tuning · AI agents · specialised assistants · classification and extraction",
    ),
  },
  {
    Icon: Server,
    title: t("Déploiement IA", "AI deployment"),
    desc: t(
      "Nous déployons votre solution sur vos propres serveurs, sur notre infrastructure ou dans une architecture hybride.",
      "We deploy your solution on your own servers, on our infrastructure, or in a hybrid setup.",
    ),
    meta: t(
      "Adapté à vos exigences de confidentialité, de sécurité et de souveraineté",
      "Fitted to your requirements on confidentiality, security and sovereignty",
    ),
  },
  {
    Icon: RefreshCw,
    title: t("Maintenance & évolution", "Maintenance & evolution"),
    desc: t(
      "Nous assurons le fonctionnement et l'amélioration continue de votre solution.",
      "We keep your solution running and improve it over time.",
    ),
    meta: t(
      "Maintenance · monitoring · nouvelles données · mises à jour · optimisation",
      "Maintenance · monitoring · new data · updates · optimisation",
    ),
  },
];

const buildJourney = (t: Translate) => [
  { Icon: Database, label: t("Données brutes", "Raw data"), hint: t("collecte", "collection") },
  { Icon: UserCheck, label: t("Annotation humaine", "Human annotation"), hint: t("qualification", "qualification") },
  { Icon: Layers, label: t("Données structurées", "Structured data"), hint: t("taxonomie", "taxonomy") },
  { Icon: Cpu, label: t("RAG / fine-tuning", "RAG / fine-tuning"), hint: t("adaptation", "adaptation") },
  { Icon: Bot, label: t("Modèle IA", "AI model"), hint: t("intelligence", "intelligence") },
  { Icon: Rocket, label: t("Déploiement", "Deployment") , hint: t("mise en service", "go-live") },
  { Icon: Users, label: t("Utilisateur final", "End user"), hint: t("usage", "usage") },
];

const buildSteps = (t: Translate) => [
  {
    n: "01",
    title: t("Comprendre", "Understand"),
    desc: t(
      "Nous analysons vos données, votre environnement et votre problème métier.",
      "We analyse your data, your environment and your business problem.",
    ),
  },
  {
    n: "02",
    title: t("Préparer", "Prepare"),
    desc: t(
      "Nous nettoyons, structurons et annotons vos données.",
      "We clean, structure and annotate your data.",
    ),
  },
  {
    n: "03",
    title: t("Construire", "Build"),
    desc: t(
      "Nous choisissons l'approche la plus pertinente : RAG, fine-tuning, agents, modèles open source ou combinaison de plusieurs technologies.",
      "We choose the most relevant approach: RAG, fine-tuning, agents, open-source models, or a combination of several technologies.",
    ),
  },
  {
    n: "04",
    title: t("Déployer", "Deploy"),
    desc: t(
      "Sur vos serveurs, notre infrastructure ou une architecture hybride.",
      "On your servers, our infrastructure, or a hybrid setup.",
    ),
  },
  {
    n: "05",
    title: t("Faire évoluer", "Evolve"),
    desc: t(
      "Nous assurons, selon votre besoin, la maintenance, le monitoring et l'amélioration continue.",
      "As needed, we handle maintenance, monitoring and continuous improvement.",
    ),
  },
];

const buildProfiles = (t: Translate) => [
  {
    Icon: Building2,
    title: t("Entreprises & grands groupes", "Companies & large organisations"),
    desc: t(
      "Solutions IA internes, automatisation, recherche intelligente et exploitation des connaissances.",
      "Internal AI solutions, automation, intelligent search and knowledge exploitation.",
    ),
  },
  {
    Icon: HeartHandshake,
    title: t("ONG & fondations", "NGOs & foundations"),
    desc: t(
      "Structuration des données, analyse documentaire, reporting et intelligence des programmes.",
      "Data structuring, document analysis, reporting and programme intelligence.",
    ),
  },
  {
    Icon: Briefcase,
    title: t("Cabinets & consultants", "Firms & consultants"),
    desc: t(
      "Assistants spécialisés, analyse de documents, recherche et automatisation des processus.",
      "Specialised assistants, document analysis, research and process automation.",
    ),
  },
  {
    Icon: Landmark,
    title: t("Organisations & institutions", "Organisations & institutions"),
    desc: t(
      "Solutions IA adaptées aux données, processus et contraintes spécifiques.",
      "AI solutions fitted to specific data, processes and constraints.",
    ),
  },
  {
    Icon: GraduationCap,
    title: t("Établissements & acteurs de la formation", "Education providers & training bodies"),
    desc: t(
      "Données éducatives, assistants IA, analyse de contenus et solutions intelligentes pour l'apprentissage.",
      "Education data, AI assistants, content analysis and intelligent solutions for learning.",
    ),
  },
];

export default function MalaykaServicesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow="Malayka Services"
        image={MEDIA.iaSecteur}
        lines={
          t.lang === "en"
            ? [
                "Your AI. Your data.",
                <span key="a" className="text-muted-foreground">Your infrastructure.</span>,
              ]
            : [
                "Votre IA. Vos données.",
                <span key="a" className="text-muted-foreground">Votre infrastructure.</span>,
              ]
        }
        lead={t(
          "Nous préparons vos données, adaptons des modèles d'IA et déployons des solutions adaptées à vos besoins, sur votre infrastructure ou la nôtre.",
          "We prepare your data, adapt AI models and deploy solutions fitted to your needs, on your infrastructure or ours.",
        )}
        chain={
          t.lang === "en"
            ? ["Data", "Annotation", "Model", "Deployment"]
            : ["Données", "Annotation", "Modèle", "Déploiement"]
        }
        primary={{ label: t("Parler à un expert", "Talk to an expert"), href: mailto("Malayka Services : parler à un expert") }}
        secondary={{ label: t("Voir nos services", "See our services"), to: "/produits/malayka-services#services" }}
      />

      {/* Le parcours d'une donnée, de brute à exploitée : compris en quelques secondes. */}
      <DataJourney
        eyebrow={t("De la donnée brute à l'intelligence exploitable", "From raw data to usable intelligence")}
        lines={
          t.lang === "en"
            ? ["The same journey,", "every time."]
            : ["Le même parcours,", "à chaque fois."]
        }
        lead={t(
          "Quel que soit le point de départ de votre projet, la donnée traverse les mêmes étapes avant de devenir une intelligence dont vos équipes se servent réellement.",
          "Whatever your project starts from, data crosses the same stages before it becomes intelligence your teams actually use.",
        )}
        steps={buildJourney(t)}
      />

      {/* Nos services */}
      <Section tone="muted" id="services">
        <Reveal>
          <SectionHeading
            eyebrow={t("Nos services", "Our services")}
            title={
              t.lang === "en" ? (
                <>Four services, <Mark>one continuous chain</Mark>.</>
              ) : (
                <>Quatre services, <Mark>une seule chaîne</Mark>.</>
              )
            }
            lead={t(
              "Vous pouvez nous confier un maillon de la chaîne ou l'ensemble du projet, de la préparation des données jusqu'à la maintenance.",
              "You can hand us a single link in the chain, or the whole project, from data preparation through to maintenance.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {buildServices(t).map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <FeatureCard {...s} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Comment ça fonctionne */}
      <StickySteps
        eyebrow={t("Comment ça fonctionne", "How it works")}
        lines={
          t.lang === "en"
            ? ["Five steps.", "One team, from data to production."]
            : ["Cinq étapes.", "Une équipe, de la donnée à la production."]
        }
        steps={buildSteps(t)}
      />

      {/* Pour qui */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour votre organisation", "For your organisation")}
            title={t("Une offre, cinq façons de s'en servir.", "One offering, five ways to use it.")}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {buildProfiles(t).map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <FeatureCard {...p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Positionnement */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            align="center"
            title={
              t.lang === "en" ? (
                <>We do not <Underline variante="epais">only build software</Underline>.</>
              ) : (
                <>Nous ne construisons <Underline variante="epais">pas uniquement des logiciels</Underline>.</>
              )
            }
            lead={t(
              "Nous travaillons sur toute la chaîne, avant même le modèle : la qualité et la structuration de vos données, puis leur déploiement opérationnel.",
              "We work across the whole chain, starting before the model: the quality and structuring of your data, then its operational deployment.",
            )}
          />
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-12 flex justify-center">
            <FlowChain
              steps={
                t.lang === "en"
                  ? ["Data", "Annotation", "Intelligence", "Model", "Deployment", "Maintenance"]
                  : ["Données", "Annotation", "Intelligence", "Modèle", "Déploiement", "Maintenance"]
              }
              className="justify-center"
            />
          </div>
        </Reveal>
      </Section>

      {/* Tarification */}
      <Section id="tarification">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-3 font-mono type-label font-semibold text-foreground/45">
                <span className="h-px w-8 bg-foreground/25" />
                {t("Tarification", "Pricing")}
              </span>
            </div>
            <p className="font-display mt-8 text-[clamp(2.5rem,5.5vw,4rem)] font-semibold leading-none text-foreground">
              {t("À partir de 150 000 FCFA", "Starting at 150,000 FCFA")}
            </p>
            <p className="type-lead mt-7 text-muted-foreground">
              {t(
                "Le tarif dépend du volume de données, de la complexité du projet, du modèle utilisé et de l'infrastructure nécessaire.",
                "The price depends on the volume of data, the complexity of the project, the model used and the infrastructure required.",
              )}
            </p>
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Demander une estimation", "Request an estimate"), href: mailto("Malayka Services : demande d'estimation") }}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      {/* CTA final */}
      <Section tone="muted">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t("Parlons de votre projet.", "Let's talk about your project.")}
              lead={t(
                "Décrivez-nous vos données et vos contraintes, nous vous proposons l'approche la plus pertinente.",
                "Tell us about your data and your constraints, and we will propose the most relevant approach.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Parler à un expert", "Talk to an expert"), href: mailto("Malayka Services : parler à un expert") }}
                secondary={{ label: t("Demander une estimation", "Request an estimate"), href: mailto("Malayka Services : demande d'estimation") }}
              />
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              {(t.lang === "en"
                ? ["Not only development", "Not only consulting", "The full data-to-deployment chain"]
                : ["Pas seulement du développement", "Pas seulement du conseil", "Toute la chaîne, de la donnée au déploiement"]
              ).map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  {i === 2 ? <Check className="h-3.5 w-3.5 text-primary" /> : <span className="text-foreground/20">✕</span>}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
