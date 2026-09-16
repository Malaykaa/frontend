import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles, GraduationCap, Database, Cpu, Landmark, Building2, Users,
  ArrowRight, Check, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Reveal, RevealLines, Eyebrow, Section, SectionHeading, FlowChain, Card,
  Stat, CtaGroup, StickySteps, ImageBand, ScrollCue, mailto, PhotoCard,
  InlinePhoto, Marquee, SlideIn, DiagonalPhotos, SitePhoto,
} from "./_shared/ui";
import { MalaykaDemo } from "./_shared/MalaykaDemo";
import { MetricsBoard } from "./_shared/scenes";
import { DataConstellation } from "./_shared/DataConstellation";
import { SkillsTerminal } from "./_shared/SkillsTerminal";
import { HeroEngine } from "./_shared/HeroEngine";
import { ShapingManifesto } from "./_shared/statements";
import { Mark, Underline, Circled, Hatched, StatementBand } from "./_shared/emphasis";
import { MEDIA, MEDIA_ALIASES, light } from "./_shared/media";
import { useT, type Translate } from "./_shared/lang";

/* Hero */

function Hero() {
  const t = useT();
  return (
    <section className="on-dark relative flex min-h-[94vh] flex-col justify-center overflow-hidden bg-[#0a0a0a] pb-20 pt-36 text-foreground">
      <SitePhoto
        image={MEDIA.home}
        loading="eager"
        className="kenburns pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/78 to-[#0a0a0a]/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/60" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <Eyebrow>Human Capital Intelligence</Eyebrow>
            </Reveal>

            <RevealLines
              as="h1"
              stagger={120}
              className="type-display mt-9"
              lines={
                t.lang === "en"
                  ? [
                      "The intelligence",
                      "of African human",
                      <span key="a" className="text-muted-foreground">capital.</span>,
                    ]
                  : [
                      "L'intelligence",
                      "du capital humain",
                      <span key="a" className="text-muted-foreground">africain.</span>,
                    ]
              }
            />

            <Reveal delay={420}>
              <p className="type-lead mt-10 max-w-lg text-muted-foreground">
                {t(
                  "Comprendre ce qui change. Anticiper les opportunités. Agir au bon moment.",
                  "Understand what is changing. Anticipate opportunity. Act at the right moment.",
                )}
              </p>
              <CtaGroup
                className="mt-10"
                primary={{ label: t("Découvrir Malayka", "Discover Malayka"), to: "/onboarding" }}
                secondary={{ label: t("Parler à notre équipe", "Talk to our team"), href: mailto("Parler à l'équipe Malayka") }}
              />
              <FlowChain steps={["Data", "Intelligence", "Action"]} className="mt-12" />
            </Reveal>
          </div>

          <Reveal delay={300} className="hidden justify-end lg:flex">
            <HeroEngine />
          </Reveal>
        </div>

        <Reveal delay={700}>
          <div className="mt-20">
            <ScrollCue />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Le problème */

function Problem() {
  const t = useT();
  return (
    <Section>
      <RevealLines
        lines={
          t.lang === "en"
            ? ["Human capital is everywhere.", <span key="b" className="text-muted-foreground">The intelligence is <Hatched>fragmented</Hatched>.</span>]
            : ["Le capital humain est partout.", <span key="b" className="text-muted-foreground">L'intelligence est <Hatched>fragmentée</Hatched>.</span>]
        }
        className="type-h2 max-w-4xl text-foreground"
      />
      <Reveal delay={260}>
        <p className="type-lead mt-10 max-w-2xl text-muted-foreground">
          {t.lang === "en" ? (
            <>
              Labour-market signals are{" "}
              <Underline variante="trait" className="text-foreground">scattered</Underline> across
              professional networks, job boards, social media, freelance platforms, institutional
              sites, Telegram groups and communities.
            </>
          ) : (
            <>
              Les signaux du marché du travail sont{" "}
              <Underline variante="trait" className="text-foreground">dispersés</Underline> entre
              plateformes professionnelles, sites d'emploi, réseaux sociaux, plateformes freelance,
              sites institutionnels, groupes Telegram et communautés.
            </>
          )}
        </p>
      </Reveal>

      <div className="mt-20 grid gap-10 md:grid-cols-3 md:gap-8">
        {[
          {
            k: t("Collecter", "Collect"),
            t: t("Nous trouvons les signaux.", "We find the signals."),
            d: t(
              "Offres, métiers, compétences, formations, financements et opportunités — y compris hors des canaux officiels.",
              "Openings, occupations, skills, training, funding and opportunities — including outside official channels.",
            ),
            img: MEDIA_ALIASES.focus,
          },
          {
            k: t("Comprendre", "Understand"),
            t: t("Nous structurons les données.", "We structure the data."),
            d: t(
              "Normalisation, classification, annotation humaine, historisation et analyse des évolutions.",
              "Normalisation, classification, human annotation, historisation and change analysis.",
            ),
            img: MEDIA.annotation,
          },
          {
            k: t("Agir", "Act"),
            t: t("Nous produisons des décisions.", "We produce decisions."),
            d: t(
              "Matching, recommandations, alertes, plans d'action et accompagnement jusqu'au concret.",
              "Matching, recommendations, alerts, action plans and support all the way to the concrete result.",
            ),
            img: MEDIA_ALIASES.community,
          },
        ].map((b, i) => (
          <Reveal key={b.k} delay={i * 120}>
            <PhotoCard image={light(b.img)} eyebrow={b.k} title={b.t} desc={b.d} ratio="5/4" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Ce que le moteur produit, en chiffres — le « comment » avant le « pourquoi ». */
function Performance() {
  const t = useT();
  return (
    <MetricsBoard
      eyebrow={t("Ce que le moteur produit", "What the engine produces")}
      lines={
        t.lang === "en" ? ["An infrastructure", "can be measured."] : ["Une infrastructure", "se mesure."]
      }
      lead={t(
        "Ces indicateurs décrivent le fonctionnement courant de Malayka : ce que le moteur observe, ce qu'il produit, et à quelle vitesse.",
        "These indicators describe how Malayka runs day to day: what the engine watches, what it produces, and how fast.",
      )}
      metrics={[
        { value: "100K+", label: t("opportunités scannées chaque semaine", "opportunities scanned every week") },
        { value: "1 200+", label: t("sources actives connectées", "active sources connected"), count: { to: 1200, suffix: "+" } },
        { value: "1K+", label: t("objectifs créés chaque jour", "goals created every day") },
        { value: "25", label: t("pays visés", "countries targeted"), count: { to: 25 } },
        { value: t("91 %", "91%"), label: t("précision du score de matching IA", "accuracy of the AI matching score") },
        { value: t("12 jours", "12 days"), label: t("délai moyen pour décrocher une opportunité", "average time to land an opportunity") },
        { value: t("8 sec", "8 sec"), label: t("pour générer un dossier complet", "to generate a complete application") },
        { value: "24/7", label: t("surveillance du marché", "market monitoring") },
      ]}
    />
  );
}

/** Ruban des sources surveillées, qui défile sans fin. */
function SourceMarquee() {
  const t = useT();
  return (
    <Marquee
      items={
        t.lang === "en"
          ? [
              "Job boards", "Freelance platforms", "Professional networks", "Telegram",
              "Institutional sites", "Calls for projects", "Scholarships", "Communities",
              "Partner APIs", "Field research",
            ]
          : [
              "Sites d'emploi", "Plateformes freelance", "Réseaux professionnels", "Telegram",
              "Sites institutionnels", "Appels à projets", "Bourses", "Communautés",
              "API partenaires", "Recherches terrain",
            ]
      }
    />
  );
}

/* Data engine */

function DataEngine() {
  const t = useT();
  return (
    <StickySteps
      eyebrow={t("Notre Data Engine", "Our Data Engine")}
      lines={
        t.lang === "en"
          ? ["Technology collects.", "People make sense of it.", "AI transforms it."]
          : ["La technologie collecte.", "L'humain comprend.", "L'IA transforme."]
      }
      lead={t(
        "Nous combinons l'échelle de l'automatisation avec l'intelligence humaine et la connaissance du terrain.",
        "We combine the scale of automation with human judgement and ground knowledge.",
      )}
      image={MEDIA.modeles}
      steps={[
        {
          n: "01",
          title: t("Collecte", "Collection"),
          desc: t(
            "Sites d'emploi, plateformes professionnelles et freelance, réseaux sociaux, institutions, Telegram, communautés, API partenaires et recherches terrain.",
            "Job boards, professional and freelance platforms, social media, institutions, Telegram, communities, partner APIs and field research.",
          ),
        },
        {
          n: "02",
          title: t("Structuration", "Structuring"),
          desc: t(
            "Des milliers de formats deviennent des données comparables. « Data analyst junior » et « Analyste données » rejoignent la même catégorie.",
            "Thousands of formats become comparable data. “Junior data analyst” and “Data analyst” land in the same category.",
          ),
        },
        {
          n: "03",
          title: t("Annotation", "Annotation"),
          desc: t(
            "Des experts africains annotent et contextualisent : métier, secteur, compétences, niveau, localisation, rémunération, langue.",
            "African experts annotate and contextualise: occupation, sector, skills, level, location, pay, language.",
          ),
        },
        {
          n: "04",
          title: t("Validation", "Validation"),
          desc: t(
            "Cohérence, complétude, exactitude, fraîcheur et provenance. Nous conservons d'où vient chaque donnée.",
            "Consistency, completeness, accuracy, freshness and provenance. We keep track of where every record came from.",
          ),
        },
        {
          n: "05",
          title: "Intelligence",
          desc: t(
            "Matching, détection de tendances, signaux émergents, recommandations et modèles prédictifs.",
            "Matching, trend detection, emerging signals, recommendations and predictive models.",
          ),
        },
      ]}
    />
  );
}

/* Produits */

const buildProducts = (t: Translate) => [
  {
    Icon: Sparkles,
    name: "Malayka IA",
    tagline: t("Votre intelligence personnelle du marché.", "Your personal intelligence on the market."),
    bullets: [
      t("Emplois, stages et missions", "Jobs, internships and assignments"),
      t("Formations, bourses et financements", "Training, scholarships and funding"),
      t("Plan d'action et alertes WhatsApp", "Action plan and WhatsApp alerts"),
    ],
    to: "/produits/malayka-ia",
  },
  {
    Icon: GraduationCap,
    name: "Malayka Éducative",
    tagline: t(
      "L'IA qui augmente les capacités de chaque enseignant.",
      "The AI that extends what every teacher can do.",
    ),
    bullets: [
      t("Cours transformés en parcours", "Courses turned into pathways"),
      t("Exercices et évaluations", "Exercises and assessments"),
      t("Détection des lacunes et alertes", "Gap detection and alerts"),
    ],
    to: "/produits/malayka-educative",
  },
  {
    Icon: Database,
    name: "Malayka Data",
    tagline: t(
      "L'infrastructure de données du capital humain africain.",
      "The data infrastructure for African human capital.",
    ),
    bullets: [
      t("Datasets et API prêts à l'emploi", "Ready-to-use datasets and APIs"),
      t("Données d'entraînement pour l'IA", "Training data for AI"),
      t("Observatoires temps réel", "Real-time observatories"),
    ],
    to: "/produits/malayka-data",
  },
];

function Products() {
  const t = useT();
  const PRODUCTS = buildProducts(t);
  return (
    <Section tone="default" size="large">
      <SectionHeading
        eyebrow={t("Les produits", "The products")}
        lines={
          t.lang === "en"
            ? [<span key="p"><Hatched>One</Hatched> intelligence.</span>, "Several ways to use it."]
            : [<span key="p"><Hatched>Une</Hatched> intelligence.</span>, "Plusieurs façons de l'utiliser."]
        }
      />

      <div className="mt-24 grid gap-6 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 130}>
            <Link to={p.to} className="block h-full">
              <Card className="group flex h-full flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20">
                  <p.Icon className="h-5.5 w-5.5 text-primary" />
                </div>
                <h3 className="font-display type-h3 mt-8">{p.name}</h3>
                <p className="mt-3 text-[15px] font-medium text-primary">{p.tagline}</p>
                <ul className="mt-8 flex-1 space-y-3.5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/70">{b}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {t("Découvrir", "Explore")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* Bandeau image */

function DataBand() {
  const t = useT();
  return (
    <ImageBand
      image={MEDIA.data}
      lines={
        t.lang === "en"
          ? ["African data.", "Structured by AI.", "Enriched by people."]
          : ["Des données africaines.", "Structurées par l'IA.", "Enrichies par l'humain."]
      }
      lead={t(
        "Une donnée utile n'est pas une donnée abondante. C'est une donnée contextualisée, traçable et exploitable.",
        "Useful data is not abundant data. It is data that is contextualised, traceable and ready to act on.",
      )}
      cta={{ label: t("Explorer Malayka Data", "Explore Malayka Data"), to: "/produits/malayka-data" }}
    />
  );
}

/* Solutions */

const buildSolutions = (t: Translate) => [
  {
    Icon: Cpu,
    title: t("Entreprises d'IA", "AI companies"),
    badge: t("Data d'entraînement", "Training data"),
    desc: t(
      "Des datasets africains annotés, contextualisés et traçables pour entraîner, évaluer et ancrer vos modèles.",
      "Annotated, contextualised and traceable African datasets to train, evaluate and ground your models.",
    ),
    meta: t(
      "Datasets · annotation · benchmarks · RAG · API",
      "Datasets · annotation · benchmarks · RAG · API",
    ),
    to: "/solutions/entreprises-ia",
    featured: true,
  },
  {
    Icon: Landmark,
    title: t("Gouvernements, ONG & bailleurs", "Governments, NGOs & funders"),
    badge: t("Temps réel", "Real time"),
    desc: t(
      "Observer les variations du marché au fil de l'eau, mesurer l'impact réel des programmes financés et décider sur du réel.",
      "Watch the market shift as it happens, measure the real impact of funded programmes, and decide on what is actually there.",
    ),
    meta: t(
      "Observatoires · politiques · suivi d'impact",
      "Observatories · policy · impact tracking",
    ),
    to: "/solutions/gouvernements",
    featured: true,
  },
  {
    Icon: Building2,
    title: t("Établissements & EdTech", "Institutions & EdTech"),
    desc: t(
      "Aligner les programmes sur l'évolution réelle des métiers et alimenter vos produits éducatifs en données de compétences.",
      "Align your programmes with how occupations really evolve, and feed your education products with skills data.",
    ),
    meta: t(
      "Orientation · matching formation-emploi",
      "Guidance · training-to-job matching",
    ),
    to: "/solutions/etablissements",
  },
  {
    Icon: Users,
    title: t("Particuliers", "Individuals"),
    desc: t(
      "Étudiants, jeunes diplômés, chercheurs d'emploi, freelances, professionnels et entrepreneurs.",
      "Students, recent graduates, job seekers, freelancers, professionals and entrepreneurs.",
    ),
    meta: t(
      "Opportunités · formations · plan d'action",
      "Opportunities · training · action plan",
    ),
    to: "/solutions/particuliers",
  },
];

function Solutions() {
  const t = useT();
  const SOLUTIONS = buildSolutions(t);
  return (
    <Section tone="muted" size="large">
      <SectionHeading
        eyebrow="Solutions"
        lines={
          t.lang === "en"
            ? ["One infrastructure.", <span key="s"><Hatched>Many</Hatched> users.</span>]
            : ["Une infrastructure.", <span key="s"><Hatched>Plusieurs</Hatched> utilisateurs.</span>]
        }
        lead={t(
          "La même couche de données sert celles et ceux qui construisent des modèles d'IA, qui pilotent des politiques publiques, qui forment, et qui cherchent leur prochaine opportunité.",
          "The same data layer serves those building AI models, those steering public policy, those who teach, and those looking for their next opportunity.",
        )}
      />

      <div className="mt-24 grid gap-6 lg:grid-cols-2">
        {SOLUTIONS.map((s, i) => (
          <Reveal key={s.title} delay={i * 110}>
            <Link to={s.to} className="block h-full">
              <Card className={`group h-full ${s.featured ? "border-primary/25 bg-primary/[0.02]" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-500 group-hover:bg-primary/20">
                    <s.Icon className="h-5.5 w-5.5 text-primary" />
                  </div>
                  {s.badge && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">
                      {s.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-display type-h3 mt-8">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-muted-foreground">{s.desc}</p>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {s.meta}
                </p>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* Observe / comprend / anticipe / agit */

const buildVerbs = (t: Translate) => [
  { word: t("Observe", "Observes"), hint: t("les changements.", "what is changing.") },
  { word: t("Comprend", "Understands"), hint: t("ce qu'ils signifient.", "what it means.") },
  { word: t("Anticipe", "Anticipates"), hint: t("les besoins émergents.", "emerging needs.") },
  { word: t("Agit", "Acts"), hint: t("avec l'utilisateur.", "alongside the user.") },
];

function AiVerbs() {
  const t = useT();
  const VERBS = buildVerbs(t);
  return (
    <Section size="large">
      <Reveal>
        <div className="flex justify-center">
          <Eyebrow>
            {t("Une IA qui ne se contente pas de répondre", "An AI that does more than answer")}
          </Eyebrow>
        </div>
      </Reveal>
      <div className="mt-20 space-y-2">
        {VERBS.map((v, i) => (
          <Reveal key={v.word} delay={i * 150}>
            <div className="group flex flex-col gap-2 border-b border-border py-8 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-display type-h2 text-foreground transition-colors duration-500 group-hover:text-primary">
                {v.word}
              </span>
              <span className="type-lead text-muted-foreground">{v.hint}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** L'intelligence donnée à voir : terminal de données, très peu de texte. */
function IntelligenceTerminal() {
  const t = useT();
  return (
    <Section size="large">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
        <SlideIn from="left">
          <SectionHeading
            eyebrow="Intelligence"
            lines={
              t.lang === "en"
                ? ["Understand", "the skills.", "Anticipate", "the occupations."]
                : ["Comprendre", "les compétences.", "Anticiper", "les métiers."]
            }
          />
        </SlideIn>
        <SlideIn from="right" delay={120}>
          <SkillsTerminal />
        </SlideIn>
      </div>
    </Section>
  );
}

/** Démonstration du produit : l'IA travaille sous les yeux du visiteur. */
function ProductDemo() {
  const t = useT();
  return (
    <Section tone="muted" size="large">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <SlideIn from="right" delay={100} className="lg:order-2">
          <SectionHeading
            eyebrow={t("Malayka IA en action", "Malayka IA at work")}
            lines={
              t.lang === "en"
                ? ["One request.", "One profile analysed.", "Three opportunities."]
                : ["Une demande.", "Un profil analysé.", "Trois opportunités."]
            }
            lead={t(
              "Le visiteur n'a pas besoin qu'on lui explique le produit : il le voit fonctionner.",
              "Nobody needs the product explained to them: they can watch it run.",
            )}
          />
        </SlideIn>
        <SlideIn from="left" className="lg:order-1 lg:justify-self-end">
          <MalaykaDemo />
        </SlideIn>
      </div>
    </Section>
  );
}

/** L'humain comme finalité — composition diagonale, aucun texte superflu. */
function HumanFirst() {
  const t = useT();
  return (
    <Section size="large">
      <div className="mx-auto max-w-3xl text-center">
        <RevealLines
          lines={
            t.lang === "en"
              ? ["Data is the engine.", <span key="h">People are <Mark>the point</Mark>.</span>]
              : ["Les données sont le moteur.", <span key="h">L'humain est <Mark>la finalité</Mark>.</span>]
          }
          className="type-h2"
        />
      </div>
      <div className="mt-24">
        <DiagonalPhotos images={[light(MEDIA.competences), light(MEDIA.classe), light(MEDIA.territoire)]} />
      </div>
      <Reveal delay={260}>
        <div className="mt-20 flex justify-center">
          <FlowChain
            steps={
              t.lang === "en"
                ? ["A person", "A skill", "A course", "An opportunity", "A job"]
                : ["Une personne", "Une compétence", "Une formation", "Une opportunité", "Un emploi"]
            }
            className="justify-center"
          />
        </div>
      </Reveal>
    </Section>
  );
}

/* Whatsapp */

function WhatsApp() {
  const navigate = useNavigate();
  const t = useT();
  return (
    <Section tone="default" size="large">
      <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            eyebrow="WhatsApp"
            lines={
              t.lang === "en" ? ["The information", "comes to you."] : ["L'information", "vient à vous."]
            }
            lead={t(
              "Les meilleures opportunités ne servent à rien si vous ne les voyez jamais. Malayka envoie directement sur WhatsApp celles qui correspondent au profil et aux objectifs de l'utilisateur.",
              "The best opportunities are worth nothing if you never see them. Malayka sends the ones that match your profile and goals straight to WhatsApp.",
            )}
          />
          <Reveal delay={260}>
            <Button
              className="group mt-12 h-13 gap-2 rounded-full px-8 py-6 text-[15px] font-semibold"
              onClick={() => navigate("/produits/malayka-ia")}
            >
              {t("Découvrir Malayka IA", "Discover Malayka IA")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mx-auto w-full max-w-sm rounded-3xl border bg-card p-6 shadow-2xl shadow-black/[0.07]">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground">
                <MessageCircle className="h-4 w-4 text-background" />
              </div>
              <div>
                <p className="font-semibold">Malayka</p>
                <p className="text-xs text-muted-foreground">{t("maintenant", "now")}</p>
              </div>
            </div>
            <div className="space-y-4 pt-5">
              <p className="text-[15px] text-foreground/75">
                {t(
                  "Une nouvelle opportunité correspond à votre profil.",
                  "A new opportunity matches your profile.",
                )}
              </p>
              <div className="rounded-2xl bg-muted/60 p-5">
                <p className="font-display text-lg font-semibold">
                  {t("Stage Data Analyst — Abidjan", "Data Analyst internship — Abidjan")}
                </p>
                <p className="mt-2 font-mono text-sm font-semibold text-primary">
                  {t("Match : 94 %", "Match: 94%")}
                </p>
                <div className="mt-4 space-y-1.5">
                  {["Python", "SQL", t("Analyse de données", "Data analysis")].map((s) => (
                    <p key={s} className="flex items-center gap-2 text-[13px] text-foreground/65">
                      <Check className="h-3.5 w-3.5 text-foreground" />
                      {s}
                    </p>
                  ))}
                </div>
                <p className="mt-4 text-[13px] text-muted-foreground">
                  {t("Il vous manque : Power BI", "You are missing: Power BI")}
                </p>
              </div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                {t("Voir l'opportunité →", "View the opportunity →")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* Ce que nous façonnons — énoncé de tête */

function Shaping() {
  const t = useT();
  return (
    <ShapingManifesto
      eyebrow={t("Ce que nous façonnons", "What we shape")}
      lines={
        t.lang === "en"
          ? ["We are shaping", "the next generations of", "specialised AI for Africa."]
          : ["Nous façonnons pour l'Afrique,", "les prochaines générations", "d'IA spécialisées."]
      }
      lead={t(
        "Les modèles généralistes ne connaissent ni nos métiers, ni nos diplômes, ni nos marchés. Nous constituons la matière — données annotées, référentiels, profondeur historique — qui permet de les spécialiser pour le continent.",
        "General-purpose models know neither our occupations, nor our qualifications, nor our markets. We build the raw material — annotated data, taxonomies, historical depth — that makes it possible to specialise them for the continent.",
      )}
      items={[
        {
          image: MEDIA.iaPortrait,
          label: t("Annoter", "Annotate"),
          caption: t(
            "Des experts africains qualifient chaque signal : métier, compétence, secteur, niveau, rémunération.",
            "African experts qualify every signal: occupation, skill, sector, level, pay.",
          ),
        },
        {
          image: MEDIA.iaImmersion,
          label: t("Structurer", "Structure"),
          caption: t(
            "Un référentiel unique relie métiers, compétences et formations, et conserve leurs évolutions.",
            "A single taxonomy links occupations, skills and training, and keeps track of how they move.",
          ),
        },
        {
          image: MEDIA.iaSecteur,
          label: t("Spécialiser", "Specialise"),
          caption: t(
            "Jeux de données et références d'évaluation pour entraîner des modèles sur nos réalités, pas sur celles d'ailleurs.",
            "Datasets and benchmarks to train models on our realities, not on someone else's.",
          ),
        },
      ]}
    />
  );
}

/* Prêt à l'emploi — la promesse faite aux entreprises d'IA */

function ReadyData() {
  const t = useT();
  return (
    <StatementBand
      eyebrow={t("Pour les entreprises d'IA", "For AI companies")}
      footer={
        <>
          {t(
            "Nous annotons vos corpus, ou nous vous livrons des jeux de données déjà annotés pour vos métiers. Rien à collecter, rien à préparer.",
            "We annotate your corpora, or we deliver datasets already annotated for your industry. Nothing to collect, nothing to prepare.",
          )}{" "}
          <Link
            to="/solutions/entreprises-ia"
            className="font-semibold text-foreground underline underline-offset-4 hover:no-underline"
          >
            {t("Voir les données d'entraînement", "See the training data")}
          </Link>
        </>
      }
    >
      {t.lang === "en" ? (
        <>
          Data that is ready to use. Start training on <Circled>day zero</Circled>.
        </>
      ) : (
        <>
          Des données prêtes à l'emploi. Commencez vos entraînements le{" "}
          <Circled>jour zéro</Circled>.
        </>
      )}
    </StatementBand>
  );
}

/* Traction */

function Traction() {
  const t = useT();
  return (
    <Section tone="muted" size="large">
      <SectionHeading
        eyebrow={t("Résultats", "Results")}
        lines={
          t.lang === "en"
            ? ["Already in use", <span key="t"><Mark>on the ground</Mark>.</span>]
            : ["Déjà utilisé", <span key="t"><Mark>sur le terrain</Mark>.</span>]
        }
      />

      <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
        <div className="grid gap-14 sm:grid-cols-3">
          <Reveal>
            <Stat size="huge" value="10K+" label={t("utilisateurs accompagnés", "people supported")} />
          </Reveal>
          <Reveal delay={120}>
            <Stat
              size="huge"
              value="10+"
              label={t("structures éducatives partenaires", "partner education providers")}
              count={{ to: 10, suffix: "+" }}
            />
          </Reveal>
          <Reveal delay={240}>
            <Stat size="huge" value="50K+" label={t("objectifs créés", "goals created")} />
          </Reveal>
        </div>
        <Reveal delay={200}>
          <InlinePhoto
            image={light(MEDIA.reussite)}
            ratio="4/5"
            caption={t(
              "Abidjan — accompagnement d'une promotion partenaire.",
              "Abidjan — supporting a partner cohort.",
            )}
            className="w-full lg:w-72"
          />
        </Reveal>
      </div>

    </Section>
  );
}

/* Vision */

function Vision() {
  const t = useT();
  return (
    <Section tone="default" size="large">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="flex justify-center">
            <Eyebrow>{t("Notre vision", "Our vision")}</Eyebrow>
          </div>
        </Reveal>
        <RevealLines
          lines={
            t.lang === "en"
              ? ["Build the infrastructure", "that will let Africa", <span key="v">understand its <Mark>human capital</Mark>.</span>]
              : ["Construire l'infrastructure", "qui permettra à l'Afrique", <span key="v">de comprendre son <Mark>capital humain</Mark>.</span>]
          }
          className="type-h2 mt-10"
        />
        <Reveal delay={340}>
          <div className="mt-14 flex justify-center">
            <FlowChain
              steps={
                t.lang === "en"
                  ? ["Observe", "Anticipate", "Train", "Guide", "Place"]
                  : ["Observer", "Anticiper", "Former", "Orienter", "Insérer"]
              }
              className="justify-center"
            />
          </div>
        </Reveal>
        <Reveal delay={440}>
          <div className="mt-14 flex justify-center">
            <CtaGroup
              primary={{ label: t("Commencer avec Malayka", "Get started with Malayka"), to: "/onboarding" }}
              secondary={{ label: t("Découvrir notre approche", "See our approach"), to: "/a-propos" }}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <SourceMarquee />
      <DataConstellation />
      <Shaping />
      <ReadyData />
      <DataEngine />
      <IntelligenceTerminal />
      <Products />
      <Performance />
      <DataBand />
      <Solutions />
      <ProductDemo />
      <AiVerbs />
      <HumanFirst />
      <WhatsApp />
      <Traction />
      <Vision />
    </>
  );
}
