import { useQuery } from "@tanstack/react-query";
import { fetchAdminAnalytics } from "@/services/api/analytics.api";

export const analyticsKeys = {
  summary: (months: number) => ["admin", "analytics", months] as const,
};

/**
 * Une vingtaine d'agrégations SQL en un appel : plus coûteux qu'une liste
 * paginée, d'où un staleTime plus long. Les volumes analysés bougent à
 * l'échelle de la journée, pas de la seconde.
 */
export const useAdminAnalytics = (months = 12) =>
  useQuery({
    queryKey: analyticsKeys.summary(months),
    queryFn: () => fetchAdminAnalytics(months),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
