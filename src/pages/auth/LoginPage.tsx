import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/shared/api/client";
import { isPhone } from "@/shared/lib/utils";
import { setLanguage } from "@/i18n";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectedType = identifier.trim()
    ? isPhone(identifier)
      ? "phone"
      : "email"
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setError("");
    setLoading(true);
    try {
      const loggedUser = await login(identifier.trim(), password);
      const dest = loggedUser.role === "admin" ? "/admin" : "/app";
      navigate(dest, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError(t("auth.invalid_credentials"));
      } else {
        setError(t("errors.generic"));
        toast.error(t("errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link to="/">
          <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
        </Link>

        {/* Language toggle */}
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setLanguage(i18n.language === "fr" ? "en" : "fr")}
        >
          {i18n.language === "fr" ? "EN" : "FR"}
        </button>
      </header>

      {/* Form */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{t("auth.login")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("auth.login_hint")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier */}
            <div className="space-y-1.5">
              <Label htmlFor="identifier">
                {t("auth.email")} {t("common.or")} {t("auth.phone")}
              </Label>
              <div className="relative">
                <Input
                  id="identifier"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder={t("auth.identifier_placeholder")}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError("");
                  }}
                  className="pr-16"
                />
                {detectedType && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {detectedType === "phone" ? "📱" : "✉️"}
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !identifier.trim() || !password}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("auth.login")
              )}
            </Button>
          </form>

          {/* Mot de passe oublié */}
          <p className="text-center text-sm">
            <Link to="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
              {t("auth.forgot_password")}
            </Link>
          </p>

          {/* Link to onboarding */}
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.no_account")}{" "}
            <Link to="/onboarding" className="font-medium text-primary hover:underline">
              {t("auth.register")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
