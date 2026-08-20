/**
 * NameConfirmForm — flux partagé "clic sur un lien d'invitation → saisir son
 * nom → accepté ou en attente de validation", utilisé par InviteAcceptPage
 * (invitation enseignant nominative) et ClassroomJoinPage (rejoindre une
 * classroom via un code). Les deux pages restent des routes distinctes (URLs
 * et mutations différentes) mais partagent tout l'écran/formulaire.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NameConfirmFormProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRedirect: (path: "/login" | "/onboarding") => void;
  title: string;
  hint: string;
  onSubmit: (firstName: string, lastName: string) => Promise<{ status: "accepted" | "pending_review" }>;
  isSubmitting: boolean;
  successTitle: string;
  successHint: string;
  pendingTitle: string;
  pendingHint: string;
}

export function NameConfirmForm({
  isLoading,
  isError,
  errorMessage,
  isAuthenticated,
  authLoading,
  onAuthRedirect,
  title,
  hint,
  onSubmit,
  isSubmitting,
  successTitle,
  successHint,
  pendingTitle,
  pendingHint,
}: NameConfirmFormProps) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [result, setResult] = useState<"accepted" | "pending_review" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSubmit(firstName, lastName);
    setResult(res.status);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <Link to="/" className="text-sm font-medium text-primary hover:underline">
          {t("structures.back_home")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-center px-6 py-4">
        <Link to="/">
          <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-6">
          {result === "accepted" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              <h1 className="text-xl font-bold">{successTitle}</h1>
              <p className="text-sm text-muted-foreground">{successHint}</p>
              <Link to="/app">
                <Button>{t("structures.go_to_app")}</Button>
              </Link>
            </div>
          )}

          {result === "pending_review" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Clock className="h-10 w-10 text-amber-500" />
              <h1 className="text-xl font-bold">{pendingTitle}</h1>
              <p className="text-sm text-muted-foreground">{pendingHint}</p>
              <Link to="/app">
                <Button variant="outline">{t("structures.go_to_app")}</Button>
              </Link>
            </div>
          )}

          {result === null && (
            <>
              <div className="text-center">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={() => onAuthRedirect("/login")}>
                    {t("structures.invite_login")}
                  </Button>
                  <Button
                    className="w-full"
                    size="lg"
                    variant="outline"
                    onClick={() => onAuthRedirect("/onboarding")}
                  >
                    {t("structures.invite_signup")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.first_name")}</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.last_name")}</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t("structures.invite_confirm")
                    )}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
