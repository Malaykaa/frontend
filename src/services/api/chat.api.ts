import { apiRequest, apiStream } from "@/shared/api/client";
import type { ChatThread, ChatMessage, MessageRole, ThreadStatus } from "@/shared/types";

// ── Types bruts backend (camelCase) ────────────────────────────────────────

interface RawMessage {
  id: string;
  role: string;
  content: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

interface RawThread {
  id: string;
  userId: string;
  title: string;
  source?: string;
  status: string;
  instructions?: string | null;
  presetKey?: string | null;
  messages: RawMessage[];
  createdAt: string;
  updatedAt?: string;
}

// ── Labels lisibles pour les preset keys (fallback quand le titre = clé brute) ──
const PRESET_KEY_LABELS: Record<string, string> = {
  // Objectifs v2
  stage_emploi:           "Stage / Emploi",
  bourse_etudes:          "Bourse d'Études · Recherches",
  subvention_financement: "Subvention / Financement projet",
  prepa_exam:             "Prépa Exam / Concours",
  appel_offres:           "Appel d'offres / À proposition",
  missions_freelance:     "Missions Freelances",
  appels_projet:          "Appels à Projet / Candidature",
  orientation_carriere:   "Orientation de Carrière",
  // Objectifs legacy (threads existants en DB)
  career:       "Trouver un emploi",
  scholarship:  "Bourse d'études",
  funding:      "Financement projet",
  exam:         "Concours & Examens",
  tender:       "Appel d'offres",
  freelance:    "Mission freelance",
  study_grant:  "Bourse de recherche",
  professional: "Progression de carrière",
  // Livrables
  business_plan:       "Business Plan",
  marketing_plan:      "Plan Marketing",
  market_study:        "Étude de Marché",
  project_setup:       "Montage de Projet",
  report:              "Rapport",
  thesis:              "Mini Mémoire",
  cv_analysis:         "Analyse CV",
  interview_sim:       "Simulation Entretien",
  commercial_proposal: "Proposition Commerciale",
  contract_proposal:   "Proposition de Contrat",
};

/** Si le titre brut = une clé de preset (ex: "career"), retourne le label lisible. */
function resolveTitle(rawTitle: string, presetKey: string | null | undefined): string {
  if (!rawTitle) return presetKey ? (PRESET_KEY_LABELS[presetKey] ?? presetKey) : "Conversation";
  // Titre qui ressemble à une clé brute : minuscules, underscores, pas d'espaces
  if (/^[a-z_]+$/.test(rawTitle) && PRESET_KEY_LABELS[rawTitle]) {
    return PRESET_KEY_LABELS[rawTitle];
  }
  return rawTitle;
}

// ── Normaliseurs backend → frontend ────────────────────────────────────────

function normalizeMessage(raw: RawMessage, threadId: string): ChatMessage {
  return {
    id: raw.id,
    thread_id: threadId,
    role: raw.role as MessageRole,
    content: raw.content,
    created_at: raw.createdAt,
    is_deliverable: Boolean(raw.metadata?.isDeliverable),
    completed_step_key: (raw.metadata?.completedStepKey as string) ?? null,
  };
}

function normalizeThread(raw: RawThread): ChatThread {
  return {
    id: raw.id,
    user_id: raw.userId,
    goal_id: null,
    title: resolveTitle(raw.title, raw.presetKey),
    status: raw.status as ThreadStatus,
    message_count: raw.messages?.length ?? 0,
    created_at: raw.createdAt,
    updated_at: raw.updatedAt,
    preset_key: raw.presetKey ?? null,
  };
}

// ── Payload de création (frontend → backend camelCase) ─────────────────────

export interface CreateThreadPayload {
  title: string;
  preset_key?: string | null;
  instructions?: string | null;
  notif_mode?: "realtime" | "scheduled";
  notif_time?: string | null;
}

interface BackendThreadCreate {
  title: string;
  presetKey?: string | null;
  instructions?: string | null;
  notifMode?: string | null;
  notifTime?: string | null;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/** Liste tous les threads de l'utilisateur connecté */
export async function fetchThreads(): Promise<ChatThread[]> {
  const raw = await apiRequest<RawThread[]>("/chat/threads");
  return (Array.isArray(raw) ? raw : []).map(normalizeThread);
}

/** Crée un nouveau thread */
export async function createThread(payload: CreateThreadPayload): Promise<ChatThread> {
  const body: BackendThreadCreate = {
    title: payload.title,
    presetKey: payload.preset_key ?? null,
    instructions: payload.instructions ?? null,
    notifMode: payload.notif_mode ?? null,
    notifTime: payload.notif_time ?? null,
  };
  const raw = await apiRequest<RawThread>("/chat/threads", {
    method: "POST",
    body: JSON.stringify(body),
    timeoutMs: 90_000, // L'IA génère le message d'accueil côté serveur (~30s avec Claude)
  });
  return normalizeThread(raw);
}

/**
 * Récupère un thread + ses messages en un seul appel.
 * Le backend embarque les messages dans le thread (pas d'endpoint /messages séparé).
 */
export async function fetchThreadWithMessages(
  threadId: string
): Promise<{ thread: ChatThread; messages: ChatMessage[] }> {
  const raw = await apiRequest<RawThread>(`/chat/threads/${threadId}`);
  return {
    thread: normalizeThread(raw),
    messages: (raw.messages ?? []).map((m) => normalizeMessage(m, threadId)),
  };
}

/** Détail d'un thread (sans messages) */
export async function fetchThread(threadId: string): Promise<ChatThread> {
  const raw = await apiRequest<RawThread>(`/chat/threads/${threadId}`);
  return normalizeThread(raw);
}

/** Messages d'un thread — extraits du thread response (pas d'endpoint séparé) */
export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  const raw = await apiRequest<RawThread>(`/chat/threads/${threadId}`);
  return (raw.messages ?? []).map((m) => normalizeMessage(m, threadId));
}

/** Feed "Pour Moi" */
export async function fetchPourMoiFeed(): Promise<ChatThread[]> {
  const raw = await apiRequest<RawThread[]>("/chat/pour-moi");
  return (Array.isArray(raw) ? raw : []).map(normalizeThread);
}

// ── SSE Streaming ──────────────────────────────────────────────────────────

export interface StreamChunk {
  type: "token" | "done" | "error" | "agent_start" | "agent_done" | "generating" | "progress";
  token?: string;
  content?: string;
  agent?: string;
  agentId?: string;
  label?: string;
  error?: string;
  message?: string;
  isDeliverable?: boolean;
}

/** Parse un chunk SSE — tolère plusieurs formats backend */
export function parseStreamChunk(raw: string): string | null {
  if (!raw.trim() || raw === "[DONE]") return null;
  try {
    const parsed = JSON.parse(raw) as StreamChunk;
    if (parsed.type === "error") throw new Error(parsed.error ?? parsed.message ?? "Stream error");
    if (parsed.type === "done") return null;
    if (["generating", "agent_start", "agent_done", "progress"].includes(parsed.type)) return null;
    // Priorité : token → content → message
    return parsed.token ?? parsed.content ?? parsed.message ?? null;
  } catch (e) {
    if (e instanceof SyntaxError) return raw;
    throw e;
  }
}

/**
 * Stream une réponse IA via SSE.
 *
 * Le backend en mode "direct" (mock LLM et agents) ne stream pas token par token :
 * il envoie quelques chunks de progression, puis un event `done` avec la réponse
 * complète dans `done.content`. On yield ce contenu final.
 *
 * Pour les vraies LLMs avec streaming réel (OpenAI stream / Claude stream),
 * les events `token` contiendraient de vrais tokens — on les yield aussi.
 */
export async function* streamMessage(
  threadId: string,
  content: string,
  attachmentIds: string[] = [],
  onDone?: (meta: { isDeliverable: boolean }) => void,
  onSection?: (label: string, status: "running" | "complete") => void,
  displayContent?: string,
  stepKey?: string,
): AsyncGenerator<string> {
  const body: Record<string, unknown> = { content };
  if (attachmentIds.length > 0) body.attachment_ids = attachmentIds;
  if (displayContent) body.display_content = displayContent;
  if (stepKey) body.metadata = { completed_step_key: stepKey };
  let _currentSectionLabel = "";

  for await (const raw of apiStream(
    `/chat/threads/${threadId}/stream`,
    { method: "POST", body: JSON.stringify(body) },
    180_000, // 3 min — documents longs (8-12 sections × ~10 s)
  )) {
    if (!raw.trim() || raw === "[DONE]") continue;

    let parsed: StreamChunk;
    try {
      parsed = JSON.parse(raw) as StreamChunk;
    } catch {
      // Texte brut (rare) — yield tel quel
      yield raw;
      continue;
    }

    if (parsed.type === "error") {
      throw new Error(parsed.error ?? parsed.message ?? "Stream error");
    }

    // Réponse finale : le contenu réel de l'IA est ici
    if (parsed.type === "done") {
      onDone?.({ isDeliverable: Boolean(parsed.isDeliverable) });
      if (parsed.content) yield parsed.content;
      return;
    }

    // Sections d'un document (quand l'orchestrateur génère via _execute_document)
    if (parsed.type === "agent_start" && parsed.label) {
      _currentSectionLabel = parsed.label;
      onSection?.(parsed.label, "running");
    }
    if (parsed.type === "agent_done" && _currentSectionLabel) {
      onSection?.(_currentSectionLabel, "complete");
    }

    // Vrais tokens (streaming réel avec OpenAI/Claude/Gemini)
    if (parsed.type === "token" && parsed.token) {
      yield parsed.token;
    }

    // Événements de progression (generating, agent_start, agent_done) → ignorés
  }
}
