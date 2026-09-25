package com.diario.apidiario.dto;

import com.diario.apidiario.enums.NivelIngles;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Respuesta completa que ve el usuario tras escribir una entrada:
 * texto corregido, lista de correcciones, puntaje y resumen de temas a mejorar.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
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
}
