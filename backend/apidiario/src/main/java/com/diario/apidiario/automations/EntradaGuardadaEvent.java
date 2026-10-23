package com.diario.apidiario.automations;

import com.diario.apidiario.entities.EntradaDiario;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

/** Instantanea de metricas: nunca transporta texto, nombre, correo ni id de usuario. */
public record EntradaGuardadaEvent(UUID eventId, Instant occurredAt, long entryId, LocalDate entryDate,
        String level, int score, int correctionCount, int wordCount) {
    public static EntradaGuardadaEvent from(EntradaDiario entrada) {
        return new EntradaGuardadaEvent(UUID.randomUUID(), Instant.now(), entrada.getIdEntrada(),
                entrada.getFecha(), entrada.getNivel().name(), entrada.getPuntaje(),
                entrada.getCorrecciones().size(), entrada.getTextoOriginal().strip().split("\\s+").length);
    }

    public String toJson() {
        // Todos los valores proceden de tipos cerrados/numericos; no contiene contenido del diario.
        return String.format(Locale.ROOT,
                "{\"eventId\":\"%s\",\"type\":\"entry.created\",\"occurredAt\":\"%s\",\"entryId\":%d,\"entryDate\":\"%s\",\"level\":\"%s\",\"score\":%d,\"correctionCount\":%d,\"wordCount\":%d}",
                eventId, occurredAt, entryId, entryDate, level, score, correctionCount, wordCount);
    }
}
