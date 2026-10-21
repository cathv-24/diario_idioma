package com.diario.apidiario.services;

import com.diario.apidiario.dtos.SugerenciaDTO;
import com.diario.apidiario.enums.NivelIngles;
import java.util.List;

public interface VocabularioService {
    List<SugerenciaDTO> sugerir(String texto, NivelIngles nivel);
}
