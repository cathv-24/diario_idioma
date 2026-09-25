import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  EntradaCorregida,
  EntradaRequest,
  NivelIngles,
  Usuario,
} from '../modelos/modelos';
import { CorrectorLocal } from './corrector-local';

const CLAVE_HISTORIAL = 'diario_entradas';

@Injectable({ providedIn: 'root' })
export class DiarioService {
  private readonly base = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private local: CorrectorLocal,
  ) {}

  /** Modo local (demo sin backend): cuando no hay apiUrl configurada. */
  get modoLocal(): boolean {
    return !this.base;
  }

  // ---- Usuarios ----
  listarUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/usuarios`);
  }

  actualizarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/usuario`, usuario);
  }

  // ---- Entradas del diario ----
  crearEntrada(request: EntradaRequest, nivel: NivelIngles): Observable<EntradaCorregida> {
    if (this.modoLocal) {
      const entrada = this.local.corregir(request.texto, nivel);
      this.guardarLocal(entrada);
      return of(entrada);
    }
    return this.http.post<EntradaCorregida>(`${this.base}/entrada`, request);
  }

  historial(idUsuario: number): Observable<EntradaCorregida[]> {
    if (this.modoLocal) {
      return of(this.historialLocal());
    }
    return this.http.get<EntradaCorregida[]>(`${this.base}/entradas/${idUsuario}`);
  }

  // ---- Persistencia local (modo demo) ----
  private historialLocal(): EntradaCorregida[] {
    try {
      const crudo = localStorage.getItem(CLAVE_HISTORIAL);
      const lista: EntradaCorregida[] = crudo ? JSON.parse(crudo) : [];
      return lista.sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
    } catch {
      return [];
    }
  }

  private guardarLocal(entrada: EntradaCorregida): void {
    try {
      const lista = this.historialLocal();
      lista.unshift(entrada);
      localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(lista));
    } catch {
      // Sin localStorage disponible: la entrada simplemente no se persiste.
    }
  }
}
