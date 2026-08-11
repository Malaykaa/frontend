import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  acceptInvitation,
  aiAssistSection,
  type AiAssistAction,
  completeCourseStep,
  createClassroom,
  createCourse,
  createInvitation,
  fetchClassroomJoinPreview,
  fetchClassrooms,
  fetchCourse,
  fetchCourseProgress,
  fetchCourses,
  downloadImpactReport,
  fetchClassroomDashboard,
  fetchImpactReport,
  fetchInvitationPreview,
  fetchInvitations,
  fetchJoinRequests,
  fetchMembers,
  fetchMyCourseProgress,
  fetchMyStructures,
  fetchRoster,
  fetchStructureDashboard,
  generateEvolutionPlans,
  importRoster,
  joinClassroom,
  rejectInvitation,
  rejectJoinRequest,
  requestStructure,
  sendCourse,
  validateInvitation,
  validateJoinRequest,
} from "@/services/api/structure.api";

export const structureKeys = {
  mine: ["structures", "me"] as const,
  classrooms: (structureId: string) => ["structures", structureId, "classrooms"] as const,
  invitations: (structureId: string) => ["structures", structureId, "invitations"] as const,
  invitationPreview: (token: string) => ["structures", "invite", token] as const,
  roster: (structureId: string, classroomId: string) =>
    ["structures", structureId, "classrooms", classroomId, "roster"] as const,
  members: (structureId: string, classroomId: string) =>
    ["structures", structureId, "classrooms", classroomId, "members"] as const,
  joinRequests: (structureId: string, classroomId: string) =>
    ["structures", structureId, "classrooms", classroomId, "join-requests"] as const,
  classroomJoinPreview: (inviteCode: string) => ["classrooms", "join", inviteCode] as const,
  courses: (structureId: string, classroomId: string) =>
    ["structures", structureId, "classrooms", classroomId, "courses"] as const,
  course: (structureId: string, classroomId: string, courseId: string) =>
    ["structures", structureId, "classrooms", classroomId, "courses", courseId] as const,
  courseProgress: (structureId: string, classroomId: string, courseId: string) =>
    ["structures", structureId, "classrooms", classroomId, "courses", courseId, "progress"] as const,
  myCourseProgress: (courseId: string) => ["classrooms", "courses", courseId, "my-progress"] as const,
  classroomDashboard: (structureId: string, classroomId: string) =>
    ["structures", structureId, "classrooms", classroomId, "dashboard"] as const,
  structureDashboard: (structureId: string) => ["structures", structureId, "dashboard"] as const,
  impactReport: (structureId: string) => ["structures", structureId, "impact-report"] as const,
};

export const useMyStructures = () =>
  useQuery({ queryKey: structureKeys.mine, queryFn: fetchMyStructures, staleTime: 60000 });

export function useRequestStructure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requestStructure,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.mine });
      toast.success("Demande envoyée — en attente de validation.");
    },
    onError: () => toast.error("Erreur lors de la demande."),
  });
}

export const useClassrooms = (structureId: string) =>
  useQuery({
    queryKey: structureKeys.classrooms(structureId),
    queryFn: () => fetchClassrooms(structureId),
    enabled: !!structureId,
  });

export function useCreateClassroom(structureId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createClassroom(structureId, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.classrooms(structureId) });
      toast.success("Classroom créée.");
    },
    onError: () => toast.error("Erreur lors de la création."),
  });
}

export const useInvitations = (structureId: string) =>
  useQuery({
    queryKey: structureKeys.invitations(structureId),
    queryFn: () => fetchInvitations(structureId),
    enabled: !!structureId,
  });

export function useCreateInvitation(structureId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { first_name: string; last_name: string; classroom_ids: string[]; contact?: string }) =>
      createInvitation(structureId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.invitations(structureId) });
      toast.success("Invitation envoyée.");
    },
    onError: () => toast.error("Erreur lors de l'envoi de l'invitation."),
  });
}

export function useValidateInvitation(structureId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => validateInvitation(structureId, invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.invitations(structureId) });
      toast.success("Invitation validée.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur."),
  });
}

export function useRejectInvitation(structureId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) => rejectInvitation(structureId, invitationId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.invitations(structureId) });
      toast.success("Invitation refusée.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur."),
  });
}

export const useInvitationPreview = (token: string) =>
  useQuery({
    queryKey: structureKeys.invitationPreview(token),
    queryFn: () => fetchInvitationPreview(token),
    enabled: !!token,
    retry: false,
  });

export function useAcceptInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ token, firstName, lastName }: { token: string; firstName: string; lastName: string }) =>
      acceptInvitation(token, firstName, lastName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.mine });
    },
  });
}

export const useRoster = (structureId: string, classroomId: string) =>
  useQuery({
    queryKey: structureKeys.roster(structureId, classroomId),
    queryFn: () => fetchRoster(structureId, classroomId),
    enabled: !!structureId && !!classroomId,
  });

export function useImportRoster(structureId: string, classroomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entries: { first_name: string; last_name: string }[]) =>
      importRoster(structureId, classroomId, entries),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.roster(structureId, classroomId) });
      toast.success("Roster importé.");
    },
    onError: () => toast.error("Erreur lors de l'import du roster."),
  });
}

export const useMembers = (structureId: string, classroomId: string) =>
  useQuery({
    queryKey: structureKeys.members(structureId, classroomId),
    queryFn: () => fetchMembers(structureId, classroomId),
    enabled: !!structureId && !!classroomId,
  });

