import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, ChevronDown, ChevronUp, Loader2, Check,
  User, Lock, Globe, Sliders, Bell, LogOut,
  Moon, Sun, Eye, EyeOff,
  GraduationCap, Briefcase, Search,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/auth/CountrySelect";
import {
  updateProfile, applyTheme, getTheme, requestPushPermission,
  getPushPermission, type ProfileUpdatePayload, type Theme,
} from "@/services/api/profile.api";
import { setLanguage } from "@/i18n";
import { cn } from "@/shared/lib/utils";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/shared/api/client";

// ── Accordion section ──────────────────────────────────────────────────────

interface SectionProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

function Section({ icon, title, children, defaultOpen = false }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0">
      <button
        className="flex w-full items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
        <span className="flex-1 text-left text-sm font-semibold">{title}</span>
        {open
          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t bg-muted/10 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Avatar initiales ────────────────────────────────────────────────────────

function AvatarDisplay({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
      {initials || "?"}
    </div>
  );
}

// ── Section Profil ─────────────────────────────────────────────────────────

const ROLES = [
  { value: "student",      label: "Étudiant(e)",        Icon: GraduationCap },
  { value: "professional", label: "Professionnel(le)",  Icon: Briefcase     },
  { value: "jobseeker",    label: "Chercheur d'emploi", Icon: Search        },
] as const;

function ProfileSection() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name:   profile?.first_name ?? "",
    last_name:    profile?.last_name  ?? "",
    gender:       profile?.gender     ?? "",
    birth_year:   profile?.birth_year?.toString() ?? "",
    country:      profile?.country    ?? "",
    city:         profile?.city       ?? "",
    primary_role: profile?.primary_role ?? "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: ProfileUpdatePayload = {
        first_name:   form.first_name   || null,
        last_name:    form.last_name    || null,
        gender:       form.gender       || null,
        birth_year:   form.birth_year ? parseInt(form.birth_year) : null,
        country:      form.country      || null,
        city:         form.city         || null,
        primary_role: (form.primary_role as ProfileUpdatePayload["primary_role"]) || null,
      };
      await updateProfile(payload);
      await refreshProfile();
      toast.success("Profil mis à jour !");
    } catch {
      toast.error("Impossible de sauvegarder le profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Prénom</Label>
          <Input
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            placeholder="Kofi"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nom</Label>
          <Input
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            placeholder="Mensah"
          />
        </div>
      </div>

      {/* Rôle */}
      <div className="space-y-1.5">
        <Label className="text-xs">Ton profil</Label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border py-2.5 px-2 text-xs font-medium transition-all",
                form.primary_role === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input hover:bg-muted/50 text-muted-foreground"
              )}
              onClick={() => setForm((f) => ({ ...f, primary_role: value }))}
            >
              <Icon className="h-4 w-4" />
              <span className="leading-tight text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div className="space-y-1.5">
        <Label className="text-xs">Genre</Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "male",   label: "Homme" },
            { value: "female", label: "Femme" },
            { value: "other",  label: "Autre" },
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
              onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Année de naissance */}
      <div className="space-y-1.5">
        <Label className="text-xs">Année de naissance</Label>
        <Input
          type="number"
          value={form.birth_year}
          onChange={(e) => setForm((f) => ({ ...f, birth_year: e.target.value }))}
          placeholder="2000"
          min={1950}
          max={new Date().getFullYear() - 14}
        />
      </div>

      {/* Pays */}
      <div className="space-y-1.5">
        <Label className="text-xs">Pays</Label>
        <CountrySelect
          value={form.country}
          onChange={(code) => setForm((f) => ({ ...f, country: code }))}
          placeholder="Sélectionner ton pays"
        />
      </div>

      {/* Ville */}
      <div className="space-y-1.5">
        <Label className="text-xs">Ville</Label>
        <Input
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          placeholder="Abidjan, Dakar…"
        />
      </div>

      <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Enregistrer le profil
      </Button>
    </div>
  );
}

