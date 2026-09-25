package com.diario.apidiario.controladores;

import com.diario.apidiario.dto.UsuarioDTO;
import com.diario.apidiario.servicios.UsuarioServicio;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
public class UsuarioController {
    @Autowired
    private UsuarioServicio usuarioServicio;

    @PostMapping("/usuario")
    public ResponseEntity<UsuarioDTO> insertar(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(usuarioServicio.insertar(usuarioDTO));
    }

    @GetMapping("/usuarios")
    public ResponseEntity<List<UsuarioDTO>> listar() {
        return ResponseEntity.ok(usuarioServicio.listar());
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<UsuarioDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioServicio.buscar(id));
    }

    @PutMapping("/usuario")
    public ResponseEntity<UsuarioDTO> actualizar(@Valid @RequestBody UsuarioDTO usuarioDTO) {
        return ResponseEntity.ok(usuarioServicio.actualizar(usuarioDTO));
    }

    @DeleteMapping("/usuario/{id}")
    public void eliminar(@PathVariable Long id) {
        usuarioServicio.eliminar(id);
    }
}
