import { describe, it, expect } from "vitest";
import { formatRelativeTime, truncate, isPhone, cn } from "@/shared/lib/utils";

describe("formatRelativeTime", () => {
  it("retourne 'À l'instant' pour moins d'une minute", () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe("À l'instant");
  });

  it("retourne les minutes écoulées", () => {
    const d = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(d)).toBe("Il y a 5 min");
  });

  it("retourne les heures écoulées", () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(d)).toBe("Il y a 3h");
  });

  it("retourne les jours écoulés", () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(d)).toBe("Il y a 2j");
  });
});

describe("truncate", () => {
  it("ne tronque pas si le texte est plus court", () => {
    expect(truncate("Bonjour", 20)).toBe("Bonjour");
  });

  it("tronque avec '…' au bon endroit", () => {
    expect(truncate("Bonjour le monde", 7)).toBe("Bonjour…");
  });

  it("retourne exactement max caractères + '…'", () => {
    const result = truncate("abcdefghij", 5);
    expect(result).toBe("abcde…");
  });
});

describe("isPhone", () => {
  it("accepte un numéro international", () => {
    expect(isPhone("+225 07 00 00 00 00")).toBe(true);
  });

  it("accepte un numéro sans indicatif", () => {
    expect(isPhone("0700000000")).toBe(true);
  });

  it("rejette une adresse email", () => {
    expect(isPhone("user@example.com")).toBe(false);
  });

  it("rejette un texte trop court", () => {
    expect(isPhone("123")).toBe(false);
  });
});

describe("cn", () => {
  it("fusionne des classes simples", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("déduplique les classes Tailwind conflictuelles", () => {
    // tailwind-merge : la seconde valeur gagne
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("px-4", false && "hidden", undefined, "py-2")).toBe("px-4 py-2");
  });
});
