import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomSheet } from "@/components/ui/bottom-sheet";

/** Confirmation avant un envoi "à toute la salle" — corrige l'absence de garde-fou
 * avant un mis-clic sur le select laissé au défaut "Toute la salle" (cours ET
 * exercices étaient concernés). */
export function SendConfirmDialog({
  open,
  onClose,
  onConfirm,
  targetLabel,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetLabel: string;
  loading?: boolean;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} title="Confirmer l'envoi" locked={loading}>
      <div className="space-y-4 pt-2">
        <p className="text-sm text-muted-foreground">
          Envoyer à <strong className="text-foreground">{targetLabel}</strong> ? Cette action ne
          peut pas être annulée — les destinataires recevront une notification.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={loading}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> Envoyer
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
