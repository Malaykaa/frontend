import { apiRequest } from "@/shared/api/client";
import type { FeedbackAction, ScrapedOffer } from "@/shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

// Format brut renvoyé par le backend (RecommendationItem Pydantic)
interface RawRecommendationItem {
  offer_ref: string;
  title: string;
  company?: string | null;
  location?: string | null;
  url?: string | null;
  type?: string | null;        // ← backend expose "type", pas "offer_type"
  score: number;
  freshness_factor?: number | null;
  feedback?: string | null;
  source?: string;
  description?: string | null;
}

export interface PropositionsResponse {
  propositions?: RawRecommendationItem[];
  items?: RawRecommendationItem[];
}

/** Normalise un item brut backend → ScrapedOffer frontend */
function normalizeRecommendation(raw: RawRecommendationItem): ScrapedOffer {
  return {
    offer_ref:   raw.offer_ref,
    title:       raw.title,
    company:     raw.company ?? null,
    location:    raw.location ?? null,
    url:         raw.url ?? null,
    offer_type:  raw.type ?? "",          // "type" → "offer_type"
    score:       raw.score,
    freshness:   null,                    // freshness_factor est un float, pas un label
    source:      raw.source ?? "scraped",
    description: raw.description ?? null,
  };
}

// ── Endpoints ─────────────────────────────────────────────────────────────

/** Récupère les opportunités matchées pour l'utilisateur courant */
export async function fetchPropositions(): Promise<ScrapedOffer[]> {
  const raw = await apiRequest<PropositionsResponse | RawRecommendationItem[]>(
    "/recommendations/propositions"
  );
  const items: RawRecommendationItem[] = Array.isArray(raw)
    ? raw
    : ((raw as PropositionsResponse).propositions
        ?? (raw as PropositionsResponse).items
        ?? []);
  return items.map(normalizeRecommendation);
}

// ── Browse (filtres explicites depuis Tendances) ───────────────────────────────

export interface BrowseOffersParams {
  offer_types?: string;  // ex: "scholarship,grant"
  country?: string;
  skill?: string;
  max_age?: number;
  limit?: number;
}

export async function fetchBrowseOffers(params: BrowseOffersParams): Promise<ScrapedOffer[]> {
  const sp = new URLSearchParams();
  if (params.offer_types) sp.set("offer_types", params.offer_types);
  if (params.country)     sp.set("country", params.country);
  if (params.skill)       sp.set("skill", params.skill);
  if (params.max_age)     sp.set("max_age", String(params.max_age));
  if (params.limit)       sp.set("limit", String(params.limit));
  const raw = await apiRequest<RawRecommendationItem[]>(`/recommendations/browse?${sp}`);
  return (Array.isArray(raw) ? raw : []).map(normalizeRecommendation);
}

/** Enregistre le feedback de l'utilisateur sur une offre */
export async function sendFeedback(
  offerRef: string,
  action: FeedbackAction
): Promise<void> {
  await apiRequest(`/recommendations/${encodeURIComponent(offerRef)}/feedback`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────

/** Normalise le score en pourcentage (0-100) quel que soit le format backend */
export function normalizeScore(score: number): number {
  if (score <= 0)  return 0;
  if (score <= 1)  return Math.round(score * 100);   // cosine 0-1
  if (score <= 10) return Math.round(score * 10);    // llm score 0-10
  return Math.min(100, Math.round(score));             // déjà en %
}

/** Mapping type d'offre → label + couleur badge */
export const OFFER_TYPE_META: Record<
  string,
  { label: string; color: string; bg: string; emoji: string }
> = {
  job:         { label: "Emploi",        color: "text-blue-700",   bg: "bg-blue-100",    emoji: "💼" },
  scholarship: { label: "Bourse",        color: "text-violet-700", bg: "bg-violet-100",  emoji: "🎓" },
  internship:  { label: "Stage",         color: "text-sky-700",    bg: "bg-sky-100",     emoji: "📋" },
  grant:       { label: "Financement",   color: "text-emerald-700",bg: "bg-emerald-100", emoji: "💰" },
  funding:     { label: "Financement",   color: "text-emerald-700",bg: "bg-emerald-100", emoji: "💰" },
  tender:      { label: "Appel d'offres",color: "text-orange-700", bg: "bg-orange-100",  emoji: "📄" },
  freelance:   { label: "Freelance",     color: "text-pink-700",   bg: "bg-pink-100",    emoji: "💻" },
  training:    { label: "Formation",     color: "text-amber-700",  bg: "bg-amber-100",   emoji: "📚" },
};

export function getOfferTypeMeta(type: string | null | undefined) {
  if (!type) {
    return { label: "Opportunité", color: "text-muted-foreground", bg: "bg-muted", emoji: "📌" };
  }
  return (
    OFFER_TYPE_META[type.toLowerCase()] ?? {
      label: type,
      color: "text-muted-foreground",
      bg: "bg-muted",
      emoji: "📌",
    }
  );
}
