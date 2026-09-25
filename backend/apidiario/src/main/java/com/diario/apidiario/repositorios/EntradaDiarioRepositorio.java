package com.diario.apidiario.repositorios;

import com.diario.apidiario.entidades.EntradaDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntradaDiarioRepositorio extends JpaRepository<EntradaDiario, Long> {

    // Query method: entradas de un usuario ordenadas de la mas reciente a la mas antigua
    List<EntradaDiario> findByUsuarioIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);

    // JPQL: promedio de puntaje de un usuario (para ver su progreso)
    @Query("SELECT AVG(e.puntaje) FROM EntradaDiario e WHERE e.usuario.idUsuario = :idUsuario")
    Double promedioPuntajePorUsuario(Long idUsuario);
}
