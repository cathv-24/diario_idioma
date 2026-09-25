import { Injectable } from '@angular/core';
import {
  CategoriaError,
  Correccion,
  EntradaCorregida,
  NivelIngles,
  ResumenTema,
} from '../modelos/modelos';

/**
 * Port en TypeScript del motor de corrección por reglas del backend
 * (CorrectorBasadoEnReglas). Permite que la app funcione 100% en el navegador,
 * sin backend, para la demo de GitHub Pages.
 *
 * Mantener alineado con el backend Java si se agregan reglas nuevas.
 */

interface Regla {
  malo: string;
  correcto: string;
  categoria: CategoriaError;
  es: string;
  en: string;
}

interface Detectada {
  categoria: CategoriaError;
  original: string;
  corregido: string;
  explicacion: string;
}

const TITULOS: Record<CategoriaError, string> = {
  ORTOGRAFIA: 'Ortografia',
  GRAMATICA: 'Gramatica',
  PUNTUACION: 'Puntuacion',
  VOCABULARIO: 'Vocabulario',
  ARTICULOS: 'Articulos',
  MAYUSCULAS: 'Mayusculas',
};

const CONSEJOS: Record<CategoriaError, string> = {
  ORTOGRAFIA: 'Repasa la escritura de las palabras que usas seguido y apoyate en un diccionario.',
  GRAMATICA: 'Revisa verbos irregulares y la estructura de la oracion (sujeto + verbo).',
  PUNTUACION: 'Cuida las comas, los puntos y no dejar espacios de mas.',
  VOCABULARIO: 'Aprende que sustantivos son incontables y sus plurales irregulares.',
  ARTICULOS: "Recuerda: 'an' antes de sonido vocalico y 'a' antes de consonante.",
  MAYUSCULAS: "Empieza cada oracion con mayuscula y escribe siempre 'I' en mayuscula.",
};

const SUENA_CONSONANTE = new Set([
  'university', 'universe', 'user', 'unicorn', 'european', 'one', 'once',
  'uniform', 'union', 'unique', 'useful', 'used', 'usual', 'united',
]);
const H_MUDA = new Set(['hour', 'honest', 'honor', 'honour', 'heir']);

function ortografia(malo: string, correcto: string): Regla {
  return { malo, correcto, categoria: 'ORTOGRAFIA',
    es: `Se escribe "${correcto}".`, en: `The correct spelling is "${correcto}".` };
}
function contraccion(malo: string, correcto: string): Regla {
  return { malo, correcto, categoria: 'GRAMATICA',
    es: `La contraccion correcta lleva apostrofe: "${correcto}".`,
    en: `The contraction needs an apostrophe: "${correcto}".` };
}
function verbo(malo: string, correcto: string): Regla {
  return { malo, correcto, categoria: 'GRAMATICA',
    es: `Es un verbo irregular: el pasado es "${correcto}", no se le agrega -ed.`,
    en: `This is an irregular verb: the past form is "${correcto}", not -ed.` };
}
function vocab(malo: string, correcto: string): Regla {
  return { malo, correcto, categoria: 'VOCABULARIO',
    es: `Se usa "${correcto}" (no lleva -s en plural).`,
    en: `Use "${correcto}" (no plural -s here).` };
}

const ORTOGRAFIA: Regla[] = [
  ortografia('recieve', 'receive'), ortografia('wich', 'which'),
  ortografia('becouse', 'because'), ortografia('becuase', 'because'),
  ortografia('tomorow', 'tomorrow'), ortografia('definately', 'definitely'),
  ortografia('seperate', 'separate'), ortografia('untill', 'until'),
  ortografia('allways', 'always'), ortografia('beatiful', 'beautiful'),
  ortografia('familly', 'family'), ortografia('finaly', 'finally'),
  ortografia('reallly', 'really'), ortografia('alot', 'a lot'),
  ortografia('thankyou', 'thank you'), ortografia('everyday', 'every day'),
];

const GRAMATICA: Regla[] = [
  contraccion('dont', "don't"), contraccion('doesnt', "doesn't"),
  contraccion('didnt', "didn't"), contraccion('cant', "can't"),
  contraccion('wont', "won't"), contraccion('isnt', "isn't"),
  contraccion('arent', "aren't"), contraccion('wasnt', "wasn't"),
  contraccion('werent', "weren't"), contraccion('havent', "haven't"),
  contraccion('hasnt', "hasn't"), contraccion('hadnt', "hadn't"),
  contraccion('im', "I'm"), contraccion('ive', "I've"),
  contraccion('youre', "you're"), contraccion('theyre', "they're"),
  verbo('goed', 'went'), verbo('teached', 'taught'), verbo('buyed', 'bought'),
  verbo('catched', 'caught'), verbo('runned', 'ran'), verbo('eated', 'ate'),
  verbo('comed', 'came'), verbo('maked', 'made'), verbo('taked', 'took'),
  verbo('thinked', 'thought'), verbo('bringed', 'brought'),
  verbo('gived', 'gave'), verbo('writed', 'wrote'),
];

