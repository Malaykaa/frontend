import { cn } from "@/shared/lib/utils";
import { Check, X } from "lucide-react";

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { label: "8 caractères minimum", test: (p) => p.length >= 8 },
  { label: "Une majuscule", test: (p) => /[A-Z]/.test(p) },
  { label: "Un chiffre", test: (p) => /\d/.test(p) },
  { label: "Un caractère spécial", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export function getPasswordStrength(password: string): number {
  return RULES.filter((r) => r.test(password)).length;
}

export function isPasswordValid(password: string): boolean {
  return RULES.every((r) => r.test(password));
}

const STRENGTH_COLORS = [
  "bg-transparent",
  "bg-destructive",
  "bg-orange-400",
  "bg-amber-400",
  "bg-emerald-500",
];

const STRENGTH_LABELS = ["", "Trop faible", "Faible", "Moyen", "Fort"];

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
      {/* Barre de force */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= strength ? STRENGTH_COLORS[strength] : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Label */}
      {strength > 0 && (
        <p
          className={cn(
            "text-xs font-medium",
            strength < 3 ? "text-destructive" : strength < 4 ? "text-amber-500" : "text-emerald-600"
          )}
        >
          {STRENGTH_LABELS[strength]}
        </p>
      )}

      {/* Règles */}
      <ul className="space-y-1">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className="flex items-center gap-2">
              {ok ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <X className="h-3 w-3 text-muted-foreground" />
              )}
              <span
                className={cn(
                  "text-xs",
                  ok ? "text-emerald-600" : "text-muted-foreground"
                )}
              >
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
