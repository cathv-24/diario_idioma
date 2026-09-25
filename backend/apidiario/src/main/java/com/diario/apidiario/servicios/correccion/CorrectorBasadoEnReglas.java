package com.diario.apidiario.servicios.correccion;

import com.diario.apidiario.enums.CategoriaError;
import com.diario.apidiario.enums.NivelIngles;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Implementacion del motor de correccion basada en reglas y diccionarios.
 * Funciona sin dependencias externas: detecta los errores mas tipicos de
 * hispanohablantes que estudian ingles (ortografia, contracciones, verbos
 * irregulares, articulos a/an, mayusculas y puntuacion).
 *
 * Es la implementacion por defecto ({@code diario.corrector=reglas}).
 * Cuando se conecte la {@code CorrectorLLM}, esta clase puede seguir usandose
 * como respaldo o para pruebas offline.
 */
@Service
@Slf4j
@ConditionalOnProperty(name = "diario.corrector", havingValue = "reglas", matchIfMissing = true)
public class CorrectorBasadoEnReglas implements ServicioCorreccion {

    /** Palabra correcta + categoria + explicacion (espanol / ingles). */
    private record Regla(String correcto, CategoriaError categoria, String es, String en) {}

    // --- Ortografia: errores de escritura frecuentes ---
    private static final Map<String, Regla> ORTOGRAFIA = new LinkedHashMap<>();
    // --- Gramatica: contracciones sin apostrofe y verbos irregulares ---
    private static final Map<String, Regla> GRAMATICA = new LinkedHashMap<>();
    // --- Vocabulario: incontables en plural y plurales irregulares ---
    private static final Map<String, Regla> VOCABULARIO = new LinkedHashMap<>();

    // Palabras que empiezan con vocal pero suenan como consonante (van con "a", no "an")
    private static final Set<String> SUENA_CONSONANTE = Set.of(
            "university", "universe", "user", "unicorn", "european", "one", "once",
            "uniform", "union", "unique", "useful", "used", "usual", "united");
    // Palabras que empiezan con consonante muda (van con "an", no "a")
    private static final Set<String> H_MUDA = Set.of("hour", "honest", "honor", "honour", "heir");

    static {
        // Ortografia
        ortografia("recieve", "receive");
        ortografia("wich", "which");
        ortografia("becouse", "because");
        ortografia("becuase", "because");
        ortografia("tomorow", "tomorrow");
        ortografia("definately", "definitely");
        ortografia("seperate", "separate");
        ortografia("untill", "until");
        ortografia("allways", "always");
        ortografia("beatiful", "beautiful");
        ortografia("familly", "family");
        ortografia("finaly", "finally");
        ortografia("reallly", "really");
        ortografia("alot", "a lot");
        ortografia("thankyou", "thank you");
        ortografia("everyday", "every day"); // como adverbio; heuristica basica

        // Gramatica: contracciones sin apostrofe
        contraccion("dont", "don't");
        contraccion("doesnt", "doesn't");
        contraccion("didnt", "didn't");
        contraccion("cant", "can't");
        contraccion("wont", "won't");
        contraccion("isnt", "isn't");
        contraccion("arent", "aren't");
        contraccion("wasnt", "wasn't");
        contraccion("werent", "weren't");
        contraccion("havent", "haven't");
        contraccion("hasnt", "hasn't");
        contraccion("hadnt", "hadn't");
        contraccion("im", "I'm");
        contraccion("ive", "I've");
        contraccion("youre", "you're");
        contraccion("theyre", "they're");
        contraccion("were", "we're"); // ojo: 'were' tambien es pasado; el motor de reglas asume contraccion
        // Gramatica: verbos irregulares mal conjugados en pasado
        verbo("goed", "went");
        verbo("teached", "taught");
        verbo("buyed", "bought");
        verbo("catched", "caught");
        verbo("runned", "ran");
        verbo("eated", "ate");
        verbo("comed", "came");
        verbo("maked", "made");
        verbo("taked", "took");
        verbo("thinked", "thought");
        verbo("bringed", "brought");
        verbo("gived", "gave");
        verbo("writed", "wrote");

        // Vocabulario: incontables que no llevan plural
        vocab("informations", "information");
        vocab("advices", "advice");
        vocab("furnitures", "furniture");
        vocab("homeworks", "homework");
        vocab("knowledges", "knowledge");
        vocab("moneys", "money");
        // Vocabulario: plurales irregulares
        vocab("childs", "children");
        vocab("mans", "men");
        vocab("womans", "women");
        vocab("foots", "feet");
        vocab("tooths", "teeth");
        vocab("persons", "people");
    }