// ── Section Compte (mot de passe) ─────────────────────────────────────────

function AccountSection() {
  const [showOld, setShowOld]     = useState(false);
  const [showNew, setShowNew]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm] = useState({ old: "", new: "", confirm: "" });

  const valid = form.old && form.new.length >= 8 && form.new === form.confirm;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    try {
      await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ old_password: form.old, new_password: form.new }),
      });
      toast.success("Mot de passe modifié !");
      setForm({ old: "", new: "", confirm: "" });
    } catch {
      toast.error("Impossible de modifier le mot de passe. Vérifie l'ancien.");
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({
    label, value, show, onToggle, placeholder, onChange,
  }: {
    label: string; value: string; show: boolean;
    onToggle: () => void; placeholder: string;
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onToggle}
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <PasswordInput
        label="Ancien mot de passe"
        value={form.old}
        show={showOld}
        onToggle={() => setShowOld((v) => !v)}
        placeholder="••••••••"
        onChange={(v) => setForm((f) => ({ ...f, old: v }))}
      />
      <PasswordInput
        label="Nouveau mot de passe (8 car. min)"
        value={form.new}
        show={showNew}
        onToggle={() => setShowNew((v) => !v)}
        placeholder="••••••••"
        onChange={(v) => setForm((f) => ({ ...f, new: v }))}
      />
      <div className="space-y-1.5">
        <Label className="text-xs">Confirmer le nouveau mot de passe</Label>
        <Input
          type="password"
          value={form.confirm}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          placeholder="••••••••"
          className={cn(form.confirm && form.new !== form.confirm && "border-destructive")}
        />
        {form.confirm && form.new !== form.confirm && (
          <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
        )}
      </div>
      <Button className="w-full" onClick={handleSave} disabled={!valid || saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Modifier le mot de passe"}
      </Button>
    </div>
  );
}

// ── Section Langue ─────────────────────────────────────────────────────────

function LanguageSection() {
  const { i18n } = useTranslation();
  const { refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleLanguageChange = async (lang: "fr" | "en") => {
    setSaving(true);
    setLanguage(lang);
    try {
      await updateProfile({ language: lang });
      await refreshProfile();
      toast.success(lang === "fr" ? "Langue changée en Français" : "Language changed to English");
    } catch {
      // Pas bloquant — la langue est déjà changée localement
    } finally {
      setSaving(false);
    }
  };

  const current = i18n.language as "fr" | "en";

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Langue de l'interface</p>
      <div className="grid grid-cols-2 gap-2">
        {([
          { code: "fr" as const, label: "🇫🇷 Français" },
          { code: "en" as const, label: "🇬🇧 English" },
        ] as const).map(({ code, label }) => (
          <button
            key={code}
            disabled={saving}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all",
              current === code
                ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                : "border-input hover:bg-muted/50"
            )}
            onClick={() => handleLanguageChange(code)}
          >
            {saving && current !== code
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : null}
            {label}
            {current === code && <Check className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section Préférences ────────────────────────────────────────────────────

function PreferencesSection() {
  const { profile, refreshProfile } = useAuth();
  const [theme, setTheme] = useState<Theme>(getTheme);
  const [interests, setInterests] = useState(profile?.preferred_content ?? "");
  const [saving, setSaving] = useState(false);

  const handleThemeToggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ preferred_content: interests || null });
      await refreshProfile();
      toast.success("Préférences sauvegardées !");
    } catch {
      toast.error("Impossible de sauvegarder");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Thème */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Thème</p>
          <p className="text-xs text-muted-foreground">
            {theme === "light" ? "Mode clair" : "Mode sombre"}
          </p>
        </div>
        <button
          onClick={handleThemeToggle}
          className={cn(
            "relative flex h-7 w-12 items-center rounded-full transition-colors",
            theme === "dark" ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform",
              theme === "dark" ? "translate-x-6" : "translate-x-1"
            )}
          >
            {theme === "dark"
              ? <Moon className="h-3 w-3 text-primary" />
              : <Sun className="h-3 w-3 text-amber-500" />}
          </span>
        </button>
      </div>

      {/* Centres d'intérêt */}
      <div className="space-y-1.5">
        <Label className="text-xs">Centres d'intérêt & contenu préféré</Label>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="Ex: entrepreneuriat, technologie, bourses internationales…"
          rows={3}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Enregistrer
      </Button>
    </div>
  );
}

// ── Section Notifications ─────────────────────────────────────────────────

function NotificationsSection() {
  const [permission, setPermission] = useState<NotificationPermission>(getPushPermission);
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    const result = await requestPushPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success("Notifications activées !");
    } else if (result === "denied") {
      toast.error("Notifications refusées. Active-les dans les paramètres du navigateur.");
    }
    setRequesting(false);
  };

  return (
    <div className="space-y-4">
      {/* Push browser */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-3.5">
        <div>
          <p className="text-sm font-medium">Notifications navigateur</p>
          <p className="text-xs text-muted-foreground">
            {permission === "granted"
              ? "✅ Activées"
              : permission === "denied"
              ? "❌ Bloquées (modifier dans le navigateur)"
              : "En attente d'autorisation"}
          </p>
        </div>
        {permission !== "granted" && permission !== "denied" && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRequestPermission}
            disabled={requesting}
          >
            {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activer"}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Les alertes WhatsApp sont configurées depuis tes objectifs.
      </p>
    </div>
  );
}

// ── Dialog de confirmation de déconnexion ────────────────────────────────

function LogoutConfirm({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-5 space-y-4 shadow-xl">
        <div className="text-center">
          <p className="font-bold">Se déconnecter ?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu devras te reconnecter pour accéder à Malayka.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── SettingsPanel principal ────────────────────────────────────────────────

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut]       = useState(false);

  // Bloquer le scroll quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ")
    || user?.email
    || "Mon compte";

  const role =
    profile?.primary_role === "student" ? "Étudiant(e)"
    : profile?.primary_role === "professional" ? "Professionnel(le)"
    : profile?.primary_role === "jobseeker" ? "Chercheur d'emploi"
    : null;

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel (slide depuis la droite) */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl",
          "max-w-sm",
          "animate-slide-in-right"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Paramètres"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="font-bold">Paramètres</span>
        </div>

        {/* Carte utilisateur */}
        <div className="flex items-center gap-4 border-b px-5 py-5">
          <AvatarDisplay name={fullName} />
          <div className="min-w-0">
            <p className="truncate font-bold">{fullName}</p>
            {role && <p className="text-sm text-muted-foreground">{role}</p>}
            <p className="truncate text-xs text-muted-foreground">
              {user?.phone ?? user?.email}
            </p>
          </div>
        </div>

        {/* Sections scrollables */}
        <div className="flex-1 overflow-y-auto">
          <Section icon={<User className="h-4 w-4" />} title="Profil" defaultOpen>
            <ProfileSection />
          </Section>
          <Section icon={<Lock className="h-4 w-4" />} title="Compte">
            <AccountSection />
          </Section>
          <Section icon={<Globe className="h-4 w-4" />} title="Langue">
            <LanguageSection />
          </Section>
          <Section icon={<Sliders className="h-4 w-4" />} title="Préférences">
            <PreferencesSection />
          </Section>
          <Section icon={<Bell className="h-4 w-4" />} title="Notifications">
            <NotificationsSection />
          </Section>
        </div>

        {/* Bouton déconnexion */}
        <div className="border-t px-5 py-4">
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </div>

      {/* Dialog de confirmation */}
      {logoutConfirm && (
        <LogoutConfirm
          onConfirm={handleLogout}
          onCancel={() => setLogoutConfirm(false)}
          loading={loggingOut}
        />
      )}
    </>
  );
}
