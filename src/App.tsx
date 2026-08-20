import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InstallBanner } from "@/components/app/InstallBanner";
import { Suspense, useEffect } from "react";
import { clearChunkReloadMark, lazyRoute } from "@/shared/lib/lazy-route";

const LandingPage        = lazyRoute(() => import("@/pages/landing"));
const PrivacyPolicy      = lazyRoute(() => import("@/pages/legal/PrivacyPolicy"));
const TermsOfService     = lazyRoute(() => import("@/pages/legal/TermsOfService"));
const LoginPage           = lazyRoute(() => import("@/pages/auth/LoginPage"));
const OnboardingPage      = lazyRoute(() => import("@/pages/auth/OnboardingPage"));
const ForgotPasswordPage  = lazyRoute(() => import("@/pages/auth/ForgotPasswordPage"));
const NotFoundPage       = lazyRoute(() => import("@/pages/NotFoundPage"));
const SharedDocumentPage = lazyRoute(() => import("@/pages/shared/SharedDocumentPage"));
const AppPage            = lazyRoute(() => import("@/pages/app/AppPage"));
const PourMoiTab         = lazyRoute(() => import("@/pages/app/tabs/PourMoiTab"));
const ActionsTab         = lazyRoute(() => import("@/pages/app/tabs/ActionsTab"));
const TendancesTab       = lazyRoute(() => import("@/pages/app/tabs/TendancesTab"));
const AideTab            = lazyRoute(() => import("@/pages/app/tabs/AideTab"));
const ServicesTab        = lazyRoute(() => import("@/pages/app/tabs/ServicesTab"));
const ProviderPage       = lazyRoute(() => import("@/pages/app/services/ProviderPage"));
const RequestsPage       = lazyRoute(() => import("@/pages/app/services/RequestsPage"));
const RequestDetailPage  = lazyRoute(() => import("@/pages/app/services/RequestDetailPage"));
const NotificationDetailPage = lazyRoute(() => import("@/pages/app/NotificationDetailPage"));
const ChatView           = lazyRoute(() => import("@/pages/app/chat/ChatView"));
const AdminLayout        = lazyRoute(() => import("@/layouts/AdminLayout"));
const AdminDashboard     = lazyRoute(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers         = lazyRoute(() => import("@/pages/admin/AdminUsers"));
const AdminUserDetail    = lazyRoute(() => import("@/pages/admin/AdminUserDetail"));
const AdminOffers        = lazyRoute(() => import("@/pages/admin/AdminOffers"));
const AdminGoals         = lazyRoute(() => import("@/pages/admin/AdminGoals"));
const AdminThreads       = lazyRoute(() => import("@/pages/admin/AdminThreads"));
const AdminThreadDetail  = lazyRoute(() => import("@/pages/admin/AdminThreadDetail"));
const AdminDocuments     = lazyRoute(() => import("@/pages/admin/AdminDocuments"));
const AdminIntents       = lazyRoute(() => import("@/pages/admin/AdminIntents"));
const AdminScraping      = lazyRoute(() => import("@/pages/admin/AdminScraping"));
const AdminCuration      = lazyRoute(() => import("@/pages/admin/AdminCuration"));
const AdminStructures    = lazyRoute(() => import("@/pages/admin/AdminStructures"));
const AdminServices      = lazyRoute(() => import("@/pages/admin/AdminServices"));
const StructureDashboardPage = lazyRoute(() => import("@/pages/structures/StructureDashboardPage"));
const ClassroomDetailPage = lazyRoute(() => import("@/pages/structures/ClassroomDetailPage"));
const InviteAcceptPage   = lazyRoute(() => import("@/pages/structures/InviteAcceptPage"));
const ClassroomJoinPage  = lazyRoute(() => import("@/pages/structures/ClassroomJoinPage"));
const CourseProgressPage = lazyRoute(() => import("@/pages/structures/CourseProgressPage"));
const CourseEditorPage   = lazyRoute(() => import("@/pages/structures/CourseEditorPage"));
const MyCoursePage       = lazyRoute(() => import("@/pages/structures/MyCoursePage"));
const ExerciseEditorPage  = lazyRoute(() => import("@/pages/structures/ExerciseEditorPage"));
const ExerciseResultsPage = lazyRoute(() => import("@/pages/structures/ExerciseResultsPage"));
const TakeExercisePage    = lazyRoute(() => import("@/pages/structures/TakeExercisePage"));
const ExerciseResultPage  = lazyRoute(() => import("@/pages/structures/ExerciseResultPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: (failureCount, error) => {
        if (error instanceof Error && "status" in error) {
          const status = (error as { status: number }).status;
          if ([401, 403, 404].includes(status)) return false;
        }
        return failureCount < 2;
      },
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (isAuthenticated) return <Navigate to={user?.role === "admin" ? "/admin" : "/app"} replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground">Chargement...</span>
      </div>
    </div>
  );
}

