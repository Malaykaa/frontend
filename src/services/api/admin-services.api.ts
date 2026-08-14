import { apiRequest } from "@/shared/api/client";
import type { AdminPaginated } from "@/shared/types";
import type {
  MatchDecision, MatchSource, ProviderStatus, RequestStatus, RequestType,
} from "@/services/api/services.api";

// ── Types (miroir de app/schemas/admin_service.py) ─────────────────────────

export interface ServiceBucket { key: string; label: string; count: number; pct: number }
export interface ServiceSeriesPoint { period: string; label: string; count: number }

/** Entonnoir de conversion — dit où la place de marché se casse. */
export interface ServiceFunnel {
  requests_total: number;
  requests_with_matches: number;
  matches_total: number;
  provider_accepted: number;
  connected: number;
  provider_response_rate: number;
  acceptance_rate: number;
  connection_rate: number;
}

export interface AdminServiceStats {
  providers_total: number;
  providers_published: number;
  providers_draft: number;
  providers_suspended: number;
  requests_total: number;
  requests_open: number;
  requests_public: number;
  requests_fulfilled: number;
  funnel: ServiceFunnel;
  requests_by_type: ServiceBucket[];
  providers_by_country: ServiceBucket[];
  requests_by_country: ServiceBucket[];
  monthly_requests: ServiceSeriesPoint[];
  monthly_providers: ServiceSeriesPoint[];
  avg_match_score: number | null;
  unmatched_requests: number;
}

export interface AdminProviderItem {
  id: string;
  user_id: string;
  user_email: string | null;
  user_phone: string | null;
  display_name: string | null;
  title: string;
  keywords: string[];
  city: string | null;
  country: string | null;
  rate_text: string | null;
  status: ProviderStatus;
  has_embedding: boolean;
  received_count: number;
  accepted_count: number;
  connected_count: number;
  published_at: string | null;
  created_at: string;
}

export interface AdminProviderDetail extends AdminProviderItem {
  description: string;
  availability_text: string | null;
  years_experience: number | null;
  contact_phone: string | null;
  consent_public_at: string | null;
}

export interface AdminMatchItem {
  id: string;
  user_id: string;
  display_name: string | null;
  provider_title: string | null;
  source: MatchSource;
  decision: MatchDecision;
  match_score: number | null;
  match_mode: string | null;
  notified_at: string;
  provider_responded_at: string | null;
  client_responded_at: string | null;
}

export interface AdminRequestItem {
  id: string;
  requester_id: string;
  requester_name: string | null;
  request_type: RequestType;
  title: string;
  city: string | null;
  country: string | null;
  budget_hint: string | null;
  status: RequestStatus;
  has_embedding: boolean;
  matches_count: number;
  accepted_count: number;
  connected_count: number;
  published_public_at: string | null;
  created_at: string;
}

export interface AdminRequestDetail extends AdminRequestItem {
  description: string;
  keywords: string[];
  matches: AdminMatchItem[];
}

// ── Endpoints ──────────────────────────────────────────────────────────────

const qs = (p: Record<string, unknown>) => {
  const s = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") s.append(k, String(v));
  });
  const out = s.toString();
  return out ? `?${out}` : "";
};

export const fetchServiceStats = () =>
  apiRequest<AdminServiceStats>("/admin/services/stats");

export const fetchAdminProviders = (p: {
  page?: number; size?: number; status?: string; q?: string;
} = {}) =>
  apiRequest<AdminPaginated<AdminProviderItem>>(
    `/admin/services/providers${qs({ page: p.page ?? 1, size: p.size ?? 20, status: p.status, q: p.q })}`
  );

export const fetchAdminProvider = (id: string) =>
  apiRequest<AdminProviderDetail>(`/admin/services/providers/${id}`);

export const moderateProvider = (id: string, status: ProviderStatus) =>
  apiRequest<AdminProviderItem>(`/admin/services/providers/${id}`, {
    method: "PATCH", body: JSON.stringify({ status }),
  });

export const fetchAdminServiceRequests = (p: {
  page?: number; size?: number; status?: string; request_type?: string; unmatched?: boolean;
} = {}) =>
  apiRequest<AdminPaginated<AdminRequestItem>>(
    `/admin/services/requests${qs({
      page: p.page ?? 1, size: p.size ?? 20, status: p.status,
      request_type: p.request_type, unmatched: p.unmatched || undefined,
    })}`
  );

export const fetchAdminServiceRequest = (id: string) =>
  apiRequest<AdminRequestDetail>(`/admin/services/requests/${id}`);
