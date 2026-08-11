import { useState } from "react";
import {
  AlertCircle, Eye, Plus, RefreshCw,
  Search, ShieldCheck, ShieldOff, Trash2, Users, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { useAdminUsers, useCreateAdminUser, useDeleteAdminUser, useUpdateAdminUser } from "@/hooks/queries/use-admin";
import { formatRelativeTime, cn } from "@/shared/lib/utils";
import { useNavigate } from "react-router-dom";
import type { AdminUserItem } from "@/shared/types";
import type { AdminUserCreate } from "@/services/api/admin.api";

const EMPTY_FORM: AdminUserCreate = {
  email: "", phone: "", password: "", role: "b2c",
  first_name: "", last_name: "", primary_role: "", country: "",
};

const ROLE_LABELS: Record<string, string> = { b2c: "Utilisateur", admin: "Admin" };
const PRIMARY_ROLE_LABELS: Record<string, string> = {
  student: "Étudiant", professional: "Professionnel", job_seeker: "Chercheur d'emploi",
};

// ── Modal création utilisateur ────────────────────────────────────────────────

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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errors.length > 0 && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-1">
              {errors.map(e => <p key={e} className="text-xs text-destructive">{e}</p>)}
            </div>
          )}
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

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, icon: Icon, color, dot, active, onClick,
}: {
  label: string; value: number | string; icon?: React.ElementType;
  color?: string; dot?: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left transition-all w-full",
        active ? "border-primary/40 bg-primary/5" : "bg-card hover:bg-muted/30",
        !onClick && "cursor-default",
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {dot && <span className={cn("h-2 w-2 rounded-full flex-shrink-0", dot)} />}
        {Icon && !dot && <Icon className={cn("h-3.5 w-3.5", color ?? "text-muted-foreground")} />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </button>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function AdminUsers() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, error, refetch } = useAdminUsers({
    page, size: 25, q: q || undefined,
    role: roleFilter || undefined, active: activeFilter,
  });
  const updateUser = useUpdateAdminUser();
  const deleteUser = useDeleteAdminUser();

  // Stats queries
  const { data: dActive }   = useAdminUsers({ page: 1, size: 1, active: true });
  const { data: dInactive } = useAdminUsers({ page: 1, size: 1, active: false });
  const { data: dAdmins }   = useAdminUsers({ page: 1, size: 1, role: "admin" });

  const stats = {
    total:    (dActive?.total ?? 0) + (dInactive?.total ?? 0),
    active:   dActive?.total ?? 0,
    inactive: dInactive?.total ?? 0,
    admins:   dAdmins?.total ?? 0,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showCreate && <UserCreatePanel onClose={() => setShowCreate(false)} />}

      {/* ── Header ── */}
      <div className="border-b bg-background px-6 pt-5 pb-4 shrink-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Utilisateurs</h1>
            <p className="text-xs text-muted-foreground">Comptes enregistrés sur la plateforme</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Nouvel utilisateur
          </Button>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard label="Total" value={stats.total} icon={Users} />
          <KpiCard
            label="Actifs"
            value={stats.active}
            dot="bg-emerald-500"
            active={activeFilter === true}
            onClick={() => setActiveFilter(activeFilter === true ? undefined : true)}
          />
          <KpiCard
            label="Inactifs"
            value={stats.inactive}
            dot="bg-red-400"
            active={activeFilter === false}
            onClick={() => setActiveFilter(activeFilter === false ? undefined : false)}
          />
          <KpiCard
            label="Admins"
            value={stats.admins}
            dot="bg-violet-500"
            active={roleFilter === "admin"}
            onClick={() => { setRoleFilter(roleFilter === "admin" ? "" : "admin"); setPage(1); }}
          />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 h-9"
              placeholder="Email, téléphone, nom…"
              value={q}
              onChange={e => { setQ(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">Tous les rôles</option>
            <option value="b2c">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm"
            value={activeFilter === undefined ? "" : String(activeFilter)}
            onChange={e => {
              setActiveFilter(e.target.value === "" ? undefined : e.target.value === "true");
              setPage(1);
            }}
          >
            <option value="">Tous les statuts</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>
          {data && (
            <span className="ml-auto self-center text-xs text-muted-foreground">
              {data.total.toLocaleString()} utilisateur{data.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Erreur ── */}
      {isError && (
        <div className="mx-6 mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive flex-1">
            {(error as { message?: string })?.message ?? "Impossible de charger les utilisateurs."}
          </p>
          <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-destructive hover:underline">
            <RefreshCw className="h-3 w-3" /> Réessayer
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b bg-muted/50">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Utilisateur</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Rôle métier</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Accès</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Statut</th>
              <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">T · O · D</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Inscrit</th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 rounded bg-muted w-40" /></td>
                  <td className="px-4 py-4"><div className="h-3 rounded bg-muted w-20" /></td>
                  <td className="px-4 py-4"><div className="h-5 rounded bg-muted w-16" /></td>
                  <td className="px-4 py-4"><div className="h-5 rounded bg-muted w-12" /></td>
                  <td className="px-4 py-4"><div className="h-3 rounded bg-muted w-12 mx-auto" /></td>
                  <td className="px-4 py-4"><div className="h-3 rounded bg-muted w-16" /></td>
                  <td className="px-4 py-4"></td>
                </tr>
              ))
              : data?.items.map((u: AdminUserItem) => {
                const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
                return (
                  <tr
                    key={u.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                          {(u.first_name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium leading-tight">{name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email ?? u.phone ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {u.primary_role ? (PRIMARY_ROLE_LABELS[u.primary_role] ?? u.primary_role) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                        {ROLE_LABELS[u.role] ?? u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", u.is_active ? "bg-emerald-500" : "bg-red-400")} />
                        <span className={cn("text-xs", u.is_active ? "text-emerald-600" : "text-red-500")}>
                          {u.is_active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-center tabular-nums text-muted-foreground">
                      {u.threads_count} · {u.goals_count} · {u.documents_count}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatRelativeTime(u.created_at)}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7"
                          onClick={() => navigate(`/admin/users/${u.id}`)}
                          title="Voir le profil"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7"
                          onClick={() => updateUser.mutate({ userId: u.id, payload: { role: u.role === "admin" ? "b2c" : "admin" } })}
                          title={u.role === "admin" ? "Rétrograder" : "Passer admin"}
                        >
                          {u.role === "admin"
                            ? <ShieldOff className="h-3.5 w-3.5 text-destructive" />
                            : <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => { if (confirm(`Supprimer ${u.email ?? u.id} ?`)) deleteUser.mutate(u.id); }}
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            {!isLoading && data?.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted-foreground">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data && (
          <AdminPagination page={data.page} pages={data.pages} total={data.total} size={data.size} onPage={setPage} />
        )}
      </div>
    </div>
  );
}
