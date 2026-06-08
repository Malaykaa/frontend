import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import { MessageBubble, StreamingBubble } from "@/components/chat/MessageBubble";
import { StreamingIndicator } from "@/components/chat/StreamingIndicator";
import { AnimatedDots } from "@/components/chat/AnimatedDots";
import { ActionProgressView } from "@/components/chat/ActionProgressView";
import { DeliverableCard } from "@/components/chat/DeliverableCard";
import { DocumentViewer } from "@/components/chat/DocumentViewer";
import { PlanPanel } from "@/components/chat/PlanPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { fetchThreadWithMessages, streamMessage } from "@/services/api/chat.api";
import {
  streamActionGeneration,
  PRESET_LABELS,
  type AgentStep,
} from "@/services/api/actions.api";
import { ApiError } from "@/shared/api/client";
import { isActionThread } from "@/hooks/queries/use-chat-threads";
import type { ChatThread, ChatMessage } from "@/shared/types";
import { cn } from "@/shared/lib/utils";
import { usePageTitle } from "@/hooks/use-page-title";

// ── États de streaming chat ────────────────────────────────────────────────
type StreamPhase = "idle" | "thinking" | "streaming" | "error";

interface StreamState {
  phase: StreamPhase;
  content: string;
  agentName: string | null;
  errorMsg: string | null;
}

const STREAM_IDLE: StreamState = {
  phase: "idle",
  content: "",
  agentName: null,
  errorMsg: null,
};

// ── États de génération de document ───────────────────────────────────────
type GenPhase = "idle" | "generating" | "done" | "error";

interface GenState {
  phase: GenPhase;
  steps: AgentStep[];
  content: string;
  documentId: string | null;
}

const GEN_IDLE: GenState = {
  phase: "idle",
  steps: [],
  content: "",
  documentId: null,
};

// ── Gestion erreurs ────────────────────────────────────────────────────────
function getErrorMessage(err: unknown, t: (key: string) => string): string {
  if (err instanceof ApiError) {
    if (err.status === 429) return t("chat.error_rate_limit");
    if (err.status === 503) return t("chat.error_unavailable");
    if (err.status >= 500)  return t("chat.error_server");
    if (err.status === 401) return t("chat.error_session");
  }
  if (err instanceof TypeError && err.message.includes("fetch")) {
    return t("chat.error_network");
  }
  return t("chat.error_generic");
}

// ── Squelettes ─────────────────────────────────────────────────────────────
function MessageSkeleton({ side }: { side: "left" | "right" }) {
  return (
    <div className={cn("flex gap-2.5 px-4 py-1.5", side === "right" && "justify-end")}>
      {side === "left" && <div className="h-8 w-8 shrink-0 rounded-full bg-muted animate-pulse" />}
      <div
        className={cn(
          "h-10 rounded-2xl bg-muted animate-pulse",
          side === "left" ? "w-48 rounded-tl-sm" : "w-36 rounded-tr-sm"
        )}
      />
    </div>
  );
}

