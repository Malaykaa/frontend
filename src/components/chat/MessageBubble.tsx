import { Copy, Check, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { AiAvatar } from "./AiAvatar";
import { useState } from "react";
import { MarkdownContent } from "./MarkdownContent";
import { cn } from "@/shared/lib/utils";
import { formatRelativeTime } from "@/shared/lib/utils";
import type { ChatMessage } from "@/shared/types";

// ── Parser des marqueurs injectés par le backend ───────────────────────────

interface ParsedSubStep {
  id: string;
  title: string;
}

interface ParsedStep {
  id: string;
  title: string;
  description: string;
  type: string;
  subSteps?: ParsedSubStep[];
}

interface ParsedContent {
  text: string;
  steps: ParsedStep[];
  propositions: string[];
}

/**
 * Supprime le bloc Sources UNIQUEMENT s'il est en queue absolue du texte.
 * Ne supprime rien si du contenu suit après le bloc Sources
 * (questions de clarification, marqueurs @@STEPS@@, @@PROPOSITIONS@@…).
 *
 * Pattern : header Sources + items de liste éventuels + fin de chaîne.
 * Le $ sans flag /m correspond à la fin de chaîne entière (pas à la fin de ligne).
 */
function stripSourcesBlock(text: string): string {
  return text
    .replace(
      /\n{1,3}(?:---[ \t]*\n)?(?:#{1,3}[ \t]+)?\*{0,2}[ \t]*[Ss]ources?[ \t]*:?[ \t]*\*{0,2}[^\n]*(?:\n[ \t]*[-*][ \t][^\n]*)*\s*$/g,
      ""
    )
    .trimEnd();
}

function parseContent(raw: string): ParsedContent {
  // Ordre important : extraire les marqueurs interactifs EN PREMIER,
  // puis supprimer Sources sur le texte restant.
  //
  // Pourquoi : le raw string a la forme :
  //   [explication + éventuel bloc Sources]
  //   @@STEPS@@ {encoded}
  //   @@PROPOSITIONS@@ {encoded}
  //
  // Si on appelle stripSourcesBlock avant d'extraire les marqueurs, le regex
  // $-ancré échoue car @@STEPS@@ suit Sources. En extrayant d'abord, Sources
  // devient la vraie queue du texte et le regex peut matcher correctement.
  let text = raw ?? "";
  const steps: ParsedStep[] = [];
  const propositions: string[] = [];

  // ── 1. Extraire @@STEPS@@ ─────────────────────────────────────────────────
  const stepsMatch = text.match(/@@STEPS@@\s+(\S+)/);
  if (stepsMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(stepsMatch[1])) as ParsedStep[];
      steps.push(...decoded);
    } catch { /* ignore */ }
    text = text.replace(/\s*@@STEPS@@\s+\S+/, "");
  }

  // ── 2. Extraire @@PROPOSITIONS@@ ─────────────────────────────────────────
  const propMatch = text.match(/@@PROPOSITIONS@@\s+(\S+)/);
  if (propMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(propMatch[1])) as string[];
      propositions.push(...decoded);
    } catch { /* ignore */ }
    text = text.replace(/\s*@@PROPOSITIONS@@\s+\S+/, "");
  }

  // ── 3. Nettoyer les marqueurs résiduels (défensif) ─────────────────────────
  text = text.replace(/@@\w+@@[^\n]*/g, "").trim();

  // ── 4. Supprimer Sources — maintenant en vraie queue du texte ─────────────
  text = stripSourcesBlock(text);

  return { text, steps, propositions };
}

// ── Carte d'étape cliquable avec sous-étapes ──────────────────────────────

interface StepCardProps {
  step: ParsedStep;
  index: number;
  completed?: boolean;
  onSend?: (text: string) => void;
  onComplete?: () => void;
}

