import { lazy, type ComponentType } from "react";

/**
 * Chargement paresseux résistant aux déploiements.
 *
 * Le problème qu'il règle : après une mise en production, les noms de fichiers
 * des morceaux JavaScript changent. Un onglet resté ouvert — ou un navigateur
 * servant l'ancien `index.html` depuis son cache ou depuis le service worker —
 * demande alors un morceau qui n'existe plus. L'import dynamique échoue, React
 * n'a rien à monter, et l'écran devient blanc de façon définitive : aucune
 * navigation ne le répare, puisque c'est le document lui-même qui est périmé.
 *
 * La réparation se fait en deux temps :
 *  1. une seule nouvelle tentative, qui suffit quand l'échec venait du réseau ;
 *  2. sinon un rechargement complet, qui va rechercher un `index.html` à jour
 *     et donc les bons noms de morceaux.
 *
 * Le rechargement est marqué dans `sessionStorage` : si le morceau manque
 * encore juste après, on laisse l'erreur remonter à la frontière d'erreur
 * plutôt que de boucler indéfiniment sur des rechargements.
 */
export function lazyRoute<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      try {
        return await factory();
      } catch {
        const KEY = "malayka:chunk-reload";
        if (!sessionStorage.getItem(KEY)) {
          sessionStorage.setItem(KEY, String(Date.now()));
          window.location.reload();
          // Le rechargement est asynchrone : cette promesse ne se résout
          // jamais, ce qui laisse le voile de chargement affiché jusque-là.
          return await new Promise<{ default: T }>(() => {});
        }
        throw error;
      }
    }
  });
}

/**
 * Efface la marque de rechargement une fois l'application réellement rendue.
 * Sans cela, un seul incident interdirait toute réparation ultérieure pour le
 * reste de la session.
 */
export function clearChunkReloadMark(): void {
  try {
    sessionStorage.removeItem("malayka:chunk-reload");
  } catch {
    /* stockage indisponible (navigation privée) — sans conséquence ici */
  }
}
