package com.diario.apidiario.security;
import com.diario.apidiario.dtos.UsuarioDTO;
import com.diario.apidiario.enums.NivelIngles;
import com.diario.apidiario.repositories.UsuarioRepositorio;
import com.diario.apidiario.services.UsuarioService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
@RestController
@RequestMapping("/api")
public class AuthController {
 private final UsuarioService users; private final UsuarioRepositorio repository; private final PasswordEncoder encoder; private final Access access;
 public AuthController(UsuarioService users, UsuarioRepositorio repository, PasswordEncoder encoder, Access access) {this.users=users;this.repository=repository;this.encoder=encoder;this.access=access;}
 public record Register(@NotBlank @Size(max=80) String nombre, @NotBlank @Email @Size(max=100) String email, @NotNull NivelIngles nivel, @NotBlank @Size(min=8,max=64) String password) {}
 @GetMapping("/auth/csrf") public Map<String,String> csrf(CsrfToken token) {return Map.of("token",token.getToken(),"headerName",token.getHeaderName());}
 @PostMapping("/auth/register") @Transactional public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody Register data) {
  if(data.password().getBytes(java.nio.charset.StandardCharsets.UTF_8).length>72) throw new com.diario.apidiario.exceptions.SolicitudInvalidaException("La contraseña debe ocupar como máximo 72 bytes");
  var dto=new UsuarioDTO();dto.setNombre(data.nombre());dto.setEmail(data.email());dto.setNivel(data.nivel());
  var created=users.insertar(dto);var entity=repository.findById(created.getIdUsuario()).orElseThrow();entity.setPasswordHash(encoder.encode(data.password()));repository.save(entity);
  return ResponseEntity.status(201).body(created);
 }
 @GetMapping("/auth/me") public UsuarioDTO me() {return users.buscar(access.id());}
 @GetMapping("/health") public Map<String,String> health() {repository.count();return Map.of("status","ok");}
}
