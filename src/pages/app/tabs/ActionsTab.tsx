import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ── Catalogue des actions ──────────────────────────────────────────────────
const ACTIONS = [
  { Icon: Building2,       label: "Business Plan",             color: "bg-purple-100 text-purple-600",   desc: "Rédige un plan d'affaires complet",          preset: "business_plan"      },
  { Icon: TrendingUp,      label: "Plan Marketing",             color: "bg-orange-100 text-orange-600",   desc: "Stratégie marketing sur mesure",             preset: "marketing_plan"     },
  { Icon: PieChart,        label: "Étude de Marché",            color: "bg-sky-100 text-sky-600",          desc: "Analyse approfondie de ton marché",          preset: "market_study"       },
  { Icon: FolderKanban,    label: "Montage de Projet",          color: "bg-violet-100 text-violet-600",   desc: "Structure ton projet de A à Z",              preset: "project_setup"      },
  { Icon: BarChart3,       label: "Rapports",                   color: "bg-emerald-100 text-emerald-600", desc: "Rapports professionnels clés en main",       preset: "report"             },
  { Icon: GraduationCap,   label: "Mini Mémoire",               color: "bg-amber-100 text-amber-600",     desc: "Structure ton mémoire académique",           preset: "thesis"             },
  { Icon: ClipboardCheck,  label: "Analyse & Amélioration CV",  color: "bg-teal-100 text-teal-600",        desc: "Optimise et améliore ton CV",                preset: "cv_analysis"        },
  { Icon: Mic,             label: "Simulation Entretien",       color: "bg-pink-100 text-pink-600",        desc: "Prépare-toi pour ton entretien",             preset: "interview_sim"      },
  { Icon: HandshakeIcon,   label: "Proposition Commerciale",    color: "bg-fuchsia-100 text-fuchsia-600", desc: "Rédige une offre commerciale percutante",    preset: "commercial_proposal"},
  { Icon: FileSignature,   label: "Proposition de Contrat",     color: "bg-yellow-100 text-yellow-600",   desc: "Rédige un contrat professionnel",            preset: "contract_proposal"  },
] as const;

type ActionPreset = (typeof ACTIONS)[number]["preset"];

// ── Icône par preset ───────────────────────────────────────────────────────
const PRESET_ICON: Record<string, (typeof ACTIONS)[number]["Icon"]> = Object.fromEntries(
  ACTIONS.map(({ preset, Icon }) => [preset, Icon])
);

const PRESET_COLOR: Record<string, string> = Object.fromEntries(
  ACTIONS.map(({ preset, color }) => [preset, color])
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

  const handleCustomSubmit = () => {
    if (!custom.trim()) return;
    onSelect("report", custom.trim() || "Rapport personnalisé");
    setCustom("");
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Nouveau livrable"
      description="Choisis un type de document à générer"
      maxHeight="max-h-[90vh]"
    >
      <div className="space-y-4 pb-4">
        {/* Tâche libre */}
        <div className="flex gap-2">
          <Input
            placeholder="Décris ta tâche personnalisée…"
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
              "Go"
            )}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou choisir</span>
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
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-dashed border-muted p-5 text-center space-y-2">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Zap className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <p className="font-semibold text-sm">Génère ton premier livrable</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Choisis un type de document ci-dessous. L'IA le rédige pour toi en quelques instants.
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
  const preset = thread.preset_key ?? "";
  const IconComp = PRESET_ICON[preset] ?? FileText;
  const color    = PRESET_COLOR[preset] ?? "bg-muted text-muted-foreground";
  const label    = PRESET_LABELS[preset] ?? thread.title;

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
      toast.error("Impossible de créer le livrable. Réessaie.");
    } finally {
      setCreatingPreset(null);
    }
  };

  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Livrables</h1>
          <p className="text-sm text-muted-foreground">
            {hasThreads
              ? "Tes documents générés par l'IA"
              : "Génère des documents professionnels en quelques secondes"}
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
            Nouveau
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
