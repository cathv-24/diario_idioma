package com.diario.apidiario.serviceimpl;

import com.diario.apidiario.dtos.*;
import com.diario.apidiario.entities.*;
import com.diario.apidiario.enums.CategoriaError;
import com.diario.apidiario.exceptions.*;
import com.diario.apidiario.repositories.*;
import com.diario.apidiario.services.*;
import com.diario.apidiario.automations.EntradaGuardadaEvent;
import org.springframework.context.ApplicationEventPublisher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@Transactional(readOnly = true)
public class EntradaDiarioServiceImpl implements EntradaDiarioService {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private EntradaDiarioRepositorio entradaRepositorio;
    @Autowired
    private CorreccionRepositorio correccionRepositorio;
    @Autowired
    private CorreccionService correccionService;
    @Autowired
    private VocabularioService vocabularioService;
    @Autowired
    private ApplicationEventPublisher events;

    @Override
    @Transactional
    public EntradaCorregidaDTO crear(EntradaRequestDTO request) {
        Usuario usuario = buscarUsuario(request.getIdUsuario());
        EntradaDiario entrada = new EntradaDiario();
        entrada.setUsuario(usuario);
        entrada.setFechaCreacion(LocalDateTime.now());
        preparar(entrada, request);
        EntradaDiario guardada = entradaRepositorio.save(entrada);
        events.publishEvent(EntradaGuardadaEvent.from(guardada));
        log.debug("Entrada {} creada con {} correcciones", guardada.getIdEntrada(), guardada.getCorrecciones().size());
        return aDTO(guardada);
    }

    @Override
    public EntradaCorregidaDTO buscar(Long id) {
        return aDTO(buscarEntrada(id));
    }

    @Override
    public List<EntradaCorregidaDTO> listarPorUsuario(Long idUsuario) {
        buscarUsuario(idUsuario);
        return entradaRepositorio.findByUsuarioIdUsuarioOrderByFechaCreacionDesc(idUsuario)
                .stream().map(this::aDTO).toList();
    }

    @Override
    @Transactional
    public EntradaCorregidaDTO actualizar(Long id, EntradaRequestDTO request) {
        EntradaDiario entrada = buscarEntrada(id);
        if (!entrada.getUsuario().getIdUsuario().equals(request.getIdUsuario())) {
            throw new SolicitudInvalidaException("No se puede cambiar el usuario propietario de una entrada");
        }
        // orphanRemoval elimina las correcciones antiguas al guardar la edicion.
        entrada.getCorrecciones().clear();
        preparar(entrada, request);
        return aDTO(entradaRepositorio.save(entrada));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        entradaRepositorio.delete(buscarEntrada(id));
    }

    @Override
    public ResumenProgresoDTO resumen(Long idUsuario) {
        buscarUsuario(idUsuario);
        Double promedio = entradaRepositorio.promedioPuntaje(idUsuario);
        return new ResumenProgresoDTO(entradaRepositorio.countByUsuarioIdUsuario(idUsuario),
                promedio == null ? 0 : Math.round(promedio * 100.0) / 100.0,
                correccionRepositorio.resumirPorUsuario(idUsuario));
    }

    private void preparar(EntradaDiario entrada, EntradaRequestDTO request) {
        String texto = request.getTexto().strip();
        entrada.setFecha(request.getFecha() == null ? LocalDate.now() : request.getFecha());
        entrada.setNivel(entrada.getUsuario().getNivel());
        entrada.setTextoOriginal(texto);
        CorreccionService.ResultadoCorreccion resultado = correccionService.corregir(texto, entrada.getNivel());
        entrada.setTextoCorregido(resultado.textoCorregido());
        for (CorreccionDTO dto : resultado.correcciones()) {
            Correccion correccion = new Correccion();
            correccion.setCategoria(dto.getCategoria());
            correccion.setFragmentoOriginal(dto.getFragmentoOriginal());
            correccion.setFragmentoCorregido(dto.getFragmentoCorregido());
            correccion.setExplicacion(dto.getExplicacion());
            entrada.agregarCorreccion(correccion);
        }
        entrada.setPuntaje(Math.max(0, 100 - resultado.correcciones().size() * 5));
    }

    private Usuario buscarUsuario(Long id) {
        return usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    private EntradaDiario buscarEntrada(Long id) {
        return entradaRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Entrada no encontrada"));
    }

    private EntradaCorregidaDTO aDTO(EntradaDiario entrada) {
        List<CorreccionDTO> correcciones = entrada.getCorrecciones().stream()
                .map(c -> new CorreccionDTO(c.getCategoria(), c.getCategoria().getTitulo(),
                        c.getFragmentoOriginal(), c.getFragmentoCorregido(), c.getExplicacion())).toList();
        Map<CategoriaError, Long> conteo = new EnumMap<>(CategoriaError.class);
        for (Correccion c : entrada.getCorrecciones()) {
            conteo.merge(c.getCategoria(), 1L, Long::sum);
        }
        List<ResumenTemaDTO> temas = conteo.entrySet().stream()
                .map(e -> new ResumenTemaDTO(e.getKey(), e.getKey().getTitulo(), e.getValue(),
                        "Revisa las explicaciones de esta categoria y escribe otra oracion para practicar."))
                .sorted(Comparator.comparingLong(ResumenTemaDTO::getCantidad).reversed()).toList();
        return new EntradaCorregidaDTO(entrada.getIdEntrada(), entrada.getFecha(), entrada.getFechaCreacion(),
                entrada.getNivel(), entrada.getTextoOriginal(), entrada.getTextoCorregido(), entrada.getPuntaje(),
                "Motor de reglas: " + correcciones.size() + " correcciones detectadas. El puntaje no mide tu nivel de ingles.",
                correcciones, temas, vocabularioService.sugerir(entrada.getTextoOriginal(), entrada.getNivel()));
    }
}
