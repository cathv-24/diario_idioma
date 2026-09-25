package com.diario.apidiario.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Una entrada del diario: lo que el usuario escribio un dia,
 * su version corregida y la lista de correcciones detectadas.
 */
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EntradaDiario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntrada;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    /** Fecha del dia sobre el que escribe el usuario. */
    private LocalDate fecha;

    /** Momento exacto en que se guardo la entrada. */
    private LocalDateTime fechaCreacion;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String textoOriginal;

    @Column(columnDefinition = "TEXT")
    private String textoCorregido;

    /** Puntaje 0-100: 100 = sin errores detectados. */
    private int puntaje;

    @OneToMany(mappedBy = "entrada", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Correccion> correcciones = new ArrayList<>();

    /** Helper para mantener sincronizada la relacion bidireccional. */
    public void agregarCorreccion(Correccion correccion) {
        correccion.setEntrada(this);
        this.correcciones.add(correccion);
    }
}
