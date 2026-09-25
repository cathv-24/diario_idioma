package com.diario.apidiario.dto;

import com.diario.apidiario.enums.NivelIngles;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioDTO {
    private Long idUsuario;
    private String nombre;
    private String email;
    private NivelIngles nivel;
    private LocalDate fechaRegistro;
}
