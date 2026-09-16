import { useEffect, useState } from "react";
import {
  Landmark, HeartHandshake, HandCoins, Radar, Eye, LineChart, Compass,
  Gavel, Gauge, ArrowUpRight, Clock, TrendingUp,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, FlowChain,
  CtaGroup, mailto, ImageBand,
} from "../_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "../_shared/media";
import { PinnedGallery, JoiningBlocks } from "../_shared/scenes";
import { Mark, Underline, Hatched } from "../_shared/emphasis";
import { useT, type Translate } from "../_shared/lang";

/* Observatoire — panneau temps réel */

function LiveObservatory() {
  const t = useT();
  const [detected, setDetected] = useState(1284);
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const tick = setInterval(() => setSeconds((s) => (s >= 24 ? 1 : s + 1)), 1000);
    const grow = setInterval(() => setDetected((d) => d + 1), 4200);
    return () => { clearInterval(tick); clearInterval(grow); };
  }, []);

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <Radar className="h-3.5 w-3.5 text-primary" />
          {t("Observatoire du capital humain", "Human capital observatory")}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-foreground/10 px-2 py-0.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-foreground">Live</span>
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-card p-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {t("Opportunités détectées · cette semaine", "Opportunities detected · this week")}
        </p>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="font-display text-3xl font-extrabold tabular-nums text-foreground">
            {detected.toLocaleString(t.lang === "en" ? "en-GB" : "fr-FR")}
          </span>
          <span className="flex items-center gap-0.5 text-[12px] font-semibold text-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {t("+18 %", "+18%")}
          </span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {t(`Actualisé il y a ${seconds}s`, `Updated ${seconds}s ago`)}
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-foreground" />
            {t("Compétences en forte hausse", "Fastest-growing skills")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(t.lang === "en"
              ? ["Data", "Applied AI", "Solar energy", "Logistics"]
              : ["Data", "IA appliquée", "Énergie solaire", "Logistique"]
            ).map((s) => (
              <span key={s} className="rounded-full border border-border bg-foreground/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11.5px] font-semibold text-muted-foreground">
            {t("Secteurs sous tension", "Sectors under strain")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(t.lang === "en"
              ? ["Healthcare", "Construction", "Agritech"]
              : ["Santé", "BTP", "Agritech"]
            ).map((s) => (
              <span key={s} className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-[10px] font-semibold text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const buildAudiences = (t: Translate) => [
  {
    Icon: Landmark,
    title: t("Gouvernements", "Governments"),
    desc: t(
      "Comprendre le marché du travail, anticiper les besoins en compétences et adapter les politiques de formation à ce qui se passe réellement, semaine après semaine.",
      "Understand the labour market, anticipate skill needs, and adapt training policy to what is actually happening, week after week.",
    ),
    meta: t(
      "Observatoires · politiques publiques · formation · emploi",
      "Observatories · public policy · training · employment",
    ),
  },
  {
    Icon: HeartHandshake,
    title: t("ONG", "NGOs"),
    desc: t(
      "Financer et mesurer l'impact réel de vos programmes sur le terrain avec des données actualisées en continu — pas seulement un rapport annuel produit six mois après les faits.",
      "Fund and measure the real ground-level impact of your programmes with continuously refreshed data — not just an annual report written six months after the fact.",
    ),
    meta: t(
      "Financement · monitoring · insertion · reporting",
      "Funding · monitoring · placement · reporting",
    ),
  },
  {
    Icon: HandCoins,
    title: t("Bailleurs de fonds", "Funders"),
    desc: t(
      "Suivre en temps réel les indicateurs que vous financez, comparer les territoires et allouer vos financements là où l'impact se produit réellement.",
      "Track the indicators you fund in real time, compare territories, and allocate funding where the impact actually lands.",
    ),
    meta: t(
      "Suivi d'impact · allocation · évaluation · redevabilité",
      "Impact tracking · allocation · evaluation · accountability",
    ),
  },
];

const buildSteps = (t: Translate) => [
  { Icon: Eye, title: t("Observer", "Observe"), desc: t("Ce qui bouge sur le marché du travail, en continu et par territoire.", "What is moving in the labour market, continuously and by territory.") },
  { Icon: LineChart, title: t("Analyser", "Analyse"), desc: t("Métiers, compétences, secteurs, formations, rémunérations.", "Occupations, skills, sectors, training, pay.") },
  { Icon: Compass, title: t("Anticiper", "Anticipate"), desc: t("Signaux émergents, tensions à venir, déficits de compétences.", "Emerging signals, strain ahead, skill shortfalls.") },
  { Icon: Gavel, title: t("Décider", "Decide"), desc: t("Orienter les politiques, les programmes et les financements.", "Steer policy, programmes and funding.") },
  { Icon: Gauge, title: t("Mesurer", "Measure"), desc: t("Vérifier l'effet réel des décisions prises, et ajuster.", "Check the real effect of the decisions taken, and adjust.") },
];

const buildDashboards = (t: Translate) =>
  t.lang === "en"
    ? [
        "Growing occupations", "Emerging skills", "Shortages and strain",
        "Training supply", "Employer demand", "Occupational mobility",
        "Graduate placement", "Regional change",
      ]
    : [
        "Métiers en croissance", "Compétences émergentes", "Pénuries et tensions",
        "Offre de formation", "Demande employeurs", "Mobilité professionnelle",
        "Insertion des diplômés", "Évolution régionale",
      ];

export default function GovernmentsPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("Gouvernements · ONG · Bailleurs de fonds", "Governments · NGOs · Funders")}
        image={MEDIA_ALIASES.governments}
        lines={
          t.lang === "en"
            ? [
                "Give your decisions",
                "intelligence that is",
                <span key="a" className="text-muted-foreground">live.</span>,
              ]
            : [
                "Donnez à vos décisions",
                "une intelligence",
                <span key="a" className="text-muted-foreground">en temps réel.</span>,
              ]
        }
        lead={t(
          "Au-delà des données historiques, Malayka montre les variations du marché du travail au fil de l'eau : quels métiers recrutent maintenant, quelles compétences progressent cette semaine, où les tensions apparaissent. Pour décider sur la réalité du terrain, pas sur une photographie datée.",
          "Beyond historical data, Malayka shows the labour market shifting as it happens: which occupations are hiring now, which skills are growing this week, where strain is appearing. So you decide on the reality on the ground, not on a dated snapshot.",
        )}
        chain={
          t.lang === "en"
            ? ["Observe", "Analyse", "Anticipate", "Decide", "Measure"]
            : ["Observer", "Analyser", "Anticiper", "Décider", "Mesurer"]
        }
        primary={{ label: t("Construire un observatoire", "Build an observatory"), href: mailto("Observatoire — Gouvernement / ONG / Bailleur de fonds") }}
        secondary={{ label: t("Découvrir Malayka Data", "Discover Malayka Data"), to: "/produits/malayka-data" }}
      />

      {/* Audiences */}
      <Section tone="default" id="bailleurs">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour qui", "Who it is for")}
            title={
              t.lang === "en" ? (
                <>Three uses, <Hatched>one</Hatched> data layer.</>
              ) : (
                <>Trois usages, <Hatched>une même</Hatched> couche de données.</>
              )
            }
            lead={t(
              "Les institutions qui pilotent, financent ou évaluent des programmes liés à l'emploi et à la formation partagent le même angle mort : elles décident sur des données qui décrivent le passé.",
              "The institutions that steer, fund or evaluate employment and training programmes share one blind spot: they decide on data that describes the past.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {buildAudiences(t).map((a, i) => (
            <Reveal key={a.title} delay={i * 100}>
              <FeatureCard {...a} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Temps réel */}
      <Section id="observatoire">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={t("Historique + temps réel", "History + real time")}
              title={
                t.lang === "en" ? (
                  <>The past explains. <Mark>Real time</Mark> lets you act.</>
                ) : (
                  <>Le passé explique. <Mark>Le temps réel</Mark> permet d'agir.</>
                )
              }
              lead={t(
                "Notre profondeur historique montre d'où l'on vient. Notre surveillance continue montre ce qui change maintenant — pour que vos décisions s'appuient sur la réalité du marché.",
                "Our historical depth shows where things came from. Our continuous monitoring shows what is changing now — so your decisions rest on the market as it is.",
              )}
            />
            <ul className="mt-8 space-y-3">
              {[
                t("Quels métiers recrutent en ce moment", "Which occupations are hiring right now"),
                t("Quelles compétences progressent cette semaine", "Which skills are growing this week"),
                t("Où se situent les déficits, en direct", "Where the shortfalls are, live"),
                t("Comment les besoins évoluent — pas seulement où ils en étaient hier", "How needs are moving — not just where they stood yesterday"),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140} className="flex justify-center lg:justify-end">
            <LiveObservatory />
          </Reveal>
        </div>
      </Section>

      <ImageBand
        image={MEDIA_ALIASES.individuals}
        lines={
          t.lang === "en"
            ? ["Anticipate tomorrow's occupations", "before they become", "today's problems."]
            : ["Anticiper les métiers de demain", "avant qu'ils ne deviennent", "les problèmes d'aujourd'hui."]
        }
        lead={t(
          "Observer, analyser, anticiper, décider, mesurer — puis recommencer, avec des données qui se rafraîchissent en continu.",
          "Observe, analyse, anticipate, decide, measure — then start again, on data that refreshes continuously.",
        )}
      />

      <PinnedGallery
        eyebrow={t("Ce que vous observez", "What you observe")}
        lines={
          t.lang === "en"
            ? ["One territory,", "several readings."]
            : ["Un même territoire,", "plusieurs lectures."]
        }
        items={[
          { image: MEDIA.observatoire, label: t("Observatoire", "Observatory"), note: t("Les variations du marché, semaine après semaine.", "How the market shifts, week after week.") },
          { image: MEDIA.restitution, label: t("Restitution", "Reporting back"), note: t("Des tableaux de bord lisibles par vos équipes.", "Dashboards your teams can actually read.") },
          { image: MEDIA.rapport, label: t("Redevabilité", "Accountability"), note: t("Des indicateurs traçables pour vos financeurs.", "Traceable indicators for your funders.") },
          { image: MEDIA.pilotage, label: t("Pilotage", "Steering"), note: t("Le suivi des programmes en cours d'exécution.", "Tracking programmes while they run.") },
        ]}
      />

      {/* Boucle */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Comment ça se passe", "How it plays out")}
            lines={
              t.lang === "en"
                ? ["Observe to decide.", "Measure to adjust."]
                : ["Observer pour décider.", "Mesurer pour ajuster."]
            }
          />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-5">
          {buildSteps(t).map((s, i) => (
            <Reveal key={s.title} delay={i * 70} className="bg-card">
              <div className="h-full p-6">
                <s.Icon className="h-5 w-5 text-primary" />
                <h3 className="font-display mt-3.5 text-[15px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={260}>
          <div className="mt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              {t("Exemples de tableaux de bord", "Example dashboards")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {buildDashboards(t).map((d) => (
                <span key={d} className="rounded-full border bg-card px-3.5 py-1.5 text-[13px] text-foreground/70">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>

      <JoiningBlocks
        eyebrow={t("Historique et temps réel", "History and real time")}
        lines={
          t.lang === "en"
            ? ["Two horizons", "that meet."]
            : ["Deux horizons", "qui se rejoignent."]
        }
        top={{
          title: t("Ce que dit l'historique", "What the history says"),
          desc: t(
            "Dix ans de données montrent les tendances longues : métiers qui apparaissent, compétences qui se déplacent, secteurs qui se recomposent.",
            "Ten years of data show the long trends: occupations appearing, skills shifting, sectors reshaping.",
          ),
        }}
        bottom={{
          title: t("Ce que dit le temps réel", "What real time says"),
          desc: t(
            "La surveillance continue montre ce qui change maintenant : tensions naissantes, recrutements en cours, écarts qui se creusent.",
            "Continuous monitoring shows what is changing now: strain building, hiring under way, gaps widening.",
          ),
        }}
        image={MEDIA.territoire}
      />

      {/* Questions */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("Les questions auxquelles nous répondons", "The questions we answer")}
            title={
              t.lang === "en" ? (
                <>
                  Six questions any skills policy should be able to{" "}
                  <Underline variante="trait">settle</Underline>.
                </>
              ) : (
                <>
                  Six questions que toute politique de compétences devrait pouvoir{" "}
                  <Underline variante="trait">trancher</Underline>.
                </>
              )
            }
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            t("Quels métiers recrutent ?", "Which occupations are hiring?"),
            t("Quelles compétences progressent ?", "Which skills are growing?"),
            t("Quels métiers émergent ?", "Which occupations are emerging?"),
            t("Quels secteurs ralentissent ?", "Which sectors are slowing?"),
            t("Où sont les déficits de compétences ?", "Where are the skill shortfalls?"),
            t("Quelles formations faut-il renforcer ?", "Which training needs strengthening?"),
          ].map((q, i) => (
            <Reveal key={q} delay={i * 60}>
              <Card className="h-full">
                <p className="font-display text-base font-bold leading-snug">{q}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t("Construisons votre observatoire.", "Let's build your observatory.")}
              lead={t(
                "Tableaux de bord sur mesure, indicateurs de suivi, accès API, rapports périodiques : parlons de votre périmètre et de vos territoires.",
                "Bespoke dashboards, tracking indicators, API access, periodic reports: let's talk about your scope and your territories.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Demander une présentation", "Request a walkthrough"), href: mailto("Observatoire — demande de présentation") }}
                secondary={{ label: t("Voir nos données", "See our data"), to: "/produits/malayka-data" }}
              />
            </div>
            <FlowChain
              className="mt-10 justify-center"
              steps={
                t.lang === "en"
                  ? ["Observe", "Anticipate", "Train", "Guide", "Place", "Measure"]
                  : ["Observer", "Anticiper", "Former", "Orienter", "Insérer", "Mesurer"]
              }
            />
          </div>
        </Reveal>
      </Section>
    </>
  );
}
