import { apiStream } from "@/shared/api/client";

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Chunk SSE tel que renvoyé par le backend (format swarm / smart).
 *
 * Types émis par format_swarm_event :
 *   generating   → début de planification
 *   agent_start  → début d'une section  (+ agentId, label)
 *   agent_done   → fin d'une section    (+ agentId)
 *   token        → fragment de texte    (+ token)
 *   done         → document complet     (+ content, qualityScore, sources)
 *   error        → erreur               (+ message)
 *
 * Types legacy (restent pour compat) :
 *   progress / agent
 */
export interface ActionProgressChunk {
  type:
    | "generating"
    | "agent_start"
    | "agent_done"
    | "token"
    | "done"
    | "error"
    | "progress"
    | "agent"
    | "clarification"
    | "follow_up";
  agentId?: string | null;
  label?: string | null;      // libellé de la section (agent_start)
  agent?: string | null;      // legacy
  step?: string | null;       // legacy
  status?: "running" | "complete" | "error" | "pending" | null;
  token?: string | null;
  content?: string | null;    // fragment (token) OU document final (done)
  message?: string | null;
  document_id?: string | null;
  error?: string | null;
  question?: string | null;   // clarification
  sources?: unknown[];
  qualityScore?: number | null;
}

export interface AgentStep {
  agent: string;   // libellé lisible de la section
  status: "pending" | "running" | "complete" | "error";
}

// ── Preset → backend key (les valeurs servent au routing SSE) ─────────────
export const ACTION_PRESETS: Record<string, string> = {
  business_plan:       "business_plan",
  marketing_plan:      "marketing_plan",
  market_study:        "market_study",
  project_setup:       "project_setup",
  report:              "report",
  thesis:              "thesis",
  cv_analysis:         "cv_analysis",
  interview_sim:       "interview_sim",
  commercial_proposal: "commercial_proposal",
  contract_proposal:   "contract_proposal",
};

// ── Preset → clé i18n (passer par t() avant d'afficher) ───────────────────
export const PRESET_LABELS: Record<string, string> = {
  business_plan:       "actions.label_business_plan",
  marketing_plan:      "actions.label_marketing_plan",
  market_study:        "actions.label_market_study",
  project_setup:       "actions.label_project_setup",
  report:              "actions.label_report",
  thesis:              "actions.label_thesis",
  cv_analysis:         "actions.label_cv_analysis",
  interview_sim:       "actions.label_interview_sim",
  commercial_proposal: "actions.label_commercial_proposal",
  contract_proposal:   "actions.label_contract_proposal",
};

// ── Parse chunk SSE ────────────────────────────────────────────────────────
export function parseActionChunk(raw: string): ActionProgressChunk | null {
  if (!raw.trim() || raw === "[DONE]") return null;
  try {
    return JSON.parse(raw) as ActionProgressChunk;
  } catch {
    return { type: "token", token: raw };
  }
}

// ── Streaming de génération de document ───────────────────────────────────

export interface ActionStreamOptions {
  preset: string;
  threadId?: string;        // optionnel — thread où persister le document généré
  instructions?: string;
  objectiveContext?: string;
  onProgress?: (step: AgentStep) => void;
  onToken?: (token: string) => void;
  onDone?: (documentId: string | null) => void;
  onError?: (err: string) => void;
}

/**
 * Génération de livrable via POST /ai/actions/swarm/{preset}/stream.
 *
 * Flux SSE attendu :
 *   generating   → planification démarrée
 *   agent_start  → début d'une section (label = nom de la section)
 *   token        → fragment de texte streamé par la LLM (optionnel)
 *   agent_done   → fin de la section
 *   done         → document complet dans done.content
 *
 * Retourne le contenu final du document (string Markdown).
 */
export async function streamActionGeneration(
  opts: ActionStreamOptions
): Promise<string> {
  const { preset, threadId, instructions, objectiveContext } = opts;

  const body: Record<string, unknown> = {};
  if (instructions)     body.customInstructions = instructions;
  if (objectiveContext) body.objectiveContext    = objectiveContext;
  if (threadId)         body.threadId           = threadId;

  let fullContent = "";
  let currentLabel = ""; // section courante pour apparier agent_done

  for await (const raw of apiStream(
    `/ai/actions/swarm/${preset}/stream`,
    { method: "POST", body: JSON.stringify(body) },
    180_000, // 3 min — documents longs (8-12 sections × ~10 s)
  )) {
    const chunk = parseActionChunk(raw);
    if (!chunk) continue;

    switch (chunk.type) {

      // ── Planification ──────────────────────────────────────────
      case "generating":
        // Rien à faire côté UI — l'indicateur "Génération en cours" est déjà affiché
        break;

      // ── Début d'une section ────────────────────────────────────
      case "agent_start": {
        // label = nom lisible de la section (ex: "Résumé exécutif")
        const label = chunk.label ?? chunk.agentId ?? "Section";
        currentLabel = label;
        opts.onProgress?.({ agent: label, status: "running" });
        break;
      }

      // ── Fin d'une section ──────────────────────────────────────
      case "agent_done": {
        const label = currentLabel || chunk.agentId || "Section";
        opts.onProgress?.({ agent: label, status: "complete" });
        break;
      }

      // ── Fragment de texte (LLM streaming réel) ─────────────────
      case "token": {
        const text = chunk.token ?? chunk.content ?? "";
        if (text) {
          fullContent += text;
          opts.onToken?.(text);
        }
        break;
      }

      // ── Document complet ───────────────────────────────────────
      // Le backend met le document final dans done.content.
      // Pour le mock LLM (pas de token streaming), c'est le seul endroit
      // où le contenu arrive. Pour les vraies LLMs, done.content est la
      // version canonique (on l'utilise comme source de vérité).
      case "done": {
        if (chunk.content) {
          fullContent = chunk.content; // écrase les tokens partiels si besoin
        }
        opts.onDone?.(chunk.document_id ?? null);
        break;
      }

      // ── Events legacy ──────────────────────────────────────────
      case "progress":
      case "agent":
        if (chunk.agent) {
          opts.onProgress?.({
            agent: chunk.agent,
            status: (chunk.status as AgentStep["status"]) ?? "running",
          });
        }
        break;

      // ── Demande de clarification ───────────────────────────────
      case "clarification":
        // Le document nécessite plus d'infos → on affiche la question comme erreur douce
        opts.onError?.(chunk.question ?? "Précise ta demande pour générer le document.");
        break;

      // ── Erreur ────────────────────────────────────────────────
      case "error":
        opts.onError?.(chunk.error ?? chunk.message ?? "Erreur de génération");
        break;
    }
  }

  return fullContent;
}
