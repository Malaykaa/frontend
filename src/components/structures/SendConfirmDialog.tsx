import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <BottomSheet open={open} onClose={onClose} title={t("structures.components.send_confirm_title")} locked={loading}>
      <div className="space-y-4 pt-2">
        <p
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{
            __html: t("structures.components.send_confirm_body", {
              target: `<strong class="text-foreground">${targetLabel}</strong>`,
            }),
          }}
        />
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
            {t("structures.components.send_confirm_cancel")}
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={loading}>
            <Send className="mr-1.5 h-3.5 w-3.5" /> {t("structures.components.send_confirm_send")}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
