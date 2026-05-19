import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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

// ── Étape individuelle ────────────────────────────────────────────────────────

function Step({ number, html }: { number: number; html: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
        {number}
      </span>
      <p
        className="flex-1 pt-px text-sm leading-relaxed text-foreground"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

// ── Contenu iOS ───────────────────────────────────────────────────────────────

function IosGuide() {
  const { t } = useTranslation();
  const isAlreadySafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const steps = [
    t("install.ios_step_1"),
    t("install.ios_step_2"),
    t("install.ios_step_3"),
    t("install.ios_step_4"),
    t("install.ios_step_5"),
  ];

  return (
    <div className="space-y-6">
      {!isAlreadySafari && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3">
          <p
            className="text-sm text-amber-800"
            dangerouslySetInnerHTML={{ __html: t("install.safari_warning") }}
          />
        </div>
      )}

      <div className="space-y-4">
        {steps.map((html, i) => (
          <Step key={i} number={i + 1} html={html} />
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {t("install.fullscreen_hint")}
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
  const { t } = useTranslation();

  if (installed) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <div>
          <p className="font-semibold text-base">{t("install.installed_title")}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("install.installed_hint")}
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    t("install.android_step_1"),
    t("install.android_step_2"),
    t("install.android_step_3"),
    t("install.android_step_4"),
  ];

  return (
    <div className="space-y-6">
      {nativePromptAvailable && (
        <>
          <Button className="w-full" onClick={onNativeInstall}>
            <Download className="mr-2 h-4 w-4" />
            {t("install.install_btn")}
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{t("install.or_manually")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <div className="space-y-4">
        {steps.map((html, i) => (
          <Step key={i} number={i + 1} html={html} />
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {t("install.fullscreen_hint")}
        </p>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────────

export function InstallGuideSheet({ open, platform, onClose }: InstallGuideSheetProps) {
  const { t } = useTranslation();
  const { nativePromptAvailable, triggerPrompt } = useAndroidInstallPrompt();
  const [installed, setInstalled] = useState(false);

  const handleNativeInstall = async () => {
    const accepted = await triggerPrompt();
    if (accepted) setInstalled(true);
  };

  const title = platform === "ios"
    ? t("install.ios_title")
    : t("install.android_title");

  const description = platform === "ios"
    ? t("install.ios_desc")
    : t("install.android_desc");

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
