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

// ── Exercices / évaluations (QCM) ──────────────────────────────────────────

export type ExerciseKind = "exercise" | "evaluation";

export interface ExerciseQuestionAnswerKeyResponse {
  id: string;
  prompt: string;
  choices: string[];
  correct_choice_index: number;
  explanation: string | null;
  points: number;
  order: number;
  topic_tag: string | null;
}

export interface ExerciseResponse {
  id: string;
  classroom_id: string;
  title: string;
  subject: string | null;
  kind: ExerciseKind;
  topic_hint: string | null;
  instructions: string | null;
  source_course_id: string | null;
  created_at: string;
  questions: ExerciseQuestionAnswerKeyResponse[];
}

export interface ExerciseListItem {
  id: string;
  classroom_id: string;
  title: string;
  subject: string | null;
  kind: ExerciseKind;
  created_at: string;
  questions_count: number;
  recipients_count: number;
}

export interface QuestionEditInput {
  prompt: string;
  choices: string[];
  correct_choice_index: number;
  explanation?: string | null;
  topic_tag?: string | null;
  points?: number;
}

export interface ExerciseSendResult {
  new_recipients_count: number;
}

export interface ExerciseTakeQuestion {
  id: string;
  prompt: string;
  choices: string[];
  order: number;
}

export interface ExerciseTakeResponse {
  exercise_id: string;
  title: string;
  instructions: string | null;
  kind: ExerciseKind;
  questions: ExerciseTakeQuestion[];
}

export interface ExerciseSubmissionResponse {
  submission_id: string;
  attempt_number: number;
  status: "in_progress" | "submitted";
}

export interface ExerciseAnswerResult {
  question_id: string;
  prompt: string;
  choices: string[];
  selected_choice_index: number | null;
  correct_choice_index: number;
  is_correct: boolean;
  explanation: string | null;
}

export interface ExerciseResultResponse {
  exercise_id: string;
  attempt_number: number;
  status: "in_progress" | "submitted";
  score_points: number | null;
  max_points: number | null;
  score_pct: number | null;
  submitted_at: string | null;
  answers: ExerciseAnswerResult[];
}

export interface ExerciseAttemptSummary {
  attempt_number: number;
  score_pct: number | null;
  submitted_at: string | null;
}

export interface ExerciseRecipientResult {
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  attempted: boolean;
  score_pct: number | null;
  submitted_at: string | null;
}

export interface ExerciseResultsMatrixResponse {
  exercise_id: string;
  title: string;
  kind: ExerciseKind;
  recipients: ExerciseRecipientResult[];
}

export interface StudentTopicFlag {
  topic_tag: string;
  wrong_rate: number;
  questions_seen: number;
}

export interface ClassroomDifficultyStudentItem {
  user_id: string;
  user_name: string | null;
  avg_score_pct: number;
  flagged_topics: StudentTopicFlag[];
  trend: "improving" | "flat" | "declining" | null;
}

export interface TopicDifficultyItem {
  topic_tag: string;
  class_success_rate: number;
  students_flagged_count: number;
}

export interface ClassroomDifficultyReportResponse {
  students: ClassroomDifficultyStudentItem[];
  topics: TopicDifficultyItem[];
  insufficient_data: boolean;
}

export interface StudentDifficultyDetailResponse {
  insufficient_data: boolean;
  student: ClassroomDifficultyStudentItem | null;
}

export const createExercise = (
  structureId: string,
  classroomId: string,
  payload: {
    title: string; topic_hint: string; subject?: string; kind: ExerciseKind;
    question_count?: number; source_course_id?: string;
  },
) =>
  apiRequest<ExerciseResponse>(`/structures/${structureId}/classrooms/${classroomId}/exercises`, {
    method: "POST",
    body: JSON.stringify(payload),
    timeoutMs: 120_000, // génération LLM — peut prendre 30-60 s
  });

export const updateExerciseQuestions = (
  structureId: string,
  classroomId: string,
  exerciseId: string,
  questions: QuestionEditInput[],
) =>
  apiRequest<ExerciseResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/exercises/${exerciseId}/questions`,
    { method: "PATCH", body: JSON.stringify({ questions }) },
  );

export const fetchExercises = (structureId: string, classroomId: string, kind?: ExerciseKind) =>
  apiRequest<ExerciseListItem[]>(
    `/structures/${structureId}/classrooms/${classroomId}/exercises${kind ? `?kind=${kind}` : ""}`,
  );

export const fetchExercise = (structureId: string, classroomId: string, exerciseId: string) =>
  apiRequest<ExerciseResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/exercises/${exerciseId}`,
  );

export const sendExercise = (
  structureId: string,
  classroomId: string,
  exerciseId: string,
  payload: { target: "classroom" | "student"; student_user_id?: string },
) =>
  apiRequest<ExerciseSendResult>(
    `/structures/${structureId}/classrooms/${classroomId}/exercises/${exerciseId}/send`,
    { method: "POST", body: JSON.stringify(payload), timeoutMs: 60_000 },
  );

export const fetchExerciseResults = (structureId: string, classroomId: string, exerciseId: string) =>
  apiRequest<ExerciseResultsMatrixResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/exercises/${exerciseId}/results`,
  );

export const fetchClassroomDifficulty = (structureId: string, classroomId: string) =>
  apiRequest<ClassroomDifficultyReportResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/difficulty`,
  );

export const fetchStudentDifficulty = (structureId: string, classroomId: string, userId: string) =>
  apiRequest<StudentDifficultyDetailResponse>(
    `/structures/${structureId}/classrooms/${classroomId}/difficulty/${userId}`,
  );

export const fetchExerciseToTake = (exerciseId: string) =>
  apiRequest<ExerciseTakeResponse>(`/structures/classroom-exercises/${exerciseId}/take`);

export const startExerciseSubmission = (exerciseId: string) =>
  apiRequest<ExerciseSubmissionResponse>(`/structures/classroom-exercises/${exerciseId}/start`, {
    method: "POST",
  });

export const submitExercise = (
  exerciseId: string,
  answers: { question_id: string; selected_choice_index: number | null }[],
) =>
  apiRequest<ExerciseResultResponse>(`/structures/classroom-exercises/${exerciseId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

export const fetchMyExerciseResult = (exerciseId: string, attemptNumber?: number) =>
  apiRequest<ExerciseResultResponse>(
    `/structures/classroom-exercises/${exerciseId}/my-result${attemptNumber ? `?attempt_number=${attemptNumber}` : ""}`,
  );

export const fetchMyExerciseAttempts = (exerciseId: string) =>
  apiRequest<ExerciseAttemptSummary[]>(`/structures/classroom-exercises/${exerciseId}/my-attempts`);

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
