import { categoryNames } from "./types";
import type { Entry, Level, Category, Correction } from "./types";
export function correctEntry(
  text: string,
  nivel: Level,
  fecha: string,
  id = Date.now(),
): Entry {
  let corrected = text.trim();
  const corrections: Correction[] = [];
  const es = nivel === "A1" || nivel === "A2";
  const rules: [RegExp, string, Category, string, string][] = [
    [
      /\bgoed\b/gi,
      "went",
      "GRAMATICA",
      "El pasado de go es went. Es un verbo irregular.",
      "The past tense of go is went. It is an irregular verb.",
    ],
    [
      /\beated\b/gi,
      "ate",
      "GRAMATICA",
      "El pasado de eat es ate.",
      "The past tense of eat is ate.",
    ],
    [
      /\bbuyed\b/gi,
      "bought",
      "GRAMATICA",
      "El pasado de buy es bought.",
      "The past tense of buy is bought.",
    ],
    [
      /\brecieve\b/gi,
      "receive",
      "ORTOGRAFIA",
      "La forma correcta es receive.",
      "The correct spelling is receive.",
    ],
    [
      /\bbeatiful\b/gi,
      "beautiful",
      "ORTOGRAFIA",
      "La forma correcta es beautiful.",
      "The correct spelling is beautiful.",
    ],
    [
      /\binformations\b/gi,
      "information",
      "VOCABULARIO",
      "Information es incontable y no lleva s.",
      "Information is uncountable and has no plural s.",
    ],
    [
      /\bdont\b/gi,
      "don't",
      "GRAMATICA",
      "La contracción lleva apóstrofo.",
      "This contraction needs an apostrophe.",
    ],
    [
      /\bi\b/g,
      "I",
      "MAYUSCULAS",
      "El pronombre I siempre se escribe en mayúscula.",
      "The pronoun I is always capitalized.",
    ],
  ];
  const add = (
    original: string,
    replacement: string,
    category: Category,
    explanation: string,
  ) =>
    corrections.push({
      categoria: category,
      categoriaTitulo: categoryNames[category],
      fragmentoOriginal: original,
      fragmentoCorregido: replacement,
      explicacion: explanation,
    });
  for (const [regex, replacement, category, spanish, english] of rules)
    corrected = corrected.replace(regex, (match) => {
      let value = replacement;
      if (match[0] === match[0].toUpperCase() && category !== "MAYUSCULAS")
        value = value[0].toUpperCase() + value.slice(1);
      if (match !== value) add(match, value, category, es ? spanish : english);
      return value;
    });
  corrected = corrected.replace(/^\p{Ll}/u, (letter) => {
    add(
      letter,
      letter.toUpperCase(),
      "MAYUSCULAS",
      es
        ? "Empieza el texto con mayúscula."
        : "Start the text with a capital letter.",
    );
    return letter.toUpperCase();
  });
  const counts = new Map<Category, number>();
  for (const c of corrections)
    counts.set(c.categoria, (counts.get(c.categoria) || 0) + 1);
  return {
    idEntrada: id,
    fecha,
    fechaCreacion: new Date().toISOString(),
    nivel,
    textoOriginal: text.trim(),
    textoCorregido: corrected,
    puntaje: Math.max(0, 100 - corrections.length * 5),
    mensaje:
      "Corrección con reglas limitadas. El puntaje no mide tu nivel de inglés.",
    correcciones: corrections,
    temasAMejorar: [...counts]
      .sort((a, b) => b[1] - a[1])
      .map(([categoria, cantidad]) => ({
        categoria,
        titulo: categoryNames[categoria],
        cantidad,
        consejo: es
          ? "Relee la explicación y escribe una nueva oración para practicar."
          : "Read the explanation and write a new sentence to practise.",
      })),
    sugerenciasVocabulario: [],
  };
}