function StepCard({ step, index, completed = false, onSend, onComplete }: StepCardProps) {
  const [open, setOpen] = useState(false);

  const hasSubSteps = (step.subSteps?.length ?? 0) > 0;
  const hasContent = hasSubSteps || !!step.description;

  const handleSendStep = () => {
    if (completed) return;
    // Le titre et le bouton dans la card appellent onSend directement → on envoie le contexte complet
    // Le onComplete (depuis MessageBubble) gère la séparation display/llm
    // Ici on délègue à onComplete si disponible (chemin normal depuis MessageBubble)
    // sinon fallback : onSend avec contexte complet (chemin legacy)
    onComplete?.();
    if (!onComplete) {
      let text = `Traitons l'étape : **${step.title}**`;
      if (step.description) text += `\n\nContexte : ${step.description}`;
      if (hasSubSteps) {
        text += `\n\nSous-plans à couvrir :\n${step.subSteps!.map((s) => `- ${s.title}`).join("\n")}`;
      }
      onSend?.(text);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border overflow-hidden transition-all",
        completed
          ? "border-emerald-200 bg-emerald-50/50 opacity-50"
          : "border-border bg-background hover:border-primary/30"
      )}
    >
      {/* Ligne principale */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {/* Numéro / check */}
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
            completed
              ? "bg-emerald-100 text-emerald-600"
              : "bg-primary/10 text-primary"
          )}
        >
          {completed ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
        </div>

        {/* Titre cliquable → envoie la requête */}
        <button
          className={cn(
            "flex-1 text-left text-xs font-semibold leading-snug",
            completed
              ? "line-through text-muted-foreground cursor-default"
              : "hover:text-primary transition-colors"
          )}
          onClick={handleSendStep}
          disabled={completed}
        >
          {step.title}
        </button>

        {/* Chevron expand (si sous-étapes ou description) */}
        {hasContent && !completed && (
          <button
            className="shrink-0 rounded p-1.5 hover:bg-muted/50 transition-colors"
            onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          >
            {open
              ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        )}
      </div>

      {/* Contenu déplié */}
      {open && !completed && hasContent && (
        <div className="border-t bg-muted/10 px-3 py-2.5 space-y-2">
          {step.description && (
            <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
          )}
          {hasSubSteps && (
            <div className="space-y-1">
              {step.subSteps!.map((sub, j) => (
                <div key={sub.id ?? j} className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                  <p className="text-xs text-foreground/80 leading-snug">{sub.title}</p>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-1 w-full rounded-lg bg-primary/5 border border-primary/20 px-3 py-2.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors text-left"
            onClick={handleSendStep}
          >
            Traiter cette étape →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Bouton proposition ─────────────────────────────────────────────────────

function PropositionChip({
  label,
  onSend,
}: {
  label: string;
  onSend?: (text: string) => void;
}) {
  const clean = label
    .replace(/^si tu veux je peux te\s*[:·-]\s*/i, "")
    .replace(/^si tu veux\s*[:·-]?\s*/i, "")
    .trim();

  const display = clean.charAt(0).toUpperCase() + clean.slice(1);

  return (
    <button
      className="rounded-full border border-primary/30 bg-primary/5 px-3 py-2.5 text-xs font-medium text-primary hover:bg-primary/10 active:scale-[0.98] transition-all text-left"
      onClick={() => onSend?.(display)}
    >
      {display}
    </button>
  );
}

// ── CopyButton ─────────────────────────────────────────────────────────────

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="rounded-md p-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground active:scale-95"
      title="Copier"
    >
      {copied
        ? <Check className="h-3.5 w-3.5 text-emerald-500" />
        : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ── MessageBubble ──────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  showActions?: boolean;
  onSend?: (text: string) => void;
  completedStepKeys?: Set<string>;
  onStepComplete?: (compositeKey: string, fullContext: string, displayContent: string) => void;
}

export function MessageBubble({
  message,
  showActions = true,
  onSend,
  completedStepKeys,
  onStepComplete,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-1">
        <div className="group flex max-w-[80%] flex-col items-end gap-1">
          <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 shadow-sm">
            <p className="text-sm leading-relaxed text-primary-foreground whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <span className="text-[11px] text-muted-foreground px-1">
            {message.created_at ? formatRelativeTime(message.created_at) : ""}
          </span>
        </div>
      </div>
    );
  }

  // Message IA — parser les marqueurs
  const { text, steps, propositions } = parseContent(message.content);

  // Filtrer les étapes visibles (non complétées gardent leurs positions, les complétées sont grisées)
  const visibleSteps = steps.filter((step) => {
    const key = `${message.id}::${step.id}`;
    return !(completedStepKeys?.has(key));
  });

  return (
    <div className="flex items-start gap-2.5 px-4 py-1">
      <AiAvatar className="mt-0.5" />

      <div className="group flex min-w-0 flex-1 flex-col gap-2">
        {/* Texte principal */}
        {text && (
          <div className={cn(
            "rounded-2xl rounded-tl-sm border bg-card px-4 py-3 shadow-sm",
            "min-w-0 max-w-full"
          )}>
            <MarkdownContent content={text} />
          </div>
        )}

        {/* Étapes (plan d'action) — affiche seulement les non complétées */}
        {steps.length > 0 && visibleSteps.length > 0 && (
          <div className="space-y-1.5 max-w-full">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-1">
              Plan d'action · {visibleSteps.length} étape{visibleSteps.length > 1 ? "s" : ""} restante{visibleSteps.length > 1 ? "s" : ""}
            </p>
            {visibleSteps.map((step, i) => {
              const key = `${message.id}::${step.id}`;
              return (
                <StepCard
                  key={key}
                  step={step}
                  index={i}
                  completed={false}
                  onSend={onSend}
                  onComplete={() => {
                    // Texte court affiché dans la bulle utilisateur
                    const display = `Étape : "${step.title}"`;
                    // Contexte complet envoyé au LLM (invisible pour l'user)
                    let fullCtx = `Traitons l'étape : **${step.title}**`;
                    if (step.description) fullCtx += `\n\nContexte : ${step.description}`;
                    if (step.subSteps?.length) {
                      fullCtx += `\n\nSous-plans à couvrir :\n${step.subSteps.map((s) => `- ${s.title}`).join("\n")}`;
                    }
                    onStepComplete?.(key, fullCtx, display);
                  }}
                />
              );
            })}
            {visibleSteps.length < steps.length && (
              <p className="text-[11px] text-emerald-600 px-1">
                ✓ {steps.length - visibleSteps.length} étape{steps.length - visibleSteps.length > 1 ? "s" : ""} traitée{steps.length - visibleSteps.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Toutes les étapes complétées */}
        {steps.length > 0 && visibleSteps.length === 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2.5">
            <p className="text-xs font-medium text-emerald-700">
              ✓ Toutes les étapes ont été traitées
            </p>
          </div>
        )}

        {/* Propositions (suggestions cliquables) */}
        {propositions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {propositions.map((p, i) => (
              <PropositionChip key={i} label={p} onSend={onSend} />
            ))}
          </div>
        )}

        {/* Footer (heure + copier) */}
        <div className="flex items-center gap-1 px-1">
          <span className="text-[11px] text-muted-foreground">
            {message.created_at ? formatRelativeTime(message.created_at) : ""}
          </span>
          {showActions && <CopyButton content={message.content} />}
        </div>
      </div>
    </div>
  );
}

// ── StreamingBubble ────────────────────────────────────────────────────────

export function StreamingBubble({ content }: { content: string }) {
  const { text } = parseContent(content);

  return (
    <div className="flex items-start gap-2.5 px-4 py-1">
      <AiAvatar className="mt-0.5" />
      <div className="rounded-2xl rounded-tl-sm border bg-card px-4 py-3 shadow-sm max-w-[85%]">
        <MarkdownContent content={text || content} />
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" />
      </div>
    </div>
  );
}
