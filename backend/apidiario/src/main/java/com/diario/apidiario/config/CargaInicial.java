package com.diario.apidiario.config;

import com.diario.apidiario.entities.Usuario;
import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.repositories.UsuarioRepositorio;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@ConditionalOnProperty(name = "diario.demo.enabled", havingValue = "true")
public class CargaInicial implements CommandLineRunner {
    private final UsuarioRepositorio usuarioRepositorio;

    public CargaInicial(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepositorio.count() == 0) {
            Usuario usuario = new Usuario();
            usuario.setNombre("Estudiante Demo");
            usuario.setEmail("demo@example.com");
            usuario.setNivel(NivelIngles.A2);
            usuario.setFechaRegistro(LocalDate.now());
            usuarioRepositorio.save(usuario);
        }
    }
}
