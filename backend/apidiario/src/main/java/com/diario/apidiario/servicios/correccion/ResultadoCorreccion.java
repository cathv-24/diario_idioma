package com.diario.apidiario.servicios.correccion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * Resultado de corregir un texto: la version corregida y la lista de errores encontrados.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResultadoCorreccion {
    private String textoCorregido;
    private List<CorreccionDetectada> correcciones = new ArrayList<>();

    public ResultadoCorreccion(String textoCorregido) {
        this.textoCorregido = textoCorregido;
        this.correcciones = new ArrayList<>();
    }
}
