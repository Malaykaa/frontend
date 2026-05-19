import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { Check, X } from "lucide-react";

type Rule = {
  labelKey: string;
  test: (pw: string) => boolean;
};

const RULES: Rule[] = [
  { labelKey: "auth.password_min",     test: (p) => p.length >= 8 },
  { labelKey: "auth.password_upper",   test: (p) => /[A-Z]/.test(p) },
  { labelKey: "auth.password_digit",   test: (p) => /\d/.test(p) },
  { labelKey: "auth.password_special", test: (p) => /[^A-Za-z0-9]/.test(p) },
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

const STRENGTH_LABEL_KEYS = [
  "",
  "auth.strength_too_weak",
  "auth.strength_weak",
  "auth.strength_medium",
  "auth.strength_strong",
];

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation();
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-2">
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

      {strength > 0 && (
        <p
          className={cn(
            "text-xs font-medium",
            strength < 3 ? "text-destructive" : strength < 4 ? "text-amber-500" : "text-emerald-600"
          )}
        >
          {t(STRENGTH_LABEL_KEYS[strength])}
        </p>
      )}

      <ul className="space-y-1">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.labelKey} className="flex items-center gap-2">
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
                {t(rule.labelKey)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
