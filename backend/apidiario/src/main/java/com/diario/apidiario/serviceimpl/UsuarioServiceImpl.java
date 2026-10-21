package com.diario.apidiario.serviceimpl;

import com.diario.apidiario.dtos.UsuarioDTO;
import com.diario.apidiario.entities.Usuario;
import com.diario.apidiario.exceptions.*;
import com.diario.apidiario.repositories.*;
import com.diario.apidiario.services.UsuarioService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private EntradaDiarioRepositorio entradaRepositorio;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public UsuarioDTO insertar(UsuarioDTO dto) {
        if (dto.getIdUsuario() != null) {
            throw new SolicitudInvalidaException("Al crear un usuario no envies idUsuario; lo genera la base de datos");
        }
        String email = normalizarEmail(dto.getEmail());
        if (usuarioRepositorio.existsByEmail(email)) {
            throw new ConflictoException("El email ya esta registrado");
        }
        Usuario usuario = modelMapper.map(dto, Usuario.class);
        usuario.setNombre(dto.getNombre().strip());
        usuario.setEmail(email);
        usuario.setFechaRegistro(LocalDate.now());
        return aDTO(usuarioRepositorio.save(usuario));
    }

    @Override
    public List<UsuarioDTO> listar() {
        return usuarioRepositorio.findAll().stream().map(this::aDTO).toList();
    }

    @Override
    public UsuarioDTO buscar(Long id) {
        return aDTO(buscarEntidad(id));
    }

    @Override
    @Transactional
    public UsuarioDTO actualizar(UsuarioDTO dto) {
        if (dto.getIdUsuario() == null) {
            throw new SolicitudInvalidaException("Para actualizar debes enviar idUsuario");
        }
        Usuario usuario = buscarEntidad(dto.getIdUsuario());
        String email = normalizarEmail(dto.getEmail());
        if (usuarioRepositorio.existsByEmailAndIdUsuarioNot(email, usuario.getIdUsuario())) {
            throw new ConflictoException("El email pertenece a otro usuario");
        }
        usuario.setNombre(dto.getNombre().strip());
        usuario.setEmail(email);
        usuario.setNivel(dto.getNivel());
        return aDTO(usuarioRepositorio.save(usuario));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = buscarEntidad(id);
        if (entradaRepositorio.existsByUsuarioIdUsuario(id)) {
            throw new ConflictoException("El usuario tiene entradas; elimina primero sus entradas");
        }
        usuarioRepositorio.delete(usuario);
    }

    private Usuario buscarEntidad(Long id) {
        return usuarioRepositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado"));
    }

    private UsuarioDTO aDTO(Usuario usuario) {
        return modelMapper.map(usuario, UsuarioDTO.class);
    }

    private String normalizarEmail(String email) {
        return email.strip().toLowerCase(Locale.ROOT);
    }
}
