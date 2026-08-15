/// <reference lib="webworker" />

/**
 * Service worker personnalisé — remplace le service worker auto-généré
 * (mode `generateSW`) pour pouvoir répondre aux notifications push.
 *
 * `precacheAndRoute(self.__WB_MANIFEST)` reproduit exactement le
 * comportement de mise en cache qu'avait le mode automatique : c'est la
 * ligne qui évite de régresser sur le hors-ligne en passant en
 * `injectManifest`. Tout ce qui suit — push, clic sur une notification —
 * est ce que le mode automatique ne permettait pas d'ajouter.
 */

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

self.skipWaiting();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Même règle que le `runtimeCaching` du mode généré précédemment.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }),
      new CacheableResponsePlugin({ statuses: [0, 200] }),
    ],
  })
);

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// ── Notifications push ───────────────────────────────────────────────────
//
// Le serveur envoie un payload JSON `{ title, body, url }` (voir
// app/services/push_service.py). `url` est un chemin interne de
// l'application — c'est lui qui permet, au clic, d'atterrir directement sur
// ce dont parle la notification plutôt que sur l'écran d'accueil.

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
}

self.addEventListener("push", (event: PushEvent) => {
  let payload: PushPayload = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = { title: event.data?.text() };
  }

  const title = payload.title || "Malayka";
  const url = payload.url || "/app";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body,
      icon: "/pwa-192.png",
      badge: "/pwa-96.png",
      data: { url },
    })
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data?.url as string) || "/app";

  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // Réutilise un onglet déjà ouvert sur l'application plutôt que d'en
      // empiler un nouveau — le comportement attendu d'une PWA installée.
      const existing = clientsList.find((c) => "focus" in c);
      if (existing) {
        await existing.focus();
        if ("navigate" in existing) await (existing as WindowClient).navigate(url);
        return;
      }
      await self.clients.openWindow(url);
    })()
  );
});
