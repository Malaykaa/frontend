import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminThread, useDeleteAdminThread } from "@/hooks/queries/use-admin";
import { formatRelativeTime, cn } from "@/shared/lib/utils";

export default function AdminThreadDetail() {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { data: thread, isLoading, isError } = useAdminThread(threadId ?? "");
  const deleteThread = useDeleteAdminThread();

  if (isLoading) return <div className="p-6 space-y-3 animate-pulse"><div className="h-6 w-48 rounded bg-muted" />{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted" />)}</div>;
  if (isError || !thread) return <div className="p-6"><p className="text-sm text-destructive">Thread introuvable.</p><Button variant="ghost" className="mt-2" onClick={() => navigate("/admin/threads")}>Retour</Button></div>;

  const del = () => { if (confirm(`Supprimer ce thread et ses ${thread.message_count} messages ?`)) deleteThread.mutate(thread.id, { onSuccess: () => navigate("/admin/threads") }); };

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate("/admin/threads")}>
        <ArrowLeft className="h-4 w-4" /> Threads
      </button>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">{thread.title ?? "(sans titre)"}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant={thread.status === "open" ? "default" : "secondary"} className="text-[10px]">{thread.status === "open" ? "Ouvert" : "Fermé"}</Badge>
            <span className="text-xs text-muted-foreground">{thread.message_count} message{thread.message_count !== 1 ? "s" : ""}</span>
            {thread.user_email && <Link to={`/admin/users/${thread.user_id}`} className="text-xs text-primary hover:underline">{thread.user_email}</Link>}
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={del} className="gap-1.5 shrink-0"><Trash2 className="h-3.5 w-3.5" />Supprimer</Button>
      </div>

      <div className="space-y-3">
        {thread.messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Aucun message.</p>}
        {thread.messages.map((msg) => (
          <div key={msg.id} className={cn("rounded-xl border p-3 space-y-1", !msg.is_active && "opacity-50", msg.role === "assistant" ? "bg-muted/30" : "bg-card")}>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={msg.role === "assistant" ? "default" : "secondary"} className="text-[10px]">{msg.role === "assistant" ? "IA" : "User"}</Badge>
              {msg.agent_id && <span className="text-[10px] text-muted-foreground">{msg.agent_id}</span>}
              {msg.processing_ms && <span className="text-[10px] text-muted-foreground">{msg.processing_ms}ms</span>}
              {!msg.is_active && <Badge variant="destructive" className="text-[10px]">Supprimé</Badge>}
              <span className="text-[10px] text-muted-foreground ml-auto">{formatRelativeTime(msg.created_at)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
