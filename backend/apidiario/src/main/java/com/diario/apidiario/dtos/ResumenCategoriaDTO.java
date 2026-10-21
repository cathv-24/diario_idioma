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
public class ResumenCategoriaDTO {
private CategoriaError categoria;
private Long cantidad;
}
