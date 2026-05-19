import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AiAvatar } from "./AiAvatar";
import { AnimatedDots } from "./AnimatedDots";
import { cn } from "@/shared/lib/utils";
import type { AgentStep } from "@/services/api/actions.api";

const AGENT_KEYS: Record<string, string> = {
  triage:           "progress.triage",
  orchestrator:     "progress.orchestrator",
  exam_agent:       "progress.exam_agent",
  scholarship_agent:"progress.scholarship_agent",
  funding_agent:    "progress.funding_agent",
  career_agent:     "progress.career_agent",
  freelance_agent:  "progress.freelance_agent",
  tender_agent:     "progress.tender_agent",
  document_agent:   "progress.document_agent",
  cv_agent:         "progress.cv_agent",
  merger:           "progress.merger",
  execution_engine: "progress.execution_engine",
};

interface ActionProgressViewProps {
  steps: AgentStep[];
  isRunning: boolean;
  presetLabel?: string;
}

function StepRow({ step }: { step: AgentStep }) {
  const { t } = useTranslation();
  const key = step.agent.toLowerCase().replace(/[-\s]/g, "_");
  const label = AGENT_KEYS[key] ? t(AGENT_KEYS[key]) : step.agent;
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
        {label}
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
