package com.diario.apidiario.repositories;

import com.diario.apidiario.dtos.ResumenCategoriaDTO;
import com.diario.apidiario.entities.Correccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CorreccionRepositorio extends JpaRepository<Correccion, Long> {
    @Query("""
        SELECT new com.diario.apidiario.dtos.ResumenCategoriaDTO(c.categoria, COUNT(c))
        FROM Correccion c WHERE c.entrada.usuario.idUsuario = :idUsuario
        GROUP BY c.categoria ORDER BY COUNT(c) DESC
        """)
    List<ResumenCategoriaDTO> resumirPorUsuario(@Param("idUsuario") Long idUsuario);
}