// ── WelcomeState — adapté selon le type de thread ─────────────────────────
function WelcomeState({
  thread,
  onGenerate,
  onSend,
}: {
  thread: ChatThread;
  onGenerate?: () => void;
  onSend?: (text: string) => void;
}) {
  const { t } = useTranslation();
  const isAction = isActionThread(thread);
  const presetLabel = thread.preset_key && PRESET_LABELS[thread.preset_key]
    ? t(PRESET_LABELS[thread.preset_key])
    : null;

  const chips = [
    { label: t("chat.starter_how_to_start"), message: t("chat.starter_msg_start", { title: thread.title }) },
    { label: t("chat.starter_options"),      message: t("chat.starter_msg_options", { title: thread.title }) },
    { label: t("chat.starter_action_plan"),  message: t("chat.starter_msg_plan", { title: thread.title }) },
  ];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center py-12">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          isAction ? "bg-amber-100" : "bg-black"
        )}
      >
        {isAction
          ? <Zap className="h-7 w-7 text-amber-600" />
          : <img src="/icon.png" alt="" className="h-9 w-9 object-contain" />}
      </div>

      <div>
        <p className="font-bold text-base">{thread.title}</p>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">
          {isAction
            ? (presetLabel ? t("chat.ready_generate", { label: presetLabel }) : t("chat.ready_generate_doc"))
            : t("chat.describe_hint")}
        </p>
      </div>

      {isAction && onGenerate ? (
        <Button
          size="lg"
          className="gap-2 bg-amber-500 hover:bg-amber-600 text-white"
          onClick={onGenerate}
        >
          <Zap className="h-4 w-4" />
          {t("chat.generate_btn")}
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {chips.map(({ label, message }) => (
            <button
              key={label}
              className="rounded-full border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors"
              onClick={() => onSend?.(message)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export default function ChatView() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const navTitle = (location.state as { title?: string } | null)?.title;
  const [thread, setThread]   = useState<ChatThread | null>(null);
  usePageTitle(thread?.title ?? navTitle ?? undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [stream, setStream]   = useState<StreamState>(STREAM_IDLE);
  const [gen, setGen]             = useState<GenState>(GEN_IDLE);
  const [showDoc, setShowDoc]     = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  // Viewer pour les livrables générés dans les threads objectif (via chat)
  const [viewingDoc, setViewingDoc] = useState<{ content: string; title: string } | null>(null);
  // Étapes complétées — dérivées des messages chargés depuis le serveur.
  // Source de vérité : DB (payload.completed_step_key sur les messages user).
  // Synchronisées sur tous les appareils sans localStorage.
  const [completedStepKeys, setCompletedStepKeys] = useState<Set<string>>(new Set());

  const bottomRef      = useRef<HTMLDivElement>(null);
  const isActiveRef    = useRef(false);

  // ── Chargement initial ──────────────────────────────────────────────────
  useEffect(() => {
    if (!threadId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const { thread: t, messages: msgs } = await fetchThreadWithMessages(threadId);
        if (!cancelled) {
          setThread(t);
          setMessages(msgs);
          // Reconstruire les étapes complétées depuis les messages DB
          // (synchronisé sur tous les appareils, survit aux rechargements)
          const keys = new Set<string>(
            msgs
              .filter((m) => m.role === "user" && m.completed_step_key)
              .map((m) => m.completed_step_key as string)
          );
          setCompletedStepKeys(keys);
        }
      } catch {
        if (!cancelled) toast.error(t("chat.load_error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, [threadId]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  useEffect(() => { scrollToBottom("instant"); }, [loading, scrollToBottom]);
  useEffect(() => { scrollToBottom(); }, [messages.length, stream.content, gen.steps.length, scrollToBottom]);

  // ── Envoi message classique ─────────────────────────────────────────────
  const handleSend = useCallback(
    async (content: string, attachmentIds: string[], displayContent?: string, stepKey?: string) => {
      if (!threadId || isActiveRef.current) return;

      // Bulle user : affiche displayContent si fourni (ex: "Étape : X"), sinon content complet
      const bubbleContent = displayContent ?? content;
      const userMsg: ChatMessage = {
        id: `local-${Date.now()}`,
        thread_id: threadId,
        role: "user",
        content: bubbleContent,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      isActiveRef.current = true;
      setStream({ phase: "thinking", content: "", agentName: null, errorMsg: null });

      try {
        let firstToken = true;
        let accumulated = "";
        let isDeliverable = false;

        for await (const token of streamMessage(
          threadId, content, attachmentIds,
          ({ isDeliverable: flag }) => { isDeliverable = flag; },
          (label, status) => {
            setGen((g) => {
              const existing = g.steps.findIndex((s) => s.agent === label);
              const step = { agent: label, status };
              if (existing >= 0) {
                const updated = [...g.steps];
                updated[existing] = step;
                return { ...g, phase: "generating", steps: updated };
              }
              return { ...g, phase: "generating", steps: [...g.steps, step] };
            });
          },
          displayContent,
          stepKey, // clé d'étape → stockée en DB dans le payload du message user
        )) {
          if (!isActiveRef.current) break;
          if (firstToken) { firstToken = false; setStream((s) => ({ ...s, phase: "streaming" })); }
          accumulated += token;
          setStream((s) => ({ ...s, content: accumulated }));
        }

        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              thread_id: threadId,
              role: "assistant",
              content: accumulated,
              created_at: new Date().toISOString(),
              is_deliverable: isDeliverable,
            },
          ]);
        }
        // Remettre gen à idle (les sections étaient un affichage de progression temporaire)
        setGen(GEN_IDLE);
        setStream(STREAM_IDLE);
      } catch (err) {
        const errMsg = getErrorMessage(err, t);
        setMessages((prev) => [
          ...prev,
          { id: `err-${Date.now()}`, thread_id: threadId, role: "assistant", content: `⚠️ ${errMsg}`, created_at: new Date().toISOString() },
        ]);
        setStream(STREAM_IDLE);
      } finally {
        isActiveRef.current = false;
      }
    },
    [threadId]
  );

  // ── Génération de document ──────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!thread?.preset_key || isActiveRef.current) return;

    isActiveRef.current = true;
    setGen({ phase: "generating", steps: [], content: "", documentId: null });
    setShowDoc(false);

    try {
      const content = await streamActionGeneration({
        preset: thread.preset_key,
        threadId,
        objectiveContext: thread.title,
        onProgress: (step) => {
          setGen((g) => {
            const existing = g.steps.findIndex((s) => s.agent === step.agent);
            if (existing >= 0) {
              const updated = [...g.steps];
              updated[existing] = step;
              return { ...g, steps: updated };
            }
            return { ...g, steps: [...g.steps, step] };
          });
        },
        onDone: (documentId) => {
          setGen((g) => ({ ...g, documentId }));
        },
        onError: (err) => {
          toast.error(err);
        },
      });

      setGen((g) => ({ ...g, phase: "done", content }));
      setShowDoc(true);
    } catch (err) {
      toast.error(getErrorMessage(err, t));
      setGen(GEN_IDLE);
    } finally {
      isActiveRef.current = false;
    }
  }, [thread]);

  // ── Complétion d'étape plan d'action ────────────────────────────────────
  const handleStepComplete = useCallback(
    (compositeKey: string, fullContext: string, displayContent: string) => {
      // Mise à jour optimiste immédiate (UX réactive sans attendre la réponse serveur)
      setCompletedStepKeys((prev) => new Set([...prev, compositeKey]));
      // Le compositeKey est envoyé dans le metadata → stocké en DB → relu au prochain chargement
      void handleSend(fullContext, [], displayContent, compositeKey);
    },
    [handleSend]
  );

  // ── Cleanup ─────────────────────────────────────────────────────────────
  useEffect(() => () => { isActiveRef.current = false; }, []);

  const isBusy = stream.phase !== "idle" || gen.phase === "generating";
  const isAction = isActionThread(thread);
  const presetLabel = thread?.preset_key && PRESET_LABELS[thread.preset_key]
    ? t(PRESET_LABELS[thread.preset_key])
    : undefined;
  const hasContent = messages.length > 0 || gen.phase !== "idle" || stream.phase !== "idle";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/90 px-3 py-3 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isAction ? "bg-amber-100" : "bg-black"
        )}>
          {isAction
            ? <Zap className="h-4 w-4 text-amber-600" />
            : <img src="/icon.png" alt="" className="h-5 w-5 object-contain" />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">
            {thread?.title ?? navTitle ?? "…"}
          </p>
          {isBusy && (
            <span className="flex items-center mt-0.5">
              <AnimatedDots size="sm" />
            </span>
          )}
        </div>

      </header>

      {/* Plan d'action (threads objectif uniquement, pas les actions) */}
      {!isAction && threadId && (
        <PlanPanel threadId={threadId} />
      )}

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-1 py-4">
            <MessageSkeleton side="right" />
            <MessageSkeleton side="left" />
            <MessageSkeleton side="right" />
            <MessageSkeleton side="left" />
          </div>
        ) : !hasContent && thread ? (
          <WelcomeState
            thread={thread}
            onGenerate={isAction ? handleGenerate : undefined}
            onSend={(text) => void handleSend(text, [])}
          />
        ) : (
          <div className="py-4">
            {/* Messages historiques */}
            {messages.map((msg) => {
              // Livrable généré dans un thread objectif → carte document
              if (msg.role === "assistant" && msg.is_deliverable) {
                // Strip any @@MARKER@@ patterns that may have leaked into stored content
                const cleanContent = (msg.content ?? "").replace(/@@\w+@@[^\n]*/g, "").trim();
                const docTitle = cleanContent.match(/^#\s+(.+)$/m)?.[1]?.trim()
                  ?? thread?.title
                  ?? "Document";
                return (
                  <DeliverableCard
                    key={msg.id}
                    presetLabel={docTitle}
                    content={cleanContent}
                    onView={() => setViewingDoc({ content: cleanContent, title: docTitle })}
                  />
                );
              }
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onSend={(text) => void handleSend(text, [])}
                  completedStepKeys={completedStepKeys}
                  onStepComplete={handleStepComplete}
                />
              );
            })}

            {/* Indicateur "En réflexion" (chat classique) */}
            {stream.phase === "thinking" && (
              <StreamingIndicator />
            )}

            {/* Streaming chat en cours */}
            {stream.phase === "streaming" && stream.content && (
              <StreamingBubble content={stream.content} />
            )}

            {/* Progression de la génération — titres de sections seulement */}
            {gen.phase === "generating" && (
              <ActionProgressView
                steps={gen.steps}
                isRunning
                presetLabel={presetLabel}
              />
            )}

            {/* Carte "livrable prêt" */}
            {showDoc && gen.phase === "done" && gen.content && (
              <>
                {/* Récap de progression terminé */}
                <ActionProgressView
                  steps={gen.steps.map((s) => ({ ...s, status: "complete" }))}
                  isRunning={false}
                  presetLabel={presetLabel}
                />
                {/* Carte livrable */}
                <DeliverableCard
                  presetLabel={presetLabel ?? "Document"}
                  content={gen.content}
                  documentId={gen.documentId}
                  onView={() => setViewerOpen(true)}
                />
              </>
            )}


            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <ChatInput
        onSend={handleSend}
        disabled={isBusy}
        placeholder={
          isAction && !hasContent
            ? t("chat.placeholder_action")
            : messages.length === 0
            ? t("chat.placeholder_new")
            : t("chat.placeholder")
        }
      />

      {/* Viewer — livrables des threads action (handleGenerate) */}
      {gen.content && (
        <DocumentViewer
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          title={presetLabel ?? thread?.title ?? "Document"}
          initialContent={gen.content}
          isAction={isAction}
          onRegenerate={isAction ? () => {
            setViewerOpen(false);
            setGen(GEN_IDLE);
            setShowDoc(false);
            void handleGenerate();
          } : undefined}
        />
      )}

      {/* Viewer — livrables générés dans les threads objectif (chat) */}
      {viewingDoc && (
        <DocumentViewer
          open={Boolean(viewingDoc)}
          onClose={() => setViewingDoc(null)}
          title={viewingDoc.title}
          initialContent={viewingDoc.content}
          isAction={false}
        />
      )}
    </div>
  );
}
