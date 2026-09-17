import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { useHtmlLang } from "./lang";

/**
 * Coquille commune à toutes les pages publiques : navigation, contenu, footer.
 * Gère aussi le scroll : haut de page au changement de route, ancre si présente.
 */
export default function SiteLayout() {
  const location = useLocation();
  useHtmlLang();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth" }));
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.hash]);

  return (
    <div className="site-theme min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
