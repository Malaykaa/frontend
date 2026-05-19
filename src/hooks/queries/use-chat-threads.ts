import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchThreads, createThread, type CreateThreadPayload } from "@/services/api/chat.api";
import { ACTION_PRESETS } from "@/services/api/actions.api";
import type { ChatThread } from "@/shared/types";

// ── Clés de cache ──────────────────────────────────────────────────────────
export const THREADS_KEY = ["chat", "threads"] as const;

// ── Séparation objectifs / livrables ──────────────────────────────────────
const ACTION_PRESET_SET = new Set(Object.values(ACTION_PRESETS));

/** Retourne true si le thread est un livrable (action), false si c'est un objectif */
export function isActionThread(thread: ChatThread | null): boolean {
  return !!thread?.preset_key && ACTION_PRESET_SET.has(thread.preset_key);
}

// ── Catégorie d'un thread objectif ────────────────────────────────────────
export type ThreadCategory = "career" | "studies" | "professional";

const CAREER_PRESETS  = new Set(["career", "freelance", "tender"]);
const STUDIES_PRESETS = new Set(["scholarship", "exam", "study_grant", "funding"]);

export function getThreadCategory(thread: ChatThread): ThreadCategory {
  const key = (thread.preset_key ?? "").toLowerCase();
  if (CAREER_PRESETS.has(key))  return "career";
  if (STUDIES_PRESETS.has(key)) return "studies";
  return "professional";
}

export const CATEGORY_META: Record<
  ThreadCategory,
  { label: string; color: string; bg: string; emoji: string }
> = {
  career:       { label: "Emploi",      color: "text-blue-600",   bg: "bg-blue-100",   emoji: "💼" },
  studies:      { label: "Études",      color: "text-violet-600", bg: "bg-violet-100", emoji: "🎓" },
  professional: { label: "Progression", color: "text-emerald-600",bg: "bg-emerald-100",emoji: "📈" },
};

// ── Hooks ──────────────────────────────────────────────────────────────────

/** Récupère tous les threads (objectifs + livrables) */
export function useChatThreads() {
  return useQuery<ChatThread[]>({
    queryKey: THREADS_KEY,
    queryFn: fetchThreads,
    staleTime: 1000 * 30,
  });
}

/**
 * Threads objectifs uniquement (exclu les livrables/actions).
 * Groupés par catégorie pour l'onglet "Pour Moi".
 */
export function useGroupedThreads() {
  const query = useChatThreads();

  const grouped: Record<ThreadCategory, ChatThread[]> = {
    career: [],
    studies: [],
    professional: [],
  };

  if (query.data) {
    for (const t of query.data) {
      // Exclure les threads d'action (livrables) — ils vont dans ActionsTab
      if (isActionThread(t)) continue;
      grouped[getThreadCategory(t)].push(t);
    }
  }

  const hasThreads =
    grouped.career.length > 0 ||
    grouped.studies.length > 0 ||
    grouped.professional.length > 0;

  return { ...query, grouped, hasThreads };
}

/**
 * Threads livrables uniquement (preset_key ∈ ACTION_PRESETS).
 * Triés par date de mise à jour décroissante, pour l'onglet "Livrables".
 */
export function useActionThreads() {
  const query = useChatThreads();

  const threads = (query.data ?? [])
    .filter(isActionThread)
    .sort((a, b) => {
      const ta = a.updated_at ?? a.created_at;
      const tb = b.updated_at ?? b.created_at;
      return tb.localeCompare(ta);
    });

  return { ...query, threads, hasThreads: threads.length > 0 };
}

/** Mutation : créer un thread */
export function useCreateThread() {
  const qc = useQueryClient();

  return useMutation<ChatThread, Error, CreateThreadPayload>({
    mutationFn: createThread,
    onSuccess: (newThread) => {
      qc.setQueryData<ChatThread[]>(THREADS_KEY, (old) =>
        old ? [newThread, ...old] : [newThread]
      );
    },
  });
}
