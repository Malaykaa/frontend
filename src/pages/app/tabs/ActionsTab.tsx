import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus, FileText, Building2, TrendingUp, PieChart,
  FolderKanban, BarChart3, GraduationCap, ClipboardCheck, Mic,
  HandshakeIcon, FileSignature, Loader2, ChevronRight, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useCreateThread, useActionThreads } from "@/hooks/queries/use-chat-threads";
import { PRESET_LABELS } from "@/services/api/actions.api";
import { cn, formatRelativeTime } from "@/shared/lib/utils";
import { toast } from "sonner";
import type { ChatThread } from "@/shared/types";

// ── Catalogue des actions — labels via i18n ────────────────────────────────
const ACTIONS_CONFIG = [
  { Icon: Building2,      labelKey: "actions.label_business_plan",      descKey: "actions.desc_business_plan",      color: "bg-purple-100 text-purple-600",   preset: "business_plan"       },
  { Icon: TrendingUp,     labelKey: "actions.label_marketing_plan",     descKey: "actions.desc_marketing_plan",     color: "bg-orange-100 text-orange-600",   preset: "marketing_plan"      },
  { Icon: PieChart,       labelKey: "actions.label_market_study",       descKey: "actions.desc_market_study",       color: "bg-sky-100 text-sky-600",          preset: "market_study"        },
  { Icon: FolderKanban,   labelKey: "actions.label_project_setup",      descKey: "actions.desc_project_setup",      color: "bg-violet-100 text-violet-600",   preset: "project_setup"       },
  { Icon: BarChart3,      labelKey: "actions.label_report",             descKey: "actions.desc_report",             color: "bg-emerald-100 text-emerald-600", preset: "report"              },
  { Icon: GraduationCap,  labelKey: "actions.label_thesis",             descKey: "actions.desc_thesis",             color: "bg-amber-100 text-amber-600",     preset: "thesis"              },
  { Icon: ClipboardCheck, labelKey: "actions.label_cv_analysis",        descKey: "actions.desc_cv_analysis",        color: "bg-teal-100 text-teal-600",        preset: "cv_analysis"         },
  { Icon: Mic,            labelKey: "actions.label_interview_sim",      descKey: "actions.desc_interview_sim",      color: "bg-pink-100 text-pink-600",        preset: "interview_sim"       },
  { Icon: HandshakeIcon,  labelKey: "actions.label_commercial_proposal",descKey: "actions.desc_commercial_proposal",color: "bg-fuchsia-100 text-fuchsia-600", preset: "commercial_proposal" },
  { Icon: FileSignature,  labelKey: "actions.label_contract_proposal",  descKey: "actions.desc_contract_proposal",  color: "bg-yellow-100 text-yellow-600",   preset: "contract_proposal"   },
] as const;

type ActionPreset = (typeof ACTIONS_CONFIG)[number]["preset"];

// ── Icône par preset ───────────────────────────────────────────────────────
const PRESET_ICON: Record<string, (typeof ACTIONS_CONFIG)[number]["Icon"]> = Object.fromEntries(
  ACTIONS_CONFIG.map(({ preset, Icon }) => [preset, Icon])
);

const PRESET_COLOR: Record<string, string> = Object.fromEntries(
  ACTIONS_CONFIG.map(({ preset, color }) => [preset, color])
);

// ── Sheet de sélection ─────────────────────────────────────────────────────
interface ActionSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (preset: ActionPreset, title: string) => void;
  loading: boolean;
  creatingPreset: string | null;
}

