import { useState } from "react";
import { useTranslation } from "react-i18next";
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

// ── Thèmes disponibles — labels et placeholders via i18n ───────────────────
const TOPICS_CONFIG = [
  { preset: "stage_emploi",           labelKey: "goals.topic_stage",        phKey: "goals.ph_stage",        Icon: Briefcase,     color: "bg-blue-100 text-blue-600"     },
  { preset: "bourse_etudes",          labelKey: "goals.topic_bourse",       phKey: "goals.ph_bourse",       Icon: GraduationCap, color: "bg-violet-100 text-violet-600"  },
  { preset: "subvention_financement", labelKey: "goals.topic_financement",  phKey: "goals.ph_financement",  Icon: Banknote,      color: "bg-emerald-100 text-emerald-600"},
  { preset: "prepa_exam",             labelKey: "goals.topic_exam",         phKey: "goals.ph_exam",         Icon: Trophy,        color: "bg-amber-100 text-amber-600"   },
  { preset: "appel_offres",           labelKey: "goals.topic_appel_offres", phKey: "goals.ph_appel_offres", Icon: FileText,      color: "bg-orange-100 text-orange-600" },
  { preset: "missions_freelance",     labelKey: "goals.topic_freelance",    phKey: "goals.ph_freelance",    Icon: Laptop,        color: "bg-pink-100 text-pink-600"     },
  { preset: "appels_projet",          labelKey: "goals.topic_appels_projet",phKey: "goals.ph_appels_projet",Icon: BookOpen,      color: "bg-sky-100 text-sky-600"       },
  { preset: "orientation_carriere",   labelKey: "goals.topic_orientation",  phKey: "goals.ph_orientation",  Icon: Compass,       color: "bg-rose-100 text-rose-600"     },
] as const;

type PresetKey = (typeof TOPICS_CONFIG)[number]["preset"];

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
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {TOPICS_CONFIG.map(({ preset, labelKey, Icon, color }) => {
          const label = t(labelKey);
          return (
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
          );
        })}
      </div>

      <Button
        className="w-full"
        onClick={onNext}
        disabled={!selected}
      >
        {t("common.next")}
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
  const { t } = useTranslation();
  const topic = TOPICS_CONFIG.find((tp) => tp.preset === preset)!;

  return (
    <div className="space-y-5">
      <div className={cn("flex items-center gap-2.5 rounded-xl p-3", topic.color.split(" ")[0] + "/10")}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", topic.color)}>
          <topic.Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold">{t(topic.labelKey)}</span>
        <button
          type="button"
          className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={onBack}
        >
          {t("goals.change")}
        </button>
      </div>

      <div className="space-y-1.5">
        <Label>{t("goals.title_label")}</Label>
        <Input
          autoFocus
          placeholder={t(topic.phKey)}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={80}
        />
        <p className="text-right text-xs text-muted-foreground">{title.length}/80</p>
      </div>

      <div className="space-y-2">
        <Label>{t("goals.notif_ia")}</Label>
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
            <span className="text-xs font-semibold">{t("goals.notif_realtime")}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {t("goals.notif_realtime_hint")}
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
            <span className="text-xs font-semibold">{t("goals.notif_scheduled")}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {t("goals.notif_scheduled_hint")}
            </span>
          </button>
        </div>

        {notifMode === "scheduled" && (
          <div className="flex items-center gap-2">
            <Label className="shrink-0 text-xs">{t("goals.notif_time")}</Label>
            <input
              type="time"
              value={notifTime}
              onChange={(e) => onNotifTimeChange(e.target.value)}
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onBack} disabled={loading}>
          {t("common.back")}
        </Button>
        <Button
          className="flex-1 gap-2"
          onClick={onSubmit}
          disabled={loading || !title.trim()}
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Plus className="h-4 w-4" />}
          {t("goals.create_btn")}
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
  const { t } = useTranslation();

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
      toast.success(t("goals.create_success"));
      onCreated?.(thread);
      resetAndClose();
    } catch {
      toast.error(t("goals.create_error"));
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={resetAndClose}
      title={step === 1 ? t("goals.new_goal_title") : t("goals.sheet_details_title")}
      description={
        step === 1
          ? t("goals.sheet_choose_hint")
          : t("goals.sheet_details_hint")
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
