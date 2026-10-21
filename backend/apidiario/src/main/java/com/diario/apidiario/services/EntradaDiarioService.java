package com.diario.apidiario.services;

import com.diario.apidiario.dtos.*;
import java.util.List;

public interface EntradaDiarioService {
    EntradaCorregidaDTO crear(EntradaRequestDTO request);
    EntradaCorregidaDTO buscar(Long id);
    List<EntradaCorregidaDTO> listarPorUsuario(Long idUsuario);
    EntradaCorregidaDTO actualizar(Long id, EntradaRequestDTO request);
    void eliminar(Long id);
    ResumenProgresoDTO resumen(Long idUsuario);
}
