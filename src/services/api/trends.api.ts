import { apiRequest } from "@/shared/api/client";

// ── Types interprétation LLM (optionnels — présents si LLM disponible) ───────

export interface TendanceInterpretation {
  ce_qui_se_passe: string;
  signification: string;
  action: string;
}

export interface MonPaysInterpretation {
  emplois: string;
  financements: string;
  missions: string;
  appels_offre: string;
  bourses: string;
}

export interface CompetenceInterpretation {
  pourquoi: string;
  si_tu_as: string;
  si_tu_nas_pas: string;
}

export interface VueGlobaleInterpretation {
  geographie: string;
  repartition: string;
  signal: string | null;
  action_globale: string;
}

// ── Types personnalisation SQL (optionnels — présents si profil renseigné) ────

export interface MatchedOffer {
  id: string;
  title: string;
  url: string;
  location: string;
  type: string;
}

export interface CountryComparison {
  pays: string;
  count: number;
  is_user_country: boolean;
}

export interface CareerOrientation {
  type: string;
  label: string;
  count: number;
  relevance: number; // 2 = directement pertinent, 1 = autre
}

// ── Types données brutes ──────────────────────────────────────────────────────

export interface TrendTendance {
  type: string;
  label: string;
  count: number;
  variation_pct: number;
  interpretation?: TendanceInterpretation;
}

export interface TopPays {
  pays: string;
  count: number;
}

export interface WeekAfrica {
  total_offres: number;
  top_pays: TopPays[];
  tendances: TrendTendance[];
  periode: string;
  // Personnalisation SQL
  offres_pour_toi?: number;
  pct_match?: number;
  top_matched?: MatchedOffer[];
  pour_toi_types?: string[];
  pour_toi_max_age?: number;
}

export interface MonPays {
  pays: string;
  has_data: boolean;
  emplois: number;
  financements: number;
  missions: number;
  appels_offre: number;
  bourses: number;
  periode: string;
  interpretation?: MonPaysInterpretation;
  // Personnalisation SQL
  match_local?: number;
  verdict?: string;
  top_alternative_countries?: TopPays[];
  country_comparison?: CountryComparison[];
  pour_toi_types?: string[];
  match_local_max_age?: number;
}

export interface Competence {
  competence: string;
  count: number;
  pct_offres: number;
  variation_pts: number;
  interpretation?: CompetenceInterpretation;
  // Personnalisation SQL
  user_has?: boolean;
  offres_debloquees?: number;
  skill_keyword?: string;
  unlock_max_age?: number;
  formation_url?: string;
  formation_title?: string;
  formation_platform?: string;
}

export interface SignalSemaine {
  type: string;
  label: string;
  count: number;
  croissance_pct: number;
}

export interface VueGlobale {
  total_offres: number;
  top_pays: TopPays[];
  par_type: Record<string, number>;
  signal_semaine: SignalSemaine | null;
  periode: string;
  interpretation?: VueGlobaleInterpretation;
  // Personnalisation SQL
  career_orientations?: CareerOrientation[];
}

export interface TrendsSummary {
  week_africa: WeekAfrica;
  mon_pays: MonPays;
  competences: Competence[];
  vue_globale: VueGlobale;
  generated_at: string;
}

// ── API call ──────────────────────────────────────────────────────────────────

export const fetchTrendsSummary = () =>
  apiRequest<TrendsSummary>("/trends/summary", { timeoutMs: 60_000 });
