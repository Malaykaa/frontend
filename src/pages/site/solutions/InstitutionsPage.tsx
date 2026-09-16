import { Link } from "react-router-dom";
import { School, Building2, Cpu, Compass, Database, ArrowRight } from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, CtaGroup, mailto,
} from "../_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "../_shared/media";
import { PinnedGallery } from "../_shared/scenes";
import { useT, type Translate } from "../_shared/lang";

const buildAudiences = (t: Translate) => [
  {
    Icon: School,
    title: t("Écoles & universités", "Schools & universities"),
    desc: t(
      "Donner à chaque enseignant une vision claire de la progression de ses étudiants, et aligner les programmes sur l'évolution réelle des métiers.",
      "Give every teacher a clear view of how their students are progressing, and align programmes with how occupations actually evolve.",
    ),
    meta: t("parcours · évaluation · suivi", "pathways · assessment · tracking"),
  },
  {
    Icon: Building2,
    title: t("Centres de formation", "Training centres"),
    desc: t(
      "Savoir quelles compétences le marché demande maintenant pour construire des offres de formation qui débouchent réellement.",
      "Know which skills the market is asking for now, so your courses actually lead somewhere.",
    ),
    meta: t("ingénierie de formation", "curriculum design"),
  },
  {
    Icon: Cpu,
    title: "EdTech",
    desc: t(
      "Alimenter vos produits avec des données structurées de compétences, métiers et formations — et des modèles ancrés sur le marché africain.",
      "Feed your products with structured data on skills, occupations and training — and models grounded in the African market.",
    ),
    meta: t("data · API · matching", "data · API · matching"),
    to: "/solutions/entreprises-ia",
  },
];

const buildDataUses = (t: Translate) => [
  {
    title: t("Matching formation → emploi", "Training → job matching"),
    desc: t(
      "Relier chaque formation aux métiers et compétences réellement demandés.",
      "Link every course to the occupations and skills actually in demand.",
    ),
  },
  {
    title: t("Orientation", "Guidance"),
    desc: t(
      "Guider les étudiants à partir des débouchés observés, pas des intuitions.",
      "Guide students from observed outcomes, not from hunches.",
    ),
  },
  {
    title: t("Référentiels de compétences", "Skills frameworks"),
    desc: t(
      "Mettre à jour vos référentiels avec les compétences qui progressent.",
      "Keep your frameworks current with the skills that are growing.",
    ),
  },
  {
    title: t("Insertion", "Placement"),
    desc: t(
      "Suivre ce que deviennent les diplômés et ajuster les programmes.",
      "Track where graduates end up and adjust the programmes.",
    ),
  },
];

export default function InstitutionsPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("Établissements & EdTech", "Institutions & EdTech")}
        image={MEDIA_ALIASES.institutions}
        lines={
          t.lang === "en"
            ? [
                "Train for a market",
                "you can actually",
                <span key="a" className="text-muted-foreground">observe.</span>,
              ]
            : [
                "Former pour un marché",
                "que l'on observe",
                <span key="a" className="text-muted-foreground">vraiment.</span>,
              ]
        }
        lead={t(
          "Malayka Éducative accompagne chaque étudiant et outille chaque enseignant. Malayka Data alimente vos produits et vos référentiels avec des données actualisées sur les métiers, compétences et formations.",
          "Malayka Éducative supports every student and equips every teacher. Malayka Data feeds your products and frameworks with current data on occupations, skills and training.",
        )}
        chain={
          t.lang === "en"
            ? ["Train", "Assess", "Detect", "Guide", "Place"]
            : ["Former", "Évaluer", "Détecter", "Orienter", "Insérer"]
        }
        primary={{
          label: t("Demander une démonstration", "Request a demo"),
          href: mailto("Démonstration — Établissement / EdTech"),
        }}
        secondary={{ label: t("Découvrir Malayka Éducative", "Discover Malayka Éducative"), to: "/produits/malayka-educative" }}
      />

      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour qui", "Who it is for")}
            title={t("Trois profils, deux produits.", "Three profiles, two products.")}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {buildAudiences(t).map((a, i) => (
            <Reveal key={a.title} delay={i * 90}>
              {a.to ? (
                <Link to={a.to} className="block h-full">
                  <FeatureCard {...a} />
                </Link>
              ) : (
                <FeatureCard {...a} />
              )}
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={t("Data pour l'éducation", "Data for education")}
              title={t(
                "Former pour un marché que l'on observe vraiment.",
                "Train for a market you can actually observe.",
              )}
              lead={t(
                "Un programme se construit sur plusieurs années ; le marché du travail, lui, bouge chaque mois. Nos données servent à réduire cet écart — et, pour les EdTech, à construire des produits ancrés sur des données africaines réelles.",
                "A programme takes years to build; the labour market moves every month. Our data exists to close that gap — and, for EdTech, to build products grounded in real African data.",
              )}
            />
            <Link
              to="/solutions/entreprises-ia"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
            >
              {t("Données d'entraînement pour vos modèles", "Training data for your models")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-4 sm:grid-cols-2">
              {buildDataUses(t).map((u) => (
                <Card key={u.title} className="h-full">
                  <Database className="h-4 w-4 text-primary" />
                  <p className="font-display mt-3 text-[15px] font-bold">{u.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{u.desc}</p>
                </Card>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <PinnedGallery
        eyebrow={t("Du programme à l'insertion", "From programme to placement")}
        lines={
          t.lang === "en" ? ["Three moments", "we equip."] : ["Trois moments", "que nous outillons."]
        }
        items={[
          {
            image: MEDIA.competences,
            label: t("Compétences réelles", "Real skills"),
            note: t(
              "Ce que le marché demande, mesuré et non supposé.",
              "What the market asks for, measured rather than assumed.",
            ),
          },
          {
            image: MEDIA.entraide,
            label: t("Accompagnement", "Support"),
            note: t("Chaque étudiant suivi individuellement.", "Every student followed individually."),
          },
          {
            image: MEDIA.reussite,
            label: t("Réussite", "Success"),
            note: t(
              "La progression rendue visible pour l'équipe pédagogique.",
              "Progress made visible to the teaching team.",
            ),
          },
        ]}
      />

      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t("Déployé en 48h, accompagnement inclus.", "Live in 48 hours, onboarding included.")}
              lead={t(
                "Nous configurons votre espace, formons vos équipes et restons disponibles pendant toute la prise en main.",
                "We set up your workspace, train your teams and stay available throughout the rollout.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{
                  label: t("Demander une démonstration", "Request a demo"),
                  href: mailto("Démonstration — Établissement / EdTech"),
                }}
                secondary={{ label: t("Voir la tarification", "See pricing"), to: "/tarification" }}
              />
            </div>
            <div className="mt-8 flex justify-center">
              <Compass className="h-5 w-5 text-primary/60" />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
