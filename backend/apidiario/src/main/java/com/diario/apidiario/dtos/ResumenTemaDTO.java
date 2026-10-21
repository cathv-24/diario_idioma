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
public class ResumenTemaDTO {
private CategoriaError categoria;
private String titulo;
private long cantidad;
private String consejo;
}
