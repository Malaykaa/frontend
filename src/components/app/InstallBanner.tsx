import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "mlk_install_dismissed";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Déjà installée → ne pas afficher
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Déjà dismissée
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // iOS : pas d'event beforeinstallprompt, on montre les instructions
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIos(ios);

    if (ios) {
      // Afficher après 3s
      const t = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(t);
    }

    // Android/Chrome : écouter l'event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  if (!showBanner || isStandalone) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 rounded-2xl border bg-background shadow-xl p-4 lg:bottom-6 lg:left-auto lg:right-6 lg:w-80 animate-slide-in-from-bottom">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Smartphone className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Installer Malayka</p>
          {isIos ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Clique sur{" "}
              <span className="font-medium">Partager</span>{" "}
              puis{" "}
              <span className="font-medium">« Sur l'écran d'accueil »</span>
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Accès rapide depuis ton écran d'accueil, même hors connexion.
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {!isIos && deferredPrompt && (
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={handleDismiss}>
            Plus tard
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" onClick={() => void handleInstall()}>
            <Download className="h-3.5 w-3.5" />
            Installer
          </Button>
        </div>
      )}
    </div>
  );
}
