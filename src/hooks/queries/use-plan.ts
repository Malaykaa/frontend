import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchThreadPlan,
  completeStep,
  type FrontendPlanStep,
} from "@/services/api/plans.api";

// ── Clé de cache ───────────────────────────────────────────────────────────

export const planKey = (threadId: string) =>
  ["chat", "plan", threadId] as const;

// ── Fetch plan ─────────────────────────────────────────────────────────────

export function useThreadPlan(threadId: string | null | undefined) {
  return useQuery<FrontendPlanStep[]>({
    queryKey: planKey(threadId ?? ""),
    queryFn: () => fetchThreadPlan(threadId!),
    enabled: !!threadId,
    staleTime: 1000 * 60,
    retry: 1,
  });
}

// ── Complétion d'étape (optimistic) ───────────────────────────────────────

export function useCompleteStep(threadId: string) {
  const qc = useQueryClient();
  const key = planKey(threadId);

  return useMutation<FrontendPlanStep, Error, string>({
    mutationFn: (stepId) => completeStep(threadId, stepId),

    onMutate: async (stepId) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<FrontendPlanStep[]>(key);

      // Optimistic : marquer l'étape comme done immédiatement
      qc.setQueryData<FrontendPlanStep[]>(key, (old) =>
        old?.map((s) =>
          s.id === stepId
            ? { ...s, completedAt: new Date().toISOString() }
            : s
        ) ?? []
      );

      return { previous };
    },

    onError: (_err, _stepId, context) => {
      const ctx = context as { previous?: FrontendPlanStep[] } | undefined;
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },

    onSuccess: (updated) => {
      // Sync avec la réponse serveur
      qc.setQueryData<FrontendPlanStep[]>(key, (old) =>
        old?.map((s) => (s.id === updated.id ? updated : s)) ?? []
      );
    },
  });
}
