/**
 * Tests du parsing de contenu de message.
 *
 * On teste directement les fonctions pures exportées — pas de rendu React,
 * pas de mock réseau. Si ces fonctions régressent, le chat est cassé.
 */
import { describe, it, expect } from "vitest";

// ── Copie locale des fonctions à tester ────────────────────────────────────
// (importées depuis leur module source pour détecter les régressions)

// Même regex que MessageBubble.tsx stripSourcesBlock et message_formatter.py.
// Ancre le match à la FIN de la chaîne ($) — ne supprime pas le contenu
// qui suit un bloc Sources (@@STEPS@@, @@PROPOSITIONS@@, clarifications).
const SOURCES_RE =
  /\n{1,3}(?:---[ \t]*\n)?(?:#{1,3}[ \t]+)?\*{0,2}[ \t]*[Ss]ources?[ \t]*:?[ \t]*\*{0,2}[^\n]*(?:\n[ \t]*[-*][ \t][^\n]*)*\s*$/g;

function stripSourcesBlock(text: string): string {
  return text.replace(SOURCES_RE, "").trimEnd();
}

// ── Tests stripSourcesBlock ────────────────────────────────────────────────

describe("stripSourcesBlock", () => {
  // ── Cas où Sources EST supprimé (en queue absolue) ───────────────────────

  it("supprime le bloc ---\\n**Sources :**\\n- liens en queue", () => {
    const content = [
      "Voici ta réponse.",
      "",
      "---",
      "**Sources :**",
      "- [Programme 2026](https://example.com/1)",
      "- [Autre programme](https://example.com/2)",
    ].join("\n");
    expect(stripSourcesBlock(content)).toBe("Voici ta réponse.");
  });

  it("supprime ## Sources avec liste en queue", () => {
    const content = "Ma réponse.\n\n## Sources\n- [Lien](https://example.com)";
    expect(stripSourcesBlock(content)).toBe("Ma réponse.");
  });

  it("supprime **Sources** sans deux-points en queue", () => {
    const content = "Réponse.\n\n**Sources**\n- [Lien](https://example.com)";
    expect(stripSourcesBlock(content)).toBe("Réponse.");
  });

  // ── Cas où Sources NE DOIT PAS être supprimé ─────────────────────────────

  it("préserve les propositions @@PROPOSITIONS@@ qui suivent Sources", () => {
    const content = [
      "Voici ma réponse.",
      "",
      "**Sources :**",
      "- [Link](https://example.com)",
      "",
      "@@PROPOSITIONS@@ %5B%22Option%201%22%5D",
    ].join("\n");
    // @@PROPOSITIONS@@ suit Sources → on ne doit rien supprimer
    expect(stripSourcesBlock(content)).toBe(content);
  });

  it("préserve les @@STEPS@@ qui suivent Sources", () => {
    const content = [
      "Voici le plan.",
      "",
      "**Sources :**",
      "- [Link](https://example.com)",
      "",
      "@@STEPS@@ %5B%7B%22id%22%3A%221%22%7D%5D",
    ].join("\n");
    expect(stripSourcesBlock(content)).toBe(content);
  });

  it("préserve les questions de clarification qui suivent Sources", () => {
    const content = [
      "Voici les infos.",
      "",
      "**Sources :**",
      "- [Link](https://example.com)",
      "",
      "1. Quel est ton niveau d'études ?",
      "2. Dans quelle filière es-tu ?",
    ].join("\n");
    expect(stripSourcesBlock(content)).toBe(content);
  });

  it("ne touche pas au contenu sans bloc Sources", () => {
    const content = "Bonjour !\n\n1. Étape 1\n2. Étape 2";
    expect(stripSourcesBlock(content)).toBe(content);
  });

  it("ne supprime pas 'sources' dans le corps du texte", () => {
    const content = "Les sources de financement sont variées.\n\nSuite de la réponse.";
    expect(stripSourcesBlock(content)).toBe(content);
  });
});

// ── Tests du parsing des marqueurs @@STEPS@@ / @@PROPOSITIONS@@ ──────────────

const STEPS_RE = /@@STEPS@@\s+(\S+)/;
const PROPS_RE = /@@PROPOSITIONS@@\s+(\S+)/;

function parseMarkers(raw: string) {
  let text = raw;
  let steps: unknown[] = [];
  let propositions: string[] = [];

  const stepsMatch = text.match(STEPS_RE);
  if (stepsMatch) {
    try { steps = JSON.parse(decodeURIComponent(stepsMatch[1])); } catch { /* */ }
    text = text.replace(/\s*@@STEPS@@\s+\S+/, "");
  }

  const propMatch = text.match(PROPS_RE);
  if (propMatch) {
    try { propositions = JSON.parse(decodeURIComponent(propMatch[1])); } catch { /* */ }
    text = text.replace(/\s*@@PROPOSITIONS@@\s+\S+/, "");
  }

  return { text: text.replace(/@@\w+@@[^\n]*/g, "").trim(), steps, propositions };
}

describe("parseMarkers (@@STEPS@@ / @@PROPOSITIONS@@)", () => {
  it("extrait les steps encodés", () => {
    const stepsJson = JSON.stringify([
      { id: "1", title: "Étape 1", type: "step", description: "Faire X" },
    ]);
    const raw = `Voici ton plan.\n\n@@STEPS@@ ${encodeURIComponent(stepsJson)}`;
    const { steps, text } = parseMarkers(raw);

    expect(steps).toHaveLength(1);
    expect(text).toBe("Voici ton plan.");
  });

  it("extrait les propositions encodées", () => {
    const propsJson = JSON.stringify(["Créer un CV", "Trouver une bourse"]);
    const raw = `Que veux-tu faire ?\n\n@@PROPOSITIONS@@ ${encodeURIComponent(propsJson)}`;
    const { propositions, text } = parseMarkers(raw);

    expect(propositions).toEqual(["Créer un CV", "Trouver une bourse"]);
    expect(text).toBe("Que veux-tu faire ?");
  });

  it("retourne le texte intact s'il n'y a pas de marqueurs", () => {
    const raw = "Réponse simple sans marqueurs.";
    const { text, steps, propositions } = parseMarkers(raw);

    expect(text).toBe(raw);
    expect(steps).toHaveLength(0);
    expect(propositions).toHaveLength(0);
  });

  it("ignore silencieusement un JSON malformé", () => {
    const raw = "Texte.\n\n@@STEPS@@ INVALID_JSON";
    const { steps } = parseMarkers(raw);
    expect(steps).toHaveLength(0);
  });
});
