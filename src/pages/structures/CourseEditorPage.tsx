/**
 * CourseEditorPage — éditeur de cours pleine page, style traitement de texte.
 *
 * Flow :
 *   compose  →  (clic "Analyser avec l'IA")  →  analyzing  →  result
 *
 * Chaque section (Introduction, Chapitre…) dispose :
 *   - d'une zone de texte expandable
 *   - d'un bouton d'import de fichier
 *   - de 3 boutons d'Assistance IA : Analyser / Développer / Corriger & Structurer
 *   - d'un panneau inline pour accepter / annuler / modifier le résultat IA
 *
 * Phase "result" : aperçu du plan LLM (étapes + résumé) avec
 *   Envoyer à la salle | Sauvegarder | ← Réviser
 */

import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2,
  FileUp, Loader2, Paperclip, Plus, Send, Sparkles, Trash2, X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";
import { apiRequest } from "@/shared/api/client";
import { PhasedGenerationProgress, useSimulatedPhases } from "@/components/structures/PhasedGenerationProgress";
import {
  useAiAssistSection,
  useClassrooms,
  useCreateCourse,
  useSendCourse,
} from "@/hooks/queries/use-structure";
import type { AiAssistAction } from "@/services/api/structure.api";
import type { CourseResponse } from "@/services/api/structure.api";

// ── Types ──────────────────────────────────────────────────────────────────

type Phase = "compose" | "analyzing" | "result";

interface UploadedFile {
  attachment_id: string;
  filename: string;
}

interface Section {
  id: string;
  label: string;
  content: string;
  file: UploadedFile | null;
  uploading: boolean;
  /** Résultat IA en attente de validation */
  aiResult: string | null;
  aiResultEditable: string | null; // copie modifiable si l'utilisateur clique "Modifier"
  aiLoading: boolean;
  aiEditing: boolean; // l'utilisateur édite le résultat IA avant de valider
}

function makeSection(label: string): Section {
  return {
    id: crypto.randomUUID(),
    label,
    content: "",
    file: null,
    uploading: false,
    aiResult: null,
    aiResultEditable: null,
    aiLoading: false,
    aiEditing: false,
  };
}

// ── Sous-composant : panneau assistance IA d'une section ───────────────────

