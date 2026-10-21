package com.diario.apidiario.dtos;

import com.diario.apidiario.enums.NivelIngles;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SugerenciaDTO {
private String expresionOriginal;
private String alternativa;
private String explicacion;
private NivelIngles nivelMinimo;
}
