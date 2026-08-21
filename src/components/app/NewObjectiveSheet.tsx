import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Briefcase, GraduationCap, Banknote, Trophy, FileText,
  Laptop, BookOpen, Compass, NotebookPen, Plus, Loader2, Check, Bell, Clock,
} from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/auth/CountrySelect";
import { TagInput } from "@/components/ui/tag-input";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateThread } from "@/hooks/queries/use-chat-threads";
import { updateProfile } from "@/services/api/profile.api";
import { isProfileComplete, isEnrichedProfileComplete } from "@/shared/lib/profile";
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
  { preset: "soutien_scolaire",       labelKey: "goals.topic_soutien_scolaire", phKey: "goals.ph_soutien_scolaire", Icon: NotebookPen, color: "bg-teal-100 text-teal-600" },
] as const;

type PresetKey = (typeof TOPICS_CONFIG)[number]["preset"];

interface NewObjectiveSheetProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (thread: ChatThread) => void;
}

// ── Étape 0 — Profil incomplet (bloque la création tant qu'il ne l'est pas) ─
//
// Les recherches d'opportunités dépendent de la localisation, de la
// nationalité (éligibilité de certaines bourses/appels), du genre et de
// l'âge (bourses avec plafond). Un profil incomplet produit un matching
// dégradé sans que l'utilisateur sache pourquoi — on lui demande donc de le
// compléter au moment précis où il en ressent le besoin : la création d'un
// objectif, qu'il s'agisse du premier ou d'un suivant.
interface CompleteProfileForm {
  country: string;
  city: string;
  nationality: string;
  gender: string;
  birth_year: string;
}

function StepCompleteProfile({
  form,
  onChange,
  onSubmit,
  loading,
}: {
  form: CompleteProfileForm;
  onChange: (patch: Partial<CompleteProfileForm>) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();

  const canSubmit =
    !!form.country && !!form.city.trim() && !!form.nationality && !!form.gender && !!form.birth_year;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.country")}</Label>
        <CountrySelect
          value={form.country}
          onChange={(code) => onChange({ country: code })}
          placeholder={t("settings.country_placeholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.city")}</Label>
        <Input
          value={form.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder={t("settings.city_placeholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.nationality")}</Label>
        <CountrySelect
          value={form.nationality}
          onChange={(code) => onChange({ nationality: code })}
          placeholder={t("settings.nationality_placeholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.gender")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "male",   label: t("settings.gender_male")   },
            { value: "female", label: t("settings.gender_female") },
            { value: "other",  label: t("settings.gender_other")  },
          ].map((g) => (
            <button
              key={g.value}
              type="button"
              className={cn(
                "rounded-lg border py-2 text-xs font-medium transition-all",
                form.gender === g.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted/50"
              )}
              onClick={() => onChange({ gender: g.value })}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.birth_year")}</Label>
        <Input
          type="number"
          value={form.birth_year}
          onChange={(e) => onChange({ birth_year: e.target.value })}
          placeholder="2000"
          min={1950}
          max={new Date().getFullYear() - 14}
        />
      </div>

      <Button className="w-full gap-2" onClick={onSubmit} disabled={loading || !canSubmit}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("goals.complete_profile_continue")}
      </Button>
    </div>
  );
}

// ── Étape 1 — Intérêts (skippable, cf. commentaire dans NewObjectiveSheet) ──
function StepInterests({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <TagInput value={value} onChange={onChange} placeholder={t("goals.interests_placeholder")} />

      <Button className="w-full gap-2" onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("common.next")}
      </Button>
    </div>
  );
}

// ── Étape 2 — Description libre (skippable) ─────────────────────────────────
function StepSelfDescription({
  value,
  onChange,
  onSubmit,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <textarea
        className="min-h-[140px] w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("goals.self_description_placeholder")}
        maxLength={4000}
      />

      <Button className="w-full gap-2" onClick={onSubmit} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("common.next")}
      </Button>
    </div>
  );
}

