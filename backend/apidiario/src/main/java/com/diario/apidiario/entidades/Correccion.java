package com.diario.apidiario.entidades;

import com.diario.apidiario.enums.CategoriaError;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un error concreto detectado dentro de una entrada del diario,
 * con su version corregida y la explicacion didactica.
 */
@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Correccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCorreccion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_entrada")
    private EntradaDiario entrada;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CategoriaError categoria;

    /** Fragmento tal como lo escribio el usuario. */
    @Column(length = 300)
    private String fragmentoOriginal;

    /** Fragmento ya corregido. */
    @Column(length = 300)
    private String fragmentoCorregido;

    /** Explicacion didactica (en espanol o ingles segun el nivel). */
    @Column(columnDefinition = "TEXT")
    private String explicacion;
}
