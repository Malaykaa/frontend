import { useEffect, useState } from "react";
import {
  MapPin, GraduationCap, Banknote, ListChecks, Laptop, FileCheck, type LucideIcon,
} from "lucide-react";
import { AiAvatar } from "@/components/chat/AiAvatar";
import { AnimatedDots } from "@/components/chat/AnimatedDots";

/**
 * Mini-simulation d'une conversation Malayka — remplace l'état vide générique
 * ("Aucun objectif pour le moment") par un aperçu concret de ce qui se passe
 * une fois un objectif créé. Reprend le langage visuel exact du chat (bulles,
 * AiAvatar, AnimatedDots) pour que ce soit reconnaissable comme "Malayka
 * lui-même", pas une illustration générique.
 *
 * Plusieurs scénarios défilent en boucle tant que l'écran reste affiché (pas
 * d'objectif créé) — chacun montre un cas d'usage différent (stage, bourse,
 * financement, concours, freelance, génération de document) pour donner une
 * idée large de ce que Malayka couvre, pas un seul exemple répété. Le bouton
 * "Créer mon premier objectif" reste en dehors de ce composant, fixe, jamais
 * affecté par le défilement (cf. PourMoiTab.EmptyState).
 */

interface Scenario {
  userMessage: string;
  aiIntro: string;
  resultTitle: string;
  resultSubtitle: string;
  ResultIcon: LucideIcon;
}

const SCENARIOS: Scenario[] = [
  {
    userMessage: "Je cherche un stage en développement web",
    aiIntro: "J'ai trouvé une offre qui correspond à ton profil :",
    resultTitle: "Stage Développement Web — Wave",
    resultSubtitle: "Abidjan, Côte d'Ivoire",
    ResultIcon: MapPin,
  },
  {
    userMessage: "Je cherche une bourse pour un master à l'étranger",
    aiIntro: "J'ai trouvé une bourse qui correspond à ton profil :",
    resultTitle: "Bourse d'Excellence — Campus France",
    resultSubtitle: "France · Master",
    ResultIcon: GraduationCap,
  },
  {
    userMessage: "Je cherche un financement pour mon projet agricole",
    aiIntro: "J'ai trouvé une subvention adaptée :",
    resultTitle: "Subvention Jeunes Entrepreneurs — PADFA",
    resultSubtitle: "Côte d'Ivoire · Agriculture",
    ResultIcon: Banknote,
  },
  {
    userMessage: "Je prépare le concours ENAM",
    aiIntro: "Voici ton plan de révision :",
    resultTitle: "Plan de révision — Concours ENAM",
    resultSubtitle: "5 étapes personnalisées",
    ResultIcon: ListChecks,
  },
  {
    userMessage: "Je cherche des missions freelance en design graphique",
    aiIntro: "J'ai trouvé une mission qui correspond à ton profil :",
    resultTitle: "Mission freelance — Identité visuelle",
    resultSubtitle: "À distance · Design graphique",
    ResultIcon: Laptop,
  },
  {
    userMessage: "Peux-tu générer mon CV ?",
    aiIntro: "Ton document est prêt :",
    resultTitle: "CV professionnel",
    resultSubtitle: "Généré et prêt à télécharger",
    ResultIcon: FileCheck,
  },
  {
    userMessage: "J'ai besoin d'une lettre de motivation pour un stage",
    aiIntro: "Ton document est prêt :",
    resultTitle: "Lettre de motivation",
    resultSubtitle: "Générée et prête à télécharger",
    ResultIcon: FileCheck,
  },
];

// Timings d'une itération (ms) — enchaînement message → réflexion → résultat,
// puis pause sur le résultat avant de passer au scénario suivant.
const T_USER_MSG = 400;
const T_TYPING = 1300;
const T_RESULT = 2500;
const T_NEXT = 5500;

export function ObjectiveSimulation() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stage, setStage] = useState(0); // 0 = rien, 1 = message user, 2 = IA réfléchit, 3 = résultat

  useEffect(() => {
    setStage(0);
    const timers = [
      setTimeout(() => setStage(1), T_USER_MSG),
      setTimeout(() => setStage(2), T_TYPING),
      setTimeout(() => setStage(3), T_RESULT),
      setTimeout(() => setScenarioIndex((i) => (i + 1) % SCENARIOS.length), T_NEXT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [scenarioIndex]);

  const { userMessage, aiIntro, resultTitle, resultSubtitle, ResultIcon } = SCENARIOS[scenarioIndex];

  return (
    <div className="min-h-[168px] space-y-2.5 rounded-xl border bg-card p-3">
      {stage >= 1 && (
        <div className="flex justify-end animate-fade-in">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs leading-snug text-primary-foreground shadow-sm">
            {userMessage}
          </div>
        </div>
      )}

      {stage === 2 && (
        <div className="flex items-center gap-2 animate-fade-in">
          <AiAvatar size="sm" />
          <div className="rounded-2xl rounded-tl-sm border bg-background px-3 py-2">
            <AnimatedDots size="sm" />
          </div>
        </div>
      )}

      {stage >= 3 && (
        <div className="flex items-start gap-2 animate-fade-in">
          <AiAvatar size="sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="rounded-2xl rounded-tl-sm border bg-background px-3 py-2 text-xs leading-snug">
              {aiIntro}
            </div>
            <div className="rounded-lg border bg-primary/5 p-2.5">
              <p className="text-xs font-semibold text-primary">{resultTitle}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <ResultIcon className="h-3 w-3 shrink-0" /> {resultSubtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
