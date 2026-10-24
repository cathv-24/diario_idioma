package com.diario.apidiario.controllers;

import com.diario.apidiario.dtos.*;
import com.diario.apidiario.services.EntradaDiarioService;
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
@Tag(name = "Entradas", description = "Escribir, corregir con reglas y guardar el diario")
public class EntradaDiarioController {
    @Autowired
    private com.diario.apidiario.security.Access access;
    @Autowired
    private EntradaDiarioService entradaService;

    @PostMapping("/entrada")
    @Operation(summary = "Corregir y guardar una nueva entrada")
    public ResponseEntity<EntradaCorregidaDTO> crear(@Valid @RequestBody EntradaRequestDTO request) {
        access.user(request.getIdUsuario());
        EntradaCorregidaDTO creada = entradaService.crear(request);
        return ResponseEntity.created(URI.create("/api/entrada/" + creada.getIdEntrada())).body(creada);
    }

    @GetMapping("/entradas/{idUsuario}")
    @Operation(summary = "Consultar el historial de un usuario")
    public List<EntradaCorregidaDTO> historial(@PathVariable Long idUsuario) {
        access.user(idUsuario);
        return entradaService.listarPorUsuario(idUsuario);
    }

    @GetMapping("/entrada/{id}")
    @Operation(summary = "Consultar una entrada y sus correcciones")
    public EntradaCorregidaDTO buscar(@PathVariable Long id) {
        access.entry(id);
        return entradaService.buscar(id);
    }

    @PutMapping("/entrada/{id}")
    @Operation(summary = "Editar el texto y volver a corregir; reemplaza las correcciones anteriores")
    public EntradaCorregidaDTO actualizar(@PathVariable Long id, @Valid @RequestBody EntradaRequestDTO request) {
        access.entry(id); access.user(request.getIdUsuario());
        return entradaService.actualizar(id, request);
    }

    @DeleteMapping("/entrada/{id}")
    @Operation(summary = "Eliminar una entrada y sus correcciones")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        access.entry(id);
        entradaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entradas/{idUsuario}/resumen")
    @Operation(summary = "Contar entradas y errores por categoria; promedio orientativo")
    public ResumenProgresoDTO resumen(@PathVariable Long idUsuario) {
        access.user(idUsuario);
        return entradaService.resumen(idUsuario);
    }
}
