import { useState } from "react";
import { AlertCircle, Plus, RefreshCw, Search, ShieldCheck, ShieldOff, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminUsers, useCreateAdminUser, useDeleteAdminUser, useUpdateAdminUser } from "@/hooks/queries/use-admin";
import { formatRelativeTime } from "@/shared/lib/utils";
import { useNavigate } from "react-router-dom";
import type { AdminUserItem } from "@/shared/types";
import type { AdminUserCreate } from "@/services/api/admin.api";

const EMPTY_FORM: AdminUserCreate = {
  email: "", phone: "", password: "", role: "b2c",
  first_name: "", last_name: "", primary_role: "", country: "",
};

function UserCreatePanel({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<AdminUserCreate>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const create = useCreateAdminUser();

  const set = (k: keyof AdminUserCreate, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];
    if (!form.email?.trim() && !form.phone?.trim()) errs.push("Email ou numéro de téléphone requis.");
    if (!form.password || form.password.length < 8) errs.push("Mot de passe minimum 8 caractères.");
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);

    const payload: AdminUserCreate = {
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      password: form.password,
      role: form.role || "b2c",
      first_name: form.first_name?.trim() || undefined,
      last_name: form.last_name?.trim() || undefined,
      primary_role: form.primary_role || undefined,
      country: form.country?.trim() || undefined,
    };
    create.mutate(payload, { onSuccess: () => { setForm(EMPTY_FORM); onClose(); } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-background rounded-2xl border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold">Nouvel utilisateur</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errors.length > 0 && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1">
              {errors.map(e => <p key={e} className="text-xs text-destructive">{e}</p>)}
            </div>
          )}

          {/* Identité */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Prénom</label>
              <Input value={form.first_name ?? ""} onChange={e => set("first_name", e.target.value)} placeholder="Prénom" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nom</label>
              <Input value={form.last_name ?? ""} onChange={e => set("last_name", e.target.value)} placeholder="Nom" />
            </div>
          </div>

          {/* Credentials */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={form.email ?? ""} onChange={e => set("email", e.target.value)} placeholder="contact@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Téléphone</label>
            <Input type="tel" value={form.phone ?? ""} onChange={e => set("phone", e.target.value)} placeholder="+225 07 00 00 00 00" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Mot de passe <span className="text-destructive">*</span></label>
            <Input type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="Minimum 8 caractères" required />
          </div>

          {/* Profil */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Rôle métier</label>
              <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={form.primary_role ?? ""} onChange={e => set("primary_role", e.target.value)}>
                <option value="">Non précisé</option>
                <option value="student">Étudiant(e)</option>
                <option value="professional">Professionnel(le)</option>
                <option value="job_seeker">Chercheur d'emploi</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Pays</label>
              <Input value={form.country ?? ""} onChange={e => set("country", e.target.value)} placeholder="Côte d'Ivoire" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Accès</label>
            <select className="w-full h-9 rounded-md border bg-background px-3 text-sm" value={form.role ?? "b2c"} onChange={e => set("role", e.target.value)}>
              <option value="b2c">Utilisateur standard</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Création…" : "Créer le compte"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = { b2c: "Utilisateur", admin: "Admin" };

export default function AdminUsers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, error, refetch } = useAdminUsers({ page, size: 20, q: q || undefined, role: roleFilter || undefined, active: activeFilter });
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();

  return (
    <div className="p-6 space-y-4">
      {showCreate && <UserCreatePanel onClose={() => setShowCreate(false)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Utilisateurs</h1>
        <div className="flex items-center gap-2">
          {data && <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} au total</span>}
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Nouvel utilisateur
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 h-9" placeholder="Email, téléphone, nom…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
          <option value="">Tous les rôles</option><option value="b2c">Utilisateur</option><option value="admin">Admin</option>
        </select>
        <select className="h-9 rounded-md border bg-background px-3 text-sm" value={activeFilter === undefined ? "" : String(activeFilter)} onChange={(e) => { setActiveFilter(e.target.value === "" ? undefined : e.target.value === "true"); setPage(1); }}>
          <option value="">Tous les statuts</option><option value="true">Actifs</option><option value="false">Inactifs</option>
        </select>
      </div>

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive flex-1">
            {(error as { message?: string })?.message ?? "Impossible de charger la liste des utilisateurs."}
          </p>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-destructive hover:underline">
            <RefreshCw className="h-3 w-3" /> Réessayer
          </button>
        </div>
      )}

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-muted/40">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Utilisateur</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Rôle métier</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Accès</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">T·O·D</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Inscrit</th>
            <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-b animate-pulse"><td colSpan={7} className="px-4 py-4"><div className="h-4 rounded bg-muted w-2/3" /></td></tr>)
              : data?.items.map((u: AdminUserItem) => {
                  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
                  return (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{u.email ?? u.phone ?? "—"}</p></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{u.primary_role ?? "—"}</td>
                      <td className="px-4 py-3"><Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-[10px]">{ROLE_LABELS[u.role] ?? u.role}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={u.is_active ? "default" : "destructive"} className="text-[10px]">{u.is_active ? "Actif" : "Inactif"}</Badge></td>
                      <td className="px-4 py-3 text-xs text-right tabular-nums text-muted-foreground">{u.threads_count} · {u.goals_count} · {u.documents_count}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(`/admin/users/${u.id}`)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateUser.mutate({ userId: u.id, payload: { role: u.role === "admin" ? "b2c" : "admin" } })} title={u.role === "admin" ? "Rétrograder" : "Passer admin"}>
                            {u.role === "admin" ? <ShieldOff className="h-3.5 w-3.5 text-destructive" /> : <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => { if (confirm(`Supprimer ${u.email ?? u.id} ?`)) deleteUser.mutate(u.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            {!isLoading && data?.items.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé.</td></tr>}
          </tbody>
        </table>
        {data && <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />}
      </div>
    </div>
  );
}
