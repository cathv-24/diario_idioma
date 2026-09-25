package com.diario.apidiario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Lo que envia el frontend cuando el usuario escribe una entrada del diario.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EntradaRequestDTO {

    @NotNull(message = "El id del usuario es obligatorio")
    private Long idUsuario;

    private LocalDate fecha;

    @NotBlank(message = "El texto no puede estar vacio")
    private String texto;
}
