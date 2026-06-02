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

// ── Notifications push (browser API) ────────────────────────────────────

export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  return Notification.requestPermission();
}

export function getPushPermission(): NotificationPermission {
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

export const deleteAccount = () =>
  apiRequest<void>("/auth/me", { method: "DELETE", skipRefresh: true });
