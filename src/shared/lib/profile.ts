import type { Profile } from "@/shared/types";

/**
 * Champs nécessaires pour un matching correct des opportunités (localisation,
 * éligibilité par nationalité, offres genrées, bourses avec plafond d'âge).
 * Utilisé pour bloquer la création d'un nouvel objectif tant qu'ils ne sont
 * pas tous renseignés — cf. NewObjectiveSheet.
 */
export const PROFILE_COMPLETION_FIELDS = [
  "country",
  "city",
  "nationality",
  "gender",
  "birth_year",
] as const satisfies readonly (keyof Profile)[];

export function isProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  return PROFILE_COMPLETION_FIELDS.every((field) => {
    const value = profile[field];
    return value !== null && value !== undefined && value !== "";
  });
}

/**
 * Intérêts + description libre — demandés juste après le profil de base, à la
 * création d'objectif (cf. NewObjectiveSheet). Contrairement à
 * isProfileComplete, une valeur VIDE compte comme "traité" (l'utilisateur a
 * vu l'étape et a choisi de ne rien mettre) — seul `null`/`undefined`
 * (jamais demandé) redéclenche l'étape. Ces champs sont plus personnels que
 * pays/genre : on ne force pas leur remplissage.
 */
export function isEnrichedProfileComplete(profile: Profile | null | undefined): boolean {
  if (!profile) return false;
  return profile.interests !== null && profile.interests !== undefined
    && profile.self_description !== null && profile.self_description !== undefined;
}
