import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  /** Hauteur max du sheet (Tailwind class). Default: max-h-[90vh] */
  maxHeight?: string;
  /** Bloque la fermeture (backdrop, Echap, bouton X) pendant un traitement en cours */
  locked?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  maxHeight = "max-h-[90vh]",
  locked = false,
}: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !locked && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-fade-in" />

        {/* Sheet */}
        <Dialog.Content
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 flex flex-col",
            "rounded-t-2xl border-t bg-background shadow-xl",
            "data-[state=open]:animate-slide-in-from-bottom",
            maxHeight,
            // Desktop : centré et max-width
            "lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-lg lg:rounded-2xl lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2"
          )}
          aria-describedby={description ? "sheet-desc" : undefined}
          onInteractOutside={(e) => { if (locked) e.preventDefault(); }}
          onEscapeKeyDown={(e) => { if (locked) e.preventDefault(); }}
        >
          {/* Handle (mobile only) */}
          <div className="flex justify-center pt-3 pb-1 lg:hidden">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          {(title ?? description) && (
            <div className="flex items-start justify-between px-5 pb-3 pt-2">
              <div>
                {title && (
                  <Dialog.Title className="text-base font-bold leading-tight">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description id="sheet-desc" className="mt-0.5 text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close
                disabled={locked}
                className={cn(
                  "ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-muted transition-colors",
                  locked && "pointer-events-none opacity-30"
                )}
                aria-label="Fermer"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Dialog.Close>
            </div>
          )}

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
