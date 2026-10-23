export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Category =
  | "ORTOGRAFIA"
  | "GRAMATICA"
  | "PUNTUACION"
  | "VOCABULARIO"
  | "ARTICULOS"
  | "MAYUSCULAS";
export interface Profile {
  idUsuario: number;
  nombre: string;
  email: string;
  nivel: Level;
  fechaRegistro?: string;
}
export interface Correction {
  categoria: Category;
  categoriaTitulo: string;
  fragmentoOriginal: string;
  fragmentoCorregido: string;
  explicacion: string;
}
export interface Suggestion {
  expresionOriginal: string;
  alternativa: string;
  explicacion: string;
  nivelMinimo: Level;
}
export interface Entry {
  idEntrada: number;
  fecha: string;
  fechaCreacion: string;
  nivel: Level;
  textoOriginal: string;
  textoCorregido: string;
  puntaje: number;
  mensaje: string;
  correcciones: Correction[];
  temasAMejorar: {
    categoria: Category;
    titulo: string;
    cantidad: number;
    consejo: string;
  }[];
  sugerenciasVocabulario: Suggestion[];
}
export const levels: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const categoryNames: Record<Category, string> = {
  ORTOGRAFIA: "Ortografía",
  GRAMATICA: "Gramática",
  PUNTUACION: "Puntuación",
  VOCABULARIO: "Vocabulario",
  ARTICULOS: "Artículos",
  MAYUSCULAS: "Mayúsculas",
};
export const localDate = () => new Date().toLocaleDateString("en-CA");
export const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;
