package com.diario.apidiario.serviceimpl;

import com.diario.apidiario.dtos.CorreccionDTO;
import com.diario.apidiario.enums.*;
import com.diario.apidiario.services.CorreccionService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Motor educativo limitado a patrones concretos; no comprende todo el ingles. */
@Service
public class CorreccionServiceImpl implements CorreccionService {
    private final EvaluadorEscritura evaluador = new EvaluadorEscritura();

    @Override
    public ResultadoCorreccion corregir(String texto, NivelIngles nivel) {
        List<CorreccionDTO> correcciones = new ArrayList<>();
        String t = texto;
        t = reemplazar(t, Pattern.compile("\\btoday was a day,\\s*very strange\\b", Pattern.CASE_INSENSITIVE),
                "today was a very strange day", CategoriaError.GRAMATICA,
                explicar(nivel, "En inglés, strange va antes de day.", "Put strange before day in this phrase."), correcciones);
        t = palabra(t, "bofriend", "boyfriend", CategoriaError.ORTOGRAFIA,
                "Se escribe boyfriend.", "The correct spelling is boyfriend.", nivel, correcciones);
        t = palabra(t, "boyfreind", "boyfriend", CategoriaError.ORTOGRAFIA,
                "Se escribe boyfriend.", "The correct spelling is boyfriend.", nivel, correcciones);
        t = palabra(t, "goed", "went", CategoriaError.GRAMATICA,
                "El pasado de go es went.", "The past of go is went.", nivel, correcciones);
        t = palabra(t, "eated", "ate", CategoriaError.GRAMATICA,
                "El pasado de eat es ate.", "The past of eat is ate.", nivel, correcciones);
        t = palabra(t, "buyed", "bought", CategoriaError.GRAMATICA,
                "El pasado de buy es bought.", "The past of buy is bought.", nivel, correcciones);
        t = palabra(t, "recieve", "receive", CategoriaError.ORTOGRAFIA,
                "Se escribe receive.", "The correct spelling is receive.", nivel, correcciones);
        t = palabra(t, "beatiful", "beautiful", CategoriaError.ORTOGRAFIA,
                "Se escribe beautiful.", "The correct spelling is beautiful.", nivel, correcciones);
        t = palabra(t, "informations", "information", CategoriaError.VOCABULARIO,
                "Information es incontable y no lleva s.", "Information is uncountable: no plural s.", nivel, correcciones);
        t = palabra(t, "dont", "don't", CategoriaError.GRAMATICA,
                "La contraccion don't lleva apostrofo.", "The contraction don't needs an apostrophe.", nivel, correcciones);
        // No se reemplaza were: puede ser un pasado perfectamente correcto.
        t = reemplazar(t, Pattern.compile("\\bi\\b"), "I", CategoriaError.MAYUSCULAS,
                explicar(nivel, "El pronombre I siempre va en mayuscula.", "Always capitalize the pronoun I."), correcciones);
        if (!t.isBlank() && Character.isLowerCase(t.charAt(0))) {
            String original = t.substring(0, 1);
            String mayuscula = original.toUpperCase(java.util.Locale.ROOT);
            agregar(correcciones, CategoriaError.MAYUSCULAS, original, mayuscula,
                    explicar(nivel, "Empieza el texto con mayuscula.", "Start the text with a capital letter."));
            t = mayuscula + t.substring(1);
        }
        var evaluacion = evaluador.evaluar(texto);
        return new ResultadoCorreccion(t, correcciones, evaluacion.nivel(), evaluacion.confianza(),
                evaluacion.evidencia(), "REGLAS");
    }

    private String palabra(String texto, String original, String alternativa, CategoriaError categoria,
                           String es, String en, NivelIngles nivel, List<CorreccionDTO> correcciones) {
        Pattern patron = Pattern.compile("\\b" + Pattern.quote(original) + "\\b", Pattern.CASE_INSENSITIVE);
        return reemplazar(texto, patron, alternativa, categoria, explicar(nivel, es, en), correcciones);
    }

    private String reemplazar(String texto, Pattern patron, String alternativa, CategoriaError categoria,
                              String explicacion, List<CorreccionDTO> correcciones) {
        Matcher matcher = patron.matcher(texto);
        StringBuilder resultado = new StringBuilder();
        while (matcher.find()) {
            String reemplazo = alternativa;
            if (Character.isUpperCase(matcher.group().charAt(0))) {
                reemplazo = alternativa.substring(0, 1).toUpperCase(java.util.Locale.ROOT) + alternativa.substring(1);
            }
            if (!matcher.group().equals(reemplazo)) {
                agregar(correcciones, categoria, matcher.group(), reemplazo, explicacion);
            }
            matcher.appendReplacement(resultado, Matcher.quoteReplacement(reemplazo));
        }
        matcher.appendTail(resultado);
        return resultado.toString();
    }

    private void agregar(List<CorreccionDTO> lista, CategoriaError categoria, String original,
                         String alternativa, String explicacion) {
        lista.add(new CorreccionDTO(categoria, categoria.getTitulo(), original, alternativa, explicacion));
    }

    private String explicar(NivelIngles nivel, String es, String en) {
        if (nivel.explicarEnEspanol()) {
            return es;
        }
        return en;
    }
}
