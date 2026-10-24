package com.diario.apidiario.security;
import com.diario.apidiario.repositories.EntradaDiarioRepositorio;
import com.diario.apidiario.exceptions.RecursoNoEncontradoException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
@Component
public class Access {
 private final EntradaDiarioRepositorio entries;
 public Access(EntradaDiarioRepositorio entries) {this.entries=entries;}
 public long id() {return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());}
 public void user(Long id) {if(id==null || id!=id()) throw new RecursoNoEncontradoException("Recurso no encontrado");}
 public void entry(Long id) {var entry=entries.findById(id).orElseThrow(() -> new RecursoNoEncontradoException("Entrada no encontrada")); user(entry.getUsuario().getIdUsuario());}
}
