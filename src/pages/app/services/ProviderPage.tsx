import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Check, CheckCircle2, Clock, Eye, EyeOff, Loader2, MapPin, Send, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/auth/CountrySelect";
import {
  useInbox, useMyProvider, useProviderDecide, usePublishProvider,
  useUnpublishProvider, useUpsertProvider,
} from "@/hooks/queries/use-services";
import type { DeliveryMode, InboxItem } from "@/services/api/services.api";
import { DeliveryModeSelect, QueryError, deliveryModeLabel } from "@/pages/app/services/shared";
import { cn } from "@/shared/lib/utils";

type Tab = "inbox" | "profile";

/**
 * Espace prestataire — les demandes reçues d'abord, la vitrine ensuite.
 *
 * L'ordre est délibéré : une fois la vitrine créée, ce que le prestataire
 * vient voir, ce sont les propositions. Le formulaire ne s'ouvre par défaut
 * que tant qu'il n'a pas encore de vitrine.
 */
export default function ProviderPage() {
  const navigate = useNavigate();
  const { data: provider, isLoading, isError, error, refetch } = useMyProvider();
  const [tab, setTab] = useState<Tab>("inbox");

  // Bascule automatique sur le formulaire tant qu'aucune vitrine n'existe :
  // la boîte de réception serait vide et n'apprendrait rien.
  useEffect(() => {
    if (!isLoading && !isError && !provider) setTab("profile");
  }, [isLoading, isError, provider]);

  return (
    <div className="flex flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app/services")}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold">Proposer mes services</h1>
      </div>

      {provider && (
        <div className="mb-4 flex gap-1 border-b">
          <TabButton active={tab === "inbox"} onClick={() => setTab("inbox")}>
            Mes propositions
          </TabButton>
          <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
            Ma vitrine
          </TabButton>
        </div>
      )}

      {isError ? (
        <QueryError
          message="Impossible de charger votre espace prestataire."
          error={error}
          onRetry={() => void refetch()}
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border bg-card" />
          ))}
        </div>
      ) : tab === "inbox" ? (
        <InboxSection />
      ) : (
        <ProfileSection />
      )}
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
        active ? "border-primary text-primary" : "border-transparent text-muted-foreground"
      )}
    >
      {children}
    </button>
  );
}

// ── Boîte de réception ─────────────────────────────────────────────────────

