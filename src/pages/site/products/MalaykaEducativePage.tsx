import {
  BookOpen, Route, ClipboardList, BarChart3, AlertTriangle, LifeBuoy,
  TrendingUp, Users,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, FlowChain,
  CtaGroup, mailto, Stat, ImageBand,
} from "../_shared/ui";
import { MEDIA } from "../_shared/media";
import { ConvergingPhotos } from "../_shared/scenes";
import { useT, type Translate } from "../_shared/lang";

const buildPipeline = (t: Translate) => [
  {
    Icon: BookOpen,
    title: t("Votre cours", "Your course"),
    desc: t("L'enseignant dépose son cours, tel qu'il l'a conçu.", "The teacher uploads their course, exactly as they designed it."),
  },
  {
    Icon: Route,
    title: t("Parcours personnalisé", "Personalised pathway"),
    desc: t(
      "Malayka le transforme en parcours adapté au rythme de chaque étudiant.",
      "Malayka turns it into a pathway tuned to each student's pace.",
    ),
  },
  {
    Icon: ClipboardList,
    title: t("Exercices & évaluations", "Exercises & assessments"),
    desc: t(
      "QCM, exercices et évaluations générés à partir du contenu réel du cours.",
      "Quizzes, exercises and assessments generated from the actual course content.",
    ),
  },
  {
    Icon: BarChart3,
    title: t("Analyse des résultats", "Results analysis"),
    desc: t(
      "Chaque réponse alimente une lecture claire de la progression.",
      "Every answer feeds a clear read on progress.",
    ),
  },
  {
    Icon: AlertTriangle,
    title: t("Détection des lacunes", "Gap detection"),
    desc: t(
      "Les notions fragiles sont identifiées, étudiant par étudiant.",
      "Shaky concepts are identified, student by student.",
    ),
  },
  {
    Icon: LifeBuoy,
    title: t("Alerte & intervention", "Alert & intervention"),
    desc: t(
      "L'enseignant est prévenu là où son intervention change quelque chose.",
      "The teacher is notified exactly where stepping in makes a difference.",
    ),
  },
];

const buildBenefits = (t: Translate) => [
  {
    Icon: Users,
    title: t("Une vision par promotion", "A cohort-level view"),
    desc: t(
      "Progression individuelle et collective visible d'un seul coup d'œil, en temps réel.",
      "Individual and collective progress visible at a glance, in real time.",
    ),
    meta: t("tableau de bord", "dashboard"),
  },
  {
    Icon: AlertTriangle,
    title: t("Alertes de décrochage", "Drop-off alerts"),
    desc: t(
      "Les étudiants inactifs ou en difficulté sont détectés avant que l'écart ne se creuse.",
      "Inactive or struggling students are spotted before the gap widens.",
    ),
    meta: t("prévention", "prevention"),
  },
  {
    Icon: TrendingUp,
    title: t("Orientation ancrée sur le marché", "Guidance grounded in the market"),
    desc: t(
      "Les compétences enseignées sont reliées aux métiers et opportunités réellement demandés.",
      "The skills you teach are linked to the occupations and opportunities actually in demand.",
    ),
    meta: t("formation → insertion", "training → placement"),
  },
];

