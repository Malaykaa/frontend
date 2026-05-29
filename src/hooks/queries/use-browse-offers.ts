import { useQuery } from "@tanstack/react-query";
import { fetchBrowseOffers, type BrowseOffersParams } from "@/services/api/recommendations.api";

export function useBrowseOffers(params: BrowseOffersParams, enabled = true) {
  return useQuery({
    queryKey: ["browse-offers", params],
    queryFn: () => fetchBrowseOffers(params),
    enabled,
    staleTime: 5 * 60_000,
  });
}
