import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAdminProvider, fetchAdminProviders, fetchAdminServiceRequest,
  fetchAdminServiceRequests, fetchServiceStats, moderateProvider,
} from "@/services/api/admin-services.api";
import type { ProviderStatus } from "@/services/api/services.api";

export const adminServiceKeys = {
  stats: ["admin", "services", "stats"] as const,
  providers: (p: unknown) => ["admin", "services", "providers", p] as const,
  provider: (id: string) => ["admin", "services", "provider", id] as const,
  requests: (p: unknown) => ["admin", "services", "requests", p] as const,
  request: (id: string) => ["admin", "services", "request", id] as const,
};

export const useServiceStats = () =>
  useQuery({ queryKey: adminServiceKeys.stats, queryFn: fetchServiceStats, staleTime: 60_000 });

export const useAdminProviders = (p: { page?: number; status?: string; q?: string } = {}) =>
  useQuery({
    queryKey: adminServiceKeys.providers(p),
    queryFn: () => fetchAdminProviders(p),
    staleTime: 30_000,
  });

export const useAdminProvider = (id: string) =>
  useQuery({
    queryKey: adminServiceKeys.provider(id),
    queryFn: () => fetchAdminProvider(id),
    enabled: !!id,
  });

export const useAdminServiceRequests = (
  p: { page?: number; status?: string; request_type?: string; unmatched?: boolean } = {}
) =>
  useQuery({
    queryKey: adminServiceKeys.requests(p),
    queryFn: () => fetchAdminServiceRequests(p),
    staleTime: 30_000,
  });

export const useAdminServiceRequest = (id: string) =>
  useQuery({
    queryKey: adminServiceKeys.request(id),
    queryFn: () => fetchAdminServiceRequest(id),
    enabled: !!id,
  });

export function useModerateProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProviderStatus }) =>
      moderateProvider(id, status),
    onSuccess: (_d, { id, status }) => {
      qc.invalidateQueries({ queryKey: ["admin", "services"] });
      qc.invalidateQueries({ queryKey: adminServiceKeys.provider(id) });
      toast.success(
        status === "suspended" ? "Vitrine suspendue."
        : status === "published" ? "Vitrine réactivée."
        : "Statut mis à jour."
      );
    },
    onError: () => toast.error("Impossible de modifier le statut."),
  });
}