    private static void ortografia(String malo, String bueno) {
        ORTOGRAFIA.put(malo, new Regla(bueno, CategoriaError.ORTOGRAFIA,
                "Se escribe \"" + bueno + "\".",
                "The correct spelling is \"" + bueno + "\"."));
    }

    private static void contraccion(String malo, String bueno) {
        GRAMATICA.put(malo, new Regla(bueno, CategoriaError.GRAMATICA,
                "La contraccion correcta lleva apostrofe: \"" + bueno + "\".",
                "The contraction needs an apostrophe: \"" + bueno + "\"."));
    }

    private static void verbo(String malo, String bueno) {
        GRAMATICA.put(malo, new Regla(bueno, CategoriaError.GRAMATICA,
                "Es un verbo irregular: el pasado es \"" + bueno + "\", no se le agrega -ed.",
                "This is an irregular verb: the past form is \"" + bueno + "\", not -ed."));
    }

    private static void vocab(String malo, String bueno) {
        VOCABULARIO.put(malo, new Regla(bueno, CategoriaError.VOCABULARIO,
                "Se usa \"" + bueno + "\" (no lleva -s en plural).",
                "Use \"" + bueno + "\" (no plural -s here)."));
    }

    @Override
    public ResultadoCorreccion corregir(String texto, NivelIngles nivel) {
        ResultadoCorreccion resultado = new ResultadoCorreccion();
        List<CorreccionDetectada> acc = resultado.getCorrecciones();

        String t = texto == null ? "" : texto;

        // 1) Diccionarios de palabras (ortografia, gramatica, vocabulario)
        t = aplicarDiccionario(t, ORTOGRAFIA, nivel, acc);
        t = aplicarDiccionario(t, GRAMATICA, nivel, acc);
        t = aplicarDiccionario(t, VOCABULARIO, nivel, acc);

        // 2) Frases tipicas
        t = reglaFrases(t, nivel, acc);

        // 3) Articulos a / an
        t = reglaArticulos(t, nivel, acc);

        // 4) Palabra repetida consecutiva ("the the")
        t = reglaPalabraRepetida(t, nivel, acc);

        // 5) Espacios dobles y espacio antes de puntuacion
        t = reglaEspacios(t, nivel, acc);

        // 6) Pronombre "i" -> "I"
        t = reglaPronombreI(t, nivel, acc);

        // 7) Mayuscula al inicio de cada oracion
        t = reglaMayusculaInicial(t, nivel, acc);

        // 8) Punto final
        t = reglaPuntoFinal(t, nivel, acc);

        resultado.setTextoCorregido(t);
        log.debug("Correccion por reglas: {} errores detectados", acc.size());
        return resultado;
    }

    // ---------------------------------------------------------------------
    // Utilidades
    // ---------------------------------------------------------------------

    private String explicar(NivelIngles nivel, String es, String en) {
        return nivel != null && nivel.explicarEnEspanol() ? es : en;
    }

    private void agregar(List<CorreccionDetectada> acc, CategoriaError cat,
                         String original, String corregido, String explicacion) {
        if (original.equals(corregido)) {
            return;
        }
        // Evita duplicados identicos (misma correccion repetida)
        boolean existe = acc.stream().anyMatch(c ->
                c.getCategoria() == cat
                        && c.getFragmentoOriginal().equals(original)
                        && c.getFragmentoCorregido().equals(corregido));
        if (!existe) {
            acc.add(new CorreccionDetectada(cat, original, corregido, explicacion));
        }
    }

