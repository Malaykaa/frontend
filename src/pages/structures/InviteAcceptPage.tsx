import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { setPendingInviteRedirect } from "@/shared/lib/pending-invite";
import { useAcceptInvitation, useInvitationPreview } from "@/hooks/queries/use-structure";

export default function InviteAcceptPage() {
  const { t } = useTranslation();
  const { token = "" } = useParams<{ token: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: preview, isLoading, isError } = useInvitationPreview(token);
  const acceptMutation = useAcceptInvitation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [result, setResult] = useState<"accepted" | "pending_review" | null>(null);

  const goAuth = (path: "/login" | "/onboarding") => {
    setPendingInviteRedirect(`/structures/invite/${token}`);
    window.location.href = path;
  };

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await acceptMutation.mutateAsync({ token, firstName, lastName });
    setResult(res.status);
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !preview) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{t("structures.invite_invalid")}</p>
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
              <h1 className="text-xl font-bold">{t("structures.accept_success_title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("structures.accept_success_hint", {
                  structure: preview.structure_name,
                  classrooms: preview.classroom_names.join(", "),
                })}
              </p>
              <Link to="/app">
                <Button>{t("structures.go_to_app")}</Button>
              </Link>
            </div>
          )}

          {result === "pending_review" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Clock className="h-10 w-10 text-amber-500" />
              <h1 className="text-xl font-bold">{t("structures.accept_pending_title")}</h1>
              <p className="text-sm text-muted-foreground">{t("structures.accept_pending_hint")}</p>
              <Link to="/app">
                <Button variant="outline">{t("structures.go_to_app")}</Button>
              </Link>
            </div>
          )}

          {result === null && (
            <>
              <div className="text-center">
                <h1 className="text-xl font-bold">
                  {t("structures.invite_title", { structure: preview.structure_name })}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("structures.invite_hint", { classrooms: preview.classroom_names.join(", ") })}
                </p>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={() => goAuth("/login")}>
                    {t("structures.invite_login")}
                  </Button>
                  <Button
                    className="w-full"
                    size="lg"
                    variant="outline"
                    onClick={() => goAuth("/onboarding")}
                  >
                    {t("structures.invite_signup")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleAccept} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.first_name")}</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.last_name")}</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                  <Button className="w-full" size="lg" type="submit" disabled={acceptMutation.isPending}>
                    {acceptMutation.isPending ? (
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
