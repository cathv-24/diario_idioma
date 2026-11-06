package com.diario.apidiario.serviceimpl;

import com.diario.apidiario.enums.NivelIngles;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Pistas léxicas de una muestra; nunca certifica el nivel general de una persona. */
public class EvaluadorEscritura {
    private static final Pattern PALABRA = Pattern.compile("[A-Za-z]+(?:'[A-Za-z]+)?");
    private static final Set<String> CONECTORES_A2 = Set.of("because", "when", "before", "after", "then", "so");
    private static final Set<String> RECURSOS_B1 = Set.of("although", "however", "despite", "eventually",
            "realized", "realised", "noticed", "managed", "wondered", "instead", "while", "unless");
    private static final Set<String> RECURSOS_B2 = Set.of("nevertheless", "whereas", "consequently", "furthermore",
            "nonetheless", "perspective", "overwhelming", "reconsidered", "acknowledged", "regardless");

    public Evaluacion evaluar(String texto) {
        Matcher matcher = PALABRA.matcher(texto.toLowerCase(Locale.ROOT));
        int cantidad = 0;
        Set<String> observadas = new LinkedHashSet<>();
        while (matcher.find()) {
            cantidad++;
            observadas.add(matcher.group());
        }
        if (cantidad < 40) {
            return new Evaluacion(null, "INSUFICIENTE",
                    "Esta entrada tiene " + cantidad + " palabras. Escribe unas 40 o más para observar variedad de vocabulario y conectores; una sola entrada no determina tu nivel general.");
        }
        List<String> a2 = presentes(observadas, CONECTORES_A2);
        List<String> b1 = presentes(observadas, RECURSOS_B1);
        List<String> b2 = presentes(observadas, RECURSOS_B2);
        NivelIngles estimado;
        String confianza;
        String pista;
        if (cantidad >= 100 && b2.size() >= 2 && b1.size() >= 2) {
            estimado = NivelIngles.B2;
            confianza = "BAJA";
            pista = "Aparecen conectores y vocabulario variados, por ejemplo " + ejemplos(b2) + ".";
        } else if (cantidad >= 65 && b1.size() >= 2) {
            estimado = NivelIngles.B1;
            confianza = "BAJA";
            pista = "Aparecen recursos para relacionar ideas, por ejemplo " + ejemplos(b1) + ".";
        } else if (!a2.isEmpty()) {
            estimado = NivelIngles.A2;
            confianza = "BAJA";
            pista = "Usas conectores cotidianos como " + ejemplos(a2) + ".";
        } else {
            estimado = NivelIngles.A1;
            confianza = "BAJA";
            pista = "En esta muestra predominan palabras y estructuras sencillas.";
        }
        return new Evaluacion(estimado, confianza,
                pista + " Es una pista de escritura, no una certificación MCER ni una evaluación de comprensión u oralidad.");
    }

    private List<String> presentes(Set<String> observadas, Set<String> candidatas) {
        List<String> presentes = new ArrayList<>();
        for (String palabra : observadas) if (candidatas.contains(palabra)) presentes.add(palabra);
        return presentes;
    }

    private String ejemplos(List<String> palabras) {
        return String.join(" y ", palabras.subList(0, Math.min(2, palabras.size())));
    }

    public record Evaluacion(NivelIngles nivel, String confianza, String evidencia) {}
}
