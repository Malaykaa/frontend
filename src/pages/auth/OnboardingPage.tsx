import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Lock, GraduationCap, Briefcase, Search, Eye, EyeOff, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProgress } from "@/components/auth/StepProgress";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { PasswordStrength, isPasswordValid } from "@/components/auth/PasswordStrength";
import { STUDY_LEVELS, DOMAIN_SUGGESTIONS, DEFAULT_COUNTRY, type Country } from "@/shared/data/countries";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/shared/api/client";
import { ApiError } from "@/shared/api/client";
import { cn } from "@/shared/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────
type Role = "student" | "professional" | "jobseeker";

interface OnboardingData {
  phone: string;
  country: Country;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthYear: string;
  countryCode: string;
  city: string;
  role: Role | null;
  domain: string;
  fieldOfStudy: string;
  studyLevel: string;
  currentStatus: string;
  cvFile: File | null;
}

const TOTAL_STEPS = 6;

// ── Composants d'étapes ────────────────────────────────────────────────────

function StepPhone({
  data,
  onChange,
  onNext,
  loading,
  error,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  loading: boolean;
  error: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.step_phone")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.phone_hint")}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>{t("onboarding.phone_label")}</Label>
        <PhoneInput
          value={data.phone}
          defaultCountry={data.country}
          onChange={(fullNumber, country) =>
            onChange({ phone: fullNumber, country })
          }
          error={error}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={loading || data.phone.replace(/\D/g, "").length < 8}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("onboarding.continue")}
      </Button>
    </div>
  );
}

function StepPassword({
  data,
  onChange,
  onNext,
  loading,
  error,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  loading: boolean;
  error: string;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const valid = isPasswordValid(data.password);
  const match = data.password === confirm;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.create_password_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.create_password_hint")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t("onboarding.create_password")}</Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShow((v) => !v)}
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {data.password && <PasswordStrength password={data.password} />}

        <div className="space-y-1.5">
          <Label>{t("onboarding.confirm_password")}</Label>
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={cn("pr-10", confirm && !match && "border-destructive")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirm && !match && (
            <p className="text-xs text-destructive">{t("onboarding.passwords_mismatch")}</p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
          {error}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={loading || !valid || !match || !confirm}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("onboarding.continue")}
      </Button>
    </div>
  );
}

function StepPersonalInfo({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const canProceed = data.firstName.trim().length >= 2 && data.lastName.trim().length >= 2;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.name_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.name_hint")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t("onboarding.first_name")} *</Label>
          <Input
            autoFocus
            placeholder={t("onboarding.first_name_placeholder")}
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && canProceed && onNext()}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("onboarding.last_name")} *</Label>
          <Input
            placeholder={t("onboarding.last_name_placeholder")}
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && canProceed && onNext()}
            className="h-12 text-base"
          />
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={!canProceed}
      >
        {t("onboarding.continue")}
      </Button>
    </div>
  );
}

