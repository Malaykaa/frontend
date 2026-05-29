import { apiRequest } from "@/shared/api/client";
import type { AdminDocumentItem,AdminGoalItem,AdminIntentItem,AdminOfferItem,AdminOfferUpdate,AdminPaginated,AdminStats,AdminThreadDetail,AdminThreadItem,AdminUserDetail,AdminUserItem,AdminUserUpdate } from "@/shared/types";
export interface AdminUsersParams{page?:number;size?:number;q?:string;role?:string;active?:boolean}
export interface AdminOffersParams{page?:number;size?:number;q?:string;offer_type?:string;source?:string;active?:boolean}
export interface AdminGoalsParams{page?:number;size?:number;goal_type?:string;status?:string;user_id?:string}
export interface AdminThreadsParams{page?:number;size?:number;status?:string;user_id?:string;q?:string}
export interface AdminDocumentsParams{page?:number;size?:number;doc_type?:string;user_id?:string}
export interface AdminIntentsParams{page?:number;size?:number;intent_type?:string;user_id?:string}
function qs(p:Record<string,string|number|boolean|undefined>):string{const s=new URLSearchParams();for(const[k,v]of Object.entries(p))if(v!==undefined&&v!==null&&v!=="")s.set(k,String(v));const q=s.toString();return q?`?${q}`:""}
export const fetchAdminStats=()=>apiRequest<AdminStats>("/admin/stats");
export const fetchAdminUsers=(p:AdminUsersParams={})=>apiRequest<AdminPaginated<AdminUserItem>>(`/admin/users${qs({page:p.page??1,size:p.size??20,q:p.q,role:p.role,active:p.active})}`);
export const fetchAdminUser=(id:string)=>apiRequest<AdminUserDetail>(`/admin/users/${id}`);
export const updateAdminUser=(id:string,payload:AdminUserUpdate)=>apiRequest<AdminUserItem>(`/admin/users/${id}`,{method:"PATCH",body:JSON.stringify(payload)});
export const deleteAdminUser=(id:string)=>apiRequest<void>(`/admin/users/${id}`,{method:"DELETE"});
export const fetchAdminOffers=(p:AdminOffersParams={})=>apiRequest<AdminPaginated<AdminOfferItem>>(`/admin/offers${qs({page:p.page??1,size:p.size??20,q:p.q,offer_type:p.offer_type,source:p.source,active:p.active})}`);
export const updateAdminOffer=(id:string,payload:AdminOfferUpdate)=>apiRequest<AdminOfferItem>(`/admin/offers/${id}`,{method:"PATCH",body:JSON.stringify(payload)});
export const deleteAdminOffer=(id:string)=>apiRequest<void>(`/admin/offers/${id}`,{method:"DELETE"});
export const fetchAdminGoals=(p:AdminGoalsParams={})=>apiRequest<AdminPaginated<AdminGoalItem>>(`/admin/goals${qs({page:p.page??1,size:p.size??20,goal_type:p.goal_type,status:p.status,user_id:p.user_id})}`);
export const fetchAdminThreads=(p:AdminThreadsParams={})=>apiRequest<AdminPaginated<AdminThreadItem>>(`/admin/threads${qs({page:p.page??1,size:p.size??20,status:p.status,user_id:p.user_id,q:p.q})}`);
export const fetchAdminThread=(id:string)=>apiRequest<AdminThreadDetail>(`/admin/threads/${id}`);
export const deleteAdminThread=(id:string)=>apiRequest<void>(`/admin/threads/${id}`,{method:"DELETE"});
export const fetchAdminDocuments=(p:AdminDocumentsParams={})=>apiRequest<AdminPaginated<AdminDocumentItem>>(`/admin/documents${qs({page:p.page??1,size:p.size??20,doc_type:p.doc_type,user_id:p.user_id})}`);
export const fetchAdminIntents=(p:AdminIntentsParams={})=>apiRequest<AdminPaginated<AdminIntentItem>>(`/admin/intents${qs({page:p.page??1,size:p.size??20,intent_type:p.intent_type,user_id:p.user_id})}`);
export const fetchScrapingStats=()=>apiRequest<Record<string,unknown>>("/admin/scraping/stats");
export const runPerplexityScraping=()=>apiRequest<Record<string,unknown>>("/admin/scraping/run-perplexity",{method:"POST"});
export const runApifyScraping=()=>apiRequest<Record<string,unknown>>("/admin/scraping/run-apify-light",{method:"POST"});

