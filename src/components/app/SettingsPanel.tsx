import { useState, useCallback, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  X, ChevronDown, ChevronUp, Loader2, Check,
  User, Lock, Globe, Sliders, Bell, LogOut, Trash2, AlertTriangle,
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
  getPushPermission, deleteAccount, type ProfileUpdatePayload, type Theme,
} from "@/services/api/profile.api";
import { setLanguage } from "@/i18n";
import { cn } from "@/shared/lib/utils";
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

function ProfileSection() {
  const { t } = useTranslation();
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

  const ROLES = [
    { value: "student",      label: t("onboarding.role_student"),      Icon: GraduationCap },
    { value: "professional", label: t("onboarding.role_professional"), Icon: Briefcase     },
    { value: "jobseeker",    label: t("onboarding.role_jobseeker"),    Icon: Search        },
  ] as const;

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
      toast.success(t("settings.profile_saved"));
    } catch {
      toast.error(t("settings.profile_save_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">{t("settings.first_name")}</Label>
          <Input
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            placeholder={t("onboarding.first_name_placeholder")}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">{t("settings.last_name")}</Label>
          <Input
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            placeholder={t("onboarding.last_name_placeholder")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.your_profile")}</Label>
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
              onClick={() => setForm((f) => ({ ...f, gender: g.value }))}
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
          onChange={(e) => setForm((f) => ({ ...f, birth_year: e.target.value }))}
          placeholder="2000"
          min={1950}
          max={new Date().getFullYear() - 14}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.country")}</Label>
        <CountrySelect
          value={form.country}
          onChange={(code) => setForm((f) => ({ ...f, country: code }))}
          placeholder={t("settings.country_placeholder")}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.city")}</Label>
        <Input
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          placeholder={t("settings.city_placeholder")}
        />
      </div>

      <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("settings.save_profile")}
      </Button>
    </div>
  );
}

// ── Section Compte (mot de passe) ─────────────────────────────────────────

function AccountSection() {
  const { t } = useTranslation();
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
      toast.success(t("settings.password_changed"));
      setForm({ old: "", new: "", confirm: "" });
    } catch {
      toast.error(t("settings.password_change_error"));
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
        label={t("settings.old_password")}
        value={form.old}
        show={showOld}
        onToggle={() => setShowOld((v) => !v)}
        placeholder="••••••••"
        onChange={(v) => setForm((f) => ({ ...f, old: v }))}
      />
      <PasswordInput
        label={t("settings.new_password")}
        value={form.new}
        show={showNew}
        onToggle={() => setShowNew((v) => !v)}
        placeholder="••••••••"
        onChange={(v) => setForm((f) => ({ ...f, new: v }))}
      />
      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.confirm_new_password")}</Label>
        <Input
          type="password"
          value={form.confirm}
          onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
          placeholder="••••••••"
          className={cn(form.confirm && form.new !== form.confirm && "border-destructive")}
        />
        {form.confirm && form.new !== form.confirm && (
          <p className="text-xs text-destructive">{t("onboarding.passwords_mismatch")}</p>
        )}
      </div>
      <Button className="w-full" onClick={handleSave} disabled={!valid || saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.change_password")}
      </Button>
    </div>
  );
}

// ── Section Langue ─────────────────────────────────────────────────────────

function LanguageSection() {
  const { t, i18n } = useTranslation();
  const { refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleLanguageChange = async (lang: "fr" | "en") => {
    setSaving(true);
    setLanguage(lang);
    try {
      await updateProfile({ language: lang });
      await refreshProfile();
      toast.success(lang === "fr" ? t("settings.language_changed_fr") : t("settings.language_changed_en"));
    } catch {
      // Not blocking — language is already changed locally
    } finally {
      setSaving(false);
    }
  };

  const current = i18n.language as "fr" | "en";

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">{t("settings.interface_language")}</p>
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
  const { t } = useTranslation();
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
      toast.success(t("settings.preferences_saved"));
    } catch {
      toast.error(t("settings.preferences_save_error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t("settings.theme")}</p>
          <p className="text-xs text-muted-foreground">
            {theme === "light" ? t("settings.theme_light") : t("settings.theme_dark")}
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

      <div className="space-y-1.5">
        <Label className="text-xs">{t("settings.interests")}</Label>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder={t("settings.interests_placeholder")}
          rows={3}
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <Button className="w-full gap-2" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {t("settings.save_btn")}
      </Button>
    </div>
  );
}

// ── Section Notifications ─────────────────────────────────────────────────

function NotificationsSection() {
  const { t } = useTranslation();
  const [permission, setPermission] = useState<NotificationPermission>(getPushPermission);
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    const result = await requestPushPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success(t("settings.notif_enabled_toast"));
    } else if (result === "denied") {
      toast.error(t("settings.notif_denied_toast"));
    }
    setRequesting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border bg-card p-3.5">
        <div>
          <p className="text-sm font-medium">{t("settings.browser_notifications")}</p>
          <p className="text-xs text-muted-foreground">
            {permission === "granted"
              ? t("settings.notif_enabled")
              : permission === "denied"
              ? t("settings.notif_blocked")
              : t("settings.notif_pending")}
          </p>
        </div>
        {permission !== "granted" && permission !== "denied" && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRequestPermission}
            disabled={requesting}
          >
            {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.notif_enable_btn")}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {t("settings.notif_whatsapp_hint")}
      </p>
    </div>
  );
}

// ── Dialog de confirmation de suppression de compte ─────────────────────

function DeleteAccountConfirm({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <p className="font-bold text-destructive">{t("settings.delete_account_title")}</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("settings.delete_account_warning")}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {t("settings.delete_account_confirm")}
          </Button>
        </div>
      </div>
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
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-background p-5 space-y-4 shadow-xl">
        <div className="text-center">
          <p className="font-bold">{t("settings.logout_title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("settings.logout_hint")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            {t("settings.logout")}
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm]         = useState(false);
  const [loggingOut, setLoggingOut]               = useState(false);
  const [deleteConfirm, setDeleteConfirm]         = useState(false);
  const [deletingAccount, setDeletingAccount]     = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ")
    || user?.email
    || t("settings.my_account");

  const role =
    profile?.primary_role === "student"      ? t("onboarding.role_student")
    : profile?.primary_role === "professional" ? t("onboarding.role_professional")
    : profile?.primary_role === "jobseeker"    ? t("onboarding.role_jobseeker")
    : null;

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  const handleDeleteAccount = useCallback(async () => {
    setDeletingAccount(true);
    try {
      await deleteAccount();
      toast.success(t("settings.delete_account_success"));
      await logout();
      navigate("/", { replace: true });
    } catch {
      toast.error(t("common.error"));
      setDeletingAccount(false);
      setDeleteConfirm(false);
    }
  }, [logout, navigate, t]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-background shadow-2xl",
          "max-w-sm",
          "animate-slide-in-right"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t("settings.title")}
      >
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="font-bold">{t("settings.title")}</span>
        </div>

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

        <div className="flex-1 overflow-y-auto">
          <Section icon={<User className="h-4 w-4" />} title={t("settings.profile")} defaultOpen>
            <ProfileSection />
          </Section>
          <Section icon={<Lock className="h-4 w-4" />} title={t("settings.account")}>
            <AccountSection />
          </Section>
          <Section icon={<Globe className="h-4 w-4" />} title={t("settings.language")}>
            <LanguageSection />
          </Section>
          <Section icon={<Sliders className="h-4 w-4" />} title={t("settings.preferences")}>
            <PreferencesSection />
          </Section>
          <Section icon={<Bell className="h-4 w-4" />} title={t("settings.notifications")}>
            <NotificationsSection />
          </Section>
        </div>

        <div className="border-t px-5 py-4 space-y-2">
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => setLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4" />
            {t("settings.logout")}
          </Button>
          <button
            className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1"
            onClick={() => setDeleteConfirm(true)}
          >
            {t("settings.delete_account")}
          </button>
        </div>
      </div>

      {logoutConfirm && (
        <LogoutConfirm
          onConfirm={handleLogout}
          onCancel={() => setLogoutConfirm(false)}
          loading={loggingOut}
        />
      )}

      {deleteConfirm && (
        <DeleteAccountConfirm
          onConfirm={handleDeleteAccount}
          onCancel={() => setDeleteConfirm(false)}
          loading={deletingAccount}
        />
      )}
    </>
  );
}
