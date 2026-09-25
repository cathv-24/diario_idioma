package com.diario.apidiario.enums;

/**
 * Nivel de ingles del usuario segun el Marco Comun Europeo (MCER).
 * Se usa para adaptar el tono y el idioma de las explicaciones de correccion.
 */
public enum NivelIngles {
    A1("Principiante"),
    A2("Basico"),
    B1("Intermedio"),
    B2("Intermedio alto"),
    C1("Avanzado"),
    C2("Maestria");

    private final String descripcion;

    NivelIngles(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    /**
     * Los niveles A1 y A2 reciben explicaciones en espanol (mas guiadas);
     * de B1 en adelante las explicaciones van en ingles para reforzar el idioma.
     */
    public boolean explicarEnEspanol() {
        return this == A1 || this == A2;
    }
}
