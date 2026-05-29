import { apiRequest } from "@/shared/api/client";

export interface OfferNotification {
  id: string;
  offer_id: string | null;
  offer_title: string | null;
  offer_url: string | null;
  offer_type: string | null;
  score_pct: number | null;
  seen: boolean;
  created_at: string | null;
}

export interface NotificationsResponse {
  notifications: OfferNotification[];
  unread_count: number;
}

export const fetchNotifications = () =>
  apiRequest<NotificationsResponse>("/notifications/");

export const markAllNotificationsRead = () =>
  apiRequest<{ ok: boolean }>("/notifications/mark-read", { method: "POST" });

export const markNotificationRead = (id: string) =>
  apiRequest<{ ok: boolean }>(`/notifications/${id}/read`, { method: "POST" });