export const useJoinRequests = (structureId: string, classroomId: string) =>
  useQuery({
    queryKey: structureKeys.joinRequests(structureId, classroomId),
    queryFn: () => fetchJoinRequests(structureId, classroomId),
    enabled: !!structureId && !!classroomId,
  });

export function useValidateJoinRequest(structureId: string, classroomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) => validateJoinRequest(structureId, classroomId, membershipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.joinRequests(structureId, classroomId) });
      qc.invalidateQueries({ queryKey: structureKeys.members(structureId, classroomId) });
      toast.success("Demande validée.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur."),
  });
}

export function useRejectJoinRequest(structureId: string, classroomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) => rejectJoinRequest(structureId, classroomId, membershipId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.joinRequests(structureId, classroomId) });
      toast.success("Demande refusée.");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur."),
  });
}

export const useClassroomJoinPreview = (inviteCode: string) =>
  useQuery({
    queryKey: structureKeys.classroomJoinPreview(inviteCode),
    queryFn: () => fetchClassroomJoinPreview(inviteCode),
    enabled: !!inviteCode,
    retry: false,
  });

export function useJoinClassroom() {
  return useMutation({
    mutationFn: ({ inviteCode, firstName, lastName }: { inviteCode: string; firstName: string; lastName: string }) =>
      joinClassroom(inviteCode, firstName, lastName),
  });
}

export const useCourses = (structureId: string, classroomId: string) =>
  useQuery({
    queryKey: structureKeys.courses(structureId, classroomId),
    queryFn: () => fetchCourses(structureId, classroomId),
    enabled: !!structureId && !!classroomId,
  });

export function useCreateCourse(structureId: string, classroomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; content?: string; attachment_id?: string; subject?: string }) =>
      createCourse(structureId, classroomId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.courses(structureId, classroomId) });
      toast.success("Cours analysé et créé.");
    },
    onError: () => toast.error("Erreur lors de la création du cours."),
  });
}

export const useCourse = (structureId: string, classroomId: string, courseId: string) =>
  useQuery({
    queryKey: structureKeys.course(structureId, classroomId, courseId),
    queryFn: () => fetchCourse(structureId, classroomId, courseId),
    enabled: !!structureId && !!classroomId && !!courseId,
  });

export const useCourseProgress = (structureId: string, classroomId: string, courseId: string) =>
  useQuery({
    queryKey: structureKeys.courseProgress(structureId, classroomId, courseId),
    queryFn: () => fetchCourseProgress(structureId, classroomId, courseId),
    enabled: !!structureId && !!classroomId && !!courseId,
  });

export function useSendCourse(structureId: string, classroomId: string, courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { target: "classroom" | "student"; student_user_id?: string }) =>
      sendCourse(structureId, classroomId, courseId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.courses(structureId, classroomId) });
      qc.invalidateQueries({ queryKey: structureKeys.courseProgress(structureId, classroomId, courseId) });
      toast.success("Cours envoyé.");
    },
    onError: () => toast.error("Erreur lors de l'envoi."),
  });
}

export const useMyCourseProgress = (courseId: string) =>
  useQuery({
    queryKey: structureKeys.myCourseProgress(courseId),
    queryFn: () => fetchMyCourseProgress(courseId),
    enabled: !!courseId,
  });

export function useCompleteCourseStep(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stepId: string) => completeCourseStep(courseId, stepId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: structureKeys.myCourseProgress(courseId) });
      toast.success("Étape terminée !");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur."),
  });
}

export const useClassroomDashboard = (structureId: string, classroomId: string) =>
  useQuery({
    queryKey: structureKeys.classroomDashboard(structureId, classroomId),
    queryFn: () => fetchClassroomDashboard(structureId, classroomId),
    enabled: !!structureId && !!classroomId,
  });

export const useStructureDashboard = (structureId: string) =>
  useQuery({
    queryKey: structureKeys.structureDashboard(structureId),
    queryFn: () => fetchStructureDashboard(structureId),
    enabled: !!structureId,
  });

export function useGenerateEvolutionPlans(structureId: string, classroomId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => generateEvolutionPlans(structureId, classroomId),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: structureKeys.courses(structureId, classroomId) });
      qc.invalidateQueries({ queryKey: structureKeys.classroomDashboard(structureId, classroomId) });
      toast.success(
        result.plans_generated > 0
          ? `${result.plans_generated} plan(s) personnalisé(s) généré(s) et envoyé(s).`
          : "Aucun plan généré — assurez-vous qu'au moins un cours a été envoyé aux étudiants.",
      );
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : null;
      toast.error(msg && msg !== `HTTP 500` ? msg : "Erreur lors de la génération des plans.");
    },
  });
}

export const useImpactReport = (structureId: string) =>
  useQuery({
    queryKey: structureKeys.impactReport(structureId),
    queryFn: () => fetchImpactReport(structureId),
    enabled: !!structureId,
  });

export function useDownloadImpactReport(structureId: string) {
  return useMutation({
    mutationFn: async (format: "pdf" | "csv") => {
      const blob = await downloadImpactReport(structureId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport_impact.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onError: () => toast.error("Erreur lors du téléchargement du rapport."),
  });
}

export function useAiAssistSection(structureId: string, classroomId: string) {
  return useMutation({
    mutationFn: (payload: { section_content: string; action: AiAssistAction }) =>
      aiAssistSection(structureId, classroomId, payload),
    onError: () => toast.error("L'assistance IA a échoué. Réessaie."),
  });
}
