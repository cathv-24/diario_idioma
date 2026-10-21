package com.diario.apidiario.serviceimpl;

import com.diario.apidiario.dtos.SugerenciaDTO;
import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.services.VocabularioService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class VocabularioServiceImpl implements VocabularioService {
    @Override
    public List<SugerenciaDTO> sugerir(String texto, NivelIngles nivel) {
        List<SugerenciaDTO> sugerencias = new ArrayList<>();
        // Son alternativas opcionales; no errores y no descuentan puntos.
        if (nivel.ordinal() >= NivelIngles.A2.ordinal() && contiene(texto, "very happy")) {
            sugerencias.add(new SugerenciaDTO("very happy", "delighted",
                    "Si quieres expresar mucha alegria, puedes usar delighted. No cambia tu texto automaticamente.", NivelIngles.A2));
        }
        if (nivel.ordinal() >= NivelIngles.B1.ordinal() && contiene(texto, "very tired")) {
            sugerencias.add(new SugerenciaDTO("very tired", "exhausted",
                    "Exhausted expresses strong tiredness. It is an optional alternative.", NivelIngles.B1));
        }
        return sugerencias;
    }

    private boolean contiene(String texto, String expresion) {
        return Pattern.compile("\\b" + Pattern.quote(expresion) + "\\b", Pattern.CASE_INSENSITIVE)
                .matcher(texto).find();
    }
}
