package com.diario.apidiario.controllers;

import com.diario.apidiario.dtos.UsuarioDTO;
import com.diario.apidiario.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Usuarios", description = "Perfil privado de la cuenta autenticada")
public class UsuarioController {
    @Autowired
    private com.diario.apidiario.security.Access access;
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/usuario")
    @Operation(summary = "Crear un perfil de usuario")
    public ResponseEntity<UsuarioDTO> insertar(@Valid @RequestBody UsuarioDTO dto) {
        UsuarioDTO creado = usuarioService.insertar(dto);
        return ResponseEntity.created(URI.create("/api/usuario/" + creado.getIdUsuario())).body(creado);
    }

    @GetMapping("/usuarios")
    @Operation(summary = "Listar perfiles")
    public List<UsuarioDTO> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/usuario/{id}")
    @Operation(summary = "Buscar un perfil por identificador")
    public UsuarioDTO buscar(@PathVariable Long id) {
        access.user(id);
        return usuarioService.buscar(id);
    }

    @PutMapping("/usuario")
    @Operation(summary = "Actualizar un perfil, incluido su nivel; enviar idUsuario")
    public UsuarioDTO actualizar(@Valid @RequestBody UsuarioDTO dto) {
        access.user(dto.getIdUsuario());
        return usuarioService.actualizar(dto);
    }

    @DeleteMapping("/usuario/{id}")
    @Operation(summary = "Eliminar un perfil sin entradas")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        access.user(id);
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
