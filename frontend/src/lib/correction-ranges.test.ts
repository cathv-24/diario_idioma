import { describe, it, expect } from "vitest";
import { correctionRanges } from "./correction-ranges";
import type { Correction } from "./types";
const change = (
  from: string,
  to: string,
  categoria: Correction["categoria"] = "ORTOGRAFIA",
): Correction => ({
  categoria,
  categoriaTitulo: categoria,
  fragmentoOriginal: from,
  fragmentoCorregido: to,
  explicacion: "Prueba",
});
describe("posiciones de correcciones dentro del diario", () => {
  it("asigna cada aparición repetida a su explicación sin superponerlas", () => {
    const result = correctionRanges("goed and goed", [
      change("goed", "went"),
      change("goed", "went"),
    ]);
    expect(
      result.map(({ start, end, index }) => ({ start, end, index })),
    ).toEqual([
      { start: 0, end: 4, index: 0 },
      { start: 9, end: 13, index: 1 },
    ]);
  });
  it("no resalta fragmentos dentro de otra palabra", () => {
    expect(
      correctionRanges("beautifully beautiful", [
        change("beautiful", "lovely"),
      ])[0].start,
    ).toBe(12);
  });
  it("permite una mayúscula inicial sin seleccionar letras intermedias", () => {
    expect(
      correctionRanges("today is sunny", [change("t", "T", "MAYUSCULAS")])[0],
    ).toMatchObject({ start: 0, end: 1 });
    expect(
      correctionRanges("at home", [change("t", "T", "MAYUSCULAS")]),
    ).toEqual([]);
  });
  it("omite fragmentos históricos ausentes en vez de inventar una posición", () => {
    expect(correctionRanges("I feel happy", [change("goed", "went")])).toEqual(
      [],
    );
  });
});
