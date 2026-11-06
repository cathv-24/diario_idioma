package com.diario.apidiario.controllers;
import com.diario.apidiario.serviceimpl.CorreccionIaService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/correccion")
public class CorreccionConfigController {
    private final CorreccionIaService ia;
    public CorreccionConfigController(CorreccionIaService ia) { this.ia = ia; }
    @GetMapping("/disponibilidad")
    public Map<String, Boolean> disponibilidad() { return Map.of("ia", ia.disponible()); }
}