function useAiActions(): { action: AiAssistAction; icon: string; label: string; color: string }[] {
  const { t } = useTranslation();
  return [
    { action: "analyze",  icon: "🔍", label: t("structures.course_editor.ai_analyze"),  color: "hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900/20" },
    { action: "develop",  icon: "📝", label: t("structures.course_editor.ai_develop"),  color: "hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-900/20" },
    { action: "correct",  icon: "✔️",  label: t("structures.course_editor.ai_correct"), color: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20" },
  ];
}

function AiPanel({
  section,
  onAsk,
  onAccept,
  onCancel,
  onStartEdit,
  onEditChange,
  onAcceptEdit,
}: {
  section: Section;
  onAsk: (action: AiAssistAction) => void;
  onAccept: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
  onEditChange: (v: string) => void;
  onAcceptEdit: () => void;
}) {
  const { t } = useTranslation();
  const AI_ACTIONS = useAiActions();
  const hasContent = section.content.trim().length > 0 || section.file !== null;

  return (
    <div className="border-t bg-muted/30 px-4 py-3">
      {/* Boutons assistance IA */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Sparkles className="h-3 w-3" /> {t("structures.course_editor.ai_label")}
        </span>
        {AI_ACTIONS.map(({ action, icon, label, color }) => (
          <button
            key={action}
            type="button"
            disabled={!hasContent || section.aiLoading}
            onClick={() => onAsk(action)}
            className={cn(
              "flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-40",
              color,
            )}
          >
            {section.aiLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span>{icon}</span>
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Résultat IA */}
      {section.aiResult !== null && !section.aiEditing && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            {t("structures.course_editor.ai_proposal_title")}
          </p>
          <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.aiResult}</ReactMarkdown>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={onAccept}>
              <Check className="mr-1 h-3 w-3" /> {t("structures.course_editor.validate")}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onStartEdit}>
              {t("structures.course_editor.edit")}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={onCancel}>
              <X className="mr-1 h-3 w-3" /> {t("structures.course_editor.cancel")}
            </Button>
          </div>
        </div>
      )}

      {/* Mode édition du résultat IA */}
      {section.aiEditing && section.aiResultEditable !== null && (
        <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50/40 p-3 dark:border-violet-900/30 dark:bg-violet-900/10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-400">
            {t("structures.course_editor.edit_before_validate")}
          </p>
          <textarea
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            rows={6}
            value={section.aiResultEditable}
            onChange={(e) => onEditChange(e.target.value)}
          />
          <div className="mt-2 flex gap-2">
            <Button size="sm" className="h-7 text-xs" onClick={onAcceptEdit}>
              <Check className="mr-1 h-3 w-3" /> {t("structures.course_editor.validate")}
            </Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={onCancel}>
              <X className="mr-1 h-3 w-3" /> {t("structures.course_editor.cancel")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Composant principal ────────────────────────────────────────────────────

export default function CourseEditorPage() {
  const { t } = useTranslation();
  const { structureId = "", classroomId = "" } = useParams<{
    structureId: string;
    classroomId: string;
  }>();
  const navigate = useNavigate();

  const { data: classrooms } = useClassrooms(structureId);
  const classroom = classrooms?.find((c) => c.id === classroomId);

  // ── État global ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("compose");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [sections, setSections] = useState<Section[]>([makeSection("Introduction")]);
  const [resultCourse, setResultCourse] = useState<CourseResponse | null>(null);
  const [sendLoading, setSendLoading] = useState(false);
  const chapterCounter = useRef(0);

  const createCourse = useCreateCourse(structureId, classroomId);
  const sendCourse   = useSendCourse(structureId, classroomId, resultCourse?.id ?? "");
  const aiAssist     = useAiAssistSection(structureId, classroomId);
  const analysisPhases = useSimulatedPhases(
    [
      t("structures.course_editor.phase_reading"),
      t("structures.course_editor.phase_splitting"),
      t("structures.course_editor.phase_finalizing"),
    ],
    phase === "analyzing", 10_000,
  );

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Helpers sections ─────────────────────────────────────────────────────

  const updateSection = (id: string, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addChapter = () => {
    chapterCounter.current += 1;
    setSections((prev) => [...prev, makeSection(t("structures.course_editor.chapter_label", { num: chapterCounter.current }))]);
  };

  const removeSection = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  // ── Upload fichier par section ────────────────────────────────────────────

  const handleFileChange = async (
    sectionId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    updateSection(sectionId, { uploading: true });
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await apiRequest<UploadedFile>("/files/upload", {
        method: "POST",
        body: form,
      });
      updateSection(sectionId, { file: result, uploading: false });
      toast.success(t("structures.course_editor.file_imported", { filename: file.name }));
    } catch {
      updateSection(sectionId, { uploading: false });
      toast.error(t("structures.course_editor.file_import_error"));
    }
  };

  // ── Assistance IA par section ─────────────────────────────────────────────

  const handleAiAssist = async (sectionId: string, action: AiAssistAction) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section || (!section.content.trim() && !section.file)) return;

    updateSection(sectionId, { aiLoading: true, aiResult: null, aiResultEditable: null, aiEditing: false });
    try {
      const payload =
        section.content.trim()
          ? { section_content: `## ${section.label}\n\n${section.content}`, action }
          : { section_content: `[Fichier joint : ${section.file!.filename}]`, action };

      const data = await aiAssist.mutateAsync(payload);
      updateSection(sectionId, { aiLoading: false, aiResult: data.result });
    } catch {
      updateSection(sectionId, { aiLoading: false });
    }
  };

  const handleAiAccept = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section?.aiResult) return;
    updateSection(sectionId, {
      content: section.aiResult,
      aiResult: null,
      aiResultEditable: null,
      aiEditing: false,
    });
  };

  const handleAiCancel = (sectionId: string) =>
    updateSection(sectionId, { aiResult: null, aiResultEditable: null, aiEditing: false });

  const handleAiStartEdit = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section?.aiResult) return;
    updateSection(sectionId, { aiEditing: true, aiResultEditable: section.aiResult });
  };

  const handleAiEditChange = (sectionId: string, v: string) =>
    updateSection(sectionId, { aiResultEditable: v });

  const handleAiAcceptEdit = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section?.aiResultEditable) return;
    updateSection(sectionId, {
      content: section.aiResultEditable,
      aiResult: null,
      aiResultEditable: null,
      aiEditing: false,
    });
  };

  // ── Analyse globale du cours ──────────────────────────────────────────────

  const assembledContent = sections
    .filter((s) => s.content.trim())
    .map((s) => `## ${s.label}\n\n${s.content.trim()}`)
    .join("\n\n");

  const firstFile = sections.find((s) => s.file !== null)?.file ?? null;

  const canAnalyze =
    title.trim().length > 0 && (assembledContent.trim().length > 0 || firstFile !== null);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setPhase("analyzing");
    try {
      const course = await createCourse.mutateAsync({
        title: title.trim(),
        subject: subject.trim() || undefined,
        content: assembledContent || undefined,
        attachment_id: firstFile?.attachment_id,
      });
      setResultCourse(course);
      setPhase("result");
    } catch {
      setPhase("compose");
      toast.error(t("structures.course_editor.analyze_error"));
    }
  };

  // ── Envoyer à la salle ────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!resultCourse) return;
    setSendLoading(true);
    try {
      await sendCourse.mutateAsync({ target: "classroom" });
      toast.success(t("structures.course_editor.course_sent_success"));
      navigate(`/structures/${structureId}/classrooms/${classroomId}?tab=courses`);
    } catch {
      setSendLoading(false);
    }
  };

  const handleSaveOnly = () => {
    toast.success(t("structures.course_editor.course_saved_success"));
    navigate(`/structures/${structureId}/classrooms/${classroomId}?tab=courses`);
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────

  // Phase : analyse en cours
  if (phase === "analyzing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Sparkles className="h-10 w-10 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t("structures.course_editor.analyzing_title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("structures.course_editor.analyzing_hint")}
          </p>
        </div>
        <PhasedGenerationProgress phases={analysisPhases} />
      </div>
    );
  }

  // Phase : résultat — aperçu du plan
  if (phase === "result" && resultCourse) {
    return (
      <div className="min-h-screen bg-muted/20">
        {/* Header résultat */}
        <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPhase("compose")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" /> {t("structures.course_editor.review_content")}
              </button>
              <span className="text-muted-foreground/40">|</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  {t("structures.course_editor.plan_generated")}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveOnly} disabled={sendLoading}>
                {t("structures.course_editor.save_without_sending")}
              </Button>
              <Button size="sm" onClick={handleSend} disabled={sendLoading}>
                {sendLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-1.5 h-4 w-4" />
                )}
                {t("structures.course_editor.send_to_classroom")}
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl space-y-6 p-6">
          {/* Titre + matière */}
          <div>
            <h1 className="text-2xl font-bold">{resultCourse.title}</h1>
            {resultCourse.subject && (
              <Badge variant="secondary" className="mt-1">
                {resultCourse.subject}
              </Badge>
            )}
          </div>

          {/* Résumé + explication (markdown) */}
          {resultCourse.summary && (
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("structures.course_editor.summary_label")}
              </p>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{resultCourse.summary}</ReactMarkdown>
              </div>
            </div>
          )}

          {resultCourse.explanation && (
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("structures.course_editor.presentation_label")}
              </p>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{resultCourse.explanation}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Étapes du parcours */}
          {resultCourse.steps.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("structures.course_editor.journey_label", { count: resultCourse.steps.length })}
              </p>
              <ol className="space-y-3">
                {resultCourse.steps.map((step, i) => (
                  <li key={step.id} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-medium leading-tight">{step.label}</p>
                      {step.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Suggestions de ressources */}
          {(resultCourse.suggestions ?? []).length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("structures.course_editor.suggested_resources")}
              </p>
              <ul className="space-y-1.5">
                {(resultCourse.suggestions ?? []).map((s) => (
                  <li key={s.id} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avertissement : le cours existe déjà */}
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/30 dark:bg-amber-900/10 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span dangerouslySetInnerHTML={{ __html: t("structures.course_editor.existing_course_warning") }} />
          </div>

          {/* Actions bottom */}
          <div className="flex flex-col gap-2 pb-8 sm:flex-row">
            <Button className="flex-1" onClick={handleSend} disabled={sendLoading}>
              {sendLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {t("structures.course_editor.send_to_whole_classroom")}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleSaveOnly} disabled={sendLoading}>
              {t("structures.course_editor.save_without_sending")}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Phase : éditeur (compose)
  return (
    <div className="min-h-screen bg-muted/20 pb-32">
      {/* Header sticky */}
      <header className="sticky top-0 z-10 border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/structures/${structureId}/classrooms/${classroomId}`}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {classroom?.name ?? t("structures.course_editor.classroom_fallback")}
          </Link>
          <h1 className="flex-1 text-center text-sm font-semibold">
            {title.trim() || t("structures.course_editor.new_course_fallback")}
          </h1>
          <div className="w-32" /> {/* spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 p-6">

        {/* ── Informations du cours ──────────────────────────── */}
        <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="border-b bg-muted/30 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("structures.course_editor.course_info_title")}
            </p>
          </div>
          <div className="space-y-3 p-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t("structures.course_editor.title_label")} <span className="text-destructive">*</span>
              </label>
              <Input
                autoFocus
                placeholder={t("structures.course_editor.title_placeholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-base font-medium"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {t("structures.course_editor.subject_label")}
              </label>
              <Input
                placeholder={t("structures.course_editor.subject_placeholder")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── Sections de contenu ─────────────────────────────── */}
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            canDelete={sections.length > 1}
            onLabelChange={(v) => updateSection(section.id, { label: v })}
            onContentChange={(v) => updateSection(section.id, { content: v })}
            onRemove={() => removeSection(section.id)}
            onFileChange={(e) => handleFileChange(section.id, e)}
            onClearFile={() => updateSection(section.id, { file: null })}
            onAiAsk={(action) => handleAiAssist(section.id, action)}
            onAiAccept={() => handleAiAccept(section.id)}
            onAiCancel={() => handleAiCancel(section.id)}
            onAiStartEdit={() => handleAiStartEdit(section.id)}
            onAiEditChange={(v) => handleAiEditChange(section.id, v)}
            onAiAcceptEdit={() => handleAiAcceptEdit(section.id)}
            fileInputRef={(el) => { fileInputRefs.current[section.id] = el; }}
            index={idx}
          />
        ))}

        {/* ── Ajouter un chapitre ─────────────────────────────── */}
        <button
          type="button"
          onClick={addChapter}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Plus className="h-4 w-4" /> {t("structures.course_editor.add_chapter")}
        </button>
      </main>

      {/* ── Barre d'action sticky en bas ────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-card px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {t("structures.course_editor.sections_written", { count: sections.filter((s) => s.content.trim()).length })}
            {firstFile && <span className="ml-1">{t("structures.course_editor.file_attached_count")}</span>}
          </div>
          <div className="flex gap-2">
            <Link to={`/structures/${structureId}/classrooms/${classroomId}`}>
              <Button variant="outline" size="sm">
                {t("structures.course_editor.cancel")}
              </Button>
            </Link>
            <Button size="sm" disabled={!canAnalyze} onClick={handleAnalyze}>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t("structures.course_editor.analyze_with_ai")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carte de section ───────────────────────────────────────────────────────

function SectionCard({
  section,
  canDelete,
  index,
  onLabelChange,
  onContentChange,
  onRemove,
  onFileChange,
  onClearFile,
  onAiAsk,
  onAiAccept,
  onAiCancel,
  onAiStartEdit,
  onAiEditChange,
  onAiAcceptEdit,
  fileInputRef,
}: {
  section: Section;
  canDelete: boolean;
  index: number;
  onLabelChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onRemove: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFile: () => void;
  onAiAsk: (action: AiAssistAction) => void;
  onAiAccept: () => void;
  onAiCancel: () => void;
  onAiStartEdit: () => void;
  onAiEditChange: (v: string) => void;
  onAiAcceptEdit: () => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
}) {
  const { t } = useTranslation();
  const [editingLabel, setEditingLabel] = useState(false);
  const labelRef = useRef<HTMLInputElement>(null);

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[10px] font-bold text-muted-foreground/60">
            §{index + 1}
          </span>
          {editingLabel ? (
            <input
              ref={labelRef}
              autoFocus
              className="h-6 min-w-0 flex-1 rounded border-0 bg-transparent text-sm font-semibold outline-none focus:ring-1 focus:ring-primary/50"
              value={section.label}
              onChange={(e) => onLabelChange(e.target.value)}
              onBlur={() => setEditingLabel(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingLabel(false)}
            />
          ) : (
            <button
              type="button"
              className="truncate text-sm font-semibold hover:text-primary"
              title={t("structures.course_editor.rename_tooltip")}
              onClick={() => setEditingLabel(true)}
            >
              {section.label || t("structures.course_editor.untitled_section")}
            </button>
          )}
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 text-muted-foreground/50 hover:text-destructive"
            title={t("structures.course_editor.delete_section_tooltip")}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Zone de texte */}
      <div className="p-4">
        <textarea
          className="w-full resize-none rounded-lg border-0 bg-transparent text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50 focus:ring-0"
          rows={6}
          placeholder={
            index === 0
              ? t("structures.course_editor.intro_placeholder")
              : t("structures.course_editor.section_content_placeholder", { label: section.label })
          }
          value={section.content}
          onChange={(e) => onContentChange(e.target.value)}
        />

        {/* Fichier joint */}
        {section.file ? (
          <div className="mt-2 flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5">
            <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-xs">{section.file.filename}</span>
            <button
              type="button"
              onClick={onClearFile}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <label className="mt-2 flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            {section.uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileUp className="h-3.5 w-3.5" />
            )}
            {t("structures.course_editor.import_document_cta")}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileChange}
              disabled={section.uploading}
            />
          </label>
        )}
      </div>

      {/* Panneau assistance IA */}
      <AiPanel
        section={section}
        onAsk={onAiAsk}
        onAccept={onAiAccept}
        onCancel={onAiCancel}
        onStartEdit={onAiStartEdit}
        onEditChange={onAiEditChange}
        onAcceptEdit={onAiAcceptEdit}
      />
    </section>
  );
}
