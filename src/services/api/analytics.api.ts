import { apiRequest } from "@/shared/api/client";

// ── Primitives (miroir de app/schemas/admin_analytics.py) ──────────────────

/** Une part d'une distribution — une barre, un secteur. */
export interface Bucket {
  /** Valeur brute en base. Pour les pays, c'est un code ISO à résoudre côté client. */
  key: string;
  /** Libellé fourni par le backend. Égal à `key` quand il reste à résoudre. */
  label: string;
  count: number;
  /** Part du total de la dimension, en %. */
  pct: number;
}

export interface SeriesPoint {
  /** AAAA-MM */
  period: string;
  /** Libellé court d'axe, ex. « janv. 26 ». */
  label: string;
  count: number;
}

export interface Kpi {
  total: number;
  current: number;
  previous: number;
  /** null quand la période précédente est à zéro : la variation n'est pas définie. */
  variation_pct: number | null;
}

// ── Sections ───────────────────────────────────────────────────────────────

export interface UsersAnalytics {
  kpi: Kpi;
  monthly: SeriesPoint[];
  by_country: Bucket[];
  by_nationality: Bucket[];
  by_gender: Bucket[];
  by_age_bracket: Bucket[];
  by_domain: Bucket[];
  by_role: Bucket[];
  by_city: Bucket[];
  by_language: Bucket[];
  profile_completion: Bucket[];
}

export interface OffersAnalytics {
  kpi: Kpi;
  monthly: SeriesPoint[];
  by_country: Bucket[];
  by_type: Bucket[];
  by_source: Bucket[];
  by_quality: Bucket[];
  active_count: number;
  indexed_count: number;
  indexed_pct: number;
}

export interface IntentsAnalytics {
  kpi: Kpi;
  monthly: SeriesPoint[];
  by_type: Bucket[];
  by_domain: Bucket[];
  by_location: Bucket[];
  by_level: Bucket[];
  top_keywords: Bucket[];
  by_user_gender: Bucket[];
  by_user_country: Bucket[];
  by_user_nationality: Bucket[];
}

export interface GoalsAnalytics {
  kpi: Kpi;
  monthly: SeriesPoint[];
  by_type: Bucket[];
  by_status: Bucket[];
  by_preset: Bucket[];
  by_user_country: Bucket[];
  by_user_gender: Bucket[];
  by_user_city: Bucket[];
}

export interface EngagementAnalytics {
  threads_total: number;
  messages_total: number;
  documents_total: number;
  messages_monthly: SeriesPoint[];
  documents_monthly: SeriesPoint[];
  avg_goals_per_user: number;
  users_with_goal_pct: number;
  users_with_intent_pct: number;
}

export interface AdminAnalytics {
  generated_at: string;
  months: number;
  users: UsersAnalytics;
  offers: OffersAnalytics;
  intents: IntentsAnalytics;
  goals: GoalsAnalytics;
  engagement: EngagementAnalytics;
}

// ── Endpoint ───────────────────────────────────────────────────────────────

export const fetchAdminAnalytics = (months = 12) =>
  apiRequest<AdminAnalytics>(`/admin/analytics?months=${months}`);
