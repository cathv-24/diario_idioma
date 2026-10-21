package com.diario.apidiario.services;

import com.diario.apidiario.dtos.UsuarioDTO;
import java.util.List;

public interface UsuarioService {
    UsuarioDTO insertar(UsuarioDTO usuario);
    List<UsuarioDTO> listar();
    UsuarioDTO buscar(Long id);
    UsuarioDTO actualizar(UsuarioDTO usuario);
    void eliminar(Long id);
}
