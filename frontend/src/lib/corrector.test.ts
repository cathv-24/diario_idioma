import { describe, it, expect } from "vitest";
import { correctEntry } from "./corrector";
describe("corrector de demostración", () => {
  it("conserva el texto original y explica los cambios de A2 en español", () => {
    const entry = correctEntry(
      "Yesterday i goed to the park.",
      "A2",
      "2026-10-23",
    );
    expect(entry.textoOriginal).toBe("Yesterday i goed to the park.");
    expect(entry.textoCorregido).toBe("Yesterday I went to the park.");
    expect(entry.puntaje).toBe(90);
    expect(entry.correcciones).toHaveLength(2);
    expect(entry.correcciones[0].explicacion).toContain("pasado");
  });
  it("explica en inglés desde B1 y conserva el nivel histórico", () => {
    const entry = correctEntry("I eated rice.", "B1", "2026-10-23");
    expect(entry.nivel).toBe("B1");
    expect(entry.correcciones[0].explicacion).toBe(
      "The past tense of eat is ate.",
    );
  });
  it("no altera palabras ambiguas ni partes internas de otras palabras", () => {
    const entry = correctEntry(
      "They were happy with their everyday routine.",
      "C1",
      "2026-10-23",
    );
    expect(entry.textoCorregido).toBe(entry.textoOriginal);
    expect(entry.correcciones).toHaveLength(0);
  });
  it("agrupa todas las ocurrencias de una categoría sin imponer puntuación final", () => {
    const entry = correctEntry("i goed and buyed food", "A1", "2026-10-23");
    expect(entry.textoCorregido).toBe("I went and bought food");
    expect(entry.temasAMejorar[0]).toMatchObject({
      categoria: "GRAMATICA",
      cantidad: 2,
    });
    expect(entry.fecha).toBe("2026-10-23");
  });
  it("limita el puntaje inferior sin perder el historial de correcciones", () => {
    const entry = correctEntry(
      Array(30).fill("goed").join(" "),
      "A2",
      "2026-10-23",
    );
    expect(entry.puntaje).toBe(0);
    expect(entry.correcciones.length).toBeGreaterThan(20);
  });
});

it.each(["Today I feel happy", "A quiet day…", "What a day!", "Today I feel happy 🙂"])("conserva el cierre informal: %s", (text) => {
  const entry = correctEntry(text, "A2", "2026-10-23");
  expect(entry.textoCorregido).toBe(text);
  expect(entry.correcciones).toHaveLength(0);
  expect(entry.puntaje).toBe(100);
});
