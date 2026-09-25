package com.diario.apidiario.repositorios;

import com.diario.apidiario.entidades.Correccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CorreccionRepositorio extends JpaRepository<Correccion, Long> {
}
