import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpInput } from "@/components/auth/OtpInput";
import { PasswordStrength, isPasswordValid } from "@/components/auth/PasswordStrength";
import { StepProgress } from "@/components/auth/StepProgress";
import { DEFAULT_COUNTRY, type Country } from "@/shared/data/countries";
import { apiRequest, ApiError } from "@/shared/api/client";
import { cn } from "@/shared/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

type Step = "phone" | "otp" | "password" | "success";

interface State {
  phone: string;
  country: Country;
  otp: string;
  newPassword: string;
}

// ── Constantes ─────────────────────────────────────────────────────────────

const RESEND_COOLDOWN = 60; // secondes
const TOTAL_STEPS = 3; // phone=0, otp=1, password=2 (success n'est pas compté)

const STEP_INDEX: Record<Step, number> = {
  phone: 0,
  otp: 1,
  password: 2,
  success: 3,
};

// ── Étape 1 : Numéro de téléphone ──────────────────────────────────────────

function StepPhone({
  state,
  onChange,
  onNext,
  loading,
  error,
}: {
  state: State;
  onChange: (p: Partial<State>) => void;
  onNext: () => void;
  loading: boolean;
  error: string;
}) {
  const { t } = useTranslation();
  const canSubmit = state.phone.replace(/\D/g, "").length >= 8;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("forgot_password.step_phone_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("forgot_password.step_phone_hint")}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>{t("onboarding.phone_label")}</Label>
        <PhoneInput
          value={state.phone}
          defaultCountry={state.country}
          onChange={(fullNumber, country) => onChange({ phone: fullNumber, country })}
          error={error}
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={loading || !canSubmit}
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : t("forgot_password.send_code")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {t("forgot_password.remembered_password")}{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          {t("auth.login")}
        </Link>
      </p>
    </div>
  );
}

// ── Étape 2 : Code OTP ─────────────────────────────────────────────────────

function StepOtp({
  state,
  onChange,
  onNext,
  onResend,
  loading,
  error,
}: {
  state: State;
  onChange: (p: Partial<State>) => void;
  onNext: () => void;
  onResend: () => void;
  loading: boolean;
  error: string;
}) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resendLoading, setResendLoading] = useState(false);

  // Décompte pour le bouton "Renvoyer"
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
      setCountdown(RESEND_COOLDOWN);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("forgot_password.step_otp_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("forgot_password.step_otp_hint", { phone: state.phone })}
        </p>
      </div>

      <OtpInput
        value={state.otp}
        onChange={(val) => onChange({ otp: val })}
        error={error}
      />

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={loading || state.otp.length !== 6}
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : t("onboarding.verify_otp")}
      </Button>

      {/* Renvoyer avec cooldown */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("forgot_password.resend_in", { seconds: countdown })}
          </p>
        ) : (
          <button
            type="button"
            className="text-sm text-primary hover:underline disabled:opacity-50"
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading
              ? <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
              : null}
            {t("onboarding.resend_code")}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Étape 3 : Nouveau mot de passe ─────────────────────────────────────────

function StepPassword({
  state,
  onChange,
  onNext,
  loading,
  error,
}: {
  state: State;
  onChange: (p: Partial<State>) => void;
  onNext: () => void;
  loading: boolean;
  error: string;
}) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const valid = isPasswordValid(state.newPassword);
  const match = state.newPassword === confirm && confirm.length > 0;
  const canSubmit = valid && match;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">{t("forgot_password.step_password_title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("forgot_password.step_password_hint")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Nouveau mot de passe */}
        <div className="space-y-1.5">
          <Label>{t("forgot_password.new_password")}</Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              placeholder="••••••••"
              value={state.newPassword}
              onChange={(e) => onChange({ newPassword: e.target.value })}
              className="pr-10"
              autoFocus
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
          {state.newPassword && <PasswordStrength password={state.newPassword} />}
        </div>

        {/* Confirmer */}
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
        disabled={loading || !canSubmit}
      >
        {loading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : t("forgot_password.confirm_reset")}
      </Button>
    </div>
  );
}

// ── Étape 4 : Succès ───────────────────────────────────────────────────────

function StepSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/login", { replace: true });
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">{t("forgot_password.success_title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("forgot_password.success_hint")}
        </p>
      </div>

      <Button className="w-full" size="lg" onClick={() => navigate("/login", { replace: true })}>
        {t("forgot_password.go_to_login")}
      </Button>

      <p className="text-xs text-muted-foreground">
        {t("forgot_password.auto_redirect", { seconds: countdown })}
      </p>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [state, setState] = useState<State>({
    phone: "",
    country: DEFAULT_COUNTRY,
    otp: "",
    newPassword: "",
  });

  const patch = useCallback((p: Partial<State>) => {
    setState((s) => ({ ...s, ...p }));
    setError("");
  }, []);

  const goBack = () => {
    setError("");
    if (step === "otp") setStep("phone");
    else if (step === "password") setStep("otp");
  };

  // ── Envoi OTP ──────────────────────────────────────────────────────────

  const sendOtp = async (): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ phone: state.phone }),
        skipAuth: true,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        throw new Error(t("onboarding.error_too_many"));
      }
      if (err instanceof ApiError && err.status === 400) {
        throw new Error(t("onboarding.error_invalid_phone"));
      }
      throw new Error(t("onboarding.error_send_otp"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp();
      setStep("otp");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // ── Vérification OTP — côté frontend uniquement, pas d'appel backend ──
  // La vérification réelle se fait à l'étape reset-password.
  // On avance directement vers la saisie du mot de passe.

  const handleVerifyOtp = () => {
    setError("");
    setStep("password");
  };

  // ── Reset mot de passe ─────────────────────────────────────────────────

  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          phone: state.phone,
          code: state.otp,
          new_password: state.newPassword,
        }),
        skipAuth: true,
      });
      setStep("success");
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        // OTP invalide ou expiré → on renvoie l'utilisateur à l'étape OTP
        setStep("otp");
        setState((s) => ({ ...s, otp: "" }));
        setError(t("forgot_password.error_invalid_code"));
      } else if (err instanceof ApiError && err.status === 429) {
        setError(t("onboarding.error_too_many"));
      } else {
        setError(t("errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ──────────────────────────────────────────────────────────────

  const showBack = step === "otp" || step === "password";
  const stepIndex = STEP_INDEX[step];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header avec progression */}
      <StepProgress
        current={stepIndex}
        total={TOTAL_STEPS}
        onBack={showBack ? goBack : undefined}
      />

      {/* Logo */}
      <div className="flex justify-center py-4">
        <Link to="/">
          <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
        </Link>
      </div>

      <main className="flex flex-1 flex-col px-6 py-4">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          {step === "phone" && (
            <StepPhone
              state={state}
              onChange={patch}
              onNext={handleSendOtp}
              loading={loading}
              error={error}
            />
          )}
          {step === "otp" && (
            <StepOtp
              state={state}
              onChange={patch}
              onNext={handleVerifyOtp}
              onResend={sendOtp}
              loading={loading}
              error={error}
            />
          )}
          {step === "password" && (
            <StepPassword
              state={state}
              onChange={patch}
              onNext={handleResetPassword}
              loading={loading}
              error={error}
            />
          )}
          {step === "success" && <StepSuccess />}
        </div>
      </main>
    </div>
  );
}
