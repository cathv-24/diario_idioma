package com.diario.apidiario.entities;

import com.diario.apidiario.enums.NivelIngles;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "entradas_diario")
@Getter
@Setter
@NoArgsConstructor
public class EntradaDiario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntrada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    // Conserva el nivel usado al corregir, aunque despues cambie el perfil.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    private NivelIngles nivel;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoOriginal;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String textoCorregido;

    private int puntaje;

    @OneToMany(mappedBy = "entrada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Correccion> correcciones = new ArrayList<>();

    public void agregarCorreccion(Correccion correccion) {
        correccion.setEntrada(this);
        correcciones.add(correccion);
    }
}
