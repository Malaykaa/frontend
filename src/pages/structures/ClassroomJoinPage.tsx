import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { setPendingInviteRedirect } from "@/shared/lib/pending-invite";
import { useClassroomJoinPreview, useJoinClassroom } from "@/hooks/queries/use-structure";
import { NameConfirmForm } from "@/components/structures/NameConfirmForm";

export default function ClassroomJoinPage() {
  const { t } = useTranslation();
  const { inviteCode = "" } = useParams<{ inviteCode: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: preview, isLoading, isError } = useClassroomJoinPreview(inviteCode);
  const joinMutation = useJoinClassroom();

  const goAuth = (path: "/login" | "/onboarding") => {
    setPendingInviteRedirect(`/classrooms/join/${inviteCode}`);
    window.location.href = path;
  };

  return (
    <NameConfirmForm
      isLoading={isLoading}
      isError={isError || !preview}
      errorMessage={t("structures.classroom_invite_invalid")}
      isAuthenticated={isAuthenticated}
      authLoading={authLoading}
      onAuthRedirect={goAuth}
      title={t("structures.classroom_join_title", { classroom: preview?.classroom_name })}
      hint={t("structures.classroom_join_hint", { structure: preview?.structure_name })}
      isSubmitting={joinMutation.isPending}
      onSubmit={(firstName, lastName) => joinMutation.mutateAsync({ inviteCode, firstName, lastName })}
      successTitle={t("structures.classroom_join_success_title")}
      successHint={t("structures.classroom_join_success_hint", { classroom: preview?.classroom_name })}
      pendingTitle={t("structures.accept_pending_title")}
      pendingHint={t("structures.classroom_join_pending_hint")}
    />
  );
}
