import { apiRequest } from "@/shared/api/client";
import type { Profile } from "@/shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProfileUpdatePayload {
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  birth_year?: number | null;
  country?: string | null;
  city?: string | null;
  nationality?: string | null;
  language?: string | null;
  primary_role?: "student" | "professional" | "jobseeker" | null;
  domain?: string | null;
  field_of_study?: string | null;
  current_status?: string | null;
  preferred_content?: string | null;
  phone?: string | null;
}

interface WrappedProfileResponse {
  profile: Profile | null;
}

// ── Endpoints ─────────────────────────────────────────────────────────────

/** Met à jour le profil de l'utilisateur courant */
export async function updateProfile(
  payload: ProfileUpdatePayload
): Promise<Profile | null> {
  const res = await apiRequest<WrappedProfileResponse>("/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.profile;
}

/** Récupère le profil complet (avec phone et email) */
export async function fetchProfile(): Promise<Profile | null> {
  const res = await apiRequest<WrappedProfileResponse>("/profile");
  return res.profile;
}

// ── Dark mode (localStorage + Tailwind class) ─────────────────────────────

export type Theme = "light" | "dark";

export function getTheme(): Theme {
  return (localStorage.getItem("mlk_theme") as Theme) ?? "light";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("mlk_theme", theme);
}

export function initTheme(): void {
  applyTheme(getTheme());
}

// ── Notifications push (Web Push + service worker) ──────────────────────
//
// Deux étapes distinctes, souvent confondues : la permission du navigateur
// (« ce site peut-il notifier ? ») et l'abonnement push (« à quel endpoint
// le serveur doit-il envoyer ? »). Avoir l'une sans l'autre ne sert à rien —
// la permission seule ne fait jamais arriver de notification.

/** Convertit la clé VAPID (base64url) au format attendu par PushManager. */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const bytes = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) bytes[i] = rawData.charCodeAt(i);
  return bytes;
}

async function subscribeToPush(): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const { public_key } = await apiRequest<{ public_key: string | null }>("/push/vapid-public-key");
      // Le serveur peut ne pas encore avoir de clés VAPID configurées —
      // la permission navigateur reste accordée, l'abonnement attendra.
      if (!public_key) return;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key),
      });
    }
    await apiRequest("/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription.toJSON()),
    });
  } catch (e) {
    console.error("[Push] Abonnement impossible :", e);
  }
}

/**
 * Resynchronise l'abonnement push si la permission est déjà accordée.
 *
 * À appeler au chargement de l'application authentifiée — pas seulement au
 * moment où l'utilisateur clique « Activer » dans les réglages. Sans ça, un
 * utilisateur ayant déjà autorisé les notifications lors d'une session
 * précédente, mais dont l'abonnement a expiré ou n'a jamais atteint le
 * serveur (ex. clés VAPID absentes à l'époque), resterait silencieusement
 * privé de push malgré une permission accordée.
 */
export function syncPushSubscription(): void {
  if (getPushPermission() === "granted") void subscribeToPush();
}

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  let permission = Notification.permission;
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }
  if (permission === "granted") {
    await subscribeToPush();
  }
  return permission;
}

export function getPushPermission(): NotificationPermission {
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

export const deleteAccount = () =>
  apiRequest<void>("/auth/me", { method: "DELETE", skipRefresh: true });
