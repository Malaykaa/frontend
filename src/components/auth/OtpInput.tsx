import { useRef, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/shared/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  error?: string;
  disabled?: boolean;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
}: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (idx: number) => {
    inputs.current[Math.min(Math.max(idx, 0), length - 1)]?.focus();
  };

  const handleChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[idx] = char;
    const newVal = next.join("").slice(0, length);
    onChange(newVal);
    if (char) focus(idx + 1);
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const next = value.split("");
        next[idx] = "";
        onChange(next.join(""));
      } else {
        focus(idx - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focus(idx - 1);
    } else if (e.key === "ArrowRight") {
      focus(idx + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    focus(Math.min(pasted.length, length - 1));
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => { inputs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[idx] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-11 rounded-lg border-2 bg-background text-center text-lg font-semibold transition-colors outline-none",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              value[idx] ? "border-primary" : "border-input",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-center text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
