package com.diario.apidiario.dtos;

import com.diario.apidiario.enums.NivelIngles;
import jakarta.validation.constraints.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class UsuarioDTO {
    private Long idUsuario;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 80, message = "El nombre admite hasta 80 caracteres")
    @Schema(example = "Cathe")
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato valido")
    @Size(max = 100, message = "El email admite hasta 100 caracteres")
    @Schema(example = "cathe@example.com")
    private String email;

    @NotNull(message = "El nivel es obligatorio")
    @Schema(example = "A2")
    private NivelIngles nivel;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDate fechaRegistro;
}
