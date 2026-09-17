import { Briefcase, Brain, TrendingUp, GraduationCap, Database, Compass, Globe2, FlaskConical } from "lucide-react";
import { Reveal, Section, SectionHeading, PageHero, Card, CtaGroup, mailto } from "./_shared/ui";
import { useT, type Translate } from "./_shared/lang";

const buildCategories = (t: Translate) => [
  { Icon: Briefcase, label: t("Marché du travail", "Labour market") },
  { Icon: Brain, label: t("IA & emploi", "AI & employment") },
  { Icon: TrendingUp, label: t("Compétences", "Skills") },
  { Icon: GraduationCap, label: t("Éducation", "Education") },
  { Icon: Database, label: "Data" },
  { Icon: Compass, label: t("Carrière", "Careers") },
  { Icon: Globe2, label: t("Afrique", "Africa") },
  { Icon: FlaskConical, label: t("Recherche", "Research") },
];

const buildTopics = (t: Translate) => [
  {
    category: t("Marché du travail", "Labour market"),
    title: t(
      "Quels métiers vont recruter le plus en Afrique ?",
      "Which occupations will hire the most in Africa?",
    ),
    desc: t(
      "Ce que dix ans de signaux disent des secteurs qui accélèrent, et de ceux qui ralentissent.",
      "What ten years of signals say about the sectors picking up, and those slowing down.",
    ),
  },
  {
    category: t("Marché du travail", "Labour market"),
    title: t(
      "Pourquoi le marché du travail africain ne se résume pas aux CDI et CDD",
      "Why the African labour market is far more than permanent and fixed-term contracts",
    ),
    desc: t(
      "Freelance, prestations, missions et opportunités informelles : la part invisible du marché.",
      "Freelance work, services, assignments and informal opportunities: the market's invisible half.",
    ),
  },
  {
    category: t("Compétences", "Skills"),
    title: t(
      "Les compétences qui progressent le plus rapidement",
      "The skills growing fastest",
    ),
    desc: t(
      "Lecture des compétences dont la demande augmente, par secteur et par pays.",
      "A read on the skills whose demand is rising, by sector and by country.",
    ),
  },
  {
    category: t("IA & emploi", "AI & employment"),
    title: t(
      "Comment l'IA transforme l'orientation professionnelle",
      "How AI is reshaping career guidance",
    ),
    desc: t(
      "De la recherche manuelle à la surveillance continue du marché : ce qui change concrètement.",
      "From manual searching to continuous market monitoring: what actually changes.",
    ),
  },
];

export default function ResourcesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("Ressources", "Resources")}
        lines={["Malayka", <span key="a" className="text-muted-foreground">Insights.</span>]}
        lead={t(
          "Comprendre les transformations du travail, des compétences et de l'éducation en Afrique, à partir de nos propres données.",
          "Understanding how work, skills and education are changing across Africa, from our own data.",
        )}
      />

      <Section tone="default">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {buildCategories(t).map((c) => (
              <span
                key={c.label}
                className="flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-1.5 text-[13px] text-muted-foreground"
              >
                <c.Icon className="h-3.5 w-3.5 text-primary" />
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-12 max-w-2xl text-sm text-muted-foreground">
            {t(
              "Nos premiers articles arrivent bientôt. Voici les sujets sur lesquels notre équipe travaille actuellement :",
              "Our first articles are on the way. Here is what the team is working on right now:",
            )}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {buildTopics(t).map((topic, i) => (
            <Reveal key={topic.title} delay={i * 80}>
              <Card className="flex h-full flex-col">
                <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-primary">
                  {topic.category}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold leading-snug">{topic.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{topic.desc}</p>
                <span className="mt-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
                  {t("Bientôt disponible", "Coming soon")}
                </span>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t(
                "Une question sur le marché du travail africain ?",
                "A question about the African labour market?",
              )}
              lead={t(
                "Notre équipe Data peut produire des analyses sur mesure à partir de nos données : secteurs, territoires, compétences, périodes.",
                "Our Data team can produce bespoke analysis from our data: sectors, territories, skills, time periods.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{
                  label: t("Contacter l'équipe Data", "Contact the Data team"),
                  href: mailto("Malayka Insights : demande d'analyse"),
                }}
                secondary={{ label: t("Explorer Malayka Data", "Explore Malayka Data"), to: "/produits/malayka-data" }}
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
