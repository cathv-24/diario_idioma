package com.diario.apidiario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "aprendizaje")
@Getter @Setter @NoArgsConstructor
public class Aprendizaje {
    @Id
    private Long idUsuario;
    @Column(length = 16)
    private String unidadActual;
    @ElementCollection
    @CollectionTable(name = "aprendizaje_lecturas", joinColumns = @JoinColumn(name = "id_usuario"))
    @Column(name = "unidad", length = 16)
    private Set<String> lecturasCompletadas = new HashSet<>();
    @ElementCollection
    @CollectionTable(name = "aprendizaje_palabras", joinColumns = @JoinColumn(name = "id_usuario"))
    @Column(name = "palabra", length = 80)
    private Set<String> palabrasGuardadas = new HashSet<>();
}
