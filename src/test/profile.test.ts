import { describe, it, expect } from "vitest";
import { isProfileComplete, isEnrichedProfileComplete } from "@/shared/lib/profile";
import type { Profile } from "@/shared/types";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "1", user_id: "1",
    first_name: "Awa", last_name: "Koné",
    gender: "F", birth_year: 2000,
    country: "CI", city: "Abidjan", nationality: "CI",
    primary_role: "student", domain: null, field_of_study: null, current_status: null,
    skills: [], preferred_content: null, language: "fr",
    interests: null, self_description: null,
    ...overrides,
  };
}

describe("isProfileComplete", () => {
  it("faux si le profil est null", () => {
    expect(isProfileComplete(null)).toBe(false);
  });

  it("vrai quand les 5 champs démographiques sont remplis", () => {
    expect(isProfileComplete(makeProfile())).toBe(true);
  });

  it("faux si un champ démographique manque", () => {
    expect(isProfileComplete(makeProfile({ city: null }))).toBe(false);
  });

  it("faux si un champ démographique est une chaîne vide", () => {
    expect(isProfileComplete(makeProfile({ city: "" }))).toBe(false);
  });
});

describe("isEnrichedProfileComplete", () => {
  it("faux si le profil est null", () => {
    expect(isEnrichedProfileComplete(null)).toBe(false);
  });

  it("faux si interests/self_description n'ont jamais été demandés (null)", () => {
    expect(isEnrichedProfileComplete(makeProfile({ interests: null, self_description: null }))).toBe(false);
  });

  it("vrai si l'étape a été skippée (valeurs vides mais non-nulles)", () => {
    expect(isEnrichedProfileComplete(makeProfile({ interests: [], self_description: "" }))).toBe(true);
  });

  it("vrai si l'étape a été réellement remplie", () => {
    expect(isEnrichedProfileComplete(makeProfile({
      interests: ["informatique"], self_description: "Je cherche un stage.",
    }))).toBe(true);
  });

  it("faux si seul un des deux champs a été traité", () => {
    expect(isEnrichedProfileComplete(makeProfile({ interests: [], self_description: null }))).toBe(false);
  });
});