export default function App() {
  // L'application est montée : un éventuel rechargement dû à un morceau
  // manquant a abouti, la marque peut être levée pour la suite de la session.
  useEffect(clearChunkReloadMark, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<FullScreenLoader />}>
              <Routes>
                <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
                <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
                <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                <Route path="/legal/terms" element={<TermsOfService />} />

                <Route path="/app" element={<PrivateRoute><AppPage /></PrivateRoute>}>
                  <Route index element={<Navigate to="pour-moi" replace />} />
                  <Route path="pour-moi"  element={<PourMoiTab />} />
                  <Route path="actions"   element={<ActionsTab />} />
                  <Route path="tendances" element={<TendancesTab />} />
                  <Route path="aide"      element={<AideTab />} />
                  <Route path="services"  element={<ServicesTab />} />
                  <Route path="services/prestataire" element={<ProviderPage />} />
                  <Route path="services/demandes" element={<RequestsPage />} />
                  <Route path="services/demandes/:requestId" element={<RequestDetailPage />} />
                  <Route path="notifications/:notificationId" element={<NotificationDetailPage />} />
                </Route>

                <Route path="/app/chat/:threadId" element={<PrivateRoute><ChatView /></PrivateRoute>} />

                <Route path="/structures/invite/:token" element={<InviteAcceptPage />} />
                <Route path="/classrooms/join/:inviteCode" element={<ClassroomJoinPage />} />
                <Route path="/structures/:structureId" element={<PrivateRoute><StructureDashboardPage /></PrivateRoute>} />
                <Route path="/structures/:structureId/classrooms/:classroomId" element={<PrivateRoute><ClassroomDetailPage /></PrivateRoute>} />
                <Route path="/structures/:structureId/classrooms/:classroomId/courses/new" element={<PrivateRoute><CourseEditorPage /></PrivateRoute>} />
                <Route path="/structures/:structureId/classrooms/:classroomId/courses/:courseId" element={<PrivateRoute><CourseProgressPage /></PrivateRoute>} />
                <Route path="/classrooms/courses/:courseId" element={<PrivateRoute><MyCoursePage /></PrivateRoute>} />
                <Route path="/structures/:structureId/classrooms/:classroomId/exercises/new" element={<PrivateRoute><ExerciseEditorPage /></PrivateRoute>} />
                <Route path="/structures/:structureId/classrooms/:classroomId/exercises/:exerciseId/results" element={<PrivateRoute><ExerciseResultsPage /></PrivateRoute>} />
                <Route path="/classrooms/exercises/:exerciseId" element={<PrivateRoute><TakeExercisePage /></PrivateRoute>} />
                <Route path="/classrooms/exercises/:exerciseId/result" element={<PrivateRoute><ExerciseResultPage /></PrivateRoute>} />

                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users"             element={<AdminUsers />} />
                  <Route path="users/:userId"     element={<AdminUserDetail />} />
                  <Route path="offers"            element={<AdminOffers />} />
                  <Route path="curation"          element={<AdminCuration />} />
                  <Route path="goals"             element={<AdminGoals />} />
                  <Route path="threads"           element={<AdminThreads />} />
                  <Route path="threads/:threadId" element={<AdminThreadDetail />} />
                  <Route path="documents"         element={<AdminDocuments />} />
                  <Route path="intents"           element={<AdminIntents />} />
                  <Route path="scraping"          element={<AdminScraping />} />
                  <Route path="structures"        element={<AdminStructures />} />
                  <Route path="services"          element={<AdminServices />} />
                </Route>

                <Route path="/share/:token" element={<SharedDocumentPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
            <Toaster position="top-center" richColors />
            <InstallBanner />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
