import {
  Briefcase, GraduationCap, Award, Target, FileText, MessageCircle,
  Check, Radar, Send,
} from "lucide-react";
import {
  Reveal, Section, SectionHeading, PageHero, Card, FeatureCard, FlowChain,
  CtaGroup, mailto, ImageBand,
} from "../_shared/ui";
import { MEDIA, MEDIA_ALIASES } from "../_shared/media";
import { JoiningBlocks } from "../_shared/scenes";
import { useT, type Translate } from "../_shared/lang";

const buildCapabilities = (t: Translate) => [
  {
    Icon: Briefcase,
    title: t("Emplois, stages et missions", "Jobs, internships and assignments"),
    desc: t(
      "CDD, CDI, stages, alternance, missions freelance et demandes de prestation.",
      "Fixed-term and permanent roles, internships, apprenticeships, freelance assignments and client requests.",
    ),
    meta: t("formel et informel", "formal and informal"),
  },
  {
    Icon: GraduationCap,
    title: t("Formations", "Training"),
    desc: t(
      "Formations, certifications et parcours alignés sur les compétences que le marché demande vraiment.",
      "Courses, certifications and pathways aligned with the skills the market genuinely asks for.",
    ),
    meta: t("local et international", "local and international"),
  },
  {
    Icon: Award,
    title: t("Bourses et financements", "Scholarships and funding"),
    desc: t(
      "Bourses d'études, appels à projets, programmes d'accompagnement et financements entrepreneuriaux.",
      "Study scholarships, calls for projects, support programmes and startup funding.",
    ),
    meta: t("opportunités émergentes", "emerging opportunities"),
  },
  {
    Icon: Target,
    title: t("Lacunes de compétences", "Skill gaps"),
    desc: t(
      "Malayka compare votre profil aux exigences réelles du marché et identifie ce qu'il vous manque.",
      "Malayka compares your profile against what the market actually requires and identifies what you are missing.",
    ),
    meta: t("écarts mesurés", "measured gaps"),
  },
  {
    Icon: FileText,
    title: t("Dossiers de candidature", "Application packs"),
    desc: t(
      "CV, lettres de motivation et documents professionnels générés à partir de votre profil.",
      "CVs, cover letters and professional documents generated from your profile.",
    ),
    meta: t("prêts en quelques secondes", "ready in seconds"),
  },
  {
    Icon: MessageCircle,
    title: t("Alertes WhatsApp", "WhatsApp alerts"),
    desc: t(
      "Les opportunités pertinentes arrivent directement là où vous êtes déjà, sans app supplémentaire.",
      "Relevant opportunities arrive where you already are, with no extra app to install.",
    ),
    meta: t("l'information vient à vous", "the information comes to you"),
  },
];

const buildFlow = (t: Translate) =>
  t.lang === "en"
    ? ["Your profile", "Goals", "Skills", "Continuous monitoring", "Matching", "Opportunity", "WhatsApp"]
    : ["Votre profil", "Objectifs", "Compétences", "Surveillance continue", "Matching", "Opportunité", "WhatsApp"];

