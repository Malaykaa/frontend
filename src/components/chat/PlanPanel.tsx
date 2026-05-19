import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { useThreadPlan, useCompleteStep } from "@/hooks/queries/use-plan";
import { computeProgress, isStepDone, type FrontendPlanStep } from "@/services/api/plans.api";

// ── Barre de progression ───────────────────────────────────────────────────

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Ligne d'étape ──────────────────────────────────────────────────────────

interface StepRowProps {
  step: FrontendPlanStep;
  threadId: string;
  isCompleting: boolean;
  onComplete: (stepId: string) => void;
}

function StepRow({ step, isCompleting, onComplete }: StepRowProps) {
  const done = isStepDone(step);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl p-3 transition-colors",
        done ? "bg-emerald-50/50" : "hover:bg-muted/40"
      )}
    >
      {/* Checkbox */}
      <button
        disabled={done || isCompleting}
        onClick={() => !done && onComplete(step.id)}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          done
            ? "border-emerald-500 bg-emerald-500 cursor-default"
            : isCompleting
            ? "border-muted cursor-wait"
            : "border-muted-foreground/30 hover:border-primary cursor-pointer"
        )}
        title={done ? "Étape terminée" : "Marquer comme terminée"}
      >
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        ) : isCompleting ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : null}
      </button>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {step.isMission && (
            <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              <Zap className="h-2.5 w-2.5" />
              Mission
            </span>
          )}
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              done && "text-muted-foreground line-through"
            )}
          >
            {step.title}
          </p>
        </div>

        {step.description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        )}

        {done && step.completedAt && (
          <p className="mt-0.5 text-[10px] text-emerald-600 font-medium">
            ✓ Terminé
          </p>
        )}
      </div>

      {/* Numéro */}
      <span className="shrink-0 text-xs text-muted-foreground/50 tabular-nums mt-0.5">
        {step.step}
      </span>
    </div>
  );
}

// ── Squelette ──────────────────────────────────────────────────────────────

function PlanSkeleton() {
  return (
    <div className="space-y-2 px-1 animate-pulse">
      {[60, 80, 70].map((w) => (
        <div key={w} className="flex items-center gap-3 p-2">
          <div className="h-5 w-5 shrink-0 rounded-full bg-muted" />
          <div className={`h-3.5 rounded bg-muted`} style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

// ── PlanPanel principal ────────────────────────────────────────────────────

interface PlanPanelProps {
  threadId: string;
}

export function PlanPanel({ threadId }: PlanPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const { data: steps, isLoading, isError } = useThreadPlan(threadId);
  const { mutateAsync: complete } = useCompleteStep(threadId);

  // Pas de plan → ne rien afficher
  if (!isLoading && (!steps || steps.length === 0)) return null;
  if (isError) return null;

  const { done, total, pct } = steps ? computeProgress(steps) : { done: 0, total: 0, pct: 0 };

  const handleComplete = async (stepId: string) => {
    setCompletingId(stepId);
    try {
      await complete(stepId);
      toast.success("Étape marquée comme terminée !");
    } catch {
      toast.error("Impossible de valider l'étape");
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="border-b bg-background">
      {/* Header — toujours visible */}
      <button
        className="flex w-full items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {/* Titre + compteur */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-muted-foreground">
            Plan d'action
          </span>
          {!isLoading && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary tabular-nums">
              {done}/{total}
            </span>
          )}
        </div>

        {/* Barre de progression compacte */}
        {!isLoading && (
          <div className="flex flex-1 items-center gap-2 max-w-[120px]">
            <ProgressBar pct={pct} />
            <span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
              {pct}%
            </span>
          </div>
        )}

        {/* Chevron */}
        <div className="shrink-0 text-muted-foreground">
          {expanded
            ? <ChevronUp className="h-4 w-4" />
            : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {/* Corps expansible */}
      {expanded && (
        <div className="border-t bg-muted/10 px-3 pb-3 pt-2">
          {isLoading ? (
            <PlanSkeleton />
          ) : (
            <>
              {/* Barre de progression détaillée */}
              <div className="mb-3 space-y-1">
                <ProgressBar pct={pct} />
                <p className="text-center text-xs text-muted-foreground">
                  {done} étape{done !== 1 ? "s" : ""} terminée{done !== 1 ? "s" : ""} sur {total}
                  {pct === 100 && " 🎉"}
                </p>
              </div>

              {/* Liste des étapes */}
              <div className="space-y-1">
                {steps!.map((step) => (
                  <StepRow
                    key={step.id}
                    step={step}
                    threadId={threadId}
                    isCompleting={completingId === step.id}
                    onComplete={handleComplete}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
