package com.diario.apidiario;

import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.servicios.correccion.CorreccionDetectada;
import com.diario.apidiario.servicios.correccion.CorrectorBasadoEnReglas;
import com.diario.apidiario.servicios.correccion.ResultadoCorreccion;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CorrectorBasadoEnReglasTest {

    private final CorrectorBasadoEnReglas corrector = new CorrectorBasadoEnReglas();

    @Test
    void corrigeErroresTipicos() {
        String texto = "yesterday i goed to the park and i eated a apple . it was beatiful";
        ResultadoCorreccion r = corrector.corregir(texto, NivelIngles.A2);

        System.out.println("ORIGINAL : " + texto);
        System.out.println("CORREGIDO: " + r.getTextoCorregido());
        for (CorreccionDetectada c : r.getCorrecciones()) {
            System.out.println("  [" + c.getCategoria() + "] '" + c.getFragmentoOriginal()
                    + "' -> '" + c.getFragmentoCorregido() + "' : " + c.getExplicacion());
        }

        assertTrue(r.getTextoCorregido().startsWith("Yesterday I"), "Debe capitalizar inicio e 'I'");
        assertTrue(r.getTextoCorregido().contains("went"), "goed -> went");
        assertTrue(r.getTextoCorregido().contains("ate"), "eated -> ate");
        assertTrue(r.getTextoCorregido().contains("an apple"), "a apple -> an apple");
        assertTrue(r.getTextoCorregido().contains("beautiful"), "beatiful -> beautiful");
        assertTrue(r.getTextoCorregido().endsWith("."), "Debe terminar en punto");
        assertFalse(r.getCorrecciones().isEmpty(), "Debe detectar varios errores");
    }

    @Test
    void textoCorrectoNoGeneraErrores() {
        String texto = "Today I went to school. It was a good day.";
        ResultadoCorreccion r = corrector.corregir(texto, NivelIngles.B1);
        assertTrue(r.getCorrecciones().isEmpty(),
                "Un texto correcto no deberia generar correcciones, pero salieron: " + r.getCorrecciones().size());
    }
}