const VOCABULARIO: Regla[] = [
  vocab('informations', 'information'), vocab('advices', 'advice'),
  vocab('furnitures', 'furniture'), vocab('homeworks', 'homework'),
  vocab('knowledges', 'knowledge'), vocab('moneys', 'money'),
  vocab('childs', 'children'), vocab('mans', 'men'), vocab('womans', 'women'),
  vocab('foots', 'feet'), vocab('tooths', 'teeth'), vocab('persons', 'people'),
];

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@Injectable({ providedIn: 'root' })
export class CorrectorLocal {
  private explicarEnEspanol(nivel: NivelIngles): boolean {
    return nivel === 'A1' || nivel === 'A2';
  }

  private explicar(nivel: NivelIngles, es: string, en: string): string {
    return this.explicarEnEspanol(nivel) ? es : en;
  }

  /** Aplica un patrón, registra las correcciones y devuelve el texto transformado. */
  private aplicarPatron(
    texto: string,
    patron: RegExp,
    reemplazo: (m: RegExpExecArray) => string,
    categoria: CategoriaError,
    explicacion: (m: RegExpExecArray) => string,
    acc: Detectada[],
  ): string {
    let resultado = '';
    let ultimo = 0;
    let m: RegExpExecArray | null;
    const re = new RegExp(patron.source, patron.flags.includes('g') ? patron.flags : patron.flags + 'g');
    while ((m = re.exec(texto)) !== null) {
      const original = m[0];
      const rep = reemplazo(m);
      resultado += texto.slice(ultimo, m.index) + rep;
      ultimo = m.index + original.length;
      if (original !== rep) {
        this.agregar(acc, categoria, original, rep, explicacion(m));
      }
      if (m.index === re.lastIndex) {
        re.lastIndex++; // evita bucles con coincidencias vacías
      }
    }
    resultado += texto.slice(ultimo);
    return resultado;
  }

  private agregar(acc: Detectada[], categoria: CategoriaError, original: string, corregido: string, explicacion: string): void {
    if (original === corregido) {
      return;
    }
    const existe = acc.some(
      (c) => c.categoria === categoria && c.original === original && c.corregido === corregido,
    );
    if (!existe) {
      acc.push({ categoria, original, corregido, explicacion });
    }
  }

  private aplicarDiccionario(texto: string, dic: Regla[], nivel: NivelIngles, acc: Detectada[]): string {
    let t = texto;
    for (const r of dic) {
      const p = new RegExp(`\\b${escaparRegex(r.malo)}\\b`, 'gi');
      t = this.aplicarPatron(t, p, () => r.correcto, r.categoria,
        () => this.explicar(nivel, r.es, r.en), acc);
    }
    return t;
  }

  private reglaFrases(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    let t = texto;
    t = this.aplicarPatron(t, /\bi am agree\b/gi, () => 'I agree', 'GRAMATICA',
      () => this.explicar(nivel,
        'En ingles "agree" ya es el verbo: se dice "I agree", no "I am agree".',
        '"Agree" is already the verb: say "I agree", not "I am agree".'), acc);
    t = this.aplicarPatron(t, /\bmore better\b/gi, () => 'better', 'GRAMATICA',
      () => this.explicar(nivel,
        '"Better" ya es comparativo; no se combina con "more".',
        '"Better" is already comparative; don\'t add "more".'), acc);
    t = this.aplicarPatron(t, /\bexplain me\b/gi, () => 'explain to me', 'GRAMATICA',
      () => this.explicar(nivel,
        'El verbo "explain" necesita "to": "explain to me".',
        '"Explain" needs "to": "explain to me".'), acc);
    t = this.aplicarPatron(t, /\bpeople is\b/gi, () => 'people are', 'GRAMATICA',
      () => this.explicar(nivel,
        '"People" es plural, se usa con "are".',
        '"People" is plural, so it takes "are".'), acc);
    return t;
  }

  private reglaArticulos(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    let t = texto;
    t = this.aplicarPatron(t, /\b([Aa])\s+([aeiouAEIOU][a-zA-Z]*)\b/g, (m) => {
      const siguiente = m[2];
      if (SUENA_CONSONANTE.has(siguiente.toLowerCase())) {
        return m[0];
      }
      const art = m[1] === 'A' ? 'An' : 'an';
      return `${art} ${siguiente}`;
    }, 'ARTICULOS', () => this.explicar(nivel,
      'Antes de sonido vocalico se usa "an", no "a".',
      'Use "an" before a vowel sound, not "a".'), acc);

    t = this.aplicarPatron(t, /\b([Aa]n)\s+([b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z][a-zA-Z]*)\b/g, (m) => {
      const siguiente = m[2];
      if (H_MUDA.has(siguiente.toLowerCase())) {
        return m[0];
      }
      const art = m[1][0] === 'A' ? 'A' : 'a';
      return `${art} ${siguiente}`;
    }, 'ARTICULOS', () => this.explicar(nivel,
      'Antes de sonido consonantico se usa "a", no "an".',
      'Use "a" before a consonant sound, not "an".'), acc);
    return t;
  }