function StepRole({
  data,
  onChange,
  onNext,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  const roles: { value: Role; label: string; desc: string; Icon: typeof GraduationCap }[] = [
    { value: "student",      label: t("onboarding.role_student"),      desc: t("onboarding.role_student_hint"),      Icon: GraduationCap },
    { value: "professional", label: t("onboarding.role_professional"), desc: t("onboarding.role_professional_hint"), Icon: Briefcase     },
    { value: "jobseeker",    label: t("onboarding.role_jobseeker"),    desc: t("onboarding.role_jobseeker_hint"),    Icon: Search        },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.role_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.role_hint")}
        </p>
      </div>

      <div className="space-y-3">
        {roles.map(({ value, label, desc, Icon }) => (
          <button
            key={value}
            type="button"
            className={cn(
              "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
              data.role === value
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/30"
            )}
            onClick={() => onChange({ role: value })}
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                data.role === value ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            {data.role === value && (
              <Check className="ml-auto h-5 w-5 shrink-0 text-primary" />
            )}
          </button>
        ))}
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={!data.role}
      >
        {t("onboarding.continue")}
      </Button>
    </div>
  );
}

function StepGoal({
  data,
  onNext,
}: {
  data: OnboardingData;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const role = data.role!;

  const GOAL_BY_ROLE: Record<Role, { label: string; icon: string; desc: string }> = {
    student:      { label: t("onboarding.goal_studies"),  icon: "🎓", desc: t("onboarding.goal_studies_hint")  },
    professional: { label: t("onboarding.goal_career"),   icon: "📈", desc: t("onboarding.goal_career_hint")   },
    jobseeker:    { label: t("onboarding.goal_job"),      icon: "💼", desc: t("onboarding.goal_job_hint")      },
  };

  const goal = GOAL_BY_ROLE[role];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.goal_title_label")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.goal_hint_text")}
        </p>
      </div>

      <div className="rounded-xl border-2 border-primary bg-primary/5 p-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon}</span>
          <div className="flex-1">
            <p className="font-bold">{goal.label}</p>
            <p className="text-sm text-muted-foreground">{goal.desc}</p>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        {t("onboarding.goal_note")}
      </p>

      <Button className="w-full" size="lg" onClick={onNext}>
        {t("onboarding.go")}
      </Button>
    </div>
  );
}

