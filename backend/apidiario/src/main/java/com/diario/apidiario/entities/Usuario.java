package com.diario.apidiario.entities;

import com.diario.apidiario.enums.NivelIngles;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    @Column(nullable = false, length = 80)
    private String nombre;

    // Null en perfiles antiguos: nunca se pueden reclamar solo con el email.
    @Column(length = 100)
    private String passwordHash;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    private NivelIngles nivel;

    @Column(nullable = false)
    private LocalDate fechaRegistro;
}
