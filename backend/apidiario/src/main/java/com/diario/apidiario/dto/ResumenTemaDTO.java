package com.diario.apidiario.dto;

import com.diario.apidiario.enums.CategoriaError;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Resumen de un tema en el que el usuario esta fallando:
 * categoria + cuantas veces fallo + un consejo.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResumenTemaDTO {
    private CategoriaError categoria;
    private String titulo;
    private long cantidad;
    private String consejo;
}
