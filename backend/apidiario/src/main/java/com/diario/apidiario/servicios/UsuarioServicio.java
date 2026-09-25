package com.diario.apidiario.servicios;

import com.diario.apidiario.dto.UsuarioDTO;
import com.diario.apidiario.entidades.Usuario;
import com.diario.apidiario.repositorios.UsuarioRepositorio;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UsuarioServicio {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private ModelMapper modelMapper;

    public UsuarioDTO insertar(UsuarioDTO usuarioDTO) {
        Usuario usuario = modelMapper.map(usuarioDTO, Usuario.class);
        if (usuario.getFechaRegistro() == null) {
            usuario.setFechaRegistro(LocalDate.now());
        }
        Usuario guardado = usuarioRepositorio.save(usuario);
        return modelMapper.map(guardado, UsuarioDTO.class);
    }

    public List<UsuarioDTO> listar() {
        return usuarioRepositorio.findAll().stream()
                .map(u -> modelMapper.map(u, UsuarioDTO.class))
                .toList();
    }

    public UsuarioDTO buscar(Long id) {
        Usuario usuario = usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return modelMapper.map(usuario, UsuarioDTO.class);
    }

    /** Actualiza los datos del usuario, incluyendo su nivel de ingles. */
    public UsuarioDTO actualizar(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioRepositorio.findById(usuarioDTO.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setEmail(usuarioDTO.getEmail());
        usuario.setNivel(usuarioDTO.getNivel());
        Usuario guardado = usuarioRepositorio.save(usuario);
        return modelMapper.map(guardado, UsuarioDTO.class);
    }

    public void eliminar(Long id) {
        usuarioRepositorio.deleteById(id);
    }
}