    /**
     * Aplica un patron sobre el texto: por cada coincidencia calcula el reemplazo,
     * registra la correccion si cambia y devuelve el texto transformado.
     */
    private String aplicarPatron(String texto, Pattern patron,
                                 Function<Matcher, String> reemplazo,
                                 CategoriaError categoria,
                                 Function<Matcher, String> explicacion,
                                 List<CorreccionDetectada> acc) {
        Matcher m = patron.matcher(texto);
        StringBuilder sb = new StringBuilder();
        while (m.find()) {
            String original = m.group();
            String rep = reemplazo.apply(m);
            agregar(acc, categoria, original, rep, explicacion.apply(m));
            m.appendReplacement(sb, Matcher.quoteReplacement(rep));
        }
        m.appendTail(sb);
        return sb.toString();
    }

    // ---------------------------------------------------------------------
    // Reglas
    // ---------------------------------------------------------------------

    private String aplicarDiccionario(String texto, Map<String, Regla> diccionario,
                                      NivelIngles nivel, List<CorreccionDetectada> acc) {
        String t = texto;
        for (Map.Entry<String, Regla> e : diccionario.entrySet()) {
            Pattern p = Pattern.compile("\\b" + Pattern.quote(e.getKey()) + "\\b",
                    Pattern.CASE_INSENSITIVE);
            Regla r = e.getValue();
            t = aplicarPatron(t, p,
                    m -> r.correcto(),
                    r.categoria(),
                    m -> explicar(nivel, r.es(), r.en()),
                    acc);
        }
        return t;
    }

    private String reglaFrases(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        String t = texto;
        t = aplicarPatron(t, Pattern.compile("\\bi am agree\\b", Pattern.CASE_INSENSITIVE),
                m -> "I agree", CategoriaError.GRAMATICA,
                m -> explicar(nivel,
                        "En ingles \"agree\" ya es el verbo: se dice \"I agree\", no \"I am agree\".",
                        "\"Agree\" is already the verb: say \"I agree\", not \"I am agree\"."),
                acc);
        t = aplicarPatron(t, Pattern.compile("\\bmore better\\b", Pattern.CASE_INSENSITIVE),
                m -> "better", CategoriaError.GRAMATICA,
                m -> explicar(nivel,
                        "\"Better\" ya es comparativo; no se combina con \"more\".",
                        "\"Better\" is already comparative; don't add \"more\"."),
                acc);
        t = aplicarPatron(t, Pattern.compile("\\bexplain me\\b", Pattern.CASE_INSENSITIVE),
                m -> "explain to me", CategoriaError.GRAMATICA,
                m -> explicar(nivel,
                        "El verbo \"explain\" necesita \"to\": \"explain to me\".",
                        "\"Explain\" needs \"to\": \"explain to me\"."),
                acc);
        t = aplicarPatron(t, Pattern.compile("\\bpeople is\\b", Pattern.CASE_INSENSITIVE),
                m -> "people are", CategoriaError.GRAMATICA,
                m -> explicar(nivel,
                        "\"People\" es plural, se usa con \"are\".",
                        "\"People\" is plural, so it takes \"are\"."),
                acc);
        return t;
    }

