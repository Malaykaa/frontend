import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Star, ChevronDown, ChevronUp, CheckCircle2, Circle,
  Zap, Loader2, Target, TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { useGroupedThreads, CATEGORY_META, getThreadCategory } from "@/hooks/queries/use-chat-threads";
import { useThreadPlan, useCompleteStep } from "@/hooks/queries/use-plan";
import { computeProgress, isStepDone, type FrontendPlanStep } from "@/services/api/plans.api";
import { Button } from "@/components/ui/button";
import type { ChatThread } from "@/shared/types";

// ── Ligne d'étape ──────────────────────────────────────────────────────────

function StepItem({
  step,
  threadId,
}: {
  step: FrontendPlanStep;
  threadId: string;
}) {
  const { mutateAsync: complete } = useCompleteStep(threadId);
  const [loading, setLoading] = useState(false);
  const done = isStepDone(step);
  const { t } = useTranslation();

  const handleComplete = async () => {
    if (done || loading) return;
    setLoading(true);
    try {
      await complete(step.id);
      toast.success(t("app.step_validated"));
    } catch {
      toast.error(t("app.step_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-2 py-2 transition-colors",
        done ? "opacity-60" : "hover:bg-muted/30"
      )}
    >
      <button
        onClick={handleComplete}
        disabled={done || loading}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          done
            ? "border-emerald-500 bg-emerald-500 cursor-default"
            : loading
            ? "border-muted cursor-wait"
            : "border-muted-foreground/30 hover:border-primary cursor-pointer"
        )}
      >
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        ) : loading ? (
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
        ) : (
          <Circle className="h-3 w-3 text-muted-foreground/40" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {step.isMission && (
            <span className="flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
              <Zap className="h-2.5 w-2.5" />
              {t("plan.mission")}
            </span>
          )}
          <p className={cn("text-sm leading-snug", done && "line-through text-muted-foreground")}>
            {step.title}
          </p>
        </div>
        {step.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
        )}
      </div>

      <span className="shrink-0 text-[10px] text-muted-foreground/40 mt-1">
        {step.step}
      </span>
    </div>
  );
}

// ── Carte d'un objectif ────────────────────────────────────────────────────

function ObjectiveCard({ thread }: { thread: ChatThread }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const category = getThreadCategory(thread);
  const meta     = CATEGORY_META[category];

  // Chargement lazy du plan uniquement quand la carte est ouverte
  const { data: steps, isLoading } = useThreadPlan(expanded ? thread.id : null);
  const progress = steps ? computeProgress(steps) : null;
  const hasPlan  = steps && steps.length > 0;

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Header cliquable */}
      <button
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Emoji catégorie */}
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg", meta.bg)}>
          {meta.emoji}
        </div>

        {/* Titre + progress */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold">{thread.title}</p>
          {progress ? (
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                {progress.done}/{progress.total}
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              {thread.message_count > 0
                ? `${thread.message_count} message${thread.message_count > 1 ? "s" : ""}`
                : t("app.no_messages")}
            </p>
          )}
        </div>

        {/* Pourcentage + chevron */}
        <div className="shrink-0 flex items-center gap-2">
          {progress && (
            <span className={cn(
              "text-xs font-bold tabular-nums",
              progress.pct === 100 ? "text-emerald-600" : meta.color
            )}>
              {progress.pct}%
            </span>
          )}
          {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Corps expandable */}
      {expanded && (
        <div className="border-t bg-muted/10">
          {isLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t("app.plan_loading")}
            </div>
          ) : hasPlan ? (
            <div className="space-y-0.5 px-3 py-2">
              {steps!.map((step) => (
                <StepItem key={step.id} step={step} threadId={thread.id} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t("app.no_plan")}</p>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => navigate(`/app/chat/${thread.id}`)}
              >
                {t("app.chat_to_plan")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Carte récapitulatif ────────────────────────────────────────────────────

function SummaryCard({ total }: { total: number }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { Icon: Target,   label: t("app.active_goals"),  value: total.toString(), color: "text-primary bg-primary/10" },
        { Icon: TrendingUp, label: t("app.avg_progress"), value: "—",             color: "text-emerald-600 bg-emerald-100" },
        { Icon: Star,     label: t("app.steps_done"),    value: "—",              color: "text-amber-600 bg-amber-100" },
      ].map(({ Icon, label, value, color }) => (
        <div key={label} className="flex flex-col items-center gap-1 rounded-xl border bg-card p-3 text-center">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", color)}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-lg font-bold tabular-nums">{value}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Onglet principal ───────────────────────────────────────────────────────

const ACTION_PRESET_SET = new Set([
  "business_plan","marketing_plan","market_study","project_setup",
  "report","thesis","cv_analysis","interview_sim",
  "commercial_proposal","contract_proposal",
]);

export default function ScoresTab() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: threads, isLoading } = useGroupedThreads();

  // Filtrer uniquement les threads d'objectif (pas les actions)
  const objectiveThreads = (threads as unknown as { career: ChatThread[]; studies: ChatThread[]; professional: ChatThread[] } | undefined)
    ? [
        ...((threads as unknown as { career: ChatThread[] }).career ?? []),
        ...((threads as unknown as { studies: ChatThread[] }).studies ?? []),
        ...((threads as unknown as { professional: ChatThread[] }).professional ?? []),
      ].filter((t) => !ACTION_PRESET_SET.has(t.preset_key ?? ""))
    : [];

  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      <div>
        <h1 className="text-lg font-bold">{t("app.scores_title")}</h1>
        <p className="text-sm text-muted-foreground">{t("app.scores_subtitle")}</p>
      </div>

      {/* Résumé */}
      <SummaryCard total={objectiveThreads.length} />

      {/* Liste des objectifs */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl border bg-muted animate-pulse" />
          ))}
        </div>
      ) : objectiveThreads.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-muted py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Star className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">{t("app.no_active_goals")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("app.no_active_goals_hint")}
            </p>
          </div>
          <Button size="sm" onClick={() => navigate("/app/pour-moi")} className="gap-2">
            <Target className="h-4 w-4" />
            {t("app.create_goal_btn")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide px-1">
            {t("app.action_plans", { count: objectiveThreads.length })}
          </p>
          {objectiveThreads.map((thread) => (
            <ObjectiveCard key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </div>
  );
}
