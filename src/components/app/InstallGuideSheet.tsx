import { useState, useEffect } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type InstallPlatform = "ios" | "android";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallGuideSheetProps {
  open: boolean;
  platform: InstallPlatform | null;
  onClose: () => void;
}

// ── Hook : capture de l'event Android ─────────────────────────────────────────

export function useAndroidInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const triggerPrompt = async (): Promise<boolean> => {
    if (!prompt) return false;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    return outcome === "accepted";
  };

  return { nativePromptAvailable: !!prompt, triggerPrompt };
}

// ── Étape individuelle — épurée, sans icône ──────────────────────────────────

function Step({ number, text }: { number: number; text: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
        {number}
      </span>
      <p className="flex-1 pt-px text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

// ── Contenu iOS ───────────────────────────────────────────────────────────────

function IosGuide() {
  const isAlreadySafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <div className="space-y-6">
      {!isAlreadySafari && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            Cette installation nécessite <strong>Safari</strong>. Si tu utilises Chrome,
            copie le lien et ouvre-le dans Safari.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <Step number={1} text={<>Ouvre <strong>Safari</strong> sur ton iPhone ou iPad.</>} />
        <Step number={2} text={<>Navigue sur <strong>malaykaa.com</strong>.</>} />
        <Step number={3} text={<>Appuie sur le bouton <strong>Partager</strong> en bas de l'écran.</>} />
        <Step number={4} text={<>Fais défiler et sélectionne <strong>« Sur l'écran d'accueil »</strong>.</>} />
        <Step number={5} text={<>Confirme avec <strong>« Ajouter »</strong>. C'est tout.</>} />
      </div>

      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          L'application s'ouvrira en plein écran, sans barre de navigateur,
          comme une app native.
        </p>
      </div>
    </div>
  );
}

// ── Contenu Android ───────────────────────────────────────────────────────────

function AndroidGuide({
  nativePromptAvailable,
  onNativeInstall,
  installed,
}: {
  nativePromptAvailable: boolean;
  onNativeInstall: () => void;
  installed: boolean;
}) {
  if (installed) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <div>
          <p className="font-semibold text-base">Installation réussie</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Malayka est maintenant sur ton écran d'accueil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {nativePromptAvailable && (
        <>
          <Button className="w-full" onClick={onNativeInstall}>
            <Download className="mr-2 h-4 w-4" />
            Installer Malayka
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">ou manuellement</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <div className="space-y-4">
        <Step number={1} text={<>Ouvre cette page dans <strong>Chrome</strong>.</>} />
        <Step number={2} text={<>Appuie sur les <strong>3 points</strong> en haut à droite.</>} />
        <Step number={3} text={<>Sélectionne <strong>« Ajouter à l'écran d'accueil »</strong>.</>} />
        <Step number={4} text={<>Confirme. C'est tout.</>} />
      </div>

      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          L'application s'ouvrira en plein écran, sans barre de navigateur,
          comme une app native.
        </p>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────────

export function InstallGuideSheet({ open, platform, onClose }: InstallGuideSheetProps) {
  const { nativePromptAvailable, triggerPrompt } = useAndroidInstallPrompt();
  const [installed, setInstalled] = useState(false);

  const handleNativeInstall = async () => {
    const accepted = await triggerPrompt();
    if (accepted) setInstalled(true);
  };

  const title = platform === "ios"
    ? "Installer sur iPhone / iPad"
    : "Installer sur Android";

  const description = platform === "ios"
    ? "Suis ces étapes dans Safari pour ajouter Malayka à ton écran d'accueil."
    : "Ajoute Malayka à ton écran d'accueil en quelques secondes.";

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxHeight="max-h-[92vh]"
    >
      {platform === "ios" ? (
        <IosGuide />
      ) : platform === "android" ? (
        <AndroidGuide
          nativePromptAvailable={nativePromptAvailable}
          onNativeInstall={() => void handleNativeInstall()}
          installed={installed}
        />
      ) : null}
    </BottomSheet>
  );
}
