package com.diario.apidiario.dto;

import com.diario.apidiario.enums.CategoriaError;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CorreccionDTO {
    private CategoriaError categoria;
    private String categoriaTitulo;
    private String fragmentoOriginal;
    private String fragmentoCorregido;
    private String explicacion;
}
