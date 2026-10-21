package com.diario.apidiario.dtos;

import com.diario.apidiario.enums.CategoriaError;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CorreccionDTO {
private CategoriaError categoria;
private String categoriaTitulo;
private String fragmentoOriginal;
private String fragmentoCorregido;
private String explicacion;
}