export default function MalaykaEducativePage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow="Malayka Éducative"
        image={MEDIA.education}
        lines={
          t.lang === "en"
            ? [
                "Every student",
                "learns differently.",
                <span key="a" className="text-muted-foreground">The teacher is no longer alone.</span>,
              ]
            : [
                "Chaque étudiant",
                "apprend différemment.",
                <span key="a" className="text-muted-foreground">L'enseignant n'est plus seul.</span>,
              ]
        }
        lead={t(
          "Malayka Éducative transforme les cours en parcours personnalisés, évalue, détecte les lacunes et alerte l'enseignant au bon moment. Elle ne le remplace pas : elle lui donne davantage de visibilité et de capacité d'action.",
          "Malayka Éducative turns courses into personalised pathways, assesses, detects gaps and alerts the teacher at the right moment. It does not replace them: it gives them more visibility and more room to act.",
        )}
        chain={
          t.lang === "en"
            ? ["Course", "Pathway", "Assessment", "Gaps", "Intervention"]
            : ["Cours", "Parcours", "Évaluation", "Lacunes", "Intervention"]
        }
        primary={{ label: t("Demander une démonstration", "Request a demo"), href: mailto("Démonstration — Malayka Éducative") }}
        secondary={{ label: t("Voir la tarification", "See pricing"), to: "/tarification" }}
      >
        <div className="mt-16 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
          <Stat value="48h" label={t("délai de déploiement", "time to deploy")} />
          <Stat value="10+" label={t("structures éducatives partenaires", "partner education providers")} />
          <Stat
            value={t("Temps réel", "Real time")}
            label={t("suivi de progression", "progress tracking")}
          />
        </div>
      </PageHero>

      {/* Pipeline */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Le parcours", "The pathway")}
            title={t("Du cours déposé à l'intervention utile.", "From uploaded course to useful intervention.")}
            lead={t(
              "Chaque étape produit de l'information exploitable pour l'étape suivante — et pour l'enseignant.",
              "Each step produces information the next step — and the teacher — can act on.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildPipeline(t).map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <p.Icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-base font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal delay={420}>
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.04] p-8 text-center">
            <p className="font-display text-xl font-extrabold leading-snug">
              {t(
                "Malayka ne remplace pas l'enseignant. Elle lui donne davantage de visibilité et de capacité d'action.",
                "Malayka does not replace the teacher. It gives them more visibility and more room to act.",
              )}
            </p>
          </div>
        </Reveal>
      </Section>

      <ImageBand
        image={MEDIA.recherche}
        lines={
          t.lang === "en"
            ? ["Malayka does not replace", "the teacher."]
            : ["Malayka ne remplace pas", "l'enseignant."]
        }
        lead={t(
          "Elle lui donne davantage de visibilité et de capacité d'action — là où son intervention change vraiment quelque chose.",
          "It gives them more visibility and more room to act — exactly where stepping in genuinely matters.",
        )}
      />

      {/* Bénéfices */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour l'établissement", "For the institution")}
            title={t(
              "L'intelligence du marché au service de l'éducation.",
              "Market intelligence in the service of education.",
            )}
            lead={t(
              "Les données ne servent pas uniquement à trouver un emploi. Elles permettent aussi de mieux former — et d'aligner les programmes sur ce que le marché demande réellement.",
              "Data is not only for finding a job. It also makes for better teaching — and for programmes aligned with what the market actually asks for.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {buildBenefits(t).map((b, i) => (
            <Reveal key={b.title} delay={i * 90}>
              <FeatureCard {...b} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={320}>
          <FlowChain
            className="mt-12 justify-center"
            steps={
              t.lang === "en"
                ? ["Transform courses", "Personalise", "Assess", "Detect", "Support", "Guide"]
                : ["Transformer les cours", "Personnaliser", "Évaluer", "Détecter", "Accompagner", "Orienter"]
            }
          />
        </Reveal>
      </Section>

      <ConvergingPhotos
        eyebrow={t("Le trio pédagogique", "The teaching trio")}
        lines={
          t.lang === "en"
            ? ["The teacher decides.", "The AI prepares the ground."]
            : ["L'enseignant décide.", "L'IA prépare le terrain."]
        }
        lead={t(
          "Le cours reste celui de l'enseignant. Malayka s'occupe de la préparation, du suivi et de la détection — pour que l'intervention humaine arrive au bon moment.",
          "The course stays the teacher's own. Malayka handles preparation, tracking and detection — so that the human intervention lands at the right moment.",
        )}
        images={[MEDIA.classe, MEDIA.formation, MEDIA.entraide]}
      />

      {/* CTA */}
      <Section>
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t(
                "Donnez à vos enseignants une intelligence supplémentaire.",
                "Give your teachers an extra layer of intelligence.",
              )}
              lead={t(
                "Écoles, universités, centres de formation et EdTech : déploiement en 48h, accompagnement inclus.",
                "Schools, universities, training centres and EdTech: live in 48 hours, onboarding included.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Demander une démonstration", "Request a demo"), href: mailto("Démonstration — Malayka Éducative") }}
                secondary={{ label: t("Solutions établissements", "Solutions for institutions"), to: "/solutions/etablissements" }}
              />
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
