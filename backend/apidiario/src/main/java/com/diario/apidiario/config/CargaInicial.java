package com.diario.apidiario.config;

import com.diario.apidiario.entidades.Usuario;
import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.repositorios.UsuarioRepositorio;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Crea un usuario de demostracion la primera vez que arranca la app,
 * para poder probar el diario sin registrar nada manualmente.
 */
@Component
@Slf4j
public class CargaInicial implements CommandLineRunner {

    private final UsuarioRepositorio usuarioRepositorio;

    public CargaInicial(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepositorio.count() == 0) {
            Usuario demo = new Usuario();
            demo.setNombre("Estudiante Demo");
            demo.setEmail("demo@diario.com");
            demo.setNivel(NivelIngles.A2);
            demo.setFechaRegistro(LocalDate.now());
            usuarioRepositorio.save(demo);
            log.info("Usuario demo creado (id=1, nivel A2).");
        }
    }
}
