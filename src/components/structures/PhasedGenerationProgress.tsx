import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AnimatedDots } from "@/components/chat/AnimatedDots";

/** Phase list for a long-running generation, reusing the same icon/animation
 * language as the chat's ActionProgressView (check/spinner/circle + AnimatedDots)
 * — used where a page shows a bare spinner during a 30s-5min LLM call (course
 * creation, exercise generation, evolution plans) with no sense of what's
 * actually happening. */
export interface GenerationPhase {
  label: string;
  status: "pending" | "running" | "done";
}

/** Fait avancer des phases sur une base de temps simulée — le backend ne renvoie
 * aucun événement intermédiaire pour ces appels (un seul POST bloquant, 20-300s
 * selon l'opération), contrairement au flux SSE de ChatView. Avancer "à peu
 * près au bon rythme" réduit l'anxiété d'attente sans prétendre suivre un
 * vrai signal serveur. */
export function useSimulatedPhases(labels: string[], active: boolean, stepMs = 8000): GenerationPhase[] {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      return;
    }
    const timer = setInterval(() => {
      setIndex((i) => Math.min(i + 1, labels.length - 1));
    }, stepMs);
    return () => clearInterval(timer);
  }, [active, stepMs, labels.length]);

  return labels.map((label, i) => ({
    label,
    status: i < index ? "done" : i === index ? "running" : "pending",
  }));
}

export function PhasedGenerationProgress({ phases }: { phases: GenerationPhase[] }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border bg-card px-5 py-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <AnimatedDots />
      </div>
      <div className="space-y-2.5">
        {phases.map((phase, i) => (
          <div key={i} className="flex items-center gap-3">
            {phase.status === "done" && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
            {phase.status === "running" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
            {phase.status === "pending" && <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />}
            <span
              className={cn(
                "text-sm transition-colors",
                phase.status === "done" && "text-foreground",
                phase.status === "running" && "font-medium text-foreground",
                phase.status === "pending" && "text-muted-foreground/60",
              )}
            >
              {phase.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
