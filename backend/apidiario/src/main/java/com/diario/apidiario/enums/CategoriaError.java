package com.diario.apidiario.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CategoriaError {
    ORTOGRAFIA("Ortografía"), GRAMATICA("Gramática"),
    PUNTUACION("Puntuación"), VOCABULARIO("Vocabulario"),
    ARTICULOS("Artículos"), MAYUSCULAS("Mayúsculas");

    private final String titulo;
}
