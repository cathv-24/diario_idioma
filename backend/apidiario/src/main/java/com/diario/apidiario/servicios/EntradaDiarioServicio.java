package com.diario.apidiario.servicios;

import com.diario.apidiario.dto.CorreccionDTO;
import com.diario.apidiario.dto.EntradaCorregidaDTO;
import com.diario.apidiario.dto.EntradaRequestDTO;
import com.diario.apidiario.dto.ResumenTemaDTO;
import com.diario.apidiario.entidades.Correccion;
import com.diario.apidiario.entidades.EntradaDiario;
import com.diario.apidiario.entidades.Usuario;
import com.diario.apidiario.enums.CategoriaError;
import com.diario.apidiario.repositorios.EntradaDiarioRepositorio;
import com.diario.apidiario.repositorios.UsuarioRepositorio;
import com.diario.apidiario.servicios.correccion.CorreccionDetectada;
import com.diario.apidiario.servicios.correccion.ResultadoCorreccion;
import com.diario.apidiario.servicios.correccion.ServicioCorreccion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Orquesta el flujo principal del diario: recibe el texto del usuario,
 * lo manda al motor de correccion, calcula el puntaje, arma el resumen de
 * "temas a mejorar" y persiste todo.
 */
@Service
@Slf4j
public class EntradaDiarioServicio {

    /** Puntos que resta cada error detectado. */
    private static final int PENALIZACION_POR_ERROR = 5;

    @Autowired
    private EntradaDiarioRepositorio entradaRepositorio;
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    // Se inyecta la implementacion activa (reglas o llm) segun la propiedad diario.corrector
    @Autowired
    private ServicioCorreccion servicioCorreccion;

    // Consejos por categoria para el resumen de temas a mejorar
    private static final Map<CategoriaError, String> CONSEJOS = new EnumMap<>(CategoriaError.class);
    static {
        CONSEJOS.put(CategoriaError.ORTOGRAFIA,
                "Repasa la escritura de las palabras que usas seguido y apoyate en un diccionario.");
        CONSEJOS.put(CategoriaError.GRAMATICA,
                "Revisa verbos irregulares y la estructura de la oracion (sujeto + verbo).");
        CONSEJOS.put(CategoriaError.PUNTUACION,
                "Cuida las comas, los puntos y no dejar espacios de mas.");
        CONSEJOS.put(CategoriaError.VOCABULARIO,
                "Aprende que sustantivos son incontables y sus plurales irregulares.");
        CONSEJOS.put(CategoriaError.ARTICULOS,
                "Recuerda: 'an' antes de sonido vocalico y 'a' antes de consonante.");
        CONSEJOS.put(CategoriaError.MAYUSCULAS,
                "Empieza cada oracion con mayuscula y escribe siempre 'I' en mayuscula.");
    }

    /**
     * Crea una entrada del diario: corrige el texto, guarda y devuelve el resultado completo.
     */
    public EntradaCorregidaDTO crearEntrada(EntradaRequestDTO request) {
        Usuario usuario = usuarioRepositorio.findById(request.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 1) Corregir con el motor activo, adaptado al nivel del usuario
        ResultadoCorreccion resultado = servicioCorreccion.corregir(request.getTexto(), usuario.getNivel());

        // 2) Construir la entidad
        EntradaDiario entrada = new EntradaDiario();
        entrada.setUsuario(usuario);
        entrada.setFecha(request.getFecha() != null ? request.getFecha() : LocalDate.now());
        entrada.setFechaCreacion(LocalDateTime.now());
        entrada.setTextoOriginal(request.getTexto());
        entrada.setTextoCorregido(resultado.getTextoCorregido());

        for (CorreccionDetectada d : resultado.getCorrecciones()) {
            Correccion c = new Correccion();
            c.setCategoria(d.getCategoria());
            c.setFragmentoOriginal(recortar(d.getFragmentoOriginal()));
            c.setFragmentoCorregido(recortar(d.getFragmentoCorregido()));
            c.setExplicacion(d.getExplicacion());
            entrada.agregarCorreccion(c);
        }

        int puntaje = calcularPuntaje(resultado.getCorrecciones().size());
        entrada.setPuntaje(puntaje);

        // 3) Persistir (cascade guarda tambien las correcciones)
        EntradaDiario guardada = entradaRepositorio.save(entrada);
        log.debug("Entrada {} guardada con {} correcciones y puntaje {}",
                guardada.getIdEntrada(), guardada.getCorrecciones().size(), puntaje);

        return aDTO(guardada);
    }

