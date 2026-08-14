import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  clientDecide, closeRequest, createRequest, fetchInbox, fetchMyProvider,
  fetchMyRequests, fetchRequest, goPublic, providerDecide, publishMyProvider,
  unpublishMyProvider, upsertMyProvider,
  type ProviderUpsertPayload, type RequestCreatePayload,
} from "@/services/api/services.api";

// Une seule re-tentative sur les lectures. Par défaut React Query en fait
// trois : combinées au délai d'expiration du client, un backend lent laissait
// l'écran vide plusieurs minutes avant d'afficher quoi que ce soit. Mieux vaut
// montrer l'erreur vite et laisser l'utilisateur réessayer.
const RETRY = 1;

/** Message renvoyé par le serveur, sinon repli générique. */
const reason = (e: unknown, fallback: string) => {
  const m = e instanceof Error ? e.message.trim() : "";
  return m && m.length < 200 ? m : fallback;
};

export const serviceKeys = {
  provider: ["services", "provider"] as const,
  requests: ["services", "requests"] as const,
  request: (id: string) => ["services", "requests", id] as const,
  inbox: ["services", "inbox"] as const,
};

// ── Prestataire ────────────────────────────────────────────────────────────

export const useMyProvider = () =>
  useQuery({
    queryKey: serviceKeys.provider, queryFn: fetchMyProvider,
    staleTime: 60_000, retry: RETRY,
  });

export function useUpsertProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProviderUpsertPayload) => upsertMyProvider(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.provider });
      toast.success("Vitrine enregistrée.");
    },
    onError: (e) => toast.error(reason(e, "Impossible d'enregistrer la vitrine.")),
  });
}

export function usePublishProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: publishMyProvider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.provider });
      toast.success("Votre vitrine est visible.");
    },
    onError: (e) => toast.error(reason(e, "Publication impossible.")),
  });
}

export function useUnpublishProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unpublishMyProvider,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.provider });
      toast.success("Vitrine retirée.");
    },
    onError: () => toast.error("Opération impossible."),
  });
}

export const useInbox = (onlyPending = false) =>
  useQuery({
    queryKey: [...serviceKeys.inbox, onlyPending],
    queryFn: () => fetchInbox(onlyPending),
    staleTime: 30_000, retry: RETRY,
  });

export function useProviderDecide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, accept }: { matchId: string; accept: boolean }) =>
      providerDecide(matchId, accept),
    onSuccess: (_d, { accept }) => {
      qc.invalidateQueries({ queryKey: serviceKeys.inbox });
      toast.success(
        accept
          ? "Proposition envoyée. Le client va examiner votre profil."
          : "Demande déclinée."
      );
    },
    onError: () => toast.error("Impossible d'enregistrer votre réponse."),
  });
}

// ── Client ─────────────────────────────────────────────────────────────────

export const useMyRequests = () =>
  useQuery({
    queryKey: serviceKeys.requests, queryFn: fetchMyRequests,
    staleTime: 30_000, retry: RETRY,
  });

export const useRequest = (id: string) =>
  useQuery({
    queryKey: serviceKeys.request(id),
    queryFn: () => fetchRequest(id),
    enabled: !!id,
    staleTime: 15_000, retry: RETRY,
  });

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestCreatePayload) => createRequest(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.requests }),
    onError: () => toast.error("Impossible de publier la demande."),
  });
}

export function useGoPublic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goPublic(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: serviceKeys.request(id) });
      toast.success("Demande élargie. Vous serez prévenu des réponses.");
    },
    onError: () => toast.error("Impossible d'élargir la demande."),
  });
}

export function useClientDecide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, matchId, accept }:
      { requestId: string; matchId: string; accept: boolean }) =>
      clientDecide(requestId, matchId, accept),
    onSuccess: (_d, { requestId, accept }) => {
      qc.invalidateQueries({ queryKey: serviceKeys.request(requestId) });
      toast.success(accept ? "Mise en relation établie." : "Profil écarté.");
    },
    onError: () => toast.error("Impossible d'enregistrer votre choix."),
  });
}

export function useCloseRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => closeRequest(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: serviceKeys.request(id) });
      qc.invalidateQueries({ queryKey: serviceKeys.requests });
      toast.success("Demande clôturée.");
    },
    onError: () => toast.error("Impossible de clôturer."),
  });
}
