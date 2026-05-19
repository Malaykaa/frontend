import { useState } from "react";
import { toast } from "sonner";
import {
  Briefcase, GraduationCap, Banknote, Trophy, FileText,
  Laptop, BookOpen, Compass, Plus, Loader2, Check, Bell, Clock,
} from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { useCreateThread } from "@/hooks/queries/use-chat-threads";
import type { ChatThread } from "@/shared/types";

// ── Thèmes disponibles ─────────────────────────────────────────────────────
const TOPICS = [
  { preset: "stage_emploi",           label: "Stage / Emploi",                  placeholder: "Ex : Trouver un stage PFE en informatique à Abidjan",          Icon: Briefcase,     color: "bg-blue-100 text-blue-600"     },
  { preset: "bourse_etudes",          label: "Bourse d'Études · Recherches",    placeholder: "Ex : Obtenir une bourse Master en France ou au Canada",         Icon: GraduationCap, color: "bg-violet-100 text-violet-600"  },
  { preset: "subvention_financement", label: "Subvention / Financement projet", placeholder: "Ex : Financer mon projet agritech au Sénégal",                  Icon: Banknote,      color: "bg-emerald-100 text-emerald-600"},
  { preset: "prepa_exam",             label: "Prépa Exam / Concours",           placeholder: "Ex : Préparer le concours de la fonction publique 2025",        Icon: Trophy,        color: "bg-amber-100 text-amber-600"   },
  { preset: "appel_offres",           label: "Appel d'offres / À proposition",  placeholder: "Ex : Répondre à l'appel d'offres BTP de la mairie",            Icon: FileText,      color: "bg-orange-100 text-orange-600" },
  { preset: "missions_freelance",     label: "Missions Freelances",             placeholder: "Ex : Décrocher des missions design ou dev sur Upwork",          Icon: Laptop,        color: "bg-pink-100 text-pink-600"     },
  { preset: "appels_projet",          label: "Appels à Projet / Candidature",   placeholder: "Ex : Candidater au programme Tony Elumelu 2025",               Icon: BookOpen,      color: "bg-sky-100 text-sky-600"       },
  { preset: "orientation_carriere",   label: "Orientation de Carrière",         placeholder: "Ex : Me reconvertir dans le marketing digital ou la data",      Icon: Compass,       color: "bg-rose-100 text-rose-600"     },
] as const;

type PresetKey = (typeof TOPICS)[number]["preset"];

interface NewObjectiveSheetProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (thread: ChatThread) => void;
}