export interface AdminOfferCreate {
  title: string;
  offer_type?: string;
  description?: string;
  url?: string;
  company?: string;
  location?: string;
  salary?: string;
  source?: string;
  posted_at?: string;
  expires_at?: string;
}

export interface AdminUserCreate {
  email?: string;
  phone?: string;
  password: string;
  role?: "b2c" | "admin";
  first_name?: string;
  last_name?: string;
  primary_role?: string;
  country?: string;
}

export const createAdminOffer = (payload: AdminOfferCreate) =>
  apiRequest<AdminOfferItem>("/admin/offers", { method: "POST", body: JSON.stringify(payload) });

export const createAdminUser = (payload: AdminUserCreate) =>
  apiRequest<AdminUserItem>("/admin/users", { method: "POST", body: JSON.stringify(payload) });

export interface AdminDeliverableItem {
  message_id: string;
  thread_id: string;
  thread_title: string | null;
  user_id: string;
  user_email: string | null;
  content_preview: string;
  agent_id: string | null;
  created_at: string;
}

export interface AdminDeliverablesParams { page?: number; size?: number; user_id?: string; }

export const fetchAdminDeliverables = (p: AdminDeliverablesParams = {}) =>
  apiRequest<AdminPaginated<AdminDeliverableItem>>(`/admin/deliverables${qs({ page: p.page ?? 1, size: p.size ?? 20, user_id: p.user_id })}`);

// ── Sources de scraping dynamiques ────────────────────────────────────────────

export type ScrapingCategory =
  | "job_boards"
  | "opportunities"
  | "grants"
  | "scholarships"
  | "call_for_applications";

export interface ScrapingSourceItem {
  id: string;
  url: string;
  label: string | null;
  category: ScrapingCategory;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ScrapingSourceCreate {
  url: string;
  label?: string;
  category: ScrapingCategory;
  notes?: string;
}

export interface ScrapingSourceUpdate {
  label?: string;
  category?: ScrapingCategory;
  notes?: string;
  is_active?: boolean;
}

export const fetchScrapingSources = () =>
  apiRequest<ScrapingSourceItem[]>("/admin/scraping/sources");

export const createScrapingSource = (payload: ScrapingSourceCreate) =>
  apiRequest<ScrapingSourceItem>("/admin/scraping/sources", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateScrapingSource = (id: string, payload: ScrapingSourceUpdate) =>
  apiRequest<ScrapingSourceItem>(`/admin/scraping/sources/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteScrapingSource = (id: string) =>
  apiRequest<void>(`/admin/scraping/sources/${id}`, { method: "DELETE" });

// ── Actors Apify dynamiques ───────────────────────────────────────────────────

export type NormalizerType = "indeed" | "linkedin_job" | "linkedin_post" | "google_jobs" | "facebook" | "web";
export type RunMode = "light" | "heavy" | "both";

export interface ScrapingActorItem {
  id: string;
  actor_id: string;
  label: string;
  offer_type: string;
  source_name: string;
  normalizer_type: NormalizerType;
  input_json: Record<string, unknown>;
  run_mode: RunMode;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface ScrapingActorCreate {
  actor_id: string;
  label: string;
  offer_type?: string;
  source_name: string;
  normalizer_type: NormalizerType;
  input_json?: Record<string, unknown>;
  run_mode?: RunMode;
  notes?: string;
}

export interface ScrapingActorUpdate {
  label?: string;
  offer_type?: string;
  source_name?: string;
  normalizer_type?: NormalizerType;
  input_json?: Record<string, unknown>;
  run_mode?: RunMode;
  is_active?: boolean;
  notes?: string;
}

export const fetchScrapingActors = () =>
  apiRequest<ScrapingActorItem[]>("/admin/scraping/actors");

export const createScrapingActor = (payload: ScrapingActorCreate) =>
  apiRequest<ScrapingActorItem>("/admin/scraping/actors", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateScrapingActor = (id: string, payload: ScrapingActorUpdate) =>
  apiRequest<ScrapingActorItem>(`/admin/scraping/actors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteScrapingActor = (id: string) =>
  apiRequest<void>(`/admin/scraping/actors/${id}`, { method: "DELETE" });
