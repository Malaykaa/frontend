import { FileText, Eye, FileDown, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AiAvatar } from "./AiAvatar";
import { MarkdownContent } from "./MarkdownContent";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { printDocument, downloadAsWord } from "@/lib/document-utils";
import { cn } from "@/shared/lib/utils";

// ── Icône Word ─────────────────────────────────────────────────────────────
function WordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.17 3H7.83A1.83 1.83 0 0 0 6 4.83v1.34L12 8l6-1.83V4.83A1.83 1.83 0 0 0 21.17 3Z" opacity=".3"/>
      <path d="M6 6.17V19.5A1.5 1.5 0 0 0 7.5 21h13a1.5 1.5 0 0 0 1.5-1.5V6.17L16 8ZM14 17h-2l-1.5-5.5L9 17H7l-2-8h2l1.2 5.5L9.7 9h2.6l1.5 5.5L15 9h2Z"/>
    </svg>
  );
}

interface DeliverableCardProps {
  presetLabel: string;
  content: string;
  documentId?: string | null;
  onView: () => void;
}

/** Strip backend @@MARKER@@ patterns from document content before rendering. */
function sanitizeContent(raw: string): string {
  return raw.replace(/@@\w+@@[^\n]*/g, "").trim();
}

export function DeliverableCard({ presetLabel, content, onView }: DeliverableCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const clean = sanitizeContent(content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(clean);
    setCopied(true);
    toast.success(t("document.copy_success"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdf = () => {
    printDocument(presetLabel, clean);
    toast.success(t("document.pdf_opened"));
  };

  const handleWord = () => {
    downloadAsWord(presetLabel, clean);
    toast.success(t("document.word_downloading"));
  };

  return (
    <div className="flex items-start gap-2.5 px-4 py-2">
      <AiAvatar className="mt-0.5" />

      {/* Carte document */}
      <div className="w-full max-w-xs rounded-2xl rounded-tl-sm border-2 border-emerald-200 bg-card shadow-md overflow-hidden">

        {/* En-tête */}
        <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/30 px-3.5 py-2.5 border-b border-emerald-100">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
            <FileText className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
              {presetLabel}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              {t("document.ready")}
            </p>
          </div>
        </div>

        {/* Miniature document */}
        <div className="relative h-28 overflow-hidden bg-white dark:bg-zinc-900 px-3 pt-2.5">
          <div
            className="origin-top-left pointer-events-none select-none"
            style={{ transform: "scale(0.62)", width: "161%", opacity: 0.85 }}
          >
            <MarkdownContent content={clean.slice(0, 800)} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-border/30" />
        </div>

        {/* Bouton principal */}
        <div className="px-3 pt-2.5 pb-1">
          <Button
            size="sm"
            className="w-full gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
            onClick={onView}
          >
            <Eye className="h-3.5 w-3.5" />
            {t("document.view")}
          </Button>
        </div>

        {/* Actions secondaires */}
        <div className="flex items-center gap-1.5 px-3 pb-2.5 pt-1">
          <button
            onClick={handlePdf}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-input bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={t("document.export_pdf")}
          >
            <FileDown className="h-3 w-3" />
            PDF
          </button>

          <button
            onClick={handleWord}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-input bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title={t("document.word_title")}
          >
            <WordIcon className="h-3 w-3" />
            Word
          </button>

          <button
            onClick={handleCopy}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-[10px] font-medium transition-colors",
              copied
                ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                : "border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={t("document.copy")}
          >
            {copied
              ? <Check className="h-3 w-3" />
              : <Copy className="h-3 w-3" />}
            {copied ? t("document.copied") : t("document.copy")}
          </button>
        </div>
      </div>
    </div>
  );
}
