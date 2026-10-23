package com.diario.apidiario;

import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.serviceimpl.CorreccionServiceImpl;
import com.diario.apidiario.serviceimpl.VocabularioServiceImpl;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CorrectorTest {
    private final CorreccionServiceImpl corrector = new CorreccionServiceImpl();

    @Test
    void corrigePatronesYCuentaCadaAparicion() {
        var resultado = corrector.corregir("Yesterday i goed and goed.", NivelIngles.A2);
        assertEquals("Yesterday I went and went.", resultado.textoCorregido());
        assertEquals(3, resultado.correcciones().size());
        assertEquals(2, resultado.correcciones().stream()
                .filter(c -> c.getFragmentoOriginal().equals("goed")).count());
    }

    @Test
    void conservaTextoCorrectoYPalabrasQueAntesSeReemplazabanMal() {
        String texto = "They were happy. These are everyday clothes.";
        var resultado = corrector.corregir(texto, NivelIngles.B1);
        assertEquals(texto, resultado.textoCorregido());
        assertTrue(resultado.correcciones().isEmpty());
    }

    @Test
    void explicaEnElIdiomaCorrespondienteAlNivel() {
        var basico = corrector.corregir("I goed.", NivelIngles.A2);
        var intermedio = corrector.corregir("I goed.", NivelIngles.B1);
        assertEquals("El pasado de go es went.", basico.correcciones().getFirst().getExplicacion());
        assertEquals("The past of go is went.", intermedio.correcciones().getFirst().getExplicacion());
    }

    @Test
    void sugerenciasSonOpcionalesYRespetanElUmbralConfigurado() {
        var vocabulario = new VocabularioServiceImpl();
        String texto = "I was very happy and very tired.";
        assertEquals(0, vocabulario.sugerir(texto, NivelIngles.A1).size());
        assertEquals(1, vocabulario.sugerir(texto, NivelIngles.A2).size());
        assertEquals(2, vocabulario.sugerir(texto, NivelIngles.B1).size());
        assertEquals(texto, corrector.corregir(texto, NivelIngles.B1).textoCorregido());
    }
    @Test
    void respetaCierresInformalesSinAgregarPuntoNiPenalizar() {
        for (String texto : new String[]{"Today I feel happy", "A quiet day…", "What a day!", "Today I feel happy 🙂"}) {
            var resultado = corrector.corregir(texto, NivelIngles.A2);
            assertEquals(texto, resultado.textoCorregido());
            assertTrue(resultado.correcciones().isEmpty());
        }
    }
}
