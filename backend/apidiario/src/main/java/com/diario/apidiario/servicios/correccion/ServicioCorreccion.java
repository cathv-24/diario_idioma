package com.diario.apidiario.servicios.correccion;

import com.diario.apidiario.enums.NivelIngles;

/**
 * Contrato del motor de correccion. Permite intercambiar la implementacion
 * (reglas ahora, LLM/Claude API despues) sin tocar el resto de la aplicacion.
 *
 * La implementacion activa se elige con la propiedad {@code diario.corrector}
 * (valores: {@code reglas} o {@code llm}) en application.properties.
 */
public interface ServicioCorreccion {

    /**
     * Corrige un texto en ingles adaptando las explicaciones al nivel del usuario.
     *
     * @param texto texto original escrito por el usuario
     * @param nivel nivel de ingles del usuario (para el tono/idioma de las explicaciones)
     * @return el texto corregido y la lista de errores detectados
     */
    ResultadoCorreccion corregir(String texto, NivelIngles nivel);
}
