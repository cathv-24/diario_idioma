// Tipos que reflejan los DTO del backend (com.diario.apidiario.dto)

export type NivelIngles = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CategoriaError =
  | 'ORTOGRAFIA'
  | 'GRAMATICA'
  | 'PUNTUACION'
  | 'VOCABULARIO'
  | 'ARTICULOS'
  | 'MAYUSCULAS';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  nivel: NivelIngles;
  fechaRegistro?: string;
}

export interface EntradaRequest {
  idUsuario: number;
  fecha?: string;
  texto: string;
}

export interface Correccion {
  categoria: CategoriaError;
  categoriaTitulo: string;
  fragmentoOriginal: string;
  fragmentoCorregido: string;
  explicacion: string;
}

export interface ResumenTema {
  categoria: CategoriaError;
  titulo: string;
  cantidad: number;
  consejo: string;
}

export interface EntradaCorregida {
  idEntrada: number;
  fecha: string;
  fechaCreacion: string;
  nivel: NivelIngles;
  textoOriginal: string;
  textoCorregido: string;
  puntaje: number;
  mensaje: string;
  correcciones: Correccion[];
  temasAMejorar: ResumenTema[];
}

export const NIVELES: { valor: NivelIngles; etiqueta: string }[] = [
  { valor: 'A1', etiqueta: 'A1 - Principiante' },
  { valor: 'A2', etiqueta: 'A2 - Basico' },
  { valor: 'B1', etiqueta: 'B1 - Intermedio' },
  { valor: 'B2', etiqueta: 'B2 - Intermedio alto' },
  { valor: 'C1', etiqueta: 'C1 - Avanzado' },
  { valor: 'C2', etiqueta: 'C2 - Maestria' },
];

// Colores por categoria para las etiquetas (clases Tailwind)
export const COLOR_CATEGORIA: Record<CategoriaError, string> = {
  ORTOGRAFIA: 'bg-rose-100 text-rose-700',
  GRAMATICA: 'bg-amber-100 text-amber-700',
  PUNTUACION: 'bg-sky-100 text-sky-700',
  VOCABULARIO: 'bg-emerald-100 text-emerald-700',
  ARTICULOS: 'bg-violet-100 text-violet-700',
  MAYUSCULAS: 'bg-fuchsia-100 text-fuchsia-700',
};
