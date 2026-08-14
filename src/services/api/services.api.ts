import { apiRequest } from "@/shared/api/client";

// ── Types (miroir de app/schemas/service.py) ───────────────────────────────

export type ProviderStatus = "draft" | "published" | "paused" | "suspended";
export type RequestType = "prestation" | "emploi" | "stage" | "autre";
export type RequestStatus = "open" | "public" | "fulfilled" | "closed" | "expired";
export type MatchDecision =
  | "pending" | "provider_accepted" | "provider_declined"
  | "client_accepted" | "client_declined" | "expired";
export type MatchSource = "provider" | "public";

export interface ProviderProfile {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  city: string | null;
  country: string | null;
  rate_text: string | null;
  availability_text: string | null;
  years_experience: number | null;
  contact_phone: string | null;
  status: ProviderStatus;
  published_at: string | null;
  created_at: string;
}

export interface ProviderUpsertPayload {
  title: string;
  description: string;
  keywords: string[];
  city?: string | null;
  country?: string | null;
  rate_text?: string | null;
  availability_text?: string | null;
  years_experience?: number | null;
  contact_phone?: string | null;
}

/** Carte publique — jamais de téléphone ni d'identité complète avant mise en relation. */
export interface ProviderPublicCard {
  provider_id: string | null;
  display_name: string;
  title: string;
  description: string;
  keywords: string[];
  city: string | null;
  country: string | null;
  rate_text: string | null;
  availability_text: string | null;
  years_experience: number | null;
}

export interface MatchCard {
  id: string;
  decision: MatchDecision;
  source: MatchSource;
  match_score: number | null;
  notified_at: string;
  /** Absent tant qu'un profil du grand public n'a pas accepté. */
  card: ProviderPublicCard | null;
  /** Renseigné uniquement après double validation. */
  contact_phone: string | null;
}

export interface ServiceRequest {
  id: string;
  request_type: RequestType;
  title: string;
  description: string;
  keywords: string[];
  city: string | null;
  country: string | null;
  budget_hint: string | null;
  status: RequestStatus;
  published_public_at: string | null;
  created_at: string;
}

export interface ServiceRequestDetail extends ServiceRequest {
  accepted: MatchCard[];
  pending: MatchCard[];
  connected: MatchCard[];
  declined_count: number;
  can_go_public: boolean;
}

export interface RequestCreatePayload {
  request_type: RequestType;
  title: string;
  description: string;
  keywords: string[];
  city?: string | null;
  country?: string | null;
  budget_hint?: string | null;
}

export interface InboxItem {
  match_id: string;
  request_id: string;
  request_type: RequestType;
  title: string;
  description: string;
  city: string | null;
  country: string | null;
  budget_hint: string | null;
  match_score: number | null;
  decision: MatchDecision;
  notified_at: string;
  client_display_name: string | null;
  client_phone: string | null;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

export const fetchMyProvider = () =>
  apiRequest<ProviderProfile | null>("/services/provider/me");

export const upsertMyProvider = (payload: ProviderUpsertPayload) =>
  apiRequest<ProviderProfile>("/services/provider/me", {
    method: "PUT", body: JSON.stringify(payload),
  });

export const publishMyProvider = () =>
  apiRequest<ProviderProfile>("/services/provider/me/publish", {
    method: "POST", body: JSON.stringify({ consent_public: true }),
  });

export const unpublishMyProvider = () =>
  apiRequest<ProviderProfile>("/services/provider/me/unpublish", { method: "POST" });

export const fetchMyRequests = () =>
  apiRequest<ServiceRequest[]>("/services/requests");

export const fetchRequest = (id: string) =>
  apiRequest<ServiceRequestDetail>(`/services/requests/${id}`);

export const createRequest = (payload: RequestCreatePayload) =>
  apiRequest<ServiceRequestDetail>("/services/requests", {
    method: "POST", body: JSON.stringify(payload),
  });

export const goPublic = (id: string) =>
  apiRequest<ServiceRequestDetail>(`/services/requests/${id}/go-public`, { method: "POST" });

export const closeRequest = (id: string) =>
  apiRequest<ServiceRequest>(`/services/requests/${id}/close`, { method: "POST" });

export const clientDecide = (requestId: string, matchId: string, accept: boolean) =>
  apiRequest<ServiceRequestDetail>(
    `/services/requests/${requestId}/matches/${matchId}/decide`,
    { method: "POST", body: JSON.stringify({ accept }) },
  );

export const fetchInbox = (onlyPending = false) =>
  apiRequest<InboxItem[]>(`/services/inbox${onlyPending ? "?only_pending=true" : ""}`);

export const providerDecide = (matchId: string, accept: boolean) =>
  apiRequest<InboxItem>(`/services/inbox/${matchId}/decide`, {
    method: "POST", body: JSON.stringify({ accept }),
  });
