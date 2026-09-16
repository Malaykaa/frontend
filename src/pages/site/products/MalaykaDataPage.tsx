import { Link } from "react-router-dom";
import {
  Database, Landmark, Globe2, Cpu, GraduationCap, Briefcase,
  Link2, RefreshCw, ArrowRight, Check, Users, HeartHandshake,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, FlowChain,
  CtaGroup, mailto, Stat, StickySteps, ImageBand,
} from "../_shared/ui";
import { MEDIA } from "../_shared/media";
import { ShrinkingPhoto, CircularFlow } from "../_shared/scenes";
import { useT, type Translate } from "../_shared/lang";

// Données
const buildEngine = (t: Translate) => [
  {
    n: "01",
    title: t("Collecte massive", "Large-scale collection"),
    desc: t(
      "Sites d'emploi, plateformes professionnelles et freelance, réseaux sociaux, institutions, Telegram, communautés, API partenaires et recherches terrain.",
      "Job boards, professional and freelance platforms, social media, institutions, Telegram, communities, partner APIs and field research.",
    ),
    meta: t("scraping · API · terrain", "scraping · API · field"),
  },
  {
    n: "02",
    title: t("Structuration", "Structuring"),
    desc: t(
      "Nettoyage, déduplication, normalisation. « Data analyst junior », « Junior Data Analyst » et « Analyste données » deviennent une même catégorie exploitable.",
      "Cleaning, deduplication, normalisation. “Junior data analyst”, “Data Analyst Jr” and “Analyste données” become a single usable category.",
    ),
    meta: t("déduplication · classification · extraction", "deduplication · classification · extraction"),
  },
  {
    n: "03",
    title: t("Annotation experte", "Expert annotation"),
    desc: t(
      "Nos experts africains annotent et contextualisent selon notre taxonomie : métiers, compétences, secteurs, niveaux, expérience, localisation, rémunération, langues.",
      "Our African experts annotate and contextualise against our taxonomy: occupations, skills, sectors, levels, experience, location, pay, languages.",
    ),
    meta: "human-in-the-loop",
  },
  {
    n: "04",
    title: "Validation",
    desc: t(
      "Contrôle de cohérence, complétude, exactitude, fraîcheur et provenance. Nous conservons d'où vient chaque donnée et dans quel contexte elle a été collectée.",
      "Checks on consistency, completeness, accuracy, freshness and provenance. We keep where each record came from and in what context it was collected.",
    ),
    meta: t("quality control · traçabilité", "quality control · traceability"),
  },
  {
    n: "05",
    title: "Intelligence",
    desc: t(
      "Matching, détection de tendances, signaux émergents, recommandations et modèles prédictifs construits sur la profondeur historique.",
      "Matching, trend detection, emerging signals, recommendations and predictive models built on historical depth.",
    ),
    meta: t("matching · tendances · prévision", "matching · trends · forecasting"),
  },
];

const buildHistoryAngles = (t: Translate) => [
  { title: t("Métiers", "Occupations"), desc: t("Quels métiers apparaissent, disparaissent ou évoluent ?", "Which occupations are appearing, disappearing or shifting?") },
  { title: t("Compétences", "Skills"), desc: t("Quelles compétences deviennent plus demandées ?", "Which skills are becoming more in demand?") },
  { title: t("Secteurs", "Sectors"), desc: t("Quels secteurs recrutent davantage ?", "Which sectors are hiring more?") },
  { title: t("Localisation", "Location"), desc: t("Où apparaissent les opportunités ?", "Where are opportunities appearing?") },
  { title: t("Formation", "Training"), desc: t("Quelles formations correspondent aux besoins du marché ?", "Which courses match what the market needs?") },
  { title: t("Rémunération", "Pay"), desc: t("Comment les niveaux de rémunération évoluent-ils ?", "How are pay levels moving?") },
];

