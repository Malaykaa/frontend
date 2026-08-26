import { useEffect, useState } from "react";
import { Briefcase, MapPin, GraduationCap, Banknote, FileCheck, type LucideIcon } from "lucide-react";
import { AiAvatar } from "@/components/chat/AiAvatar";
import { AnimatedDots } from "@/components/chat/AnimatedDots";

/**
 * Remplace l'ancien "tableau de bord IA" du hero (fenêtre façon macOS avec
 * barre de scan et liste de correspondances) par une simulation de
 * conversation réelle, se terminant par l'alerte WhatsApp.
 *
 * Demande explicite : garder la one-page telle quelle, changer uniquement ce
 * visuel. Reprend donc le langage exact du produit (AiAvatar, AnimatedDots,
 * bulles), comme ObjectiveSimulation dans l'app, plutôt qu'une interface
 * fictive redessinée pour l'occasion.
 */

interface Scenario {
  userMessage: string;
  aiIntro: string;
  resultTitle: string;
  resultSubtitle: string;
  ResultIcon: LucideIcon;
  whatsapp: string;
}

const SCENARIOS: Scenario[] = [
  {
    userMessage: "Je cherche un emploi en comptabilité à Abidjan",
    aiIntro: "J'ai trouvé une offre qui correspond à ton profil :",
    resultTitle: "Comptable junior — Groupe Sifca",
    resultSubtitle: "Abidjan · CDI",
    ResultIcon: Briefcase,
    whatsapp: "3 nouvelles offres en comptabilité viennent d'être publiées à Abidjan.",
  },
  {
    userMessage: "Je cherche un stage en développement web",
    aiIntro: "Voici une offre publiée cette semaine :",
    resultTitle: "Stage Développement Web — Wave",
    resultSubtitle: "Abidjan · 6 mois",
    ResultIcon: MapPin,
    whatsapp: "Une nouvelle offre de stage dev web vient de sortir. Candidature avant le 15.",
  },
  {
    userMessage: "Je cherche une bourse pour un master à l'étranger",
    aiIntro: "Une bourse ouverte correspond à ton niveau :",
    resultTitle: "Bourse d'Excellence — Campus France",
    resultSubtitle: "Master · dossier ouvert",
    ResultIcon: GraduationCap,
    whatsapp: "La bourse Campus France ferme dans 8 jours. Ton dossier est prêt à 70 %.",
  },
  {
    userMessage: "Je cherche un financement pour mon projet agricole",
    aiIntro: "Ce programme finance des projets comme le tien :",
    resultTitle: "Subvention Jeunes Entrepreneurs — PADFA",
    resultSubtitle: "Agriculture · jusqu'à 5 M FCFA",
    ResultIcon: Banknote,
    whatsapp: "Un nouvel appel à projets agricoles vient d'ouvrir. Dépôt jusqu'au 30.",
  },
  {
    userMessage: "Peux-tu générer mon CV ?",
    aiIntro: "Ton CV est prêt, adapté aux offres que tu vises :",
    resultTitle: "CV professionnel",
    resultSubtitle: "Prêt à télécharger",
    ResultIcon: FileCheck,
    whatsapp: "Ton CV est prêt. 2 offres correspondent déjà à ton nouveau profil.",
  },
];

const T_USER_MSG = 500;
const T_TYPING = 1400;
const T_RESULT = 2600;
const T_WHATSAPP = 4600;
const T_NEXT = 8200;

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.03c-.25.69-1.44 1.32-1.99 1.4-.53.08-1.16.11-1.87-.12-.43-.14-.99-.32-1.7-.63-2.99-1.29-4.94-4.3-5.09-4.5-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.05-2.49c.27-.3.6-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.41Z" />
    </svg>
  );
}

export function HeroWhatsAppSimulation() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  // 0 = rien · 1 = message user · 2 = Malayka réfléchit · 3 = résultat · 4 = WhatsApp
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setStage(0);
    const timers = [
      setTimeout(() => setStage(1), T_USER_MSG),
      setTimeout(() => setStage(2), T_TYPING),
      setTimeout(() => setStage(3), T_RESULT),
      setTimeout(() => setStage(4), T_WHATSAPP),
      setTimeout(() => setScenarioIndex((i) => (i + 1) % SCENARIOS.length), T_NEXT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [scenarioIndex]);

  const { userMessage, aiIntro, resultTitle, resultSubtitle, ResultIcon, whatsapp } =
    SCENARIOS[scenarioIndex];

  return (
    <div className="relative w-full max-w-[390px]">
      <div className="absolute -inset-2 rounded-3xl bg-primary/15 blur-2xl" />

      {/* Hauteur minimale fixe : sans elle, la mise en page saute à chaque
          changement de scénario, les textes n'ayant pas la même longueur. */}
      <div className="relative min-h-[360px] space-y-3 overflow-hidden rounded-2xl border-2 border-primary/15 bg-secondary/40 p-4 shadow-2xl dark:bg-card dark:border-border">
        {stage >= 1 && (
          <div className="flex justify-end animate-fade-in">
            <div className="max-w-[88%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2.5 text-sm leading-snug text-primary-foreground">
              {userMessage}
            </div>
          </div>
        )}

        {stage === 2 && (
          <div className="flex items-center gap-2 animate-fade-in">
            <AiAvatar size="sm" />
            <div className="rounded-2xl rounded-tl-sm border bg-background px-3.5 py-2.5">
              <AnimatedDots size="sm" />
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div className="flex items-start gap-2 animate-fade-in">
            <AiAvatar size="sm" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="rounded-2xl rounded-tl-sm border bg-background px-3.5 py-2.5 text-sm leading-snug">
                {aiIntro}
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-sm font-semibold">{resultTitle}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ResultIcon className="h-3.5 w-3.5 shrink-0" />
                  {resultSubtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {stage >= 4 && (
          <div className="animate-fade-in pt-1">
            <p className="mb-1.5 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
              Plus tard, sans ouvrir l'application
            </p>
            <div className="flex items-start gap-2.5 rounded-xl border border-[#25D366]/30 bg-[#25D366]/5 p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
                <WhatsAppGlyph className="h-4 w-4 text-white" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold">
                  Malayka <span className="font-normal text-muted-foreground">· WhatsApp</span>
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{whatsapp}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