// ── Étape 3 — Choix du thème ───────────────────────────────────────────────
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
      <div className="grid grid-cols-2 gap-1.5">
        {TOPICS_CONFIG.map(({ preset, labelKey, Icon, color }) => {
          const label = t(labelKey);
          return (
          <button
            key={preset}
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-lg border bg-card px-2.5 py-2 text-left transition-all active:scale-[0.98]",
              selected === preset
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/30"
            )}
            onClick={() => onSelect(preset as PresetKey)}
          >
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded", color)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium leading-tight flex-1">{label}</span>
            {selected === preset && (
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
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

// ── Étape 4 — Titre + notifications ───────────────────────────────────────
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
      <div className={cn("flex items-center gap-2.5 rounded-lg p-2.5", topic.color.split(" ")[0] + "/10")}>
        <div className={cn("flex h-6 w-6 items-center justify-center rounded", topic.color)}>
          <topic.Icon className="h-3.5 w-3.5" />
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
          {loading ? t("goals.creating") : t("goals.create_btn")}
        </Button>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────
export function NewObjectiveSheet({ open, onClose, onCreated }: NewObjectiveSheetProps) {
  const [step, setStep]           = useState<0 | 1 | 2 | 3 | 4>(3);
  const [preset, setPreset]       = useState<PresetKey | null>(null);
  const [title, setTitle]         = useState("");
  const [notifMode, setNotifMode] = useState<"realtime" | "scheduled">("realtime");
  const [notifTime, setNotifTime] = useState("18:00");
  const [profileForm, setProfileForm] = useState<CompleteProfileForm>({
    country: "", city: "", nationality: "", gender: "", birth_year: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [interestsForm, setInterestsForm] = useState<string[]>([]);
  const [savingInterests, setSavingInterests] = useState(false);
  const [selfDescriptionForm, setSelfDescriptionForm] = useState("");
  const [savingSelfDescription, setSavingSelfDescription] = useState(false);
  const { t } = useTranslation();
  const { profile, refreshProfile } = useAuth();

  const { mutateAsync, isPending } = useCreateThread();

  // À chaque ouverture, réévaluer si le profil est complet — un profil
  // complété entre deux ouvertures (depuis Réglages) ne doit plus jamais
  // redemander cette étape. Le sheet reste monté en permanence (Radix Dialog
  // ne démonte pas ses enfants), d'où la réinitialisation explicite ici
  // plutôt qu'un simple état initial.
  //
  // `initializedRef` évite de refaire ce calcul à CHAQUE changement de
  // `profile` pendant que le sheet est ouvert : handleProfileSubmit/
  // handleInterestsSubmit appellent refreshProfile() puis avancent
  // manuellement setStep(n+1) — sans ce garde-fou, le profile qui vient de
  // changer redéclenchait cet effect, qui recalculait l'étape depuis zéro et
  // renvoyait l'utilisateur en arrière (ex: valider les intérêts renvoyait
  // sur l'étape intérêts, puisque self_description n'était pas encore rempli).
  // On ne réévalue donc qu'une fois par ouverture, pas à chaque soumission.
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      initializedRef.current = false;
      return;
    }
    if (initializedRef.current) return;
    if (!profile) return; // attend le chargement du profil avant de décider
    initializedRef.current = true;

    if (!isProfileComplete(profile)) {
      setProfileForm({
        country:     profile.country     ?? "",
        city:        profile.city        ?? "",
        nationality: profile.nationality ?? "",
        gender:      profile.gender      ?? "",
        birth_year:  profile.birth_year?.toString() ?? "",
      });
      setStep(0);
    } else if (!isEnrichedProfileComplete(profile)) {
      setInterestsForm(profile.interests ?? []);
      setSelfDescriptionForm(profile.self_description ?? "");
      setStep(1);
    } else {
      setStep(3);
    }
  }, [open, profile]);

  const resetAndClose = () => {
    setPreset(null);
    setTitle("");
    setNotifMode("realtime");
    setNotifTime("18:00");
    onClose();
  };

  const handleProfileFormChange = (patch: Partial<CompleteProfileForm>) => {
    setProfileForm((f) => ({ ...f, ...patch }));
  };

  const handleProfileSubmit = async () => {
    setSavingProfile(true);
    try {
      await updateProfile({
        country:     profileForm.country,
        city:        profileForm.city.trim(),
        nationality: profileForm.nationality,
        gender:      profileForm.gender,
        birth_year:  parseInt(profileForm.birth_year, 10),
      });
      await refreshProfile();
      setStep(1);
    } catch {
      toast.error(t("goals.complete_profile_error"));
    } finally {
      setSavingProfile(false);
    }
  };

  // Étapes intérêts/description : toujours envoyées telles quelles (même
  // vides) — c'est cette valeur non-nulle qui marque l'étape comme traitée
  // et l'empêche de réapparaître à la prochaine création d'objectif (cf.
  // isEnrichedProfileComplete). Pas de blocage sur le contenu : plus
  // personnel qu'un menu déroulant, on ne force pas le remplissage.
  const handleInterestsSubmit = async () => {
    setSavingInterests(true);
    try {
      await updateProfile({ interests: interestsForm });
      await refreshProfile();
      setStep(2);
    } catch {
      toast.error(t("goals.complete_profile_error"));
    } finally {
      setSavingInterests(false);
    }
  };

  const handleSelfDescriptionSubmit = async () => {
    setSavingSelfDescription(true);
    try {
      await updateProfile({ self_description: selfDescriptionForm.trim() });
      await refreshProfile();
      setStep(3);
    } catch {
      toast.error(t("goals.complete_profile_error"));
    } finally {
      setSavingSelfDescription(false);
    }
  };

  const handleTopicSelected = (p: PresetKey) => {
    setPreset(p);
  };

  const handleNext = () => {
    if (!preset) return;
    setStep(4);
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

  const titles = {
    0: t("goals.complete_profile_title"),
    1: t("goals.interests_title"),
    2: t("goals.self_description_title"),
    3: t("goals.new_goal_title"),
    4: t("goals.sheet_details_title"),
  } as const;
  const descriptions = {
    0: t("goals.complete_profile_subtitle"),
    1: t("goals.interests_subtitle"),
    2: t("goals.self_description_subtitle"),
    3: t("goals.sheet_choose_hint"),
    4: t("goals.sheet_details_hint"),
  } as const;

  return (
    <BottomSheet
      open={open}
      onClose={resetAndClose}
      title={titles[step]}
      description={descriptions[step]}
      maxHeight="max-h-[85vh]"
      locked={isPending || savingProfile || savingInterests || savingSelfDescription}
    >
      {step === 0 ? (
        <StepCompleteProfile
          form={profileForm}
          onChange={handleProfileFormChange}
          onSubmit={handleProfileSubmit}
          loading={savingProfile}
        />
      ) : step === 1 ? (
        <StepInterests
          value={interestsForm}
          onChange={setInterestsForm}
          onSubmit={handleInterestsSubmit}
          loading={savingInterests}
        />
      ) : step === 2 ? (
        <StepSelfDescription
          value={selfDescriptionForm}
          onChange={setSelfDescriptionForm}
          onSubmit={handleSelfDescriptionSubmit}
          loading={savingSelfDescription}
        />
      ) : step === 3 ? (
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
          onBack={() => setStep(3)}
          onSubmit={handleSubmit}
          loading={isPending}
        />
      )}
    </BottomSheet>
  );
}
