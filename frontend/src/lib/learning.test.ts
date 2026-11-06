import { describe, expect, it } from "vitest";
import { placementQuestions, placementResult } from "./placement";
import { compareSpeech } from "./speech";
import { recommendUnit, units } from "./learning";
import { correctEntry } from "./corrector";

describe("orientación y práctica conectada", () => {
  it("no recomienda B1 por acertar preguntas avanzadas si faltan bases", () => {
    const answers = placementQuestions.map((question, index) => index < 3 ? (question.answer + 1) % 3 : question.answer);
    expect(placementResult(answers).level).toBe("A1");
    expect(placementResult(placementQuestions.map(question => question.answer)).level).toBe("B1");
    expect(placementResult([]).level).toBe("A1");
  });
  it("localiza una omisión sin marcar el resto de la frase", () => {
    expect(compareSpeech("I went to the park yesterday", "I went the park yesterday")).toEqual({ missing: ["to"], extra: [] });
    expect(compareSpeech("Today, I'm happy!", "today I'm happy")).toEqual({ missing: [], extra: [] });
  });
  it("conecta un error real de pasado con práctica de verbos", () => {
    const entry = correctEntry("Yesterday I goed to the park", "A2", "2026-11-05");
    expect(recommendUnit([entry], "A2").unit.id).toBe("e7");
  });
  it("cada relato tiene una respuesta válida y una propuesta para el diario", () => {
    expect(new Set(units.map(unit => unit.id)).size).toBe(12);
    for (const unit of units) {
      expect(unit.story.choices[unit.story.answer]).toBeTruthy();
      expect(unit.prompt.length).toBeGreaterThan(20);
    }
  });
});
