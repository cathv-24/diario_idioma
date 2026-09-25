package com.diario.apidiario.controladores;

import com.diario.apidiario.dto.EntradaCorregidaDTO;
import com.diario.apidiario.dto.EntradaRequestDTO;
import com.diario.apidiario.servicios.EntradaDiarioServicio;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Slf4j
public class EntradaDiarioController {
    @Autowired
    private EntradaDiarioServicio entradaServicio;

    /** Escribir una nueva entrada del diario y recibir la correccion. */
    @PostMapping("/entrada")
    public ResponseEntity<EntradaCorregidaDTO> crear(@Valid @RequestBody EntradaRequestDTO request) {
        log.debug("Nueva entrada del usuario {}", request.getIdUsuario());
        return ResponseEntity.ok(entradaServicio.crearEntrada(request));
    }

    /** Historial de entradas de un usuario. */
    @GetMapping("/entradas/{idUsuario}")
    public ResponseEntity<List<EntradaCorregidaDTO>> historial(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(entradaServicio.listarPorUsuario(idUsuario));
    }

    /** Detalle de una entrada concreta. */
    @GetMapping("/entrada/{id}")
    public ResponseEntity<EntradaCorregidaDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(entradaServicio.buscar(id));
    }
}
