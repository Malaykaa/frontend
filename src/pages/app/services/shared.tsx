import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Éléments partagés du module Services.
 *
 * `statusLabel` vivait dans ServicesTab, importé par deux autres pages. Une
 * page lazy-loadée qui en importe une autre force le chargement des deux et
 * crée un couplage inutile entre écrans — ces helpers sont donc isolés ici.
 */

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
export function QueryError({
  message = "Impossible de charger ces informations.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center">
      <AlertCircle className="mx-auto h-5 w-5 text-destructive" />
      <p className="mt-2 text-sm font-medium text-destructive">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Réessayer
        </Button>
      )}
    </div>
  );
}
