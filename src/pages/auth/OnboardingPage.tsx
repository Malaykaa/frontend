import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Lock, GraduationCap, Briefcase, Search, Eye, EyeOff, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepProgress } from "@/components/auth/StepProgress";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { OtpInput } from "@/components/auth/OtpInput";
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
  otp: string;
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

const TOTAL_STEPS = 7;

const GOAL_BY_ROLE: Record<Role, { label: string; icon: string; desc: string }> = {
  student: {
    label: "Études & Formation",
    icon: "🎓",
    desc: "Trouver des bourses, concours académiques et opportunités de formation.",
  },
  professional: {
    label: "Avancement de carrière",
    icon: "📈",
    desc: "Progresser dans ta carrière, trouver des formations et certifications.",
  },
  jobseeker: {
    label: "Trouver un emploi",
    icon: "💼",
    desc: "Identifier des offres, préparer ton CV et tes entretiens.",
  },
};

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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Ton numéro WhatsApp</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu recevras un code de vérification sur WhatsApp.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Numéro de téléphone</Label>
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
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le code"}
      </Button>
    </div>
  );
}

function StepOtp({
  data,
  onChange,
  onNext,
  onResend,
  loading,
  error,
}: {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onResend: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Vérification</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Entre le code à 6 chiffres envoyé au{" "}
          <span className="font-medium text-foreground">{data.phone}</span>
        </p>
      </div>

      <OtpInput
        value={data.otp}
        onChange={(val) => onChange({ otp: val })}
        error={error}
      />

      <Button
        className="w-full"
        size="lg"
        onClick={onNext}
        disabled={loading || data.otp.length !== 6}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Vérifier"}
      </Button>

      <button
        type="button"
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={onResend}
        disabled={loading}
      >
        Je n'ai pas reçu le code → <span className="text-primary font-medium">Renvoyer</span>
      </button>
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
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const valid = isPasswordValid(data.password);
  const match = data.password === confirm;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Crée ton mot de passe</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Il devra être solide pour protéger ton compte.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Mot de passe</Label>
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
          <Label>Confirmer le mot de passe</Label>
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
            <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
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
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continuer"}
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
  const canProceed = data.firstName.trim().length >= 2 && data.lastName.trim().length >= 2;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Comment tu t'appelles ?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pour personnaliser ton expérience avec Malayka.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Prénom *</Label>
          <Input
            autoFocus
            placeholder="Ex : Kofi"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && canProceed && onNext()}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Nom *</Label>
          <Input
            placeholder="Ex : Mensah"
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
        Continuer
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
  const roles: { value: Role; label: string; desc: string; Icon: typeof GraduationCap }[] = [
    {
      value: "student",
      label: "Étudiant(e)",
      desc: "Je suis en formation ou à l'université",
      Icon: GraduationCap,
    },
    {
      value: "professional",
      label: "Professionnel(le)",
      desc: "Je travaille et cherche à progresser",
      Icon: Briefcase,
    },
    {
      value: "jobseeker",
      label: "Chercheur d'emploi",
      desc: "Je cherche activement un poste",
      Icon: Search,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Ton profil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cela nous permet de personnaliser ton expérience.
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
        Continuer
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
  const role = data.role!;
  const goal = GOAL_BY_ROLE[role];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Ton objectif principal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Malayka va t'accompagner vers cet objectif.
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
        Cet objectif est déterminé par ton profil. Tu pourras en ajouter d'autres plus tard.
      </p>

      <Button className="w-full" size="lg" onClick={onNext}>
        C'est parti !
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
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 5 Mo");
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
          <h2 className="text-xl font-bold">Ton domaine d'études</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pour trouver les opportunités qui correspondent à ta filière.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Filière *</Label>
            <Input
              placeholder="Ex: Informatique, Médecine, Droit…"
              value={data.fieldOfStudy}
              onChange={(e) => onChange({ fieldOfStudy: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Niveau d'études *</Label>
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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terminer l'inscription"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Ton domaine professionnel</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pour des recommandations adaptées à ton secteur.
        </p>
      </div>

      <div className="space-y-4">
        {/* Domaine */}
        <div className="space-y-1.5">
          <Label>Domaine *</Label>
          <Input
            placeholder="Ex: Informatique, Marketing, Finance…"
            value={data.domain}
            onChange={(e) => onChange({ domain: e.target.value })}
          />
          {/* Suggestions */}
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

        {/* Poste actuel */}
        <div className="space-y-1.5">
          <Label>
            Poste actuel{" "}
            <span className="text-xs text-muted-foreground">(optionnel)</span>
          </Label>
          <Input
            placeholder="Ex: Développeur web, Commercial…"
            value={data.currentStatus}
            onChange={(e) => onChange({ currentStatus: e.target.value })}
          />
        </div>

        {/* Upload CV */}
        <div className="space-y-1.5">
          <Label>
            CV{" "}
            <span className="text-xs text-muted-foreground">(optionnel, PDF max 5 Mo)</span>
          </Label>

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
              <p className="text-sm text-muted-foreground">
                Glisse ton CV ici ou{" "}
                <span className="text-primary font-medium">clique pour choisir</span>
              </p>
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
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Terminer l'inscription"}
      </Button>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtpRegister, refreshProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<OnboardingData>({
    phone: "",
    country: DEFAULT_COUNTRY,
    otp: "",
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

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await sendOtp(data.phone);
      setStep(1);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Trop de tentatives. Attends 1 minute et réessaie.");
      } else if (err instanceof ApiError && err.status === 400) {
        setError("Numéro invalide. Vérifie le format (ex: +225 07 00 00 00).");
      } else {
        setError("Impossible d'envoyer le code. Vérifie ta connexion.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    // Le code est vérifié côté serveur lors de verify-otp-register
    // En dev : OTP_MOCK_ACCEPT_ANY=true → tout code 6 chiffres passe
    setStep(2);
  };

  const handleNameStep = () => {
    // Nom/prénom renseigné → passer au mot de passe
    setStep(3);
  };

  const handlePassword = async () => {
    setLoading(true);
    setError("");
    try {
      // Créer le compte avec OTP + mot de passe
      await verifyOtpRegister(data.phone, data.otp, data.password);

      // Avancer immédiatement — ne pas attendre les appels profile (peuvent être lents)
      setStep(4);

      // Sauvegarder nom + prénom en arrière-plan (non bloquant)
      void apiRequest("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: data.firstName.trim() || null,
          last_name:  data.lastName.trim()  || null,
        }),
      }).then(() => refreshProfile()).catch(() => null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Code OTP invalide ou expiré. Recommence depuis le début.");
        setStep(0);
      } else if (err instanceof ApiError && err.status === 409) {
        setError("Ce numéro est déjà enregistré. Va sur la page de connexion.");
      } else if (err instanceof ApiError && err.status === 408) {
        setError("La connexion est lente. Réessaie.");
      } else {
        setError("Erreur lors de la création du compte. Réessaie.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRole = () => setStep(5);

  const handleGoal = () => setStep(6);

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

      // Upload CV si fourni
      if (data.cvFile) {
        const form = new FormData();
        form.append("file", data.cvFile);
        await apiRequest("/files/upload", { method: "POST", body: form }).catch(() => null);
      }

      await refreshProfile();
      toast.success("Compte créé avec succès ! Bienvenue sur Malayka 🎉");
      navigate("/app", { replace: true });
    } catch {
      toast.error("Profil partiellement sauvegardé. Tu pourras compléter plus tard.");
      navigate("/app", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────

  const stepContent = [
    // 0 — Téléphone
    <StepPhone key={0} data={data} onChange={patch} onNext={handleSendOtp} loading={loading} error={error} />,
    // 1 — OTP
    <StepOtp key={1} data={data} onChange={patch} onNext={handleVerifyOtp} onResend={handleSendOtp} loading={loading} error={error} />,
    // 2 — Nom + Prénom  ← collectés AVANT la création du compte
    <StepPersonalInfo key={2} data={data} onChange={patch} onNext={handleNameStep} />,
    // 3 — Mot de passe  ← crée le compte + sauvegarde nom/prénom
    <StepPassword key={3} data={data} onChange={patch} onNext={handlePassword} loading={loading} error={error} />,
    // 4 — Profil (rôle)
    <StepRole key={4} data={data} onChange={patch} onNext={handleRole} />,
    // 5 — Objectif
    <StepGoal key={5} data={data} onNext={handleGoal} />,
    // 6 — Domaine
    <StepDomain key={6} data={data} onChange={patch} onNext={handleDomain} loading={loading} />,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barre de progression */}
      <StepProgress
        current={step}
        total={TOTAL_STEPS}
        onBack={step > 0 ? goBack : undefined}
      />

      {/* Logo centré */}
      <div className="flex justify-center py-4">
        <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
      </div>

      {/* Contenu de l'étape */}
      <main className="flex flex-1 flex-col px-6 py-4">
        <div className="mx-auto w-full max-w-sm animate-fade-in">
          {stepContent[step]}
        </div>
      </main>

      {/* Lien vers login */}
      {step === 0 && (
        <p className="pb-8 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <a href="/login" className="font-medium text-primary hover:underline">
            Se connecter
          </a>
        </p>
      )}
    </div>
  );
}
