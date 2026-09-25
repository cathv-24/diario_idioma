package com.diario.apidiario.servicios.correccion;

import com.diario.apidiario.enums.CategoriaError;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un error detectado por el motor de correccion (independiente de la persistencia).
 * El servicio de entradas lo transforma luego en la entidad {@code Correccion}.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CorreccionDetectada {
    private CategoriaError categoria;
    private String fragmentoOriginal;
    private String fragmentoCorregido;
    private String explicacion;
}
