package com.diario.apidiario.enums;

/**
 * Categoria del error detectado en una entrada del diario.
 * Sirve para agrupar los errores y mostrarle al usuario "en que temas esta fallando".
 */
public enum CategoriaError {
    ORTOGRAFIA("Ortografia", "Palabras mal escritas o mal formadas."),
    GRAMATICA("Gramatica", "Estructura de la oracion, verbos, concordancia."),
    PUNTUACION("Puntuacion", "Comas, puntos, mayusculas y espacios."),
    VOCABULARIO("Vocabulario", "Eleccion de palabras y errores tipicos de hispanohablantes."),
    ARTICULOS("Articulos", "Uso de a / an / the."),
    MAYUSCULAS("Mayusculas", "Uso de mayusculas (inicio de oracion, pronombre I).");

    private final String titulo;
    private final String descripcion;

    CategoriaError(String titulo, String descripcion) {
        this.titulo = titulo;
        this.descripcion = descripcion;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