function StepDomain({
  data,
  onChange,
  onNext,
  loading,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error(t("onboarding.error_pdf_only"));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("onboarding.error_file_size"));
      return;
    }
    onChange({ cvFile: file });
  };

  const canProceed =
    data.role === "student"
      ? data.fieldOfStudy.trim() && data.studyLevel
      : data.domain.trim();

  if (data.role === "student") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">{t("onboarding.domain_student_title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("onboarding.domain_student_hint")}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t("onboarding.field_label")} *</Label>
            <Input
              placeholder={t("onboarding.field_placeholder")}
              value={data.fieldOfStudy}
              onChange={(e) => onChange({ fieldOfStudy: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("onboarding.level_label")} *</Label>
            <div className="grid grid-cols-2 gap-2">
              {STUDY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={cn(
                    "rounded-lg border py-2.5 text-sm font-medium transition-all",
                    data.studyLevel === level.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:bg-muted/50"
                  )}
                  onClick={() => onChange({ studyLevel: level.value })}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={onNext} disabled={!canProceed || loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("onboarding.finish")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("onboarding.domain_pro_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("onboarding.domain_pro_hint")}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t("onboarding.domain_label")} *</Label>
          <Input
            placeholder={t("onboarding.domain_placeholder")}
            value={data.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
          />
          {!data.domain && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {DOMAIN_SUGGESTIONS.slice(0, 6).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="rounded-full border border-input bg-background px-2.5 py-1 text-xs hover:bg-muted/50 transition-colors"
                  onClick={() => onChange({ domain: s })}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>{t("onboarding.status_label")}</Label>
          <Input
            placeholder={t("onboarding.status_placeholder")}
            value={data.currentStatus}
            onChange={(e) => onChange({ currentStatus: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label>{t("onboarding.cv_label")}</Label>

          {data.cvFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
              <Upload className="h-4 w-4 text-primary" />
              <span className="flex-1 truncate text-sm font-medium">{data.cvFile.name}</span>
              <button
                type="button"
                onClick={() => onChange({ cvFile: null })}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-5 text-center transition-colors",
                dragOver ? "border-primary bg-primary/5" : "border-input hover:border-primary/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: t("onboarding.cv_drag"),
                }}
              />
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          )}
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={onNext} disabled={!canProceed || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("onboarding.finish")}
      </Button>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { registerPhone, refreshProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<OnboardingData>({
    phone: "",
    country: DEFAULT_COUNTRY,
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthYear: "",
    countryCode: DEFAULT_COUNTRY.code,
    city: "",
    role: null,
    domain: "",
    fieldOfStudy: "",
    studyLevel: "",
    currentStatus: "",
    cvFile: null,
  });

  const patch = useCallback(
    (p: Partial<OnboardingData>) => setData((d) => ({ ...d, ...p })),
    []
  );

  const goBack = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  // ── Handlers par étape ──────────────────────────────────────────────────

  const handlePhoneNext = async () => {
    setLoading(true);
    setError("");
    try {
      // Vérifier si le numéro est déjà enregistré avant de continuer.
      // Évite d'engager l'utilisateur dans toute l'inscription pour apprendre
      // au bout que son numéro existe déjà.
      const { exists } = await apiRequest<{ exists: boolean }>("/auth/check-phone", {
        method: "POST",
        body: JSON.stringify({ phone: data.phone }),
        skipAuth: true,
      });
      if (exists) {
        setError(t("onboarding.error_phone_exists"));
        return;
      }

      setStep(1);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError(t("onboarding.error_too_many"));
      } else if (err instanceof ApiError && err.status === 400) {
        setError(t("onboarding.error_invalid_phone"));
      } else {
        setError(t("onboarding.error_send_otp"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNameStep = () => {
    setStep(2);
  };

  const handlePassword = async () => {
    setLoading(true);
    setError("");
    try {
      await registerPhone(data.phone, data.password, {
        first_name: data.firstName.trim() || undefined,
        last_name: data.lastName.trim() || undefined,
      });

      setStep(3);
      void refreshProfile().catch(() => null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(t("onboarding.error_phone_exists"));
        setStep(0);
      } else if (err instanceof ApiError && err.status === 408) {
        setError(t("onboarding.error_slow_connection"));
      } else {
        setError(t("onboarding.error_create_account"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRole = () => setStep(4);

  const handleGoal = () => setStep(5);

  const handleDomain = async () => {
    setLoading(true);
    try {
      const profilePatch: Record<string, unknown> = {
        primary_role: data.role,
        domain: data.role === "student" ? null : data.domain || null,
        field_of_study: data.role === "student" ? data.fieldOfStudy : null,
        current_status: data.studyLevel || data.currentStatus || null,
      };

      await apiRequest("/profile", {
        method: "PATCH",
        body: JSON.stringify(profilePatch),
      });

      if (data.cvFile) {
        const form = new FormData();
        form.append("file", data.cvFile);
        await apiRequest("/files/upload", { method: "POST", body: form }).catch(() => null);
      }

      await refreshProfile();
      toast.success(t("onboarding.success_account_created"));
      navigate("/app", { replace: true });
    } catch {
      toast.error(t("onboarding.profile_partial"));
      navigate("/app", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────

  const stepContent = [
    <StepPhone key={0} data={data} onChange={patch} onNext={handlePhoneNext} loading={loading} error={error} />,
    <StepPersonalInfo key={1} data={data} onChange={patch} onNext={handleNameStep} />,
    <StepPassword key={2} data={data} onChange={patch} onNext={handlePassword} loading={loading} error={error} />,
    <StepRole key={3} data={data} onChange={patch} onNext={handleRole} />,
    <StepGoal key={4} data={data} onNext={handleGoal} />,
    <StepDomain key={5} data={data} onChange={patch} onNext={handleDomain} loading={loading} />,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StepProgress
        current={step}
        total={TOTAL_STEPS}
        onBack={step > 0 ? goBack : undefined}
      />

      <div className="flex justify-center py-4">
        <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
      </div>

      <main className="flex flex-1 flex-col px-6 py-4">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          {stepContent[step]}
        </div>
      </main>

      {step === 0 && (
        <p className="pb-8 text-center text-sm text-muted-foreground">
          <a href="/login" className="font-medium text-primary hover:underline">
            {t("onboarding.have_account_login")}
          </a>
        </p>
      )}
    </div>
  );
}