export default function MalaykaIaPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow="Malayka IA"
        image={MEDIA_ALIASES.individuals}
        lines={
          t.lang === "en"
            ? [
                "Stop hunting",
                "for opportunities.",
                <span key="a" className="text-muted-foreground">They come to you.</span>,
              ]
            : [
                "Ne cherchez plus",
                "les opportunités.",
                <span key="a" className="text-muted-foreground">Elles viennent à vous.</span>,
              ]
        }
        lead={t(
          "Malayka comprend votre profil, vos objectifs et vos compétences. Elle surveille le marché en continu, identifie les opportunités qui vous correspondent vraiment et vous accompagne jusqu'à l'action.",
          "Malayka understands your profile, your goals and your skills. It watches the market continuously, identifies the opportunities that genuinely fit, and stays with you through to action.",
        )}
        chain={
          t.lang === "en"
            ? ["Profile", "Monitoring", "Matching", "Action"]
            : ["Profil", "Surveillance", "Matching", "Action"]
        }
        primary={{ label: t("Commencer gratuitement", "Start for free"), to: "/onboarding" }}
        secondary={{ label: t("Se connecter", "Log in"), to: "/login" }}
      />

      {/* Le parcours */}
      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={t("Comment ça marche", "How it works")}
              title={t("Votre intelligence personnelle du marché.", "Your personal intelligence on the market.")}
              lead={t(
                "Vous décrivez votre objectif une fois. Malayka fait le reste : elle observe le marché à votre place, en continu, et ne vous sollicite que lorsqu'il y a quelque chose qui compte pour vous.",
                "You describe your goal once. Malayka does the rest: it watches the market for you, continuously, and only comes back to you when something actually matters.",
              )}
            />
            <FlowChain steps={buildFlow(t)} className="mt-8" />
          </Reveal>

          <Reveal delay={140}>
            <Card hover={false} className="border-primary/20">
              <div className="flex items-center gap-2">
                <Radar className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t("Nouvelle opportunité détectée", "New opportunity detected")}
                </span>
              </div>
              <h3 className="font-display mt-4 text-xl font-extrabold">Data Analyst — Abidjan</h3>
              <p className="mt-1 font-mono text-sm font-bold text-primary">{t("92 % de correspondance", "92% match")}</p>
              <div className="mt-5 space-y-2">
                {["Python", "SQL", t("Analyse de données", "Data analysis")].map((s) => (
                  <p key={s} className="flex items-center gap-2 text-sm text-foreground/75">
                    <Check className="h-4 w-4 text-foreground" />
                    {s}
                  </p>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-muted/60 p-4">
                <p className="text-sm">
                  <span className="font-semibold">{t("Compétence à renforcer :", "Skill to strengthen:")}</span>{" "}
                  <span className="text-muted-foreground">Power BI</span>
                </p>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {t(
                    "Malayka vous propose deux formations pour combler cet écart.",
                    "Malayka suggests two courses to close that gap.",
                  )}
                </p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Capacités */}
      <Section tone="muted">
        <Reveal>
          <SectionHeading
            eyebrow={t("Ce que vous pouvez faire", "What you can do")}
            title={t(
              "Un seul agent, tout le spectre des opportunités.",
              "One agent, the full spectrum of opportunity.",
            )}
            lead={t(
              "Malayka ne se limite pas aux offres d'emploi classiques : elle couvre aussi le freelance, les prestations, les bourses, les financements et les opportunités qui circulent dans les communautés.",
              "Malayka is not limited to conventional job ads: it also covers freelance work, services, scholarships, funding, and the opportunities that circulate inside communities.",
            )}
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {buildCapabilities(t).map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <FeatureCard {...c} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ImageBand
        image={MEDIA.entraide}
        lines={
          t.lang === "en"
            ? ["Your next opportunity", "already exists."]
            : ["Votre prochaine opportunité", "existe déjà."]
        }
        lead={t(
          "Encore faut-il la voir. Malayka surveille le marché en continu et ne vous sollicite que lorsqu'il y a quelque chose qui compte pour vous.",
          "You still have to see it. Malayka watches the market continuously and only comes back to you when something actually matters.",
        )}
        cta={{ label: t("Commencer gratuitement", "Start for free"), to: "/onboarding" }}
      />

      {/* WhatsApp */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="WhatsApp"
              title={t("L'information vient à vous.", "The information comes to you.")}
              lead={t(
                "Les meilleures opportunités ne servent à rien si vous ne les voyez jamais. Malayka vous envoie directement sur WhatsApp celles qui correspondent à votre profil et à vos objectifs.",
                "The best opportunities are worth nothing if you never see them. Malayka sends the ones that match your profile and goals straight to WhatsApp.",
              )}
            />
          </Reveal>
          <Reveal delay={140}>
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2.5 border-b border-border pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                  <Send className="h-3.5 w-3.5 text-background" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Malayka</p>
                  <p className="text-[11px] text-muted-foreground">{t("maintenant", "now")}</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 text-muted-foreground">
                <p className="text-sm">
                  {t(
                    "Une nouvelle opportunité correspond à votre profil.",
                    "A new opportunity matches your profile.",
                  )}
                </p>
                <div className="rounded-xl bg-card p-3.5">
                  <p className="text-sm font-bold text-foreground">
                    {t("Stage Data Analyst — Abidjan", "Data Analyst internship — Abidjan")}
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-primary">
                    {t("Match : 94 %", "Match: 94%")}
                  </p>
                  <div className="mt-3 space-y-1">
                    {["Python", "SQL", t("Analyse de données", "Data analysis")].map((s) => (
                      <p key={s} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <Check className="h-3 w-3 text-foreground" />
                        {s}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-[12px] text-muted-foreground">
                    {t("Il vous manque : Power BI", "You are missing: Power BI")}
                  </p>
                </div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {t("Voir l'opportunité →", "View the opportunity →")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <JoiningBlocks
        eyebrow={t("Ce qui change", "What changes")}
        lines={
          t.lang === "en"
            ? ["Searching takes time.", "Being found is another matter."]
            : ["Chercher, c'est long.", "Être trouvé, c'est autre chose."]
        }
        top={{
          title: t("Sans Malayka", "Without Malayka"),
          desc: t(
            "Dix plateformes à parcourir chaque semaine, des annonces déjà pourvues, et les opportunités qui circulent hors des canaux officiels qui vous échappent.",
            "Ten platforms to trawl every week, listings already filled, and the opportunities moving outside official channels passing you by.",
          ),
        }}
        bottom={{
          title: t("Avec Malayka", "With Malayka"),
          desc: t(
            "Une surveillance continue de votre marché, des opportunités qualifiées envoyées sur WhatsApp, et les écarts de compétences identifiés avant l'entretien.",
            "Continuous monitoring of your market, qualified opportunities sent over WhatsApp, and skill gaps identified before the interview.",
          ),
        }}
        image={MEDIA.entrepreneur}
      />

      {/* CTA */}
      <Section tone="default">
        <Reveal>
          <div className="text-center">
            <SectionHeading
              align="center"
              title={t(
                "Votre prochaine opportunité existe déjà. Encore faut-il la voir.",
                "Your next opportunity already exists. You still have to see it.",
              )}
              lead={t(
                "Créez votre profil en quelques minutes. Malayka commence à observer le marché pour vous immédiatement.",
                "Create your profile in a few minutes. Malayka starts watching the market for you straight away.",
              )}
            />
            <div className="mt-10 flex justify-center">
              <CtaGroup
                primary={{ label: t("Commencer gratuitement", "Start for free"), to: "/onboarding" }}
                secondary={{ label: t("Voir la tarification", "See pricing"), to: "/tarification" }}
              />
            </div>
            <p className="mt-6 text-[13px] text-muted-foreground">
              {t("Gratuit pour commencer · sans carte bancaire · ", "Free to start · no card required · ")}
              <a href={mailto("Question sur Malayka IA")} className="text-primary hover:underline">
                {t("une question ?", "have a question?")}
              </a>
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
