import { Users2, Globe2, Zap, ShieldCheck, Rocket } from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FlowChain, CtaGroup, mailto, Stat, ImageBand,
} from "./_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "./_shared/media";
import { ConvergingPhotos } from "./_shared/scenes";
import { InfrastructureStatement } from "./_shared/statements";
import { Mark, Underline, Hatched } from "./_shared/emphasis";
import { useT, type Translate } from "./_shared/lang";

const VALUES = (t: Translate) => [
  {
    Icon: Users2,
    title: t("Accessibilité", "Accessibility"),
    desc: t(
      "L'intelligence doit être utile au plus grand nombre, pas réservée à ceux qui savent déjà où chercher.",
      "Intelligence should be useful to the many, not reserved for those who already know where to look.",
    ),
  },
  {
    Icon: Globe2,
    title: t("Contextualisation", "Context"),
    desc: t(
      "L'Afrique n'est pas un marché homogène. Pays, secteurs, langues et écosystèmes diffèrent.",
      "Africa is not a single market. Countries, sectors, languages and ecosystems differ.",
    ),
  },
  {
    Icon: Zap,
    title: t("Action", "Action"),
    desc: t(
      "L'information doit conduire à une décision. Sinon, ce n'est qu'un rapport de plus.",
      "Information has to lead to a decision. Otherwise it is just one more report.",
    ),
  },
  {
    Icon: ShieldCheck,
    title: t("Responsabilité", "Responsibility"),
    desc: t(
      "Les données et l'IA doivent être utilisées avec rigueur, traçabilité et prudence dans les affirmations.",
      "Data and AI must be used rigorously, traceably, and with care in what we claim.",
    ),
  },
  {
    Icon: Rocket,
    title: t("Ambition", "Ambition"),
    desc: t(
      "Construire une infrastructure capable de servir à l'échelle du continent.",
      "Build an infrastructure able to serve at the scale of the continent.",
    ),
  },
];

