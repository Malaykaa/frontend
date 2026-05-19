import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchPropositions, sendFeedback } from "@/services/api/recommendations.api";
import type { FeedbackAction, ScrapedOffer } from "@/shared/types";

export const RECO_KEY = ["recommendations", "propositions"] as const;

// ── Fetch ──────────────────────────────────────────────────────────────────

export function useRecommendations() {
  return useQuery<ScrapedOffer[]>({
    queryKey: RECO_KEY,
    queryFn: fetchPropositions,
    staleTime: 1000 * 60 * 5,  // 5 minutes
    retry: 1,
  });
}

// ── Feedback (avec optimistic update) ─────────────────────────────────────

interface FeedbackPayload {
  offerRef: string;
  action: FeedbackAction;
}

export function useSendFeedback() {
  const qc = useQueryClient();

  return useMutation<void, Error, FeedbackPayload>({
    mutationFn: ({ offerRef, action }) => sendFeedback(offerRef, action),

    // Optimistic : retirer immédiatement les offres dismissées du cache
    onMutate: async ({ offerRef, action }) => {
      if (action !== "dismissed") return;

      await qc.cancelQueries({ queryKey: RECO_KEY });
      const previous = qc.getQueryData<ScrapedOffer[]>(RECO_KEY);

      qc.setQueryData<ScrapedOffer[]>(RECO_KEY, (old) =>
        old ? old.filter((o) => o.offer_ref !== offerRef) : []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: ScrapedOffer[] } | undefined;
      if (ctx?.previous) {
        qc.setQueryData(RECO_KEY, ctx.previous);
      }
    },
  });
}
