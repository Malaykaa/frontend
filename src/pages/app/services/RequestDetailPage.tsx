import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Check, Clock, Globe2, Handshake, Loader2, MapPin, Phone, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useClientDecide, useCloseRequest, useGoPublic, useRequest,
} from "@/hooks/queries/use-services";
import type { MatchCard } from "@/services/api/services.api";
import { QueryError, statusLabel } from "@/pages/app/services/shared";
import { cn } from "@/shared/lib/utils";

/**
 * Suivi d'une demande, côté client.
 *
 * Trois listes, dans l'ordre de ce qui appelle une action :
 * 1. Ont accepté  — c'est ici que le client doit trancher
 * 2. Mis en relation — coordonnées visibles
 * 3. Sollicités    — en attente, rien à faire
 *
 * Le regroupement vient du serveur : la règle « qui est visible et quand »
 * n'existe qu'à un seul endroit.
 */
export default function RequestDetailPage() {
  const { requestId = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useRequest(requestId);
  const goPublicMut = useGoPublic();
  const closeMut = useCloseRequest();

  return (
    <div className="flex flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/services/demandes")}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="truncate text-lg font-bold">{data?.title ?? "Demande"}</h1>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />)}
        </div>
      )}

      {isError && (
        <QueryError
          message="Impossible de charger cette demande."
          error={error}
          onRetry={() => void refetch()}
        />
      )}

      {data && (
        <div className="space-y-5">
          {/* Résumé */}
          <div className="rounded-xl border bg-card p-3.5">
            <p className="text-xs text-muted-foreground">{statusLabel(data.status)}</p>
            <p className="mt-1.5 text-sm">{data.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {(data.city || data.country) && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {[data.city, data.country].filter(Boolean).join(", ")}
                </span>
              )}
              {data.budget_hint && <span>Budget : {data.budget_hint}</span>}
            </div>
          </div>

          {/* Ceux qui ont accepté — la seule liste qui demande une décision */}
          {data.accepted.length > 0 && (
            <Section title="Ont accepté votre demande" count={data.accepted.length} tone="amber">
              {data.accepted.map((m) => (
                <ProviderCard key={m.id} match={m} requestId={requestId} actionable />
              ))}
            </Section>
          )}

          {/* Mise en relation faite */}
          {data.connected.length > 0 && (
            <Section title="Mise en relation" count={data.connected.length} tone="emerald">
              {data.connected.map((m) => (
                <ProviderCard key={m.id} match={m} requestId={requestId} />
              ))}
            </Section>
          )}

          {/* Sollicités, sans réponse */}
          {data.pending.length > 0 && (
            <Section title="Demande transmise" count={data.pending.length} tone="muted">
              {data.pending.map((m) => (
                <ProviderCard key={m.id} match={m} requestId={requestId} />
              ))}
            </Section>
          )}

          {/* Aucun destinataire du tout */}
          {!data.accepted.length && !data.pending.length && !data.connected.length && (
            <div className="rounded-2xl border border-dashed py-10 text-center">
              <p className="text-sm font-medium">Aucun prestataire correspondant</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                Élargissez au grand public : votre demande sera proposée aux
                personnes dont les objectifs correspondent.
              </p>
            </div>
          )}

          {data.declined_count > 0 && (
            <p className="text-center text-[11px] text-muted-foreground">
              {data.declined_count} prestataire{data.declined_count > 1 ? "s" : ""} non disponible
              {data.declined_count > 1 ? "s" : ""}
            </p>
          )}

          {/* Élargissement — décision du client, jamais automatique */}
          {data.can_go_public && (
            <div className="rounded-xl border border-dashed p-3.5">
              <div className="flex items-start gap-2.5">
                <Globe2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">Aucun profil ne vous convient ?</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    Nous pouvons transmettre votre demande à d'autres utilisateurs
                    dont les objectifs correspondent. Leur profil vous sera montré
                    s'ils acceptent.
                  </p>
                </div>
              </div>
              <Button
                size="sm" variant="outline" className="mt-3 w-full gap-1.5"
                disabled={goPublicMut.isPending}
                onClick={() => goPublicMut.mutate(requestId)}
              >
                {goPublicMut.isPending
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Globe2 className="h-3.5 w-3.5" />}
                Élargir au grand public
              </Button>
            </div>
          )}

          {data.status !== "closed" && (
            <button
              onClick={() => closeMut.mutate(requestId)}
              disabled={closeMut.isPending}
              className="w-full py-2 text-center text-xs text-muted-foreground underline"
            >
              Clôturer cette demande
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const TONES = {
  amber: "text-amber-600",
  emerald: "text-emerald-600",
  muted: "text-muted-foreground",
} as const;

function Section({
  title, count, tone, children,
}: { title: string; count: number; tone: keyof typeof TONES; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className={cn("text-xs font-semibold uppercase tracking-wide", TONES[tone])}>
        {title} · {count}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function ProviderCard({
  match, requestId, actionable = false,
}: { match: MatchCard; requestId: string; actionable?: boolean }) {
  const decide = useClientDecide();
  const card = match.card;
  const connected = match.decision === "client_accepted";

  // Un destinataire du grand public qui n'a pas encore répondu n'a pas de
  // carte : il n'a jamais consenti à être exposé.
  if (!card) {
    return (
      <div className="rounded-xl border border-dashed bg-card/50 p-3.5">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Demande transmise — en attente de réponse
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border bg-card p-3.5",
      connected && "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{card.title}</p>
          <p className="text-[11px] text-muted-foreground">{card.display_name}</p>
        </div>
        {match.match_score !== null && (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
            {Math.round(match.match_score)} %
          </span>
        )}
      </div>

      {card.description && (
        <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">{card.description}</p>
      )}

      {card.keywords.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {card.keywords.slice(0, 6).map((k) => (
            <span key={k} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              {k}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {(card.city || card.country) && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {[card.city, card.country].filter(Boolean).join(", ")}
          </span>
        )}
        {card.rate_text && <span>{card.rate_text}</span>}
        {card.availability_text && <span>{card.availability_text}</span>}
        {card.years_experience !== null && <span>{card.years_experience} ans d'exp.</span>}
      </div>

      {/* Coordonnées — uniquement après double validation */}
      {connected && match.contact_phone && (
        <a
          href={`tel:${match.contact_phone}`}
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" />
          {match.contact_phone}
        </a>
      )}

      {actionable && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm" className="flex-1 gap-1.5"
            disabled={decide.isPending}
            onClick={() => decide.mutate({ requestId, matchId: match.id, accept: true })}
          >
            {decide.isPending
              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
              : <Handshake className="h-3.5 w-3.5" />}
            Retenir
          </Button>
          <Button
            size="sm" variant="outline" className="gap-1.5"
            disabled={decide.isPending}
            onClick={() => decide.mutate({ requestId, matchId: match.id, accept: false })}
          >
            <X className="h-3.5 w-3.5" />
            Écarter
          </Button>
        </div>
      )}

      {connected && !match.contact_phone && (
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-600">
          <Check className="h-3 w-3" />
          Mise en relation établie
        </p>
      )}
    </div>
  );
}