const buildDatasets = (t: Translate) => [
  { title: "Jobs Dataset", desc: t("Métiers · compétences · entreprises · localisation · rémunération · expérience", "Occupations · skills · companies · location · pay · experience") },
  { title: "Skills Dataset", desc: t("Compétences · niveaux · technologies · évolution de la demande", "Skills · levels · technologies · demand over time") },
  { title: "Training Dataset", desc: t("Formations · établissements · compétences enseignées · certifications", "Courses · institutions · skills taught · certifications") },
  { title: "Opportunity Dataset", desc: t("Emplois · freelance · missions · prestations · bourses · financements", "Jobs · freelance · assignments · services · scholarships · funding") },
  { title: "Labor Market Dataset", desc: t("Tendances · secteurs · métiers émergents · évolution des compétences", "Trends · sectors · emerging occupations · how skills shift") },
  { title: "African AI Dataset", desc: t("Données annotées et contextualisées pour les systèmes et modèles d'IA", "Annotated, contextualised data for AI systems and models"), featured: true },
];

const buildAudiences = (t: Translate) => [
  { Icon: Cpu, title: t("Entreprises d'IA", "AI companies"), desc: t("Entraîner, évaluer et ancrer les modèles avec des données africaines.", "Train, evaluate and ground models with African data."), meta: t("Datasets · annotation · benchmarks · API", "Datasets · annotation · benchmarks · API"), to: "/solutions/entreprises-ia" },
  { Icon: Landmark, title: t("Gouvernements", "Governments"), desc: t("Observer le marché du travail et anticiper les besoins en compétences.", "Observe the labour market and anticipate skill needs."), meta: t("Observatoires · politiques · formation", "Observatories · policy · training"), to: "/solutions/gouvernements" },
  { Icon: HeartHandshake, title: t("ONG & bailleurs de fonds", "NGOs & funders"), desc: t("Mesurer l'impact réel des programmes financés, en temps réel.", "Measure the real impact of funded programmes, in real time."), meta: t("Monitoring · suivi d'impact · allocation", "Monitoring · impact tracking · allocation"), to: "/solutions/gouvernements#bailleurs" },
  { Icon: Globe2, title: t("Organisations internationales", "International organisations"), desc: t("Accéder à des données structurées et contextualisées pour leurs analyses.", "Access structured, contextualised data for their analysis."), meta: t("Data · études · programmes", "Data · studies · programmes") },
  { Icon: GraduationCap, title: t("EdTech & établissements", "EdTech & institutions"), desc: t("Améliorer le matching entre formations, compétences et opportunités.", "Improve the match between training, skills and opportunity."), meta: t("Orientation · recommandations", "Guidance · recommendations"), to: "/solutions/etablissements" },
  { Icon: Briefcase, title: t("RH & entreprises", "HR & employers"), desc: t("Comprendre les compétences disponibles et les évolutions du marché.", "Understand the skills available and how the market is moving."), meta: t("Workforce intelligence · matching", "Workforce intelligence · matching") },
];

const buildLoop = (t: Translate) =>
  t.lang === "en"
    ? ["Observe", "Anticipate", "Train", "Guide", "Act", "Place", "Measure"]
    : ["Observer", "Anticiper", "Former", "Orienter", "Agir", "Insérer", "Mesurer"];