// ── Étape 1 — Choix du thème ───────────────────────────────────────────────
function StepTopics({
  selected,
  onSelect,
  onNext,
}: {
  selected: PresetKey | null;
  onSelect: (p: PresetKey) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {TOPICS.map(({ preset, label, Icon, color }) => (
          <button
            key={preset}
            type="button"
            className={cn(
              "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all duration-150",
              selected === preset
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/40"
            )}
            onClick={() => onSelect(preset as PresetKey)}
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", color)}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium leading-tight">{label}</span>
            {selected === preset && (
              <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />
            )}
          </button>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={onNext}
        disabled={!selected}
      >
        Suivant
      </Button>
    </div>
  );
}

// ── Étape 2 — Titre + notifications ───────────────────────────────────────
function StepDetails({
  preset,
  title,
  onTitleChange,
  notifMode,
  onNotifModeChange,
  notifTime,
  onNotifTimeChange,
  onBack,
  onSubmit,
  loading,
}: {
  preset: PresetKey;
  title: string;
  onTitleChange: (v: string) => void;
  notifMode: "realtime" | "scheduled";
  onNotifModeChange: (v: "realtime" | "scheduled") => void;
  notifTime: string;
  onNotifTimeChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const topic = TOPICS.find((t) => t.preset === preset)!;

  return (
    <div className="space-y-5">
      {/* Thème sélectionné */}
      <div className={cn("flex items-center gap-2.5 rounded-xl p-3", topic.color.split(" ")[0] + "/10")}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", topic.color)}>
          <topic.Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">{topic.label}</span>
        <button
          type="button"
          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={onBack}
        >
          Changer
        </button>
      </div>

      {/* Titre de l'objectif */}
      <div className="space-y-1.5">
        <Label>Titre de l'objectif</Label>
        <Input
          autoFocus
          placeholder={topic.placeholder}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={80}
        />
        <p className="text-right text-xs text-muted-foreground">{title.length}/80</p>
      </div>

      {/* Préférence de notification */}
      <div className="space-y-2">
        <Label>Notifications IA</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
              notifMode === "realtime"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/40"
            )}
            onClick={() => onNotifModeChange("realtime")}
          >
            <Bell className={cn("h-5 w-5", notifMode === "realtime" ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs font-semibold">Temps réel</span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Dès qu'une réponse arrive
            </span>
          </button>

          <button
            type="button"
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
              notifMode === "scheduled"
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/40"
            )}
            onClick={() => onNotifModeChange("scheduled")}
          >
            <Clock className={cn("h-5 w-5", notifMode === "scheduled" ? "text-primary" : "text-muted-foreground")} />
            <span className="text-xs font-semibold">Planifié</span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              Résumé à une heure fixe
            </span>
          </button>
        </div>

        {notifMode === "scheduled" && (
          <div className="flex items-center gap-2">
            <Label className="shrink-0 text-xs">Heure de notification</Label>
            <input
              type="time"
              value={notifTime}
              onChange={(e) => onNotifTimeChange(e.target.value)}
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack} disabled={loading}>
          Retour
        </Button>
        <Button
          className="flex-1 gap-2"
          onClick={onSubmit}
          disabled={loading || !title.trim()}
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Plus className="h-4 w-4" />}
          Créer
        </Button>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export function NewObjectiveSheet({ open, onClose, onCreated }: NewObjectiveSheetProps) {
  const [step, setStep]           = useState<1 | 2>(1);
  const [preset, setPreset]       = useState<PresetKey | null>(null);
  const [title, setTitle]         = useState("");
  const [notifMode, setNotifMode] = useState<"realtime" | "scheduled">("realtime");
  const [notifTime, setNotifTime] = useState("18:00");

  const { mutateAsync, isPending } = useCreateThread();

  const resetAndClose = () => {
    setStep(1);
    setPreset(null);
    setTitle("");
    setNotifMode("realtime");
    setNotifTime("18:00");
    onClose();
  };

  const handleTopicSelected = (p: PresetKey) => {
    setPreset(p);
  };

  const handleNext = () => {
    if (!preset) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!preset || !title.trim()) return;
    try {
      const thread = await mutateAsync({
        title: title.trim(),
        preset_key: preset,
        notif_mode: notifMode,
        notif_time: notifMode === "scheduled" ? notifTime : null,
      });
      toast.success("Objectif créé !");
      onCreated?.(thread);
      resetAndClose();
    } catch {
      toast.error("Impossible de créer l'objectif. Réessaie.");
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={resetAndClose}
      title={step === 1 ? "Nouvel objectif" : "Détails"}
      description={
        step === 1
          ? "Choisis le thème de ton objectif"
          : "Personnalise ton objectif"
      }
      maxHeight="max-h-[85vh]"
    >
      {step === 1 ? (
        <StepTopics
          selected={preset}
          onSelect={handleTopicSelected}
          onNext={handleNext}
        />
      ) : (
        <StepDetails
          preset={preset!}
          title={title}
          onTitleChange={setTitle}
          notifMode={notifMode}
          onNotifModeChange={setNotifMode}
          notifTime={notifTime}
          onNotifTimeChange={setNotifTime}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
          loading={isPending}
        />
      )}
    </BottomSheet>
  );
}
