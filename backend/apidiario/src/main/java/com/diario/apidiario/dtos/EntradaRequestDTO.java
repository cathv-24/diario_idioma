package com.diario.apidiario.dtos;

import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class EntradaRequestDTO {
    @NotNull(message = "El usuario es obligatorio")
    @Positive(message = "El identificador del usuario debe ser positivo")
    @Schema(example = "1")
    private Long idUsuario;

    @PastOrPresent(message = "La fecha no puede estar en el futuro")
    private LocalDate fecha;

    @NotBlank(message = "El texto es obligatorio")
    @Size(max = 10000, message = "El texto admite hasta 10000 caracteres")
    @Schema(example = "Yesterday i goed to the park. I was very happy.")
    private String texto;
}
