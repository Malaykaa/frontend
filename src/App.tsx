import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { InstallBanner } from "@/components/app/InstallBanner";
import { Suspense, lazy } from "react";

const LandingPage        = lazy(() => import("@/pages/landing"));
const LoginPage          = lazy(() => import("@/pages/auth/LoginPage"));
const OnboardingPage     = lazy(() => import("@/pages/auth/OnboardingPage"));
const NotFoundPage       = lazy(() => import("@/pages/NotFoundPage"));
const SharedDocumentPage = lazy(() => import("@/pages/shared/SharedDocumentPage"));
const AppPage            = lazy(() => import("@/pages/app/AppPage"));
const PourMoiTab         = lazy(() => import("@/pages/app/tabs/PourMoiTab"));
const ActionsTab         = lazy(() => import("@/pages/app/tabs/ActionsTab"));
const TendancesTab       = lazy(() => import("@/pages/app/tabs/TendancesTab"));
const AideTab            = lazy(() => import("@/pages/app/tabs/AideTab"));
const ChatView           = lazy(() => import("@/pages/app/chat/ChatView"));
const AdminLayout        = lazy(() => import("@/layouts/AdminLayout"));
const AdminDashboard     = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers         = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminUserDetail    = lazy(() => import("@/pages/admin/AdminUserDetail"));
const AdminOffers        = lazy(() => import("@/pages/admin/AdminOffers"));
const AdminGoals         = lazy(() => import("@/pages/admin/AdminGoals"));
const AdminThreads       = lazy(() => import("@/pages/admin/AdminThreads"));
const AdminThreadDetail  = lazy(() => import("@/pages/admin/AdminThreadDetail"));
const AdminDocuments     = lazy(() => import("@/pages/admin/AdminDocuments"));
const AdminIntents       = lazy(() => import("@/pages/admin/AdminIntents"));
const AdminScraping      = lazy(() => import("@/pages/admin/AdminScraping"));

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

                <Route path="/app" element={<PrivateRoute><AppPage /></PrivateRoute>}>
                  <Route index element={<Navigate to="pour-moi" replace />} />
                  <Route path="pour-moi"  element={<PourMoiTab />} />
                  <Route path="actions"   element={<ActionsTab />} />
                  <Route path="tendances" element={<TendancesTab />} />
                  <Route path="aide"      element={<AideTab />} />
                </Route>

                <Route path="/app/chat/:threadId" element={<PrivateRoute><ChatView /></PrivateRoute>} />

                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users"             element={<AdminUsers />} />
                  <Route path="users/:userId"     element={<AdminUserDetail />} />
                  <Route path="offers"            element={<AdminOffers />} />
                  <Route path="goals"             element={<AdminGoals />} />
                  <Route path="threads"           element={<AdminThreads />} />
                  <Route path="threads/:threadId" element={<AdminThreadDetail />} />
                  <Route path="documents"         element={<AdminDocuments />} />
                  <Route path="intents"           element={<AdminIntents />} />
                  <Route path="scraping"          element={<AdminScraping />} />
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
