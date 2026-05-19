import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { AiAvatar } from "./AiAvatar";
import { AnimatedDots } from "./AnimatedDots";
import { cn } from "@/shared/lib/utils";
import type { AgentStep } from "@/services/api/actions.api";

const AGENT_LABELS: Record<string, string> = {
  triage:           "Analyse de ta demande",
  orchestrator:     "Orchestration",
  exam_agent:       "Agent Concours",
  scholarship_agent:"Agent Bourses",
  funding_agent:    "Agent Financements",
  career_agent:     "Agent Carrière",
  freelance_agent:  "Agent Freelance",
  tender_agent:     "Agent Appels d'offres",
  document_agent:   "Rédaction du document",
  cv_agent:         "Génération du CV",
  merger:           "Finalisation",
  execution_engine: "Moteur d'exécution",
};

function getAgentLabel(agent: string): string {
  const key = agent.toLowerCase().replace(/[-\s]/g, "_");
  return AGENT_LABELS[key] ?? agent;
}

interface ActionProgressViewProps {
  steps: AgentStep[];
  isRunning: boolean;
  presetLabel?: string;
}

function StepRow({ step }: { step: AgentStep }) {
  return (
    <div className="flex items-center gap-3">
      {step.status === "complete" && (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
      )}
      {step.status === "running" && (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
      )}
      {step.status === "error" && (
        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
      )}
      {step.status === "pending" && (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <span
        className={cn(
          "text-sm transition-colors",
          step.status === "complete" && "text-foreground",
          step.status === "running"  && "font-medium text-foreground",
          step.status === "error"    && "text-destructive",
          step.status === "pending"  && "text-muted-foreground/60"
        )}
      >
        {getAgentLabel(step.agent)}
      </span>
    </div>
  );
}

export function ActionProgressView({ steps, isRunning }: ActionProgressViewProps) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <AiAvatar className="mt-0.5" />

      <div className="w-full max-w-sm rounded-2xl rounded-tl-sm border bg-card px-4 py-3.5 shadow-sm">
        {/* Header : dots animés si en cours, check si terminé */}
        <div className="mb-3 flex items-center gap-2">
          {isRunning ? (
            <AnimatedDots />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
        </div>

        {/* Étapes */}
        {steps.length > 0 ? (
          <div className="space-y-2">
            {steps.map((step, i) => (
              <StepRow key={`${step.agent}-${i}`} step={step} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AnimatedDots size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
