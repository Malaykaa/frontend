import {
  Cpu, ShieldCheck, BookOpen, Network, Layers, Bot, Database, Link2,
  Users, Globe2, Check, AlertTriangle,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, FlowChain,
  CtaGroup, mailto, Stat, ImageBand,
} from "../_shared/ui";
import { MEDIA } from "../_shared/media";
import { AccuracyGap, BuildingInterface, ConvergingPhotos } from "../_shared/scenes";
import { Mark, Circled, StatementBand } from "../_shared/emphasis";
import { useT, type Translate } from "../_shared/lang";

// Ce que les entreprises d'IA peuvent en faire
const buildAiUses = (t: Translate) => [
  {
    Icon: Cpu,
    title: t("Entraînement", "Training"),
    desc: t(
      "Datasets spécialisés pour entraîner ou fine-tuner des modèles sur les métiers, compétences et opportunités africaines.",
      "Specialised datasets to train or fine-tune models on African occupations, skills and opportunities.",
    ),
    meta: t("fine-tuning · pré-entraînement · SFT", "fine-tuning · pre-training · SFT"),
  },
  {
    Icon: ShieldCheck,
    title: t("Évaluation", "Evaluation"),
    desc: t(
      "Benchmarks permettant d'évaluer les performances de vos modèles dans des contextes africains réels, pas approximés.",
      "Benchmarks to measure how your models perform in real African contexts, not approximated ones.",
    ),
    meta: t("benchmarks · évaluations · red teaming", "benchmarks · evaluations · red teaming"),
  },
  {
    Icon: BookOpen,
    title: "RAG & Knowledge",
    desc: t(
      "Données structurées et traçables pouvant alimenter vos systèmes de recherche augmentée et vos bases de connaissances.",
      "Structured, traceable data to feed your retrieval-augmented systems and knowledge bases.",
    ),
    meta: t("corpus · embeddings · knowledge base", "corpora · embeddings · knowledge base"),
  },
  {
    Icon: Network,
    title: "Matching",
    desc: t(
      "Relations métiers-compétences-formations pour développer des moteurs de recommandation qui comprennent le marché réel.",
      "Occupation-skill-training relations to build recommendation engines that understand the real market.",
    ),
    meta: t("graphe métiers · compétences · formations", "occupation graph · skills · training"),
  },
  {
    Icon: Layers,
    title: "Classification",
    desc: t(
      "Taxonomies et données annotées par des experts pour entraîner des modèles de classification spécialisés.",
      "Taxonomies and expert-annotated data to train specialised classification models.",
    ),
    meta: t("taxonomies · labels · ontologies", "taxonomies · labels · ontologies"),
  },
  {
    Icon: Bot,
    title: t("Agents IA", "AI agents"),
    desc: t(
      "Données permettant à vos agents de comprendre les métiers, compétences, formations et opportunités africaines.",
      "Data that lets your agents understand African occupations, skills, training and opportunities.",
    ),
    meta: t("contexte métier · outils · ancrage", "domain context · tools · grounding"),
  },
];

// Datasets
const buildDatasets = (t: Translate) => [
  {
    title: "African AI Dataset",
    desc: t(
      "Données annotées et contextualisées destinées aux systèmes et modèles d'IA.",
      "Annotated, contextualised data built for AI systems and models.",
    ),
    featured: true,
  },
  {
    title: "Jobs Dataset",
    desc: t(
      "Métiers · compétences · entreprises · localisation · rémunération · expérience",
      "Occupations · skills · companies · location · pay · experience",
    ),
  },
  {
    title: "Skills Dataset",
    desc: t(
      "Compétences · niveaux · technologies · évolution de la demande",
      "Skills · levels · technologies · demand over time",
    ),
  },
  {
    title: "Training Dataset",
    desc: t(
      "Formations · établissements · compétences enseignées · certifications",
      "Courses · institutions · skills taught · certifications",
    ),
  },
  {
    title: "Opportunity Dataset",
    desc: t(
      "Emplois · freelance · missions · prestations · bourses · financements",
      "Jobs · freelance · assignments · services · scholarships · funding",
    ),
  },
  {
    title: "Labor Market Dataset",
    desc: t(
      "Tendances · secteurs · métiers émergents · évolution des compétences",
      "Trends · sectors · emerging occupations · how skills shift",
    ),
  },
];

