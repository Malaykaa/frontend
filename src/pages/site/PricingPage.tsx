import { useNavigate } from "react-router-dom";
import { Check, GraduationCap, Landmark, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, Section, SectionHeading, PageHero, Card, mailto } from "./_shared/ui";
import { useT, type Translate } from "./_shared/lang";
import { Mark } from "./_shared/emphasis";

const buildPlans = (t: Translate) => [
  {
    name: "Free",
    tag: t("Découverte", "Discovery"),
    price: t("0 F", "0 F"),
    period: t("toujours", "forever"),
    desc: t(
      "Pour découvrir Malayka et recevoir vos premières opportunités.",
      "To get to know Malayka and receive your first opportunities.",
    ),
    features: [
      t("Détection d'opportunités de base", "Basic opportunity detection"),
      t("1 objectif actif", "1 active goal"),
      t("Notifications par email", "Email notifications"),
    ],
    cta: t("Commencer gratuitement", "Start for free"),
    featured: false,
  },
  {
    name: "Pro",
    tag: t("Accompagnement avancé", "Advanced support"),
    price: t("Sur devis", "On request"),
    period: t("par mois", "per month"),
    desc: t(
      "Pour un accompagnement complet vers vos objectifs, avec Malayka comme copilote.",
      "Full support towards your goals, with Malayka as your copilot.",
    ),
    features: [
      t("Objectifs illimités", "Unlimited goals"),
      t("Génération de documents illimitée", "Unlimited document generation"),
      t("Alertes WhatsApp en temps réel", "Real-time WhatsApp alerts"),
      t("Plan d'action personnalisé", "Personalised action plan"),
    ],
    cta: t("Commencer gratuitement", "Start for free"),
    featured: true,
  },
  {
    name: "Provider",
    tag: t("Proposer ses services", "Offer your services"),
    price: t("Sur devis", "On request"),
    period: t("par mission", "per assignment"),
    desc: t(
      "Pour proposer vos services et recevoir des opportunités de missions ciblées.",
      "To offer your services and receive targeted assignment opportunities.",
    ),
    features: [
      t("Profil prestataire visible", "Visible provider profile"),
      t("Missions matchées à vos compétences", "Assignments matched to your skills"),
      t("Mise en relation directe avec les clients", "Direct introductions to clients"),
    ],
    cta: t("Devenir prestataire", "Become a provider"),
    featured: false,
  },
];

const buildOrgPlans = (t: Translate) => [
  {
    Icon: GraduationCap,
    tag: t("Pour les établissements", "For institutions"),
    name: t("Éducation", "Education"),
    desc: t(
      "Tarification selon le nombre d'étudiants, de classes et les fonctionnalités activées. Déploiement en 48h, accompagnement inclus.",
      "Priced on the number of students, classes and features enabled. Live in 48 hours, onboarding included.",
    ),
    cta: t("Demander une démonstration", "Request a demo"),
    subject: "Tarification — Éducation",
  },
  {
    Icon: Landmark,
    tag: t("Gouvernements · ONG · Bailleurs", "Governments · NGOs · Funders"),
    name: t("Observatoire", "Observatory"),
    desc: t(
      "Tableaux de bord temps réel, indicateurs de suivi, rapports périodiques et accès API, dimensionnés à votre périmètre et vos territoires.",
      "Real-time dashboards, tracking indicators, periodic reports and API access, sized to your scope and your territories.",
    ),
    cta: t("Demander une présentation", "Request a walkthrough"),
    subject: "Tarification — Observatoire",
  },
  {
    Icon: Cpu,
    tag: t("Entreprises d'IA & data", "AI & data companies"),
    name: "Datasets & API",
    desc: t(
      "Datasets sur mesure, annotation dédiée, benchmarks et accès API. Tarification selon le volume, la fraîcheur et la profondeur d'annotation.",
      "Bespoke datasets, dedicated annotation, benchmarks and API access. Priced on volume, freshness and annotation depth.",
    ),
    cta: t("Parler à l'équipe Data", "Talk to the Data team"),
    subject: "Tarification — Datasets & API",
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const t = useT();
  const PLANS = buildPlans(t);
  const ORG_PLANS = buildOrgPlans(t);

  return (
    <>
      <PageHero
        eyebrow={t("Tarification", "Pricing")}
        lines={
          t.lang === "en"
            ? ["Simple pricing,", <span key="a" className="text-muted-foreground">matched to how you use it.</span>]
            : ["Une tarification simple,", <span key="a" className="text-muted-foreground">adaptée à votre usage.</span>]
        }
        lead={t(
          "Particulier, établissement, institution ou entreprise d'IA : Malayka s'adapte à votre échelle et à votre cas d'usage.",
          "Individual, school, institution or AI company: Malayka scales to your size and your use case.",
        )}
      />

      {/* Particuliers */}
      <Section tone="default">
        <Reveal>
          <SectionHeading
            eyebrow={t("Pour les particuliers", "For individuals")}
            title={
              t.lang === "en" ? (
                <>Start <Mark>free</Mark>, scale up when you need to.</>
              ) : (
                <>Commencez <Mark>gratuitement</Mark>, montez en puissance si besoin.</>
              )
            }
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                  p.featured ? "border-primary/40 bg-primary/[0.03] shadow-lg shadow-primary/10" : "bg-card"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-primary-foreground">
                    {t("Recommandé", "Recommended")}
                  </span>
                )}
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{p.tag}</p>
                <h3 className="font-display mt-2 text-2xl font-extrabold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold">{p.price}</span>
                  <span className="text-[13px] text-muted-foreground">/ {p.period}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-7 h-11 font-semibold"
                  variant={p.featured ? "default" : "outline"}
                  onClick={() => navigate("/onboarding")}
                >
                  {p.cta}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Organisations */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow={t("Organisations", "Organisations")}
            title={t("Sur mesure, selon votre périmètre.", "Bespoke, sized to your scope.")}
            lead={t(
              "Data · API · Observatoire · Intelligence — nous dimensionnons l'accompagnement à votre échelle.",
              "Data · API · Observatory · Intelligence — we size the engagement to your scale.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {ORG_PLANS.map((o, i) => (
            <Reveal key={o.name} delay={i * 90}>
              <Card className="flex h-full flex-col">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <o.Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{o.tag}</p>
                <h3 className="font-display mt-2 text-xl font-extrabold">{o.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{o.desc}</p>
                <Button
                  variant="outline"
                  className="mt-6 h-11 font-semibold"
                  onClick={() => (window.location.href = mailto(o.subject))}
                >
                  {o.cta}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
