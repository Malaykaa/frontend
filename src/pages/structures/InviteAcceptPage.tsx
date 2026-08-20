import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { setPendingInviteRedirect } from "@/shared/lib/pending-invite";
import { useAcceptInvitation, useInvitationPreview } from "@/hooks/queries/use-structure";
import { NameConfirmForm } from "@/components/structures/NameConfirmForm";

export default function InviteAcceptPage() {
  const { t } = useTranslation();
  const { token = "" } = useParams<{ token: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: preview, isLoading, isError } = useInvitationPreview(token);
  const acceptMutation = useAcceptInvitation();

  const goAuth = (path: "/login" | "/onboarding") => {
    setPendingInviteRedirect(`/structures/invite/${token}`);
    window.location.href = path;
  };

  return (
    <NameConfirmForm
      isLoading={isLoading}
      isError={isError || !preview}
      errorMessage={t("structures.invite_invalid")}
      isAuthenticated={isAuthenticated}
      authLoading={authLoading}
      onAuthRedirect={goAuth}
      title={t("structures.invite_title", { structure: preview?.structure_name })}
      hint={t("structures.invite_hint", { classrooms: preview?.classroom_names.join(", ") })}
      isSubmitting={acceptMutation.isPending}
      onSubmit={(firstName, lastName) => acceptMutation.mutateAsync({ token, firstName, lastName })}
      successTitle={t("structures.accept_success_title")}
      successHint={t("structures.accept_success_hint", {
        structure: preview?.structure_name,
        classrooms: preview?.classroom_names.join(", "),
      })}
      pendingTitle={t("structures.accept_pending_title")}
      pendingHint={t("structures.accept_pending_hint")}
    />
  );
}
