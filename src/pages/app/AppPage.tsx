import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";
import { Sidebar } from "@/components/app/Sidebar";
import { SettingsPanel } from "@/components/app/SettingsPanel";
import { NotificationPanel } from "@/components/app/NotificationPanel";

function TabLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
    </div>
  );
}

export default function AppPage() {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen]      = useState(false);
  const [notifOpen,    setNotifOpen]         = useState(false);

  return (
    <>
      {/* ── MOBILE (< 1024px) ────────────────────────────── */}
      <div className="flex min-h-screen flex-col lg:hidden">
        <AppHeader
          compact
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
        />
        <main
          key={location.pathname}
          className="flex flex-1 flex-col overflow-y-auto pb-20 animate-fade-in"
        >
          <Suspense fallback={<TabLoader />}>
            <Outlet />
          </Suspense>
        </main>
        <BottomNav />
      </div>

      {/* ── DESKTOP (≥ 1024px) ───────────────────────────── */}
      <div className="hidden h-screen lg:flex overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader
            hideLogo
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNotifications={() => setNotifOpen(true)}
          />
          <main
            key={location.pathname}
            className="flex flex-1 flex-col overflow-y-auto animate-fade-in"
          >
            <div className="mx-auto w-full max-w-2xl px-6 py-6">
              <Suspense fallback={<TabLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {/* Panneaux globaux */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