// Page
export default function AiCompaniesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("Pour les entreprises d'IA", "For AI companies")}
        image={MEDIA.aiCompanies}
        lines={
          t.lang === "en"
            ? [
                "African data",
                "to build",
                <span key="a" className="text-muted-foreground">tomorrow's AI.</span>,
              ]
            : [
                "Des données africaines",
                "pour construire",
                <span key="a" className="text-muted-foreground">les IA de demain.</span>,
              ]
        }
        lead={t(
          "Les modèles d'IA ont besoin de données représentatives des populations, des langues, des métiers et des contextes dans lesquels ils seront utilisés. Malayka produit ces données pour l'Afrique : collectées à grande échelle, annotées par des experts, validées et traçables.",
          "AI models need data that represents the populations, languages, occupations and contexts they will be used in. Malayka produces that data for Africa: collected at scale, annotated by experts, validated and traceable.",
        )}
        chain={
          t.lang === "en"
            ? ["Sources", "AI structuring", "Human annotation", "Validation", "Datasets & API"]
            : ["Sources", "Structuration IA", "Annotation humaine", "Validation", "Datasets & API"]
        }
        primary={{ label: t("Parler à l'équipe Data", "Talk to the Data team"), href: mailto("Données d'entraînement IA : Malayka Data") }}
        secondary={{ label: t("Explorer Malayka Data", "Explore Malayka Data"), to: "/produits/malayka-data" }}
      >
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <Stat value={t("10+ ans", "10+ years")} label={t("de profondeur historique", "of historical depth")} />
          <Stat value={t("Millions", "Millions")} label={t("de données structurées", "of structured records")} />
          <Stat value={t("Humain + IA", "Human + AI")} label={t("annotation et validation", "annotation and validation")} />
          <Stat value={t("Traçable", "Traceable")} label={t("provenance conservée", "provenance retained")} />
        </div>
      </PageHero>

      {/* Le problème */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={t("Le problème", "The problem")}
              title={t(
                "Les modèles d'IA connaissent mal le marché du travail africain.",
                "AI models barely know the African labour market.",
              )}
              lead={t(
                "Les données disponibles sur le capital humain africain sont dispersées, souvent obsolètes, rarement structurées et presque jamais annotées pour un usage machine. Résultat : des modèles entraînés ailleurs, qui approximent des réalités qu'ils n'ont jamais observées.",
                "The available data on African human capital is scattered, often out of date, rarely structured and almost never annotated for machine use. The result: models trained elsewhere, approximating realities they have never observed.",
              )}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4">
              {[
                t(
                  "Peu de corpus africains riches, récents et structurés pour l'entraînement.",
                  "Few African corpora that are rich, recent and structured enough for training.",
                ),
                t(
                  "Des taxonomies métiers importées, qui ne reflètent pas les intitulés et parcours réels du continent.",
                  "Imported occupation taxonomies that do not reflect the continent's actual job titles and career paths.",
                ),
                t(
                  "Très peu de benchmarks permettant d'évaluer un modèle sur un contexte africain.",
                  "Very few benchmarks for evaluating a model in an African context.",
                ),
                t(
                  "Un marché informel et freelance massivement invisible dans les jeux de données classiques.",
                  "An informal and freelance market largely invisible in conventional datasets.",
                ),
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm leading-relaxed text-foreground/75">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Ce que coûte l'entraînement sur de la donnée brute, en chiffres. */}
      <AccuracyGap
        eyebrow={t("Brut contre annoté", "Raw versus annotated")}
        lines={
          t.lang === "en"
            ? ["An open-source model", "is only as good as", "the data you feed it."]
            : ["Un modèle open source", "ne vaut que les données", "qu'on lui donne."]
        }
        lead={t(
          "Beaucoup d'équipes africaines partent d'un modèle open source et l'entraînent sur des données collectées telles quelles. Le modèle apprend alors les doublons, les intitulés incohérents et les manques du corpus en même temps que le métier.",
          "Many African teams start from an open-source model and train it on data collected as it comes. The model then learns the duplicates, the inconsistent job titles and the gaps in the corpus along with the domain itself.",
        )}
        brut={{
          label: t("Données brutes, non annotées", "Raw, unannotated data"),
          valeur: 62,
          legende: t("de précision sur nos évaluations", "accuracy on our evaluations"),
          points: [
            t("Doublons et quasi-doublons jamais écartés", "Duplicates and near-duplicates never removed"),
            t(
              "« Data analyst junior » et « Analyste données » comptés comme deux métiers distincts",
              "“Junior data analyst” and “Data analyst” counted as two separate occupations",
            ),
            t("Aucun contexte : ni secteur, ni niveau, ni localisation", "No context: no sector, no level, no location"),
            t("Aucune vérité terrain à laquelle comparer les sorties", "No ground truth to compare the outputs against"),
          ],
        }}
        annote={{
          label: t("Données structurées et annotées", "Structured and annotated data"),
          valeur: 90,
          affichage: t("+ de 90 %", "Over 90%"),
          legende: t("de précision sur les mêmes évaluations", "accuracy on the same evaluations"),
          points: [
            t("Déduplication et normalisation avant tout entraînement", "Deduplication and normalisation before any training"),
            t("Une taxonomie unique : un métier, un identifiant", "A single taxonomy: one occupation, one identifier"),
            t(
              "Métier, secteur, niveau, expérience, localisation et rémunération qualifiés",
              "Occupation, sector, level, experience, location and pay all qualified",
            ),
            t("Annotation vérifiée par des experts africains, provenance conservée", "Annotation verified by African experts, provenance retained"),
          ],
        }}
        ecart={t("28 points de précision d'écart.", "A 28-point gap in accuracy.")}
        note={t(
          "Écart mesuré en interne sur nos jeux d'évaluation métiers et compétences, à modèle open source identique : seule la qualité du corpus d'entraînement change entre les deux colonnes.",
          "Gap measured internally on our occupation and skills evaluation sets, with the same open-source model on both sides: only the quality of the training corpus differs between the two columns.",
        )}
      />

      {/* La réponse au problème : la donnée est déjà faite. */}
      <StatementBand
        eyebrow={t("Prêt à l'emploi", "Ready to use")}
        footer={t(
          "Aucune collecte à lancer, aucune taxonomie à écrire, aucune campagne d'annotation à monter. Les jeux de données arrivent structurés, annotés et traçables, et le travail long est déjà fait.",
          "No collection to set up, no taxonomy to write, no annotation campaign to run. The datasets arrive structured, annotated and traceable, and the long work is already done.",
        )}
      >
        {t.lang === "en" ? (
          <>
            Data that is ready to use. Start training on{" "}
            <Circled>day zero</Circled>.
          </>
        ) : (
          <>
            Des données prêtes à l'emploi. Commencez vos entraînements le{" "}
            <Circled>jour zéro</Circled>.
          </>
        )}
      </StatementBand>

      {/* Les deux façons d'obtenir cette donnée */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("La matière", "The raw material")}
            title={
              t.lang === "en" ? (
                <>
                  Data of <Mark>high quality</Mark>, for specialised and
                  high-performing AI.
                </>
              ) : (
                <>
                  Des données de <Mark>haute qualité</Mark>, pour des IA
                  spécialisées et performantes.
                </>
              )
            }
            lead={t(
              "Entraînez et améliorez les modèles généraux pour en faire des modèles performants, adaptés à vos besoins et à vos métiers.",
              "Train and refine general-purpose models into high-performing ones, fitted to your needs and your industry.",
            )}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <Card className="flex h-full flex-col">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t("Option 01", "Option 01")}
              </span>
              <h3 className="font-display mt-4 type-h3">
                {t.lang === "en" ? (
                  <>
                    We annotate <Mark>your</Mark> data.
                  </>
                ) : (
                  <>
                    Nous annotons <Mark>vos</Mark> données.
                  </>
                )}
              </h3>
              <p className="mt-5 flex-1 leading-relaxed text-muted-foreground">
                {t(
                  "Vous détenez déjà des corpus, mais bruts, hétérogènes, inexploitables tels quels. Nos experts africains les nettoient, les qualifient et les alignent sur notre taxonomie, sans que la donnée quitte votre périmètre.",
                  "You already hold corpora: raw, heterogeneous, unusable as they stand. Our African experts clean, qualify and align them against our taxonomy, without the data leaving your perimeter.",
                )}
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                {t("Vos corpus · notre taxonomie · nos annotateurs", "Your corpora · our taxonomy · our annotators")}
              </p>
            </Card>
          </Reveal>

          <Reveal delay={120}>
            <Card className="flex h-full flex-col border-primary/25 bg-primary/[0.02]">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t("Option 02", "Option 02")}
              </span>
              <h3 className="font-display mt-4 type-h3">
                {t.lang === "en" ? (
                  <>
                    Or take data <Mark>already annotated</Mark>.
                  </>
                ) : (
                  <>
                    Ou partez de données <Mark>déjà annotées</Mark>.
                  </>
                )}
              </h3>
              <p className="mt-5 flex-1 leading-relaxed text-muted-foreground">
                {t(
                  "Nous vous livrons des jeux de données déjà constitués et annotés pour vos métiers : santé, agritech, énergie, finance, logistique, éducation. Rien à préparer, l'entraînement peut commencer immédiatement.",
                  "We deliver datasets already built and annotated for your industry: healthcare, agritech, energy, finance, logistics, education. Nothing to prepare, training can start immediately.",
                )}
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
                {t("Livré prêt · par métier · dès le jour zéro", "Delivered ready · by industry · from day zero")}
              </p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Cas d'usage */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow={t("Cas d'usage", "Use cases")}
            title={t(
              "Six façons d'utiliser nos données dans vos systèmes d'IA.",
              "Six ways to put our data to work in your AI systems.",
            )}
            lead={t(
              "Que vous entraîniez un modèle de fondation, un moteur de recommandation ou un agent spécialisé, la couche de données du capital humain africain vous manque probablement.",
              "Whether you are training a foundation model, a recommendation engine or a specialised agent, the African human-capital data layer is probably what you are missing.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildAiUses(t).map((u, i) => (
            <Reveal key={u.title} delay={i * 80}>
              <FeatureCard {...u} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Human in the loop */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Human-in-the-loop"
            title={t("L'IA donne l'échelle. L'humain donne le contexte.", "AI provides the scale. People provide the context.")}
            lead={t(
              "Le scraping et l'automatisation permettent de collecter à grande échelle. Mais les réalités professionnelles africaines ne se comprennent pas uniquement à partir de données automatisées : des experts annotent, vérifient et contextualisent, et lorsque les données manquent, nous allons les chercher sur le terrain.",
              "Scraping and automation collect at scale. But African working realities cannot be understood from automated data alone: experts annotate, verify and contextualise; and where data is missing, we go and gather it in the field.",
            )}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            { Icon: Cpu, title: t("Machines", "Machines"), desc: t("Collecter · traiter · détecter à l'échelle, en continu.", "Collect · process · detect at scale, continuously.") },
            { Icon: Users, title: t("Experts", "Experts"), desc: t("Annoter · vérifier · contextualiser selon notre taxonomie.", "Annotate · verify · contextualise against our taxonomy.") },
            { Icon: Globe2, title: t("Terrain", "Field"), desc: t("Observer · comprendre · compléter là où la donnée manque.", "Observe · understand · fill in where the data is missing.") },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 100}>
              <FeatureCard {...b} />
            </Reveal>
          ))}
        </div>

      </Section>

      <ImageBand
        image={MEDIA.data}
        lines={
          t.lang === "en"
            ? ["Africa should not merely", "use models built elsewhere."]
            : ["L'Afrique ne doit pas seulement", "utiliser les modèles construits ailleurs."]
        }
        lead={t(
          "Elle doit aussi contribuer à construire les données qui les rendront pertinents pour ses réalités.",
          "It should also help build the data that makes them relevant to its own realities.",
        )}
      />

      {/* Qualité */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={t("Qualité & traçabilité", "Quality & traceability")}
              title={t("Une donnée utile n'est pas une donnée abondante.", "Useful data is not abundant data.")}
              lead={t(
                "Chaque dataset passe par plusieurs niveaux de contrôle, et nous conservons la provenance de chaque donnée : d'où elle vient, quand elle a été collectée, dans quel contexte.",
                "Every dataset goes through several layers of control, and we keep the provenance of each record: where it came from, when it was collected, in what context.",
              )}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="grid gap-3 sm:grid-cols-2">
              {(t.lang === "en"
                ? ["Consistency", "Completeness", "Accuracy", "Freshness", "Deduplication", "Provenance", "Annotation quality", "Historisation"]
                : ["Cohérence", "Complétude", "Exactitude", "Fraîcheur", "Déduplication", "Provenance", "Qualité des annotations", "Historisation"]
              ).map((q) => (
                <div key={q} className="flex items-center gap-2.5 rounded-xl border bg-card px-4 py-3">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium">{q}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <BuildingInterface
        eyebrow={t("Construction d'un dataset", "Building a dataset")}
        lines={
          t.lang === "en"
            ? ["Every row is", "collected, annotated,", "then verified."]
            : ["Chaque ligne est", "collectée, annotée,", "puis vérifiée."]
        }
        rows={[
          { label: t("Sources interrogées", "Sources queried"), value: t("1 247", "1,247") },
          { label: t("Enregistrements collectés", "Records collected"), value: t("128 451", "128,451") },
          { label: t("Doublons écartés", "Duplicates removed"), value: t("21 308", "21,308") },
          { label: t("Annotations expertes", "Expert annotations"), value: t("94 612", "94,612") },
          { label: t("Taux de validation", "Validation rate"), value: t("98,2 %", "98.2%") },
          { label: t("Provenance conservée", "Provenance retained"), value: t("100 %", "100%") },
        ]}
        footer={t(
          "Chiffres d'illustration d'un cycle de production, les volumes réels dépendent du périmètre commandé.",
          "Illustrative figures for one production cycle, actual volumes depend on the scope commissioned.",
        )}
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
                  <Database className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-display text-[15px] font-bold">{d.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d.desc}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* API */}
        <Reveal delay={200}>
          <div className="mt-10 rounded-2xl border bg-card p-8" id="api">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {t(
                      "Connectez vos modèles à l'intelligence du capital humain africain.",
                      "Connect your models to African human-capital intelligence.",
                    )}
                  </h3>
                  <FlowChain
                    className="mt-4"
                    steps={["Jobs", "Skills", "Training", "Opportunities", "Labor Market"]}
                  />
                </div>
              </div>
              <CtaGroup
                className="shrink-0"
                primary={{ label: t("Voir la documentation API", "See the API documentation"), href: mailto("Documentation API : Malayka Data") }}
              />
            </div>
          </div>
        </Reveal>
      </Section>

      <ConvergingPhotos
        eyebrow="Human-in-the-loop"
        lines={
          t.lang === "en"
            ? ["Three crafts", "behind one record."]
            : ["Trois métiers", "pour une seule donnée."]
        }
        lead={t(
          "Les machines collectent, les experts annotent, le terrain complète. La donnée exploitable naît de la rencontre des trois.",
          "Machines collect, experts annotate, the field fills the gaps. Usable data comes from all three meeting.",
        )}
        images={[MEDIA.modeles, MEDIA.annotation, MEDIA.terrain]}
      />

      {/* CTA final */}
      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t(
                "Construisons ensemble les données dont vos modèles ont besoin.",
                "Let's build the data your models need, together.",
              )}
              lead={t(
                "Datasets sur mesure, annotation dédiée, benchmarks, accès API : parlons de votre cas d'usage.",
                "Bespoke datasets, dedicated annotation, benchmarks, API access: let's talk about your use case.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Parler à l'équipe Data", "Talk to the Data team"), href: mailto("Entreprise d'IA : parler à l'équipe Data") }}
                secondary={{ label: t("Découvrir Malayka Data", "Discover Malayka Data"), to: "/produits/malayka-data" }}
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
