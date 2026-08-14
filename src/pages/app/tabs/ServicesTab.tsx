import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Briefcase, CheckCircle2, Clock, Handshake, Inbox, Search, Store,
} from "lucide-react";
import { useInbox, useMyProvider, useMyRequests } from "@/hooks/queries/use-services";
import { QueryError, statusLabel } from "@/pages/app/services/shared";
import { cn } from "@/shared/lib/utils";

/**
 * Point d'entrée unique du module Services.
 *
 * Deux portes — proposer / chercher — puis un résumé de ce qui bouge de chaque
 * côté. L'utilisateur peut être les deux à la fois : rien ne l'oblige à choisir
 * un camp, et les deux blocs coexistent sans se gêner.
 */
export default function ServicesTab() {
  const navigate = useNavigate();
  const { data: provider, isError: providerError, refetch: refetchProvider } = useMyProvider();
  const { data: inbox } = useInbox();
  const { data: requests, isError: requestsError } = useMyRequests();

  const pendingCount = (inbox ?? []).filter((i) => i.decision === "pending").length;
  const wonCount = (inbox ?? []).filter((i) => i.decision === "client_accepted").length;
  const activeRequests = (requests ?? []).filter(
    (r) => r.status === "open" || r.status === "public"
  ).length;

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <div>
        <h1 className="text-lg font-bold">Services</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Proposez vos compétences ou trouvez la bonne personne
        </p>
      </div>

      {(providerError || requestsError) && (
        <QueryError onRetry={() => void refetchProvider()} />
      )}

      {/* Les deux portes d'entrée */}
      <div className="flex flex-col gap-2">
        <EntryButton
          Icon={Store}
          title="Proposer mes services"
          subtitle={
            provider?.status === "published"
              ? "Votre vitrine est visible"
              : provider
              ? "Vitrine créée — à publier"
              : "Créez votre vitrine"
          }
          tone="emerald"
          badge={pendingCount > 0 ? `${pendingCount} nouvelle${pendingCount > 1 ? "s" : ""}` : undefined}
          onClick={() => navigate("/app/services/prestataire")}
        />
        <EntryButton
          Icon={Search}
          title="Chercher un prestataire"
          subtitle={
            activeRequests > 0
              ? `${activeRequests} demande${activeRequests > 1 ? "s" : ""} en cours`
              : "Décrivez votre besoin"
          }
          tone="violet"
          onClick={() => navigate("/app/services/demandes")}
        />
      </div>

      {/* Côté prestataire — n'apparaît qu'une fois la vitrine créée */}
      {provider && (
        <section className="space-y-2.5">
          <SectionTitle Icon={Inbox} label="Mon activité de prestataire" />
          <div className="grid grid-cols-3 gap-2.5">
            <MiniStat value={pendingCount} label="À traiter" tone="amber" />
            <MiniStat
              value={(inbox ?? []).filter((i) => i.decision === "provider_accepted").length}
              label="En attente client"
              tone="sky"
            />
            <MiniStat value={wonCount} label="Obtenues" tone="emerald" />
          </div>
          <button
            onClick={() => navigate("/app/services/prestataire")}
            className="flex w-full items-center justify-between rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40"
          >
            <span className="text-sm font-medium">Voir mes propositions</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </section>
      )}

      {/* Côté client — n'apparaît qu'une fois une demande créée */}
      {(requests?.length ?? 0) > 0 && (
        <section className="space-y-2.5">
          <SectionTitle Icon={Briefcase} label="Mes demandes" />
          <div className="space-y-2">
            {(requests ?? []).slice(0, 3).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/app/services/demandes/${r.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40"
              >
                <RequestStatusDot status={r.status} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{statusLabel(r.status)}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
          {(requests?.length ?? 0) > 3 && (
            <button
              onClick={() => navigate("/app/services/demandes")}
              className="w-full text-center text-xs font-medium text-primary"
            >
              Voir les {requests?.length} demandes
            </button>
          )}
        </section>
      )}

      {/* Explication du fonctionnement — visible tant que rien n'est engagé */}
      {!provider && (requests?.length ?? 0) === 0 && <HowItWorks />}
    </div>
  );
}

// ── Sous-composants ────────────────────────────────────────────────────────

const TONES = {
  emerald: "bg-emerald-100 text-emerald-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
  sky: "bg-sky-100 text-sky-600",
} as const;

/**
 * Porte d'entrée — une ligne, pas une carte.
 *
 * Format volontairement dense : hauteur d'une rangée de liste mobile, icône
 * cadrée sur la hauteur du texte, aucun remplissage autour des mots. Le badge
 * est dans le flux plutôt qu'en position absolue, qui obligeait à réserver du
 * vide en haut à droite même quand il n'y avait rien à afficher.
 */
function EntryButton({
  Icon, title, subtitle, tone, badge, onClick,
}: {
  Icon: typeof Store;
  title: string;
  subtitle: string;
  tone: keyof typeof TONES;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/40 active:bg-muted/60"
    >
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-tight">{title}</span>
        <span className="block truncate text-[11px] leading-tight text-muted-foreground">
          {subtitle}
        </span>
      </span>
      {badge && (
        <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
          {badge}
        </span>
      )}
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function SectionTitle({ Icon, label }: { Icon: typeof Inbox; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h2>
    </div>
  );
}

function MiniStat({ value, label, tone }: { value: number; label: string; tone: keyof typeof TONES }) {
  return (
    <div className="rounded-xl border bg-card p-3 text-center">
      <p className={cn("text-xl font-bold tabular-nums", value > 0 && TONES[tone].split(" ")[1])}>
        {value}
      </p>
      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}

function RequestStatusDot({ status }: { status: string }) {
  const color =
    status === "fulfilled" ? "bg-emerald-500"
    : status === "public" ? "bg-violet-500"
    : status === "open" ? "bg-amber-500"
    : "bg-muted-foreground/40";
  return <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} />;
}

function HowItWorks() {
  const steps = [
    { Icon: Search, text: "Vous décrivez votre besoin en quelques mots" },
    { Icon: Clock, text: "Les prestataires correspondants reçoivent votre demande" },
    { Icon: CheckCircle2, text: "Ceux qui sont disponibles acceptent" },
    { Icon: Handshake, text: "Vous choisissez — les coordonnées sont alors échangées" },
  ];
  return (
    <section className="rounded-2xl border border-dashed p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Comment ça marche
      </h2>
      <ol className="mt-3 space-y-3">
        {steps.map(({ Icon, text }, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