function ActionSheet({ open, onClose, onSelect, loading, creatingPreset }: ActionSheetProps) {
  const [custom, setCustom] = useState("");
  const { t } = useTranslation();
  const ACTIONS = ACTIONS_CONFIG.map((a) => ({ ...a, label: t(a.labelKey), desc: t(a.descKey) }));

  const handleCustomSubmit = () => {
    if (!custom.trim()) return;
    onSelect("report", custom.trim());
    setCustom("");
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t("actions.sheet_title")}
      description={t("actions.sheet_desc")}
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-4 pb-4">
        <div className="flex gap-2">
          <Input
            placeholder={t("actions.custom_placeholder")}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
          />
          <Button
            onClick={handleCustomSubmit}
            disabled={!custom.trim() || loading}
            size="sm"
            className="shrink-0"
          >
            {loading && creatingPreset === null ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("actions.go_btn")
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">{t("actions.or_choose")}</span>
          </div>
        </div>

        {/* Liste des types */}
        <div className="space-y-2">
          {ACTIONS.map(({ Icon, label, color, desc, preset }) => (
            <button
              key={preset}
              disabled={loading}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                creatingPreset === preset
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-input hover:bg-muted/40",
                loading && creatingPreset !== preset && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => onSelect(preset, label)}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", color)}>
                {loading && creatingPreset === preset ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

// ── Empty state — grille des topics ───────────────────────────────────────
function EmptyTopicGrid({
  onSelect,
  loading,
  creatingPreset,
}: {
  onSelect: (preset: ActionPreset, title: string) => void;
  loading: boolean;
  creatingPreset: string | null;
}) {
  const { t } = useTranslation();
  const ACTIONS = ACTIONS_CONFIG.map((a) => ({ ...a, label: t(a.labelKey), desc: t(a.descKey) }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-dashed border-muted p-5 text-center space-y-2">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Zap className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <p className="font-semibold text-sm">{t("actions.empty_title")}</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          {t("actions.empty_hint")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map(({ Icon, label, color, preset }) => (
          <button
            key={preset}
            disabled={loading}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border bg-card p-3 text-left transition-all active:scale-[0.98]",
              loading && creatingPreset !== preset && "opacity-50 cursor-not-allowed",
              loading && creatingPreset === preset && "border-amber-400 bg-amber-50",
              !loading && "hover:bg-muted/30"
            )}
            onClick={() => onSelect(preset, label)}
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", color)}>
              {loading && creatingPreset === preset ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <span className="text-xs font-medium leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Item de conversation livrable ──────────────────────────────────────────
function LiverableItem({
  thread,
  onClick,
}: {
  thread: ChatThread;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const preset   = thread.preset_key ?? "";
  const IconComp = PRESET_ICON[preset] ?? FileText;
  const color    = PRESET_COLOR[preset] ?? "bg-muted text-muted-foreground";
  const labelKey = PRESET_LABELS[preset];
  const label    = labelKey ? t(labelKey) : thread.title;

  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-all hover:bg-muted/30 active:scale-[0.99]"
      onClick={onClick}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", color)}>
        <IconComp className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold leading-tight">{thread.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground truncate">{label}</p>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        {thread.updated_at && (
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeTime(thread.updated_at)}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

// ── Squelette ──────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5 animate-pulse">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/2 rounded bg-muted" />
      </div>
    </div>
  );
}

// ── Onglet principal ───────────────────────────────────────────────────────
export default function ActionsTab() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync: createThread, isPending } = useCreateThread();
  const { threads, hasThreads, isLoading } = useActionThreads();

  const [sheetOpen, setSheetOpen]           = useState(false);
  const [creatingPreset, setCreatingPreset] = useState<string | null>(null);

  const handleSelect = async (preset: ActionPreset, title: string) => {
    setCreatingPreset(preset);
    setSheetOpen(false);
    try {
      const thread = await createThread({ title, preset_key: preset });
      navigate(`/app/chat/${thread.id}`, { state: { title: thread.title } });
    } catch {
      toast.error(t("actions.create_error"));
    } finally {
      setCreatingPreset(null);
    }
  };

  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{t("actions.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {hasThreads
              ? t("actions.ai_docs")
              : t("actions.gen_docs")}
          </p>
        </div>

        {/* Bouton "Nouveau" seulement quand il y a déjà des livrables */}
        {hasThreads && (
          <Button
            size="sm"
            className="gap-1.5 shrink-0"
            onClick={() => setSheetOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t("actions.new_btn")}
          </Button>
        )}
      </div>

      {/* Chargement */}
      {isLoading && (
        <div className="space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      )}

      {/* Aucun livrable → grille des topics */}
      {!isLoading && !hasThreads && (
        <EmptyTopicGrid
          onSelect={handleSelect}
          loading={isPending}
          creatingPreset={creatingPreset}
        />
      )}

      {/* Des livrables existent → liste des conversations */}
      {!isLoading && hasThreads && (
        <div className="space-y-2">
          {threads.map((thread) => (
            <LiverableItem
              key={thread.id}
              thread={thread}
              onClick={() => navigate(`/app/chat/${thread.id}`, { state: { title: thread.title } })}
            />
          ))}
        </div>
      )}

      {/* Sheet création (accessible depuis le bouton "Nouveau") */}
      <ActionSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={handleSelect}
        loading={isPending}
        creatingPreset={creatingPreset}
      />
    </div>
  );
}
