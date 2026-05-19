import {
  useRef,
  useState,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Send, Paperclip, X, Loader2, FileText, Image } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { apiRequest } from "@/shared/api/client";

interface UploadedFile {
  storage_key: string;
  filename: string;
  content_type: string;
}

interface ChatInputProps {
  onSend: (content: string, attachmentKeys: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Écris ton message…",
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText]             = useState("");
  const [uploading, setUploading]   = useState(false);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);

  // ── Auto-resize textarea ─────────────────────────────────────────────────
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  };

  // ── Envoi ────────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, attachments.map((a) => a.storage_key));
    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [text, attachments, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Envoi sur Enter (sans Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Upload fichier ────────────────────────────────────────────────────────
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const MAX_MB = 10;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Le fichier dépasse ${MAX_MB} Mo`);
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const result = await apiRequest<UploadedFile>("/files/upload", {
        method: "POST",
        body: form,
      });
      setAttachments((prev) => [...prev, result]);
      toast.success("Fichier joint");
    } catch {
      toast.error("Impossible de joindre le fichier");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (key: string) =>
    setAttachments((prev) => prev.filter((a) => a.storage_key !== key));

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="border-t bg-background px-3 py-2 safe-bottom">
      {/* Pièces jointes */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((a) => (
            <div
              key={a.storage_key}
              className="flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2.5 py-1.5 text-xs"
            >
              {a.content_type.startsWith("image/")
                ? <Image className="h-3.5 w-3.5 text-muted-foreground" />
                : <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="max-w-[120px] truncate font-medium">{a.filename}</span>
              <button
                type="button"
                onClick={() => removeAttachment(a.storage_key)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-muted/20 px-3 py-2",
          "focus-within:border-primary/50 focus-within:bg-background transition-colors"
        )}
      >
        {/* Bouton pièce jointe */}
        <button
          type="button"
          disabled={uploading || disabled}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            uploading ? "cursor-wait opacity-50" : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
          title="Joindre un fichier"
        >
          {uploading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Paperclip className="h-4 w-4" />}
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "En cours de génération…" : placeholder}
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed outline-none",
            "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "max-h-40 overflow-y-auto"
          )}
          style={{ height: "auto" }}
        />

        {/* Bouton envoi */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            "mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all",
            canSend
              ? "bg-primary text-white hover:bg-primary/90 scale-100"
              : "bg-muted text-muted-foreground scale-90 cursor-not-allowed"
          )}
          title="Envoyer (Entrée)"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={handleFileSelect}
      />

      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
      </p>
    </div>
  );
}
