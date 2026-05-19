// â”€â”€ Utilisateur â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  role: "b2c" | "admin";
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  birth_year: number | null;
  country: string | null;
  city: string | null;
  primary_role: "student" | "professional" | "jobseeker" | null;
  domain: string | null;
  field_of_study: string | null;
  current_status: string | null;
  skills: string[];
  preferred_content: string | null;
  language: string | null;
}

export interface AuthUser {
  user: User;
  profile: Profile | null;
}

// â”€â”€ Chat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type ThreadStatus = "open" | "closed";
export type MessageRole = "user" | "assistant";
export type ThreadType = "goal" | "action";

export interface ChatThread {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  status: ThreadStatus;
  message_count: number;
  created_at: string;
  updated_at?: string;
  preset_key?: string | null;
  notif_mode?: "realtime" | "scheduled";
  notif_time?: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  agent_id?: string | null;
  processing_ms?: number | null;
  is_deliverable?: boolean; // true quand l'assistant a gÃ©nÃ©rÃ© un livrable
}

// â”€â”€ Objectifs & Plans â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type GoalType =
  | "exam"
  | "scholarship"
  | "funding"
  | "tender"
  | "study_grant"
  | "career"
  | "freelance";

export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  id: string;
  user_id: string;
  type: GoalType;
  status: GoalStatus;
  context_data: Record<string, unknown>;
  created_at: string;
}

export type StepStatus = "todo" | "in_progress" | "done";

export interface PlanStep {
  id: string;
  plan_id: string;
  label: string;
  description: string | null;
  order: number;
  status: StepStatus;
}

export interface Plan {
  id: string;
  goal_id: string;
  summary: string;
  explanation: string | null;
  version: number;
  steps: PlanStep[];
}

// â”€â”€ Recommandations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type FeedbackAction =
  | "clicked"
  | "saved"
  | "applied"
  | "ignored"
  | "dismissed";

export interface ScrapedOffer {
  offer_ref: string;
  title: string;
  company: string | null;
  location: string | null;
  offer_type: string | null;
  source: string;
  url: string | null;
  score: number;
  freshness: string | null;
  description?: string | null;
}

// â”€â”€ Documents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type DocumentType =
  | "cv"
  | "cover_letter"
  | "business_plan"
  | "marketing_plan"
  | "market_study"
  | "report"
  | "thesis"
  | "commercial_proposal"
  | "contract";

export interface Document {
  id: string;
  user_id: string;
  goal_id: string | null;
  type: DocumentType;
  content: string;
  version: number;
  created_at: string;
}

// â”€â”€ Pour Moi Feed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface PourMoiItem {
  id: string;
  type: "recommendation" | "goal" | "received";
  title: string;
  source?: string;
  score?: number;
  created_at: string;
  thread_id?: string;
  offer_ref?: string;
}

// â”€â”€ API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ApiError {
  detail?: string;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

