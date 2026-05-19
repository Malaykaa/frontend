import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Ban, CheckCircle, ShieldCheck, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminUser, useDeleteAdminUser, useUpdateAdminUser } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";

const GOAL_LABELS: Record<string, string> = { career:"Carrière", scholarship:"Bourse", funding:"Financement", exam:"Concours", tender:"Appel d'offres", study_grant:"Recherche", freelance:"Freelance" };
const STATUS_LABELS: Record<string, string> = { active:"Actif", completed:"Terminé", paused:"En pause", open:"Ouvert", closed:"Fermé" };

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useAdminUser(userId ?? "");
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();

  if (isLoading) return <div className="p-6 space-y-4 animate-pulse"><div className="h-6 w-48 rounded bg-muted" /><div className="h-32 rounded-xl bg-muted" /></div>;
  if (isError || !user) return <div className="p-6"><p className="text-sm text-destructive">Utilisateur introuvable.</p><Button variant="ghost" className="mt-2" onClick={() => navigate("/admin/users")}>Retour</Button></div>;

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate("/admin/users")}>
        <ArrowLeft className="h-4 w-4" /> Utilisateurs
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email ?? user.phone ?? user.id}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px]">{user.role === "admin" ? "Admin" : "Utilisateur"}</Badge>
            <Badge variant={user.is_active ? "default" : "destructive"} className="text-[10px]">{user.is_active ? "Actif" : "Inactif"}</Badge>
            {user.primary_role && <Badge variant="outline" className="text-[10px]">{user.primary_role}</Badge>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => updateUser.mutate({ userId: user.id, payload: { role: user.role === "admin" ? "b2c" : "admin" } })} className="gap-1.5">
            {user.role === "admin" ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
            {user.role === "admin" ? "Rétrograder" : "Passer admin"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => updateUser.mutate({ userId: user.id, payload: { is_active: !user.is_active } })} className="gap-1.5">
            {user.is_active ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
            {user.is_active ? "Désactiver" : "Activer"}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => { if (confirm(`Supprimer ${user.email ?? user.id} ?`)) deleteUser.mutate(user.id, { onSuccess: () => navigate("/admin/users") }); }}>Supprimer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Profil</h2>
          <dl className="space-y-1.5 text-sm">
            {[["Pays", user.country], ["Ville", user.city], ["Domaine", user.domain], ["Filière", user.field_of_study], ["Langue", user.language], ["Né(e)", user.birth_year ? String(user.birth_year) : null], ["Genre", user.gender], ["Inscrit", formatRelativeTime(user.created_at)]].map(([label, value]) => (
              <div key={label as string} className="flex gap-2"><dt className="text-muted-foreground w-32 shrink-0">{label}</dt><dd className="font-medium truncate">{value ?? "—"}</dd></div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Activité</h2>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Threads", value: user.threads_count }, { label: "Objectifs", value: user.goals_count }, { label: "Documents", value: user.documents_count }].map(({ label, value }) => (
              <div key={label} className="rounded-lg border p-3 text-center"><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground mt-0.5">{label}</p></div>
            ))}
          </div>
        </div>
      </div>

      {user.recent_goals.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between"><h2 className="text-sm font-semibold">Derniers objectifs</h2><Link to={`/admin/goals?user_id=${user.id}`} className="text-xs text-primary hover:underline">Voir tous</Link></div>
          <table className="w-full text-sm"><tbody>{user.recent_goals.map((g) => (
            <tr key={g.id} className="border-b last:border-0 hover:bg-muted/20">
              <td className="px-4 py-2.5 text-xs font-medium">{GOAL_LABELS[g.type] ?? g.type}{g.preset_key && <span className="ml-2 text-muted-foreground">{g.preset_key}</span>}</td>
              <td className="px-4 py-2.5"><Badge variant="outline" className="text-[10px]">{STATUS_LABELS[g.status] ?? g.status}</Badge></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{formatRelativeTime(g.created_at)}</td>
            </tr>
          ))}</tbody></table>
        </div>
      )}

      {user.recent_threads.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between"><h2 className="text-sm font-semibold">Derniers threads</h2><Link to={`/admin/threads?user_id=${user.id}`} className="text-xs text-primary hover:underline">Voir tous</Link></div>
          <table className="w-full text-sm"><tbody>{user.recent_threads.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20">
              <td className="px-4 py-2.5"><Link to={`/admin/threads/${t.id}`} className="text-xs font-medium hover:text-primary">{t.title ?? "(sans titre)"}</Link></td>
              <td className="px-4 py-2.5"><Badge variant={t.status === "open" ? "default" : "secondary"} className="text-[10px]">{t.status === "open" ? "Ouvert" : "Fermé"}</Badge></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{t.message_count} msg</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground text-right">{formatRelativeTime(t.created_at)}</td>
            </tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
