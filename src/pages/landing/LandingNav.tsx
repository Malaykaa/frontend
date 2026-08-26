import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/**
 * Navigation du site public.
 *
 * Le site était une page unique à ancres ; il est désormais multipage. Chaque
 * audience a sa page, ce qui permet de lui parler directement au lieu de la
 * faire défiler dans un discours écrit pour quelqu'un d'autre.
 *
 * Le menu Solutions porte un intitulé ET une ligne d'explication par entrée :
 * « Malayka Éducative » ne dit rien seul, « pour les écoles, universités et
 * centres de formation » situe immédiatement. C'est ce qui évite qu'un
 * visiteur reparte parce qu'il n'a pas su quelle page était la sienne.
 */

interface SolutionLink {
  to: string;
  label: string;
  description: string;
}

const SOLUTIONS: SolutionLink[] = [
  {
    to: "/",
    label: "Malayka Particulier",
    description: "Pour les jeunes, étudiants et chercheurs d'emploi",
  },
  {
    to: "/solutions/educative",
    label: "Malayka Éducative",
    description: "Pour les écoles, universités, formateurs et centres de formation",
  },
  {
    to: "/solutions/emploi",
    label: "Pour les structures d'emploi",
    description: "Pour les recruteurs, agences d'emploi et cabinets de recrutement",
  },
];

// Services n'a plus d'entrée propre : la mise en relation est décrite sur la
// page « Structures d'emploi », là où se trouve son audience. Un recruteur n'a
// pas à naviguer entre deux pages pour comprendre une seule proposition.
const PAGES = [
  { to: "/a-propos", label: "À propos" },
  { to: "/temoignages", label: "Témoignages" },
];

export function LandingNav() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Referme les menus à chaque changement de page : sans cela, le panneau
  // resterait ouvert par-dessus la page qu'on vient d'ouvrir.
  useEffect(() => {
    setSolutionsOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Clic à l'extérieur et touche Échap — un menu qu'on ne peut fermer qu'en
  // recliquant exactement sur son déclencheur est une impasse au clavier.
  useEffect(() => {
    if (!solutionsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!solutionsRef.current?.contains(e.target as Node)) setSolutionsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSolutionsOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [solutionsOpen]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || solutionsOpen
          ? "bg-background/95 backdrop-blur-md border-b"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
        </Link>

        {/* ── Navigation bureau ── */}
        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative" ref={solutionsRef}>
            <button
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                solutionsOpen
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              aria-haspopup="true"
            >
              Solutions
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", solutionsOpen && "rotate-180")}
              />
            </button>

            {solutionsOpen && (
              <div className="absolute left-0 top-full mt-2 w-[22rem] overflow-hidden rounded-xl border bg-popover shadow-lg animate-fade-in">
                {SOLUTIONS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="block border-b px-5 py-4 transition-colors last:border-b-0 hover:bg-muted/60"
                  >
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {s.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {PAGES.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(p.to) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            onClick={() => setLanguage(i18n.language === "fr" ? "en" : "fr")}
          >
            {i18n.language === "fr" ? "EN" : "FR"}
          </button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            {t("landing.nav_login")}
          </Button>
          <Button size="sm" className="font-semibold" onClick={() => navigate("/onboarding")}>
            {t("landing.nav_start")}
          </Button>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted/60 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Navigation mobile ── */}
      {menuOpen && (
        <div className="max-h-[calc(100dvh-4rem)] space-y-4 overflow-y-auto border-t bg-background px-5 py-5 md:hidden">
          <div className="space-y-1">
            <p className="px-1 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Solutions
            </p>
            {SOLUTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60"
              >
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="space-y-1 border-t pt-4">
            {PAGES.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted/60"
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2 border-t pt-4">
            <Button className="w-full font-semibold" onClick={() => navigate("/onboarding")}>
              {t("landing.nav_start")}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
              {t("landing.nav_login")}
            </Button>
            <button
              className="w-full py-1 text-center text-sm text-muted-foreground"
              onClick={() => setLanguage(i18n.language === "fr" ? "en" : "fr")}
            >
              {i18n.language === "fr" ? "Switch to English" : "Passer en français"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