    /** Lista el historial de un usuario, de la entrada mas reciente a la mas antigua. */
    public List<EntradaCorregidaDTO> listarPorUsuario(Long idUsuario) {
        return entradaRepositorio.findByUsuarioIdUsuarioOrderByFechaCreacionDesc(idUsuario)
                .stream()
                .map(this::aDTO)
                .toList();
    }

    public EntradaCorregidaDTO buscar(Long id) {
        EntradaDiario entrada = entradaRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada no encontrada"));
        return aDTO(entrada);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private int calcularPuntaje(int cantidadErrores) {
        return Math.max(0, 100 - cantidadErrores * PENALIZACION_POR_ERROR);
    }

    private String recortar(String s) {
        if (s == null) {
            return null;
        }
        return s.length() > 300 ? s.substring(0, 297) + "..." : s;
    }

    /** Construye el DTO de respuesta incluyendo el resumen de temas a mejorar. */
    private EntradaCorregidaDTO aDTO(EntradaDiario entrada) {
        List<CorreccionDTO> correcciones = entrada.getCorrecciones().stream()
                .map(c -> new CorreccionDTO(
                        c.getCategoria(),
                        c.getCategoria() != null ? c.getCategoria().getTitulo() : null,
                        c.getFragmentoOriginal(),
                        c.getFragmentoCorregido(),
                        c.getExplicacion()))
                .toList();

        List<ResumenTemaDTO> temas = construirResumen(entrada.getCorrecciones());

        return new EntradaCorregidaDTO(
                entrada.getIdEntrada(),
                entrada.getFecha(),
                entrada.getFechaCreacion(),
                entrada.getUsuario().getNivel(),
                entrada.getTextoOriginal(),
                entrada.getTextoCorregido(),
                entrada.getPuntaje(),
                mensajeSegunPuntaje(entrada.getPuntaje(), entrada.getCorrecciones().size()),
                correcciones,
                temas);
    }

    /** Agrupa los errores por categoria y arma el resumen ordenado por frecuencia. */
    private List<ResumenTemaDTO> construirResumen(List<Correccion> correcciones) {
        Map<CategoriaError, Long> conteo = new EnumMap<>(CategoriaError.class);
        for (Correccion c : correcciones) {
            if (c.getCategoria() != null) {
                conteo.merge(c.getCategoria(), 1L, Long::sum);
            }
        }
        return conteo.entrySet().stream()
                .map(e -> new ResumenTemaDTO(
                        e.getKey(),
                        e.getKey().getTitulo(),
                        e.getValue(),
                        CONSEJOS.getOrDefault(e.getKey(), "Sigue practicando este tema.")))
                .sorted(Comparator.comparingLong(ResumenTemaDTO::getCantidad).reversed())
                .toList();
    }

    private String mensajeSegunPuntaje(int puntaje, int errores) {
        if (errores == 0) {
            return "Excelente! No detectamos errores. Sigue escribiendo asi.";
        }
        if (puntaje >= 80) {
            return "Muy bien: solo " + errores + " detalle(s) por pulir. Vas por buen camino.";
        }
        if (puntaje >= 50) {
            return "Buen intento. Revisa las correcciones para mejorar en tus temas debiles.";
        }
        return "Sigue practicando: hay varios puntos por mejorar, pero cada entrada suma.";
    }
}