export default function AboutPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("À propos", "About")}
        image={MEDIA_ALIASES.about}
        lines={
          t.lang === "en"
            ? [
                "We are building",
                "the intelligence of African",
                <span key="a" className="text-muted-foreground">human capital.</span>,
              ]
            : [
                "Nous construisons",
                "l'intelligence du capital",
                <span key="a" className="text-muted-foreground">humain africain.</span>,
              ]
        }
        lead={t(
          "Malayka n'est pas une application parmi d'autres. C'est une infrastructure : une couche de données et d'intelligence dont Malayka IA, Malayka Éducative et Malayka Data sont les applications.",
          "Malayka is not one more app. It is an infrastructure: a layer of data and intelligence, of which Malayka IA, Malayka Éducative and Malayka Data are the applications.",
        )}
      >
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
          <Stat value="10K+" label={t("utilisateurs accompagnés", "people supported")} />
          <Stat value="10+" label={t("structures éducatives partenaires", "partner education providers")} />
          <Stat value="Abidjan" label={t("construit depuis la Côte d'Ivoire", "built from Côte d'Ivoire")} />
        </div>
      </PageHero>

      {/* Mission */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("Notre mission", "Our mission")}
            title={
              t.lang === "en" ? (
                <>
                  Enable every person, every institution and every decision-maker to better
                  understand how human capital is changing — and to{" "}
                  <Underline variante="double">act at the right moment</Underline>.
                </>
              ) : (
                <>
                  Permettre à chaque personne, chaque institution et chaque décideur de mieux
                  comprendre les transformations du capital humain — et d'
                  <Underline variante="double">agir au bon moment</Underline>.
                </>
              )
            }
          />
        </Reveal>
      </Section>

      <InfrastructureStatement
        eyebrow={t("Ce que nous construisons", "What we are building")}
        lines={
          t.lang === "en"
            ? ["We are building the infrastructure", "that shapes the future of learning", "and employment in Africa, with AI."]
            : ["Nous construisons l'infrastructure", "qui définit le futur de la formation", "et de l'emploi en Afrique avec l'IA."]
        }
        lead={t(
          "Une infrastructure, pas une application de plus : une couche de données et d'intelligence sur laquelle reposent nos produits — et, demain, ceux des institutions et des entreprises qui bâtissent avec nous.",
          "An infrastructure, not one more app: a layer of data and intelligence our own products rest on — and, tomorrow, those of the institutions and companies building alongside us.",
        )}
        pillars={[
          {
            image: MEDIA.infraFormer,
            label: t("Former", "Train"),
            caption: t(
              "Savoir quelles compétences le marché demande réellement, avant de construire un programme.",
              "Know which skills the market actually demands, before building a programme.",
            ),
          },
          {
            image: MEDIA.infraOrienter,
            label: t("Orienter", "Guide"),
            caption: t(
              "Donner à chaque personne et à chaque institution une lecture claire des trajectoires possibles.",
              "Give every person and every institution a clear read on the pathways open to them.",
            ),
          },
          {
            image: MEDIA.infraInserer,
            label: t("Insérer", "Place"),
            caption: t(
              "Relier le talent à l'opportunité au bon moment, et mesurer ce que cela produit.",
              "Connect talent to opportunity at the right moment, and measure what it produces.",
            ),
          },
        ]}
      />

      {/* Approche */}
      <Section tone="muted" id="approche">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={t("Notre approche", "Our approach")}
              title={t("Pourquoi Malayka existe.", "Why Malayka exists.")}
              lead={t(
                "Les opportunités et les signaux du marché du travail africain sont dispersés entre plateformes, institutions, réseaux sociaux et communautés — largement fragmentés et difficiles à mesurer. Les décisions, elles, se prennent souvent sur des données qui décrivent le passé.",
                "Opportunities and labour-market signals across Africa are scattered between platforms, institutions, social networks and communities — largely fragmented and hard to measure. Decisions, meanwhile, are often made on data that describes the past.",
              )}
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-4">
              <Card hover={false}>
                <p className="font-display text-base font-bold">
                  {t("L'échelle vient des machines", "Scale comes from machines")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "Scraping, API et automatisation permettent de collecter en continu, à un volume qu'aucune équipe ne pourrait atteindre manuellement.",
                    "Scraping, APIs and automation collect continuously, at a volume no team could reach by hand.",
                  )}
                </p>
              </Card>
              <Card hover={false}>
                <p className="font-display text-base font-bold">
                  {t("Le sens vient des humains", "Meaning comes from people")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "Des experts africains annotent, vérifient et contextualisent. Et lorsque la donnée manque, nous allons la chercher sur le terrain.",
                    "African experts annotate, verify and contextualise. And where the data is missing, we go and gather it in the field.",
                  )}
                </p>
              </Card>
              <Card hover={false}>
                <p className="font-display text-base font-bold">
                  {t("La valeur vient de l'action", "Value comes from action")}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "Une donnée qui ne débouche sur aucune décision n'a pas d'utilité. Tout notre travail vise le passage à l'acte : candidater, se former, orienter, décider, financer.",
                    "Data that leads to no decision serves no purpose. All our work aims at the act itself: applying, training, guiding, deciding, funding.",
                  )}
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Vision */}
      <Section>
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t("Notre vision", "Our vision")}
            title={
              t.lang === "en" ? (
                <>
                  A continent where <Hatched>every talent</Hatched> can see where they stand, where
                  opportunity is heading, and how to get ready for it.
                </>
              ) : (
                <>
                  Un continent où <Hatched>chaque talent</Hatched> peut comprendre où il se situe,
                  où vont les opportunités et comment s'y préparer.
                </>
              )
            }
          />
        </Reveal>
        <Reveal delay={150}>
          <FlowChain
            className="mt-12 justify-center"
            steps={
              t.lang === "en"
                ? ["Observe", "Anticipate", "Train", "Guide", "Place"]
                : ["Observer", "Anticiper", "Former", "Orienter", "Insérer"]
            }
          />
        </Reveal>
      </Section>

      <ImageBand
        image={MEDIA.ciel}
        lines={
          t.lang === "en"
            ? ["Scale comes from machines.", <span key="a">Meaning comes from <Mark>people</Mark>.</span>]
            : ["L'échelle vient des machines.", <span key="a">Le sens vient des <Mark>humains</Mark>.</span>]
        }
        lead={t(
          "Des experts africains annotent, vérifient et contextualisent. Et lorsque la donnée manque, nous allons la chercher sur le terrain.",
          "African experts annotate, verify and contextualise. And where the data is missing, we go and gather it in the field.",
        )}
      />

      <ConvergingPhotos
        eyebrow={t("Qui construit Malayka", "Who builds Malayka")}
        lines={
          t.lang === "en"
            ? ["One team,", "one ground,", "one continent."]
            : ["Une équipe,", "un terrain,", "un continent."]
        }
        lead={t(
          "Nous construisons depuis Abidjan, au contact des structures, des étudiants et des employeurs dont nous mesurons la réalité.",
          "We build from Abidjan, in contact with the institutions, students and employers whose reality we measure.",
        )}
        images={[MEDIA.equipe, MEDIA.ville, MEDIA.entraide]}
      />

      {/* Valeurs */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Nos valeurs", "Our values")}
            title={t("Ce qui guide chacune de nos décisions.", "What guides every decision we make.")}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES(t).map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <Card className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <v.Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display mt-4 text-base font-bold">{v.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{v.desc}</p>
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
              title={t("Envie de construire avec nous ?", "Want to build with us?")}
              lead={t(
                "Nous recrutons des profils data, IA, terrain et produit — à Abidjan et à distance.",
                "We are hiring across data, AI, field research and product — in Abidjan and remotely.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Voir les opportunités", "See open roles"), href: mailto("Carrières chez Malayka") }}
                secondary={{ label: t("Nous contacter", "Contact us"), href: mailto("Contact Malayka") }}
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