function InboxSection() {
  const { data: items, isLoading, isError, error, refetch } = useInbox();

  if (isError) {
    return (
      <QueryError
        message="Impossible de charger vos propositions."
        error={error}
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl border bg-card" />)}
      </div>
    );
  }

  const list = items ?? [];
  const pending = list.filter((i) => i.decision === "pending");
  const waiting = list.filter((i) => i.decision === "provider_accepted");
  const won = list.filter((i) => i.decision === "client_accepted");
  const lost = list.filter(
    (i) => i.decision === "provider_declined" || i.decision === "client_declined"
  );

  if (!list.length) {
    return (
      <div className="rounded-2xl border border-dashed py-12 text-center">
        <p className="text-sm font-medium">Aucune demande pour le moment</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
          Dès qu'une demande correspondra à votre vitrine, elle apparaîtra ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Group title="À traiter" count={pending.length} tone="amber">
        {pending.map((i) => <InboxCard key={i.match_id} item={i} actionable />)}
      </Group>
      <Group title="En attente du client" count={waiting.length} tone="sky">
        {waiting.map((i) => <InboxCard key={i.match_id} item={i} />)}
      </Group>
      <Group title="Obtenues" count={won.length} tone="emerald">
        {won.map((i) => <InboxCard key={i.match_id} item={i} />)}
      </Group>
      <Group title="Sans suite" count={lost.length} tone="muted">
        {lost.map((i) => <InboxCard key={i.match_id} item={i} />)}
      </Group>
    </div>
  );
}

const GROUP_TONES = {
  amber: "text-amber-600",
  sky: "text-sky-600",
  emerald: "text-emerald-600",
  muted: "text-muted-foreground",
} as const;

function Group({
  title, count, tone, children,
}: {
  title: string; count: number; tone: keyof typeof GROUP_TONES; children: React.ReactNode;
}) {
  if (!count) return null;
  return (
    <section className="space-y-2">
      <h2 className={cn("text-xs font-semibold uppercase tracking-wide", GROUP_TONES[tone])}>
        {title} · {count}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

const TYPE_LABELS: Record<string, string> = {
  prestation: "Prestation",
  emploi: "Emploi",
  stage: "Stage",
  autre: "Autre",
};

function InboxCard({ item, actionable = false }: { item: InboxItem; actionable?: boolean }) {
  const decide = useProviderDecide();
  const isWon = item.decision === "client_accepted";

  return (
    <div className="rounded-xl border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {TYPE_LABELS[item.request_type] ?? item.request_type}
            </span>
            {item.match_score !== null && (
              <span className="text-[10px] font-medium text-primary">
                {Math.round(item.match_score)} % de correspondance
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-semibold">{item.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {item.delivery_mode === "remote"
            ? "À distance"
            : [item.city, item.country].filter(Boolean).join(", ") || deliveryModeLabel(item.delivery_mode)}
        </span>
        {item.budget_hint && <span>Budget : {item.budget_hint}</span>}
      </div>

      {/* Les coordonnées n'apparaissent qu'une fois la mise en relation faite. */}
      {isWon && item.client_phone && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 dark:bg-emerald-950/30">
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            Vous avez été retenu
          </p>
          <p className="mt-0.5 text-xs">
            {item.client_display_name} · <a href={`tel:${item.client_phone}`} className="font-medium underline">{item.client_phone}</a>
          </p>
        </div>
      )}

      {actionable && (
        <div className="mt-3 flex gap-2">
          <Button
            size="sm" className="flex-1 gap-1.5"
            disabled={decide.isPending}
            onClick={() => decide.mutate({ matchId: item.match_id, accept: true })}
          >
            {decide.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            Je suis disponible
          </Button>
          <Button
            size="sm" variant="outline" className="gap-1.5"
            disabled={decide.isPending}
            onClick={() => decide.mutate({ matchId: item.match_id, accept: false })}
          >
            <X className="h-3.5 w-3.5" />
            Décliner
          </Button>
        </div>
      )}

      {item.decision === "provider_accepted" && (
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-sky-600">
          <Clock className="h-3 w-3" />
          Profil transmis — le client examine votre candidature
        </p>
      )}
    </div>
  );
}

// ── Vitrine ────────────────────────────────────────────────────────────────

function ProfileSection() {
  const { data: provider } = useMyProvider();
  const upsert = useUpsertProvider();
  const publish = usePublishProvider();
  const unpublish = useUnpublishProvider();

  const [form, setForm] = useState({
    title: "", description: "", keywordsRaw: "",
    delivery_mode: "onsite" as DeliveryMode, city: "", country: "",
    rate_text: "", availability_text: "", years_experience: "", contact_phone: "",
  });

  useEffect(() => {
    if (!provider) return;
    setForm({
      title: provider.title,
      description: provider.description,
      keywordsRaw: (provider.keywords ?? []).join(", "),
      delivery_mode: provider.delivery_mode,
      city: provider.city ?? "",
      country: provider.country ?? "",
      rate_text: provider.rate_text ?? "",
      availability_text: provider.availability_text ?? "",
      years_experience: provider.years_experience?.toString() ?? "",
      contact_phone: provider.contact_phone ?? "",
    });
  }, [provider]);

  const canSave = form.title.trim().length >= 3 && form.description.trim().length >= 20;

  const save = () =>
    upsert.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      keywords: form.keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 15),
      delivery_mode: form.delivery_mode,
      city: form.delivery_mode === "remote" ? null : form.city || null,
      country: form.delivery_mode === "remote" ? null : form.country || null,
      rate_text: form.rate_text || null,
      availability_text: form.availability_text || null,
      years_experience: form.years_experience ? parseInt(form.years_experience, 10) : null,
      contact_phone: form.contact_phone || null,
    });

  const published = provider?.status === "published";

  return (
    <div className="space-y-4">
      {provider && (
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-3",
            published ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20" : "bg-muted/40"
          )}
        >
          <div className="flex items-center gap-2">
            {published ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-xs font-semibold">
                {published ? "Vitrine visible" : "Vitrine non publiée"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {published
                  ? "Vous recevez les demandes correspondantes"
                  : "Publiez-la pour recevoir des demandes"}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={published ? "outline" : "default"}
            disabled={publish.isPending || unpublish.isPending}
            onClick={() => (published ? unpublish.mutate() : publish.mutate())}
          >
            {published ? "Retirer" : "Publier"}
          </Button>
        </div>
      )}

      <Field label="Que proposez-vous ?" hint="Une ligne claire, comme un titre d'annonce">
        <Input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Designer graphique · identité visuelle et supports print"
          maxLength={300}
        />
      </Field>

      <Field label="Décrivez votre savoir-faire" hint="20 caractères minimum">
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Ce que vous faites, votre expérience, vos spécialités…"
          rows={5}
          maxLength={5000}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Field label="Mots-clés" hint="Séparés par des virgules — ils servent à vous trouver">
        <Input
          value={form.keywordsRaw}
          onChange={(e) => setForm((f) => ({ ...f, keywordsRaw: e.target.value }))}
          placeholder="design graphique, logo, identité visuelle, charte graphique"
        />
      </Field>

      <DeliveryModeSelect
        value={form.delivery_mode}
        onChange={(delivery_mode) => setForm((f) => ({ ...f, delivery_mode }))}
      />

      {form.delivery_mode !== "remote" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ville">
            <Input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Abidjan"
            />
          </Field>
          <Field label="Pays">
            <CountrySelect
              value={form.country}
              onChange={(code) => setForm((f) => ({ ...f, country: code }))}
              placeholder="Sélectionner"
            />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Tarif" hint="Libre">
          <Input
            value={form.rate_text}
            onChange={(e) => setForm((f) => ({ ...f, rate_text: e.target.value }))}
            placeholder="À partir de 15 000 FCFA"
          />
        </Field>
        <Field label="Disponibilité">
          <Input
            value={form.availability_text}
            onChange={(e) => setForm((f) => ({ ...f, availability_text: e.target.value }))}
            placeholder="Lun–Sam, 8h–18h"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Années d'expérience">
          <Input
            type="number" min={0} max={70}
            value={form.years_experience}
            onChange={(e) => setForm((f) => ({ ...f, years_experience: e.target.value }))}
            placeholder="5"
          />
        </Field>
        <Field label="Téléphone" hint="Partagé après accord mutuel">
          <Input
            value={form.contact_phone}
            onChange={(e) => setForm((f) => ({ ...f, contact_phone: e.target.value }))}
            placeholder="+225 07 00 00 00 00"
          />
        </Field>
      </div>

      <p className="rounded-lg bg-muted/50 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
        Votre numéro n'est jamais affiché publiquement. Il n'est transmis qu'à un
        client dont vous avez accepté la demande, et qui vous a retenu.
      </p>

      <Button className="w-full gap-2" disabled={!canSave || upsert.isPending} onClick={save}>
        {upsert.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {provider ? "Enregistrer" : "Créer ma vitrine"}
      </Button>

      {!provider && (
        <p className="text-center text-[11px] text-muted-foreground">
          Vous pourrez la publier juste après.
        </p>
      )}

      {provider && !published && (
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-amber-600">
          <CheckCircle2 className="h-3 w-3" />
          Pensez à publier votre vitrine pour recevoir des demandes
        </p>
      )}
    </div>
  );
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
