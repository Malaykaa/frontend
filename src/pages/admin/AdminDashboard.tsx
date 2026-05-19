import { BarChart3, Brain, Briefcase, CheckCircle, FileText, MessageSquare, Target, TrendingUp, Users, Zap } from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { useAdminStats } from "@/hooks/queries/use-admin";

export default function AdminDashboard() {
  const { data: s, isLoading, isError } = useAdminStats();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Vue d'ensemble de la plateforme Malayka</p>
      </div>

      {isError && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">Impossible de charger les statistiques.</div>}

      {isLoading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 h-20 animate-pulse flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />
              <div className="space-y-2 flex-1"><div className="h-6 w-16 rounded bg-muted" /><div className="h-3 w-24 rounded bg-muted" /></div>
            </div>
          ))}
        </div>
      )}

      {s && (
        <>
          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Utilisateurs</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <AdminStatCard label="Total utilisateurs" value={s.users_total} Icon={Users} color="bg-blue-100 text-blue-600" />
              <AdminStatCard label="Nouveaux (7 jours)" value={s.users_new_7d} Icon={TrendingUp} color="bg-emerald-100 text-emerald-600" />
              <AdminStatCard label="Objectifs créés" value={s.goals_total} Icon={Target} color="bg-violet-100 text-violet-600" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Activité Chat</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <AdminStatCard label="Threads totaux" value={s.threads_total} Icon={MessageSquare} color="bg-sky-100 text-sky-600" />
              <AdminStatCard label="Messages aujourd'hui" value={s.messages_today} Icon={Zap} color="bg-amber-100 text-amber-600" />
              <AdminStatCard label="Documents générés" value={s.documents_total} Icon={FileText} color="bg-orange-100 text-orange-600" />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Offres & Intelligence</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <AdminStatCard label="Offres actives" value={s.offers_active} Icon={CheckCircle} color="bg-emerald-100 text-emerald-600" sub={`sur ${s.offers_total.toLocaleString()} au total`} />
              <AdminStatCard label="Offres indexées" value={s.offers_total} Icon={Briefcase} color="bg-rose-100 text-rose-600" />
              <AdminStatCard label="Intentions extraites" value={s.intents_total} Icon={Brain} color="bg-pink-100 text-pink-600" />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
