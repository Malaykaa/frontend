import { apiBlobRequest, apiRequest } from "@/shared/api/client";

export type StructureType = "training_center" | "independent_trainer" | "school" | "university" | "other";

export interface StructureResponse {
  id: string;
  name: string;
  country: string | null;
  structure_type: StructureType | null;
  structure_type_other: string | null;
  address: string | null;
  email: string | null;
  status: "pending" | "active" | "rejected";
  created_at: string;
  role: "super_admin" | "teacher";
}

export interface RequestStructureInput {
  name: string;
  country?: string;
  structure_type?: StructureType;
  structure_type_other?: string;
  address?: string;
  email?: string;
}

export interface ClassroomResponse {
  id: string;
  structure_id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface InvitationResponse {
  id: string;
  structure_id: string;
  first_name: string;
  last_name: string;
  status: "pending" | "accepted" | "pending_review" | "rejected" | "expired";
  invite_url: string;
  created_at: string;
  expires_at: string;
}

export interface InvitationPreview {
  structure_name: string;
  classroom_names: string[];
  first_name: string;
  last_name: string;
  status: string;
}

export interface InvitationAcceptResult {
  status: "accepted" | "pending_review";
  structure_name: string;
  classroom_names: string[];
}

export interface RosterEntryResponse {
  id: string;
  first_name: string;
  last_name: string;
  claimed: boolean;
}

export interface ClassroomMembershipResponse {
  id: string;
  classroom_id: string;
  user_id: string;
  user_email: string | null;
  requested_first_name: string;
  requested_last_name: string;
  status: "accepted" | "pending_review" | "rejected";
  created_at: string;
}

export interface ClassroomJoinPreview {
  structure_name: string;
  classroom_name: string;
}

export interface ClassroomJoinResult {
  status: "accepted" | "pending_review";
  classroom_name: string;
}

export interface CourseStepResponse {
  id: string;
  label: string;
  description: string;
  order: number;
}

export interface CourseResponse {
  id: string;
  classroom_id: string;
  title: string;
  subject: string | null;
  kind: "course" | "evolution_plan";
  summary: string;
  explanation: string;
  suggestions: { id: string; label: string }[] | null;
  created_at: string;
  steps: CourseStepResponse[];
}

export interface CourseListItem {
  id: string;
  classroom_id: string;
  title: string;
  subject: string | null;
  kind: "course" | "evolution_plan";
  summary: string;
  created_at: string;
  steps_count: number;
  recipients_count: number;
}

export interface StepProgressResponse {
  step_id: string;
  label: string;
  description: string;
  order: number;
  status: "todo" | "in_progress" | "done";
  completed_at: string | null;
}

export interface MyCourseProgressResponse {
  course_id: string;
  title: string;
  explanation: string;
  steps: StepProgressResponse[];
}

export interface RecipientProgressResponse {
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  user_phone: string | null;
  steps: StepProgressResponse[];
}

export interface CourseProgressMatrixResponse {
  course_id: string;
  title: string;
  recipients: RecipientProgressResponse[];
}

export interface DashboardCourseItem {
  course_id: string;
  title: string;
  subject: string | null;
  recipients_count: number;
  completion_pct: number;
}

export interface DashboardStudentItem {
  user_id: string;
  user_email: string | null;
  courses_count: number;
  steps_done: number;
  steps_total: number;
  completion_pct: number;
}

export interface ClassroomDashboardResponse {
  courses: DashboardCourseItem[];
  students: DashboardStudentItem[];
}

export interface StructureDashboardClassroomItem {
  classroom_id: string;
  name: string;
  students_count: number;
  courses_count: number;
  completion_pct: number;
}

export interface StructureDashboardResponse {
  classrooms: StructureDashboardClassroomItem[];
}

export const fetchMyStructures = () =>
  apiRequest<StructureResponse[]>("/structures/me");

export const requestStructure = (input: RequestStructureInput) =>
  apiRequest<StructureResponse>("/structures", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const fetchClassrooms = (structureId: string) =>
  apiRequest<ClassroomResponse[]>(`/structures/${structureId}/classrooms`);

export const createClassroom = (structureId: string, name: string) =>
  apiRequest<ClassroomResponse>(`/structures/${structureId}/classrooms`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const fetchInvitations = (structureId: string) =>
  apiRequest<InvitationResponse[]>(`/structures/${structureId}/invitations`);

export const createInvitation = (
  structureId: string,
  payload: { first_name: string; last_name: string; classroom_ids: string[]; contact?: string },
) =>
  apiRequest<InvitationResponse>(`/structures/${structureId}/invitations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const validateInvitation = (structureId: string, invitationId: string) =>
  apiRequest<InvitationResponse>(
    `/structures/${structureId}/invitations/${invitationId}/validate`,
    { method: "POST" },
  );

export const rejectInvitation = (structureId: string, invitationId: string) =>
  apiRequest<InvitationResponse>(
    `/structures/${structureId}/invitations/${invitationId}/reject`,
    { method: "POST" },
  );

export const fetchInvitationPreview = (token: string) =>
  apiRequest<InvitationPreview>(`/structures/invitations/${token}`);

export const acceptInvitation = (token: string, firstName: string, lastName: string) =>
  apiRequest<InvitationAcceptResult>(`/structures/invitations/${token}/accept`, {
    method: "POST",
    body: JSON.stringify({ first_name: firstName, last_name: lastName }),
  });

export const importRoster = (
  structureId: string,
  classroomId: string,
  entries: { first_name: string; last_name: string }[],
) =>
  apiRequest<RosterEntryResponse[]>(
    `/structures/${structureId}/classrooms/${classroomId}/roster`,
    { method: "POST", body: JSON.stringify({ entries }) },
  );

export const fetchRoster = (structureId: string, classroomId: string) =>
  apiRequest<RosterEntryResponse[]>(`/structures/${structureId}/classrooms/${classroomId}/roster`);

export const fetchMembers = (structureId: string, classroomId: string) =>
  apiRequest<ClassroomMembershipResponse[]>(
    `/structures/${structureId}/classrooms/${classroomId}/members`,
  );

export const fetchJoinRequests = (structureId: string, classroomId: string) =>
  apiRequest<ClassroomMembershipResponse[]>(
    `/structures/${structureId}/classrooms/${classroomId}/join-requests`,
  );

export const validateJoinRequest = (structureId: string, classroomId: string, membershipId: string) =>
  apiRequest<ClassroomMembershipResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/join-requests/${membershipId}/validate`,
    { method: "POST" },
  );

export const rejectJoinRequest = (structureId: string, classroomId: string, membershipId: string) =>
  apiRequest<ClassroomMembershipResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/join-requests/${membershipId}/reject`,
    { method: "POST" },
  );

export const fetchClassroomJoinPreview = (inviteCode: string) =>
  apiRequest<ClassroomJoinPreview>(`/structures/classroom-invites/${inviteCode}`);

export const joinClassroom = (inviteCode: string, firstName: string, lastName: string) =>
  apiRequest<ClassroomJoinResult>(`/structures/classroom-invites/${inviteCode}/join`, {
    method: "POST",
    body: JSON.stringify({ first_name: firstName, last_name: lastName }),
  });

export const createCourse = (
  structureId: string,
  classroomId: string,
  payload: { title: string; content?: string; attachment_id?: string; subject?: string },
) =>
  apiRequest<CourseResponse>(`/structures/${structureId}/classrooms/${classroomId}/courses`, {
    method: "POST",
    body: JSON.stringify(payload),
    timeoutMs: 120_000, // analyse LLM — peut prendre 30-60 s
  });

export const fetchCourses = (structureId: string, classroomId: string) =>
  apiRequest<CourseListItem[]>(`/structures/${structureId}/classrooms/${classroomId}/courses`);

export const fetchCourse = (structureId: string, classroomId: string, courseId: string) =>
  apiRequest<CourseResponse>(`/structures/${structureId}/classrooms/${classroomId}/courses/${courseId}`);

export const fetchCourseProgress = (structureId: string, classroomId: string, courseId: string) =>
  apiRequest<CourseProgressMatrixResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/courses/${courseId}/progress`,
  );

export const sendCourse = (
  structureId: string,
  classroomId: string,
  courseId: string,
  payload: { target: "classroom" | "student"; student_user_id?: string },
) =>
  apiRequest<{ new_recipients_count: number }>(
    `/structures/${structureId}/classrooms/${classroomId}/courses/${courseId}/send`,
    { method: "POST", body: JSON.stringify(payload), timeoutMs: 60_000 },
  );

export const fetchMyCourseProgress = (courseId: string) =>
  apiRequest<MyCourseProgressResponse>(`/structures/classroom-courses/${courseId}/my-progress`);

export const completeCourseStep = (courseId: string, stepId: string) =>
  apiRequest<StepProgressResponse>(
    `/structures/classroom-courses/${courseId}/steps/${stepId}/complete`,
    { method: "POST" },
  );

export const fetchClassroomDashboard = (structureId: string, classroomId: string) =>
  apiRequest<ClassroomDashboardResponse>(`/structures/${structureId}/classrooms/${classroomId}/dashboard`);

export const fetchStructureDashboard = (structureId: string) =>
  apiRequest<StructureDashboardResponse>(`/structures/${structureId}/dashboard`);

export const generateEvolutionPlans = (structureId: string, classroomId: string) =>
  apiRequest<{ plans_generated: number }>(
    `/structures/${structureId}/classrooms/${classroomId}/evolution-plans`,
    { method: "POST", timeoutMs: 300_000 }, // génération par lot — jusqu'à 5 min
  );

export interface ImpactReportClassroomItem {
  classroom_id: string;
  name: string;
  students_count: number;
  courses_count: number;
  completion_pct: number;
}

export interface ImpactReportSubjectItem {
  subject: string;
  courses_count: number;
  completion_pct: number;
}

export interface ImpactReportResponse {
  structure_id: string;
  structure_name: string;
  generated_at: string;
  period_since: string | null;
  period_until: string | null;
  classrooms_count: number;
  teachers_count: number;
  students_count: number;
  courses_count: number;
  evolution_plans_count: number;
  completion_pct: number;
  by_classroom: ImpactReportClassroomItem[];
  by_subject: ImpactReportSubjectItem[];
}

export const fetchImpactReport = (structureId: string) =>
  apiRequest<ImpactReportResponse>(`/structures/${structureId}/impact-report`);

export const downloadImpactReport = (structureId: string, format: "pdf" | "csv") =>
  apiBlobRequest(`/structures/${structureId}/impact-report/export?format=${format}`);

export type AiAssistAction = "analyze" | "develop" | "correct";

export const aiAssistSection = (
  structureId: string,
  classroomId: string,
  payload: { section_content: string; action: AiAssistAction },
) =>
  apiRequest<{ result: string }>(
    `/structures/${structureId}/classrooms/${classroomId}/ai-assist`,
    { method: "POST", body: JSON.stringify(payload), timeoutMs: 60_000 },
  );
