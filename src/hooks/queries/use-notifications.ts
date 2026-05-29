import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/api/notifications.api";

const NOTIF_KEY = ["notifications"] as const;

export function useOfferNotifications() {
  return useQuery({
    queryKey: NOTIF_KEY,
    queryFn: fetchNotifications,
    staleTime: 60_000,   // revalidé toutes les 60s — synchrone avec le polling du panel
    refetchInterval: 120_000, // polling passif toutes les 2 minutes
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIF_KEY }),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIF_KEY }),
  });
}

/** Nombre total de notifications non-lues (offres haute-pertinence). */
export function useOfferNotificationCount(): number {
  const { data } = useOfferNotifications();
  return data?.unread_count ?? 0;
}
