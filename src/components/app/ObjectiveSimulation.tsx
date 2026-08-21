import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { AiAvatar } from "@/components/chat/AiAvatar";
import { AnimatedDots } from "@/components/chat/AnimatedDots";

/**
 * Mini-simulation d'une conversation Malayka — remplace l'état vide générique
 * ("Aucun objectif pour le moment") par un aperçu concret de ce qui se passe
 * une fois un objectif créé : l'utilisateur exprime un besoin, l'IA répond
 * avec une offre réelle. Reprend le langage visuel exact du chat (bulles,
 * AiAvatar, AnimatedDots) pour que ce soit reconnaissable comme "Malayka
 * lui-même", pas une illustration générique.
 *
 * Se joue une seule fois à l'affichage (pas de boucle infinie) — un utilisateur
 * qui revient sur cet écran vide plusieurs fois n'a pas besoin de la revoir
 * tourner en continu.
 */
export function ObjectiveSimulation() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setStage(3), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-2.5 rounded-xl border bg-card p-3">
      {stage >= 1 && (
        <div className="flex justify-end animate-fade-in">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-xs leading-snug text-primary-foreground shadow-sm">
            Je cherche un stage en développement web
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
              J'ai trouvé une offre qui correspond à ton profil :
            </div>
            <div className="rounded-lg border bg-primary/5 p-2.5">
              <p className="text-xs font-semibold text-primary">Stage Développement Web — Wave</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" /> Abidjan, Côte d'Ivoire
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