export default function MalaykaDataPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow="Malayka Data"
        image={MEDIA.data}
        lines={
          t.lang === "en"
            ? [
                "The data infrastructure",
                "for African human",
                <span key="a" className="text-muted-foreground">capital.</span>,
              ]
            : [
                "L'infrastructure de données",
                "du capital humain",
                <span key="a" className="text-muted-foreground">africain.</span>,
              ]
        }
        lead={t(
          "Malayka collecte, structure, annote et transforme des millions de données sur l'emploi, les compétences, les métiers et la formation en Afrique — en datasets, API et intelligence exploitables.",
          "Malayka collects, structures, annotates and transforms millions of records on employment, skills, occupations and training across Africa — into usable datasets, APIs and intelligence.",
        )}
        chain={
          t.lang === "en"
            ? ["African data", "Structured by AI", "Enriched by people"]
            : ["Des données africaines", "Structurées par l'IA", "Enrichies par l'humain"]
        }
        primary={{ label: t("Explorer nos données", "Explore our data"), href: mailto("Explorer Malayka Data") }}
        secondary={{ label: t("Parler à notre équipe", "Talk to our team"), href: mailto("Malayka Data — parler à l'équipe") }}
      >
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <Stat value={t("10+ ans", "10+ years")} label={t("de données historiques", "of historical data")} />
          <Stat value={t("Millions", "Millions")} label={t("de données collectées et structurées", "of records collected and structured")} />
          <Stat value={t("Multi-sources", "Multi-source")} label={t("web · API · terrain · communautés", "web · API · field · communities")} />
          <Stat value={t("Humain + IA", "Human + AI")} label={t("collecte · annotation · validation", "collection · annotation · validation")} />
        </div>
      </PageHero>

      {/* Problème */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={t("Le problème", "The problem")}
              title={t(
                "Les données sur le capital humain en Afrique sont dispersées, obsolètes ou difficiles à exploiter.",
                "Data on human capital in Africa is scattered, out of date, or hard to use.",
              )}
              lead={t(
                "Les informations existent, mais elles sont fragmentées entre plateformes, institutions, réseaux professionnels, réseaux sociaux, communautés et bases de données. Une grande partie du marché réel reste difficile à observer et à structurer.",
                "The information exists, but it is fragmented across platforms, institutions, professional networks, social media, communities and databases. Much of the real market remains hard to observe and to structure.",
              )}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-3">
              {[
                [t("Les gouvernements", "Governments"), t("décident à partir de données qui ne reflètent pas les évolutions rapides du marché.", "decide from data that does not reflect how fast the market moves.")],
                [t("Les entreprises d'IA", "AI companies"), t("manquent de données africaines riches, structurées et contextualisées.", "lack African data that is rich, structured and contextualised.")],
                [t("Les organisations internationales", "International organisations"), t("doivent compléter par des enquêtes et des estimations.", "have to fill the gaps with surveys and estimates.")],
                [t("Les établissements", "Education providers"), t("manquent d'informations actualisées pour aligner leurs programmes.", "lack current information to align their programmes.")],
                [t("Les plateformes d'emploi", "Job platforms"), t("ignorent largement le freelance, les prestations et l'informel.", "largely ignore freelance work, services and the informal market.")],
              ].map(([who, what]) => (
                <div key={who} className="rounded-xl border bg-card p-4">
                  <p className="text-sm">
                    <span className="font-semibold">{who}</span>{" "}
                    <span className="text-muted-foreground">{what}</span>
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Data engine — storytelling sticky */}
      <div id="data-engine">
        <StickySteps
          eyebrow={t("Notre Data Engine", "Our Data Engine")}
          lines={
            t.lang === "en"
              ? ["Technology collects.", "People make sense of it.", "AI transforms it."]
              : ["La technologie collecte.", "L'humain comprend.", "L'IA transforme."]
          }
          lead={t(
            "Nous combinons l'échelle de l'automatisation avec l'intelligence humaine et la connaissance du terrain. C'est ce qui sépare une base volumineuse d'une donnée réellement exploitable.",
            "We combine the scale of automation with human judgement and ground knowledge. That is what separates a large database from data you can genuinely use.",
          )}
          steps={buildEngine(t)}
        />
      </div>

      {/* Historique */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Profondeur historique", "Historical depth")}
            title={t(
              "Le présent nous montre où nous sommes. L'historique nous aide à comprendre où nous allons.",
              "The present shows where we are. History helps us understand where we are going.",
            )}
            lead={t(
              "Une donnée isolée donne une photographie. Une donnée historique permet d'observer une évolution.",
              "A single record gives a snapshot. A historical record lets you watch something move.",
            )}
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card px-6 py-5">
            {["2016", "2018", "2020", "2022", "2024", "2026"].map((y, i, arr) => (
              <div key={y} className="flex items-center gap-4">
                <div className="text-center">
                  <span className={`mx-auto block h-2 w-2 rounded-full ${i === arr.length - 1 ? "bg-primary" : "bg-border"}`} />
                  <span className="mt-2 block font-mono text-[11px] text-muted-foreground">{y}</span>
                </div>
                {i < arr.length - 1 && <span className="hidden h-px w-8 bg-border sm:block" />}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buildHistoryAngles(t).map((h, i) => (
            <Reveal key={h.title} delay={i * 60}>
              <Card className="h-full">
                <p className="font-display text-base font-bold">{h.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{h.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.04] p-6">
            <FlowChain
              steps={
                t.lang === "en"
                  ? ["10+ years of data", "Change", "Trends", "Emerging signals", "Predictive models"]
                  : ["10+ ans de données", "Évolution", "Tendances", "Signaux émergents", "Modèles prédictifs"]
              }
            />
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {t(
                "Cette profondeur historique nous permet d'identifier des tendances dans l'évolution des métiers, des compétences et des opportunités, et de construire des modèles permettant d'anticiper les besoins futurs.",
                "That historical depth lets us identify trends in how occupations, skills and opportunities evolve, and build models that anticipate future needs.",
              )}
            </p>
          </div>
        </Reveal>
      </Section>

      <ImageBand
        image={MEDIA.aiCompanies}
        lines={
          t.lang === "en"
            ? ["We do not only", "collect listings."]
            : ["Nous ne collectons pas", "seulement des offres."]
        }
        lead={t(
          "Nous construisons les relations entre les données — un graphe métiers, compétences, formations et opportunités, exploitable par des moteurs de matching et par des modèles d'IA.",
          "We build the relations between records — a graph of occupations, skills, training and opportunities, usable by matching engines and by AI models.",
        )}
        cta={{ label: t("Données d'entraînement pour l'IA", "Training data for AI"), to: "/solutions/entreprises-ia" }}
      />

      {/* Datasets */}
      <Section tone="muted" id="datasets">
        <Reveal>
          <SectionHeading
            eyebrow={t("Nos datasets", "Our datasets")}
            title={t("Des données prêtes à être utilisées.", "Data ready to be put to work.")}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildDatasets(t).map((d, i) => (
            <Reveal key={d.title} delay={i * 70}>
              <Card className={`h-full ${d.featured ? "border-primary/30 bg-primary/[0.04]" : ""}`}>
                <div className="flex items-start gap-3">
                  <Database className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-display text-[15px] font-bold">{d.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d.desc}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Graph */}
        <Reveal delay={220}>
          <div className="mt-10 rounded-2xl border bg-card p-8">
            <h3 className="font-display text-lg font-bold">
              {t(
                "Nous ne collectons pas seulement des offres. Nous construisons les relations entre les données.",
                "We do not only collect listings. We build the relations between records.",
              )}
            </h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {(t.lang === "en"
                ? ["Occupation", "Skills", "Sector", "Pay", "Training", "Companies", "Country / city", "Opportunities"]
                : ["Métier", "Compétences", "Secteur", "Rémunération", "Formations", "Entreprises", "Pays / ville", "Opportunités"]
              ).map((n) => (
                <span key={n} className="rounded-lg border bg-muted/50 px-3 py-1.5 font-mono text-[11px] font-semibold">
                  {n}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              {t(
                "Un graphe de relations, pas une simple liste — c'est ce qui rend les données utilisables par des moteurs de matching, de recommandation et par des modèles d'IA.",
                "A graph of relations, not a flat list — that is what makes the data usable by matching engines, recommendation engines and AI models.",
              )}
            </p>
          </div>
        </Reveal>

        {/* API */}
        <Reveal delay={300}>
          <div id="api" className="mt-6 rounded-2xl border bg-card p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {t(
                      "Connectez votre produit à l'intelligence du capital humain africain.",
                      "Connect your product to African human-capital intelligence.",
                    )}
                  </h3>
                  <FlowChain className="mt-4" steps={["Jobs", "Skills", "Training", "Opportunities", "Companies", "Labor Market"]} />
                </div>
              </div>
              <CtaGroup
                className="shrink-0"
                primary={{ label: t("Voir la documentation API", "See the API documentation"), href: mailto("Documentation API — Malayka Data") }}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <ShrinkingPhoto
        image={MEDIA.ciel}
        eyebrow={t("L'échelle", "The scale")}
        lines={
          t.lang === "en"
            ? ["Millions of signals,", "one single taxonomy."]
            : ["Des millions de signaux,", "un seul référentiel."]
        }
        facts={[
          { label: t("de profondeur historique", "of historical depth"), value: t("10+ ans", "10+ years") },
          { label: t("sources surveillées", "sources monitored"), value: t("1 200+", "1,200+") },
          { label: t("de données structurées", "of structured records"), value: t("Millions", "Millions") },
          { label: t("provenance conservée", "provenance retained"), value: t("100 %", "100%") },
        ]}
      />

      {/* Pour qui */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour qui", "Who it is for")}
            title={t("Une infrastructure. Plusieurs utilisateurs.", "One infrastructure. Many users.")}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildAudiences(t).map((a, i) => (
            <Reveal key={a.title} delay={i * 70}>
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

      {/* Dimension humaine */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={t("La dimension humaine", "The human dimension")}
            title={t("L'IA donne l'échelle. L'humain donne le contexte.", "AI provides the scale. People provide the context.")}
            lead={t(
              "Les réalités professionnelles africaines ne peuvent pas être comprises uniquement à partir de données automatisées. Nos systèmes automatisent la collecte et le traitement ; des experts annotent, vérifient et contextualisent ; et lorsque les données manquent, nous allons les chercher sur le terrain.",
              "African working realities cannot be understood from automated data alone. Our systems automate collection and processing; experts annotate, verify and contextualise; and where data is missing, we go and gather it in the field.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { Icon: Cpu, title: t("Machines", "Machines"), desc: t("Collecter · traiter · détecter", "Collect · process · detect") },
            { Icon: Users, title: t("Experts", "Experts"), desc: t("Annoter · vérifier · contextualiser", "Annotate · verify · contextualise") },
            { Icon: Globe2, title: t("Terrain", "Field"), desc: t("Observer · comprendre · compléter", "Observe · understand · fill in") },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 100}>
              <FeatureCard {...b} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Boucle */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("La boucle Malayka", "The Malayka loop")}
            title="Human Capital Intelligence"
            lead={t(
              "Les données permettent de mieux comprendre le marché ; cette intelligence permet de mieux former et orienter ; et les résultats réels améliorent à leur tour l'intelligence.",
              "Data makes the market easier to understand; that intelligence makes training and guidance better; and the real outcomes improve the intelligence in turn.",
            )}
          />
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-12 flex items-center justify-center gap-3">
            <RefreshCw className="h-5 w-5 shrink-0 text-primary" />
            <FlowChain steps={buildLoop(t)} className="justify-center" />
          </div>
        </Reveal>
      </Section>

      <CircularFlow
        eyebrow={t("La boucle", "The loop")}
        steps={
          t.lang === "en"
            ? ["Collect", "Structure", "Annotate", "Validate", "Understand", "Predict"]
            : ["Collecter", "Structurer", "Annoter", "Valider", "Comprendre", "Prédire"]
        }
        image={MEDIA.circulaire}
      />

      {/* Promesse finale */}
      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t(
                "Comprendre le capital humain. Anticiper son évolution. Agir.",
                "Understand human capital. Anticipate how it moves. Act.",
              )}
              lead={t(
                "Malayka construit les données, les technologies et les intelligences nécessaires pour mieux connecter les personnes, les compétences, les formations et les opportunités en Afrique.",
                "Malayka builds the data, the technology and the intelligence needed to connect people, skills, training and opportunity across Africa.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Commencer avec Malayka", "Get started with Malayka"), to: "/onboarding" }}
                secondary={{ label: t("Parler à notre équipe", "Talk to our team"), href: mailto("Malayka Data — parler à l'équipe") }}
              />
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              {(t.lang === "en"
                ? ["Not a scraper", "Not a job board", "Not merely a chatbot", "A complete chain"]
                : ["Pas un scraper", "Pas une job board", "Pas seulement un chatbot", "Une chaîne complète"]
              ).map((label, i) => (
                <span key={label} className="flex items-center gap-2">
                  {i === 3 ? <Check className="h-3.5 w-3.5 text-primary" /> : <span className="text-foreground/20">✕</span>}
                  {label}
                </span>
              ))}
            </div>
            <Link
              to="/comment-ca-marche"
              className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
            >
              {t("Voir comment ça marche", "See how it works")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
