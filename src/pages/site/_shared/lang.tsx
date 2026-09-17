import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/i18n";
import { cn } from "@/shared/lib/utils";

/**
 * Bilingue du site public.
 *
 * L'application (espace connecté, admin) passe par des clés i18next et des
 * fichiers `locales/*.json` : c'est adapté à des libellés courts et réutilisés.
 * Le site vitrine, lui, est fait de prose : des titres de trois lignes, des
 * paragraphes d'accroche. Sortir ces phrases dans un fichier de clés rendrait
 * les pages illisibles (`t("home.hero.line2")` ne dit rien de ce qu'on lit)
 * et ferait diverger le texte de sa mise en forme.
 *
 * On garde donc les deux versions côte à côte, à l'endroit exact où elles
 * s'affichent :
 *
 *     const t = useT();
 *     <h2>{t("Nos valeurs", "Our values")}</h2>
 *
 * La langue active reste celle d'i18next : le sélecteur du site et celui de
 * l'application commandent le même état, persisté dans `localStorage`.
 */

export type Lang = "fr" | "en";

export type Translate = {
  (fr: string, en: string): string;
  /** Langue active, pour les rares cas où la mise en forme en dépend. */
  lang: Lang;
};

export function useT(): Translate {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith("en") ? "en" : "fr";

  return useMemo(() => {
    const t = (fr: string, en: string) => (lang === "en" ? en : fr);
    return Object.assign(t, { lang });
  }, [lang]);
}

/** Langue active hors composant React (formatage de nombres, `<html lang>`). */
export function currentLang(i18nLanguage: string | undefined): Lang {
  return i18nLanguage?.startsWith("en") ? "en" : "fr";
}

/**
 * Tient `<html lang>` à jour. Sans cela un lecteur d'écran continue de
 * prononcer la page traduite avec la phonétique française, et les moteurs
 * indexent la mauvaise langue.
 */
export function useHtmlLang(): void {
  const t = useT();
  useEffect(() => {
    document.documentElement.lang = t.lang;
  }, [t.lang]);
}

/** Bascule FR / EN. Commande la même langue que l'espace connecté. */
export function LangSwitch({ className }: { className?: string }) {
  const t = useT();
  const options: Lang[] = ["fr", "en"];

  return (
    <div
      role="group"
      aria-label={t("Langue du site", "Site language")}
      className={cn(
        "flex items-center rounded-lg border border-border p-0.5 font-mono text-[11px] font-semibold",
        className,
      )}
    >
      {options.map((code) => {
        const active = t.lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={cn(
              "rounded-[5px] px-2 py-1 uppercase tracking-[0.08em] transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