  private reglaPalabraRepetida(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    return this.aplicarPatron(texto, /\b(\w+)\s+\1\b/gi, (m) => m[1], 'GRAMATICA',
      (m) => this.explicar(nivel,
        `Palabra repetida: "${m[1]}" aparece dos veces seguidas.`,
        `Repeated word: "${m[1]}" appears twice in a row.`), acc);
  }

  private reglaEspacios(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    let t = texto;
    t = this.aplicarPatron(t, /[ \t]+([,.;:!?])/g, (m) => m[1], 'PUNTUACION',
      () => this.explicar(nivel,
        'No se deja espacio antes de un signo de puntuacion.',
        "Don't put a space before a punctuation mark."), acc);
    t = this.aplicarPatron(t, /[ \t]{2,}/g, () => ' ', 'PUNTUACION',
      () => this.explicar(nivel,
        'Sobran espacios: usa solo uno entre palabras.',
        'Extra spaces: use a single space between words.'), acc);
    return t;
  }

  private reglaPronombreI(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    return this.aplicarPatron(texto, /\bi\b/g, () => 'I', 'MAYUSCULAS',
      () => this.explicar(nivel,
        'El pronombre "I" (yo) siempre va en mayuscula.',
        'The pronoun "I" is always capitalized.'), acc);
  }

  private reglaMayusculaInicial(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    return this.aplicarPatron(texto, /(^|[.!?]\s+|\n\s*)([a-z])/g,
      (m) => m[1] + m[2].toUpperCase(), 'MAYUSCULAS',
      () => this.explicar(nivel,
        'Toda oracion empieza con mayuscula.',
        'Every sentence starts with a capital letter.'), acc);
  }

  private reglaPuntoFinal(texto: string, nivel: NivelIngles, acc: Detectada[]): string {
    const recortado = texto.replace(/\s+$/, '');
    if (!recortado) {
      return texto;
    }
    const ultimo = recortado[recortado.length - 1];
    if (ultimo !== '.' && ultimo !== '!' && ultimo !== '?') {
      const inicio = Math.max(recortado.lastIndexOf(' '), recortado.lastIndexOf('\n'));
      const fragmento = recortado.slice(inicio + 1);
      this.agregar(acc, 'PUNTUACION', fragmento, fragmento + '.',
        this.explicar(nivel,
          'Falta el punto final de la oracion.',
          'The sentence is missing a final period.'));
      return recortado + '.';
    }
    return texto;
  }

  /** Corrige el texto y arma la respuesta con el mismo formato que el backend. */
  corregir(texto: string, nivel: NivelIngles): EntradaCorregida {
    const acc: Detectada[] = [];
    let t = texto ?? '';

    t = this.aplicarDiccionario(t, ORTOGRAFIA, nivel, acc);
    t = this.aplicarDiccionario(t, GRAMATICA, nivel, acc);
    t = this.aplicarDiccionario(t, VOCABULARIO, nivel, acc);
    t = this.reglaFrases(t, nivel, acc);
    t = this.reglaArticulos(t, nivel, acc);
    t = this.reglaPalabraRepetida(t, nivel, acc);
    t = this.reglaEspacios(t, nivel, acc);
    t = this.reglaPronombreI(t, nivel, acc);
    t = this.reglaMayusculaInicial(t, nivel, acc);
    t = this.reglaPuntoFinal(t, nivel, acc);

    const correcciones: Correccion[] = acc.map((d) => ({
      categoria: d.categoria,
      categoriaTitulo: TITULOS[d.categoria],
      fragmentoOriginal: d.original,
      fragmentoCorregido: d.corregido,
      explicacion: d.explicacion,
    }));

    const puntaje = Math.max(0, 100 - acc.length * 5);
    const temas = this.construirResumen(acc);

    return {
      idEntrada: Date.now(),
      fecha: new Date().toISOString().slice(0, 10),
      fechaCreacion: new Date().toISOString(),
      nivel,
      textoOriginal: texto,
      textoCorregido: t,
      puntaje,
      mensaje: this.mensaje(puntaje, acc.length),
      correcciones,
      temasAMejorar: temas,
    };
  }

  private construirResumen(acc: Detectada[]): ResumenTema[] {
    const conteo = new Map<CategoriaError, number>();
    for (const d of acc) {
      conteo.set(d.categoria, (conteo.get(d.categoria) ?? 0) + 1);
    }
    return [...conteo.entries()]
      .map(([categoria, cantidad]) => ({
        categoria,
        titulo: TITULOS[categoria],
        cantidad,
        consejo: CONSEJOS[categoria],
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }

  private mensaje(puntaje: number, errores: number): string {
    if (errores === 0) return 'Excelente! No detectamos errores. Sigue escribiendo asi.';
    if (puntaje >= 80) return `Muy bien: solo ${errores} detalle(s) por pulir. Vas por buen camino.`;
    if (puntaje >= 50) return 'Buen intento. Revisa las correcciones para mejorar en tus temas debiles.';
    return 'Sigue practicando: hay varios puntos por mejorar, pero cada entrada suma.';
  }
}
