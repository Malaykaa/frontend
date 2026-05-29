import { useQuery } from "@tanstack/react-query";
import { fetchTrendsSummary } from "@/services/api/trends.api";

export const trendsKeys = {
  summary: ["trends", "summary"] as const,
};

export function useTrendsSummary() {
  return useQuery({
    queryKey: trendsKeys.summary,
    queryFn: fetchTrendsSummary,
    staleTime: 5 * 60 * 1000,   // 5 min — données agrégées, pas temps-réel
    retry: 1,
  });
}
