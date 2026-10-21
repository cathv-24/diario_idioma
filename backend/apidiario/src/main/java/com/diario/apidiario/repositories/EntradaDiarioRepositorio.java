package com.diario.apidiario.repositories;

import com.diario.apidiario.entities.EntradaDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntradaDiarioRepositorio extends JpaRepository<EntradaDiario, Long> {
    List<EntradaDiario> findByUsuarioIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);
    boolean existsByUsuarioIdUsuario(Long idUsuario);
    long countByUsuarioIdUsuario(Long idUsuario);

    @Query("SELECT AVG(e.puntaje) FROM EntradaDiario e WHERE e.usuario.idUsuario = :idUsuario")
    Double promedioPuntaje(@Param("idUsuario") Long idUsuario);
}
