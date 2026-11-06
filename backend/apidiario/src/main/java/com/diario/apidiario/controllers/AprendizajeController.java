package com.diario.apidiario.controllers;

import com.diario.apidiario.entities.Aprendizaje;
import com.diario.apidiario.repositories.AprendizajeRepositorio;
import com.diario.apidiario.security.Access;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@RequestMapping("/api/aprendizaje")
public class AprendizajeController {
    private final AprendizajeRepositorio repository;
    private final Access access;
    public AprendizajeController(AprendizajeRepositorio repository, Access access) {
        this.repository = repository;
        this.access = access;
    }
    public record Estado(
        @NotNull @Pattern(regexp = "e([1-9]|1[0-2])") String unidadActual,
        @NotNull @Size(max = 12) Set<@Pattern(regexp = "e([1-9]|1[0-2])") String> lecturasCompletadas,
        @NotNull @Size(max = 200) Set<@NotBlank @Size(max = 80) String> palabrasGuardadas) {}

    @GetMapping @Transactional(readOnly = true)
    public Estado get() {
        return repository.findById(access.id()).map(this::dto)
            .orElse(new Estado("", Set.of(), Set.of()));
    }
    @PutMapping @Transactional
    public Estado put(@Valid @RequestBody Estado state) {
        long user = access.id();
        Aprendizaje entity = repository.findById(user).orElseGet(Aprendizaje::new);
        entity.setIdUsuario(user);
        entity.setUnidadActual(state.unidadActual());
        entity.setLecturasCompletadas(new java.util.HashSet<>(state.lecturasCompletadas()));
        entity.setPalabrasGuardadas(new java.util.HashSet<>(state.palabrasGuardadas()));
        return dto(repository.save(entity));
    }
    private Estado dto(Aprendizaje entity) {
        return new Estado(entity.getUnidadActual(), Set.copyOf(entity.getLecturasCompletadas()), Set.copyOf(entity.getPalabrasGuardadas()));
    }
}
