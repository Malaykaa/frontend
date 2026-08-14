import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { ApiError } from "@/shared/api/client";
import type { DeliveryMode } from "@/services/api/services.api";
import { cn } from "@/shared/lib/utils";

/**
 * Éléments partagés du module Services.
 *
 * `statusLabel` vivait dans ServicesTab, importé par deux autres pages. Une
 * page lazy-loadée qui en importe une autre force le chargement des deux et
 * crée un couplage inutile entre écrans — ces helpers sont donc isolés ici.
 */

const DELIVERY_MODES: { value: DeliveryMode; label: string }[] = [
  { value: "remote", label: "À distance" },
  { value: "hybrid", label: "Hybride" },
  { value: "onsite", label: "En présentiel" },
];

export function deliveryModeLabel(mode: string): string {
  return DELIVERY_MODES.find((m) => m.value === mode)?.label ?? mode;
}

/**
 * Où se déroule la prestation — à choisir avant la ville et le pays.
 *
 * Décidé par le CLIENT, jamais par le prestataire : c'est le besoin exprimé
 * qui détermine si la localisation compte, pas la vitrine du prestataire, qui
 * a toujours une ville. À distance, la ville et le pays disparaissent du
 * formulaire et le matching ignore la localisation des prestataires ; en
 * présentiel ou hybride, ils filtrent réellement les résultats.
 *
 * Boutons simples, pas des cartes : c'est un choix rapide entre trois options
 * courtes, pas une décision qui mérite de l'espace ou une explication à côté
 * de chaque bouton.
 */
export function DeliveryModeSelect({
  value, onChange,
}: { value: DeliveryMode; onChange: (mode: DeliveryMode) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Où se fait la prestation ?</Label>
      <div className="grid grid-cols-3 gap-2">
        {DELIVERY_MODES.map(({ value: v, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors",
              value === v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-muted/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/**
 * Texte libre avec liens cliquables — utilisé pour les réalisations, où le
 * prestataire est explicitement invité à coller des liens en appui.
 *
 * Découpage par expression régulière plutôt qu'un rendu Markdown complet :
 * le champ est du texte brut, pas du Markdown, et la seule mise en forme
 * utile ici est de rendre les URL cliquables.
 */
export function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);
  return (
    <p className="whitespace-pre-wrap break-words">
      {parts.map((part, i) =>
        URL_PATTERN.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export function statusLabel(status: string): string {
  switch (status) {
    case "open":      return "Envoyée aux prestataires";
    case "public":    return "Élargie au grand public";
    case "fulfilled": return "Mise en relation faite";
    case "closed":    return "Clôturée";
    case "expired":   return "Expirée";
    default:          return status;
  }
}

/**
 * État d'erreur explicite.
 *
 * Sans lui, une requête en échec laissait la page se rendre avec des données
 * vides : l'utilisateur voyait un écran quasi blanc, sans savoir si le
 * chargement était en cours, s'il n'avait rien, ou si quelque chose avait
 * échoué. Une erreur doit se voir et proposer une action.
 */
/** Détail technique d'une erreur : « 500 — la base est inaccessible ». */
function errorDetail(error: unknown): string | null {
  if (!error) return null;
  const status = (error as ApiError)?.status;
  const message = error instanceof Error ? error.message.trim() : "";
  if (status && message && message !== `HTTP ${status}`) return `${status} — ${message}`;
  if (status) return String(status);
  return message || null;
}

export function QueryError({
  message = "Impossible de charger ces informations.",
  error,
  onRetry,
}: {
  message?: string;
  /**
   * L'erreur d'origine. Affichée en clair sous le message : sans elle,
   * l'utilisateur ne peut rapporter qu'« ça ne marche pas », ce qui ne permet
   * de distinguer ni une panne serveur, ni une session expirée, ni un
   * problème de réseau — trois causes aux correctifs sans rapport.
   */
  error?: unknown;
  onRetry?: () => void;
}) {
  const detail = errorDetail(error);
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
      <AlertCircle className="mx-auto h-5 w-5 text-destructive" />
      <p className="mt-2 text-sm font-medium text-destructive">{message}</p>
      {detail && (
        <p className="mt-1 break-words text-[11px] text-destructive/70">{detail}</p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Réessayer
        </Button>
      )}
    </div>
  );
}
