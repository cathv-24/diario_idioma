package com.diario.apidiario.dtos;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenProgresoDTO {
private long totalEntradas;
private double puntajePromedio;
private List<ResumenCategoriaDTO> erroresPorCategoria;
}
