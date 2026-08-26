import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LandingNav } from "./LandingNav";
import { LandingFooter } from "./LandingFooter";

/**
 * Enveloppe commune aux pages publiques : navigation, contenu, pied de page.
 *
 * Remonte en haut à chaque changement de page. Sans cela, passer d'une page
 * longue à une page courte conserve la position de défilement et donne
 * l'impression d'arriver au milieu d'un contenu — un défaut classique des
 * applications monopages qu'on ne remarque qu'une fois le site multipage.
 */
export function LandingLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main>
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}
