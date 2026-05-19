import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function LandingNav() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="Malayka" className="h-8 w-auto dark:invert" />
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted/60"
            onClick={() => setLanguage(i18n.language === "fr" ? "en" : "fr")}
          >
            {i18n.language === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
          </button>
          <Button
            variant="ghost"
            size="sm"
            className="font-medium"
            onClick={() => navigate("/login")}
          >
            {t("landing.nav_login")}
          </Button>
          <Button
            size="sm"
            className="gap-1.5 font-semibold"
            onClick={() => navigate("/onboarding")}
          >
            {t("landing.nav_start")}
          </Button>
        </div>

        {/* Mobile burger */}
        <button
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg hover:bg-muted/60 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background/98 backdrop-blur-md px-5 py-4 space-y-3">
          <Button
            className="w-full font-semibold"
            onClick={() => { navigate("/onboarding"); setMenuOpen(false); }}
          >
            {t("landing.nav_start")}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => { navigate("/login"); setMenuOpen(false); }}
          >
            {t("landing.nav_login")}
          </Button>
          <button
            className="w-full text-center text-sm text-muted-foreground py-1"
            onClick={() => { setLanguage(i18n.language === "fr" ? "en" : "fr"); setMenuOpen(false); }}
          >
            {i18n.language === "fr" ? "Switch to English 🇬🇧" : "Passer en français 🇫🇷"}
          </button>
        </div>
      )}
    </header>
  );
}
