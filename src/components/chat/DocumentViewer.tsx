import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Edit3, FileDown, RotateCcw, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { printDocument, downloadAsWord } from "@/lib/document-utils";
import { cn } from "@/shared/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────

interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  initialContent: string;
  onRegenerate?: () => void;
  isAction?: boolean;
}

type ActiveTab = "edit" | "preview";

// ── Share Panel ────────────────────────────────────────────────────────────

// ── Icône Word ─────────────────────────────────────────────────────────────
function WordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" opacity=".2"/>
      <path d="M14 2v6h6M9 13h1.5l1 4 1-4H14l1.5 6H14l-.75-3.5L12 19.5l-1.25-3.5L10 19H8.5Z"/>
    </svg>
  );
}

// ── Barre d'outils ─────────────────────────────────────────────────────────

interface ToolbarProps {
  title: string;
  content: string;
  onClose: () => void;
  onRegenerate?: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDesktop: boolean;
}

function Toolbar({
  title,
  content,
  onClose,
  onRegenerate,
  activeTab,
  onTabChange,
  isDesktop,
}: ToolbarProps) {
  const { t } = useTranslation();

  const handlePrint = () => {
    printDocument(title, content);
    toast.success(t("document.print_opened"));
  };

  return (
    <div className="flex items-center gap-2 border-b bg-background px-3 py-2.5">
      <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={onClose}>
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <p className="flex-1 truncate text-sm font-semibold min-w-0">{title}</p>

      {!isDesktop && (
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
          <button
            className={cn(
              "flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium transition-all",
              activeTab === "edit"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => onTabChange("edit")}
          >
            <Edit3 className="h-3.5 w-3.5" />
            {t("document.edit_tab")}
          </button>
          <button
            className={cn(
              "flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium transition-all",
              activeTab === "preview"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground"
            )}
            onClick={() => onTabChange("preview")}
          >
            <Eye className="h-3.5 w-3.5" />
            {t("document.preview_tab")}
          </button>
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        {onRegenerate && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs hidden sm:flex"
            onClick={onRegenerate}
          >
            <RotateCcw className="h-3 w-3" />
            {t("document.regenerate")}
          </Button>
        )}

        <button
          onClick={handlePrint}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-input hover:bg-muted text-muted-foreground transition-colors"
          title={t("document.export_pdf")}
        >
          <FileDown className="h-4 w-4" />
        </button>

        <button
          onClick={() => { downloadAsWord(title, content); toast.success(t("document.word_downloading")); }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-input hover:bg-muted text-muted-foreground transition-colors"
          title={t("document.word_title")}
        >
          <WordIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────

export function DocumentViewer({
  open,
  onClose,
  title,
  initialContent,
  onRegenerate,
  isAction = false,
}: DocumentViewerProps) {
  const { t } = useTranslation();
  const [content, setContent]     = useState(initialContent);
  const [activeTab, setActiveTab] = useState<ActiveTab>("preview");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleRegenerate = useCallback(() => {
    onClose();
    onRegenerate?.();
  }, [onClose, onRegenerate]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={t("document.aria_label", { title })}
    >
      <Toolbar
        title={title}
        content={content}
        onClose={onClose}
        onRegenerate={isAction ? handleRegenerate : undefined}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDesktop={isDesktop}
      />

      <div className="flex flex-1 overflow-hidden">
        {isDesktop ? (
          <>
            <div className="flex w-1/2 flex-col border-r">
              <div className="flex items-center gap-1.5 border-b bg-muted/30 px-3 py-1.5">
                <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{t("document.editor_label")}</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground"
                placeholder={t("document.markdown_placeholder")}
                spellCheck={false}
              />
            </div>

            <div className="flex w-1/2 flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 border-b bg-muted/30 px-3 py-1.5">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{t("document.preview_label")}</span>
              </div>
              <div className="document-preview flex-1 overflow-y-auto p-6">
                <MarkdownContent content={content} variant="document" />
              </div>
            </div>
          </>
        ) : (
          <>
            {activeTab === "edit" && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
                placeholder={t("document.markdown_placeholder")}
                spellCheck={false}
              />
            )}
            {activeTab === "preview" && (
              <div className="document-preview flex-1 overflow-y-auto p-4">
                <MarkdownContent content={content} variant="document" />
              </div>
            )}
          </>
        )}
      </div>

      {isAction && onRegenerate && !isDesktop && (
        <div className="border-t px-4 py-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleRegenerate}
          >
            <RotateCcw className="h-4 w-4" />
            {t("document.regenerate")}
          </Button>
        </div>
      )}
    </div>
  );
}
