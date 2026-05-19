import { apiRequest } from "@/shared/api/client";

// ── Types (format frontend du backend) ────────────────────────────────────

export interface FrontendPlanStep {
  id: string;
  threadId: string;
  step: number;               // ordre
  title: string;
  description: string | null;
  isMission: boolean;
  missionText: string | null;
  completedAt: string | null; // null = todo, ISO string = done
  createdAt: string;
}

// ── Endpoints ─────────────────────────────────────────────────────────────

/** Retourne les étapes du plan associé au thread (via son goal) */
export async function fetchThreadPlan(threadId: string): Promise<FrontendPlanStep[]> {
  return apiRequest<FrontendPlanStep[]>(`/chat/threads/${threadId}/plan`);
}

/** Marque une étape comme terminée (opération irréversible côté backend) */
export async function completeStep(
  threadId: string,
  stepId: string
): Promise<FrontendPlanStep> {
  return apiRequest<FrontendPlanStep>(
    `/chat/threads/${threadId}/plan/${stepId}/complete`,
    { method: "PATCH" }
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

export function isStepDone(step: FrontendPlanStep): boolean {
  return step.completedAt !== null;
}

export function computeProgress(steps: FrontendPlanStep[]): {
  done: number;
  total: number;
  pct: number;
} {
  const total = steps.length;
  const done  = steps.filter(isStepDone).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  return { done, total, pct };
}
