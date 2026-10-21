package com.diario.apidiario.dtos;

import com.diario.apidiario.enums.NivelIngles;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntradaCorregidaDTO {
private Long idEntrada;
private LocalDate fecha;
private LocalDateTime fechaCreacion;
private NivelIngles nivel;
private String textoOriginal;
private String textoCorregido;
private int puntaje;
private String mensaje;
private List<CorreccionDTO> correcciones;
private List<ResumenTemaDTO> temasAMejorar;
private List<SugerenciaDTO> sugerenciasVocabulario;
}