    private String reglaArticulos(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        String t = texto;
        // a + palabra que empieza con vocal -> an  (salvo excepciones de sonido)
        t = aplicarPatron(t,
                Pattern.compile("\\b([Aa])\\s+([aeiouAEIOU][a-zA-Z]*)\\b"),
                m -> {
                    String siguiente = m.group(2);
                    if (SUENA_CONSONANTE.contains(siguiente.toLowerCase())) {
                        return m.group();
                    }
                    String art = Character.isUpperCase(m.group(1).charAt(0)) ? "An" : "an";
                    return art + " " + siguiente;
                },
                CategoriaError.ARTICULOS,
                m -> explicar(nivel,
                        "Antes de sonido vocalico se usa \"an\", no \"a\".",
                        "Use \"an\" before a vowel sound, not \"a\"."),
                acc);
        // an + palabra que empieza con consonante -> a  (salvo h muda)
        t = aplicarPatron(t,
                Pattern.compile("\\b([Aa]n)\\s+([b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z][a-zA-Z]*)\\b"),
                m -> {
                    String siguiente = m.group(2);
                    if (H_MUDA.contains(siguiente.toLowerCase())) {
                        return m.group();
                    }
                    String art = Character.isUpperCase(m.group(1).charAt(0)) ? "A" : "a";
                    return art + " " + siguiente;
                },
                CategoriaError.ARTICULOS,
                m -> explicar(nivel,
                        "Antes de sonido consonantico se usa \"a\", no \"an\".",
                        "Use \"a\" before a consonant sound, not \"an\"."),
                acc);
        return t;
    }

    private String reglaPalabraRepetida(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        return aplicarPatron(texto,
                Pattern.compile("\\b(\\w+)\\s+\\1\\b", Pattern.CASE_INSENSITIVE),
                m -> m.group(1),
                CategoriaError.GRAMATICA,
                m -> explicar(nivel,
                        "Palabra repetida: \"" + m.group(1) + "\" aparece dos veces seguidas.",
                        "Repeated word: \"" + m.group(1) + "\" appears twice in a row."),
                acc);
    }

    private String reglaEspacios(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        String t = texto;
        // Espacio(s) antes de , . ; : ! ?
        t = aplicarPatron(t, Pattern.compile("[ \\t]+([,.;:!?])"),
                m -> m.group(1),
                CategoriaError.PUNTUACION,
                m -> explicar(nivel,
                        "No se deja espacio antes de un signo de puntuacion.",
                        "Don't put a space before a punctuation mark."),
                acc);
        // Dos o mas espacios seguidos -> uno
        t = aplicarPatron(t, Pattern.compile("[ \\t]{2,}"),
                m -> " ",
                CategoriaError.PUNTUACION,
                m -> explicar(nivel,
                        "Sobran espacios: usa solo uno entre palabras.",
                        "Extra spaces: use a single space between words."),
                acc);
        return t;
    }

    private String reglaPronombreI(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        return aplicarPatron(texto,
                Pattern.compile("\\bi\\b"),
                m -> "I",
                CategoriaError.MAYUSCULAS,
                m -> explicar(nivel,
                        "El pronombre \"I\" (yo) siempre va en mayuscula.",
                        "The pronoun \"I\" is always capitalized."),
                acc);
    }

    private String reglaMayusculaInicial(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        // Inicio del texto o despues de . ! ? seguido de espacio/salto de linea
        return aplicarPatron(texto,
                Pattern.compile("(^|[.!?]\\s+|\\n\\s*)([a-z])"),
                m -> m.group(1) + m.group(2).toUpperCase(),
                CategoriaError.MAYUSCULAS,
                m -> explicar(nivel,
                        "Toda oracion empieza con mayuscula.",
                        "Every sentence starts with a capital letter."),
                acc);
    }

    private String reglaPuntoFinal(String texto, NivelIngles nivel, List<CorreccionDetectada> acc) {
        String t = texto;
        String recortado = t.stripTrailing();
        if (recortado.isEmpty()) {
            return t;
        }
        char ultimo = recortado.charAt(recortado.length() - 1);
        if (ultimo != '.' && ultimo != '!' && ultimo != '?') {
            // Toma la ultima palabra como fragmento de referencia
            int inicio = Math.max(recortado.lastIndexOf(' '), recortado.lastIndexOf('\n'));
            String fragmento = recortado.substring(inicio + 1);
            agregar(acc, CategoriaError.PUNTUACION, fragmento, fragmento + ".",
                    explicar(nivel,
                            "Falta el punto final de la oracion.",
                            "The sentence is missing a final period."));
            t = recortado + ".";
        }
        return t;
    }
}
