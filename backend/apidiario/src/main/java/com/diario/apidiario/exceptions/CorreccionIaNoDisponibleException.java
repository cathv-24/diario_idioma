package com.diario.apidiario.exceptions;

public class CorreccionIaNoDisponibleException extends RuntimeException {
    public CorreccionIaNoDisponibleException() {
        super("La corrección con IA no está disponible ahora. Tu texto no se guardó; puedes reintentar o usar la corrección privada.");
    }
}
