import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/auth/CountrySelect";
import { useCreateRequest, useMyRequests } from "@/hooks/queries/use-services";
import type { RequestType } from "@/services/api/services.api";
import { QueryError, statusLabel } from "@/pages/app/services/shared";
import { cn } from "@/shared/lib/utils";

const TYPES: { value: RequestType; label: string; hint: string }[] = [
  { value: "prestation", label: "Prestation", hint: "Un travail ponctuel" },
  { value: "emploi",     label: "Emploi",     hint: "CDD ou CDI" },
  { value: "stage",      label: "Stage",      hint: "Stagiaire ou alternant" },
  { value: "autre",      label: "Autre",      hint: "Autre besoin" },
];

/**
 * Côté client : la liste des demandes, et le formulaire de création.
 *
 * Le formulaire reste volontairement court — trois champs obligatoires. Un
 * client pressé ne remplit pas dix cases, et le matching lexical fonctionne
 * dès qu'il y a un titre et des mots-clés.
 */
export default function RequestsPage() {
  const navigate = useNavigate();
  const { data: requests, isLoading, isError, error, refetch } = useMyRequests();
  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col px-4 py-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => (creating ? setCreating(false) : navigate("/app/services"))}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
          aria-label="Retour"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-lg font-bold">
          {creating ? "Nouvelle demande" : "Chercher un prestataire"}
        </h1>
      </div>

      {creating ? (
        <NewRequestForm onDone={(id) => navigate(`/app/services/demandes/${id}`)} />
      ) : (
        <>
          <Button className="mb-4 w-full gap-2" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            Décrire un nouveau besoin
          </Button>

          {isError && (
            <QueryError
              message="Impossible de charger vos demandes."
              error={error}
              onRetry={() => void refetch()}
            />
          )}

          {isLoading && (
            <div className="space-y-2">
              {[0, 1].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl border bg-card" />)}
            </div>
          )}

          {!isLoading && !isError && !(requests?.length) && (
            <div className="rounded-2xl border border-dashed py-12 text-center">
              <Search className="mx-auto h-7 w-7 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Aucune demande</p>
              <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                Décrivez ce que vous cherchez : nous transmettons aux prestataires
                qui correspondent.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {(requests ?? []).map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/app/services/demandes/${r.id}`)}
                className="flex w-full items-center gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{statusLabel(r.status)}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function NewRequestForm({ onDone }: { onDone: (id: string) => void }) {
  const create = useCreateRequest();
  const [form, setForm] = useState({
    request_type: "prestation" as RequestType,
    title: "", description: "", keywordsRaw: "", city: "", country: "", budget_hint: "",
  });

  const canSubmit = form.title.trim().length >= 3 && form.description.trim().length >= 10;

  const submit = () =>
    create.mutate(
      {
        request_type: form.request_type,
        title: form.title.trim(),
        description: form.description.trim(),
        keywords: form.keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 15),
        city: form.city || null,
        country: form.country || null,
        budget_hint: form.budget_hint || null,
      },
      { onSuccess: (detail) => onDone(detail.id) }
    );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs">Vous cherchez</Label>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm((f) => ({ ...f, request_type: t.value }))}
              className={cn(
                "rounded-xl border p-2.5 text-left transition-all",
                form.request_type === t.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-input hover:bg-muted/40"
              )}
            >
              <p className="text-xs font-semibold">{t.label}</p>
              <p className="text-[10px] text-muted-foreground">{t.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Votre besoin en une ligne</Label>
        <Input
          autoFocus
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Plombier pour une fuite dans la salle de bain"
          maxLength={300}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Détaillez</Label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Ce qu'il faut faire, quand, où, contraintes éventuelles…"
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
          placeholder="plomberie, fuite, urgence"
        />
        <p className="text-[11px] text-muted-foreground">
          Séparés par des virgules — ils affinent fortement la recherche
        </p>
      </div>

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

      <div className="space-y-1.5">
        <Label className="text-xs">Budget indicatif</Label>
        <Input
          value={form.budget_hint}
          onChange={(e) => setForm((f) => ({ ...f, budget_hint: e.target.value }))}
          placeholder="Entre 20 000 et 50 000 FCFA"
        />
      </div>

      <Button className="w-full gap-2" disabled={!canSubmit || create.isPending} onClick={submit}>
        {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        Trouver des prestataires
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        Votre demande est envoyée aux prestataires correspondants. Vous verrez
        leur profil et choisirez qui contacter.
      </p>
    </div>
  );
}
