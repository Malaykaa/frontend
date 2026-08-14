import { AlertCircle, Laptop, MapPin, RefreshCw, Shuffle } from "lucide-react";
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

const DELIVERY_MODES: { value: DeliveryMode; label: string; hint: string; Icon: typeof Laptop }[] = [
  { value: "remote", label: "À distance",  hint: "Aucune ville à préciser", Icon: Laptop },
  { value: "hybrid", label: "Hybride",     hint: "Selon les besoins",       Icon: Shuffle },
  { value: "onsite", label: "En présentiel", hint: "Ville requise",         Icon: MapPin },
];

export function deliveryModeLabel(mode: string): string {
  return DELIVERY_MODES.find((m) => m.value === mode)?.label ?? mode;
}

/**
 * Où se déroule la prestation — à choisir avant la ville et le pays.
 *
 * Certaines prestations (design, développement, rédaction, conseil...) se
 * font entièrement à distance : demander une ville dans ce cas exclurait à
 * tort des prestataires capables de la réaliser depuis n'importe où. Le choix
 * précède donc les champs de localisation plutôt que de les accompagner, pour
 * que la question se pose avant que la ville n'ait même de sens.
 */
export function DeliveryModeSelect({
  value, onChange,
}: { value: DeliveryMode; onChange: (mode: DeliveryMode) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Où se fait la prestation ?</Label>
      <div className="grid grid-cols-3 gap-2">
        {DELIVERY_MODES.map(({ value: v, label, hint, Icon }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all",
              value === v
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-input hover:bg-muted/40"
            )}
          >
            <Icon className={cn("h-4 w-4", value === v ? "text-primary" : "text-muted-foreground")} />
            <span className="text-[11px] font-semibold leading-tight">{label}</span>
            <span className="text-[9px] leading-tight text-muted-foreground">{hint}</span>
          </button>
        ))}
      </div>
    </div>
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
