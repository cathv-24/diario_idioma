package com.diario.apidiario.entities;

import com.diario.apidiario.enums.CategoriaError;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "correcciones")
@Getter
@Setter
@NoArgsConstructor
public class Correccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCorreccion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_entrada", nullable = false)
    private EntradaDiario entrada;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CategoriaError categoria;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fragmentoOriginal;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String fragmentoCorregido;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explicacion;
}
