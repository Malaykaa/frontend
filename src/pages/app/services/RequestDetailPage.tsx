import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Check, Clock, Globe2, Handshake, Loader2, MapPin, Pencil, Phone, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/auth/CountrySelect";
import {
  useClientDecide, useCloseRequest, useGoPublic, useRequest, useUpdateRequest,
} from "@/hooks/queries/use-services";
import type { MatchCard, ServiceRequestDetail } from "@/services/api/services.api";
import {
  Chip, DeliveryModeSelect, Linkified, QueryError, deliveryModeLabel, statusLabel,
} from "@/pages/app/services/shared";
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
  const [editing, setEditing] = useState(false);

  // Modifiable tant qu'aucun prestataire n'a été retenu et que la demande
  // n'est pas clôturée — même règle que côté serveur.
  const canEdit = data?.status === "open" || data?.status === "public";

  return (
    <div className="flex flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => (editing ? setEditing(false) : navigate("/app/services/demandes"))}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold">
          {editing ? "Modifier la demande" : (data?.title ?? "Demande")}
        </h1>
        {!editing && canEdit && (
          <button
            onClick={() => setEditing(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-muted"
            aria-label="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
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

      {data && editing && (
        <EditRequestForm data={data} onDone={() => setEditing(false)} />
      )}

      {data && !editing && (
        <div className="space-y-5">
          {/* Résumé */}
          <div className="rounded-xl border bg-card p-3.5">
            <p className="text-xs text-muted-foreground">{statusLabel(data.status)}</p>
            <p className="mt-1.5 text-sm">{data.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip tone="sky" icon={MapPin}>
                {data.delivery_mode === "remote"
                  ? "À distance"
                  : [data.city, data.country].filter(Boolean).join(", ") || deliveryModeLabel(data.delivery_mode)}
              </Chip>
              {data.budget_hint && <Chip tone="emerald">{data.budget_hint}</Chip>}
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

/**
 * Modification d'une demande déjà publiée.
 *
 * Mêmes champs qu'à la création, préremplis avec les valeurs actuelles.
 * Volontairement séparé du formulaire de création : celui-ci n'a ni type de
 * demande à choisir en avant-plan ni bouton « Trouver des prestataires » —
 * la demande existe déjà, il ne s'agit que d'ajuster son contenu.
 */
function EditRequestForm({
  data, onDone,
}: { data: ServiceRequestDetail; onDone: () => void }) {
  const update = useUpdateRequest();
  const [form, setForm] = useState({
    title: data.title,
    description: data.description,
    keywordsRaw: (data.keywords ?? []).join(", "),
    delivery_mode: data.delivery_mode,
    city: data.city ?? "",
    country: data.country ?? "",
    budget_hint: data.budget_hint ?? "",
    contact_phone: data.contact_phone ?? "",
  });

  const canSave =
    form.title.trim().length >= 3 && form.description.trim().length >= 10
    && form.contact_phone.trim().length >= 6;

  const save = () =>
    update.mutate(
      {
        id: data.id,
        payload: {
          title: form.title.trim(),
          description: form.description.trim(),
          keywords: form.keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 15),
          delivery_mode: form.delivery_mode,
          city: form.delivery_mode === "remote" ? null : form.city || null,
          country: form.delivery_mode === "remote" ? null : form.country || null,
          budget_hint: form.budget_hint || null,
          contact_phone: form.contact_phone.trim(),
        },
      },
      { onSuccess: () => onDone() }
    );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Votre besoin en une ligne</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          maxLength={300}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Détaillez votre demande</Label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={5}
          maxLength={5000}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Mots-clés</Label>
        <Input
          value={form.keywordsRaw}
          onChange={(e) => setForm((f) => ({ ...f, keywordsRaw: e.target.value }))}
          placeholder="développement web, React, intégration"
        />
      </div>

      <DeliveryModeSelect
        value={form.delivery_mode}
        onChange={(delivery_mode) => setForm((f) => ({ ...f, delivery_mode }))}
      />

      {form.delivery_mode !== "remote" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Ville</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Abidjan"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Pays</Label>
            <CountrySelect
              value={form.country}
              onChange={(code) => setForm((f) => ({ ...f, country: code }))}
              placeholder="Sélectionner"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Budget indicatif</Label>
        <Input
          value={form.budget_hint}
          onChange={(e) => setForm((f) => ({ ...f, budget_hint: e.target.value }))}
          placeholder="Entre 20 000 et 50 000 FCFA"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Numéro à contacter</Label>
        <Input
          type="tel"
          value={form.contact_phone}
          onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
          placeholder="+225 07 00 00 00 00"
        />
      </div>

      <Button className="w-full gap-2" disabled={!canSave || update.isPending} onClick={save}>
        {update.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Enregistrer les modifications
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        Les prestataires déjà sollicités ne sont pas prévenus du changement.
        De nouveaux profils correspondant à la version modifiée pourront
        apparaître.
      </p>
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
            <Chip key={k} tone="violet">{k}</Chip>
          ))}
        </div>
      )}

      {/* Réalisations passées — mêmes informations que le prestataire a
          renseignées dans sa vitrine, avec ses liens rendus cliquables. */}
      {card.portfolio && (
        <div className="mt-2.5 rounded-lg bg-muted/40 p-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Réalisations
          </p>
          <div className="mt-1 text-xs text-muted-foreground">
            <Linkified text={card.portfolio} />
          </div>
        </div>
      )}

      {/* Le prestataire a toujours une ville et un pays. */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Chip tone="sky" icon={MapPin}>
          {[card.city, card.country].filter(Boolean).join(", ")}
        </Chip>
        {card.rate_text && <Chip tone="emerald">{card.rate_text}</Chip>}
        {card.availability_text && (
          <span className="inline-flex items-center text-[11px] text-muted-foreground">
            {card.availability_text}
          </span>
        )}
        {card.years_experience !== null && (
          <span className="inline-flex items-center text-[11px] text-muted-foreground">
            {card.years_experience} ans d'exp.
          </span>
        )}
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
