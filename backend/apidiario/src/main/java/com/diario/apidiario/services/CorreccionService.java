package com.diario.apidiario.services;

import com.diario.apidiario.dtos.CorreccionDTO;
import com.diario.apidiario.enums.NivelIngles;
import java.util.List;

public interface CorreccionService {
    ResultadoCorreccion corregir(String texto, NivelIngles nivel);

    // Resultado interno: no es entidad y no se guarda directamente con JPA.
    record ResultadoCorreccion(String textoCorregido, List<CorreccionDTO> correcciones) {}
}
