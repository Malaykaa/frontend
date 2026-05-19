import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FileText, Download, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { getSharedDocument, printDocument } from "@/lib/document-utils";
import { formatDate } from "@/shared/lib/utils";

export default function SharedDocumentPage() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const doc = token ? getSharedDocument(token) : null;

  const handleDownload = () => {
    if (!doc) return;
    printDocument(doc.title, doc.content);
  };

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center bg-background">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <AlertCircle className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{t("shared_doc.not_found_title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            {t("shared_doc.not_found_hint")}
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("shared_doc.back_home")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" className="mr-2">
            <img src="/logo.png" alt="Malayka" className="h-6 w-auto dark:invert" />
          </Link>

          <div className="h-4 w-px bg-border" />

          <div className="flex flex-1 items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="truncate text-sm font-semibold">{doc.title}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 shrink-0"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("shared_doc.download_pdf")}</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 rounded-xl border bg-muted/30 px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold">{doc.title}</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("shared_doc.created_at", { date: formatDate(doc.createdAt) })}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <MarkdownContent content={doc.content} />
        </div>

        <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
          <p>{t("shared_doc.generated_by")} <span className="font-semibold text-primary">Malayka</span></p>
          <Link to="/onboarding" className="text-primary hover:underline font-medium">
            {t("shared_doc.create_account")}
          </Link>
        </div>
      </main>
    </div>
  );
}
